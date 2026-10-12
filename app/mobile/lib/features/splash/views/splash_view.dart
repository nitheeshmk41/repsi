import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_typography.dart';
import '../../auth/providers/auth_provider.dart';

class SplashView extends ConsumerStatefulWidget {
  const SplashView({super.key});

  @override
  ConsumerState<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends ConsumerState<SplashView> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeIn;

  bool _minAnimationElapsed = false;
  bool _hasNavigated = false;
  bool _showSlowFallback = false;

  Timer? _minTimer;
  Timer? _slowTimer;
  Timer? _safetyTimeout;

  @override
  void initState() {
    super.initState();

    // Fast 450ms smooth entrance animation
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    );

    _fadeIn = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutQuad,
      ),
    );

    _controller.forward();

    // 1. Minimum brand display threshold (450ms) to ensure smooth visuals
    _minTimer = Timer(const Duration(milliseconds: 450), () {
      if (!mounted) return;
      _minAnimationElapsed = true;
      _checkAndNavigate();
    });

    // 2. Slow connection indicator (2.2s)
    _slowTimer = Timer(const Duration(milliseconds: 2200), () {
      if (!mounted || _hasNavigated) return;
      setState(() {
        _showSlowFallback = true;
      });
    });

    // 3. Absolute safety net (3.5s) to guarantee the screen never hangs indefinitely
    _safetyTimeout = Timer(const Duration(milliseconds: 3500), () {
      if (!mounted || _hasNavigated) return;
      _forceBypass();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Precache primary branding asset on the very first frame
    precacheImage(const AssetImage('assets/logos/primary_logo.png'), context).catchError((_) {});
  }

  void _checkAndNavigate() {
    if (_hasNavigated || !_minAnimationElapsed || !mounted) return;

    final authState = ref.read(authProvider);

    // If still initializing from storage/network, wait for the state listener
    if (authState.status == AuthStatus.initial || authState.status == AuthStatus.loading) {
      return;
    }

    _executeNavigation(authState);
  }

  void _executeNavigation(AuthState authState) {
    if (_hasNavigated || !mounted) return;
    _hasNavigated = true;

    _cleanupTimers();

    if (authState.isAuthenticated) {
      context.go(RouteNames.roleDashboard(authState.user?.role));
    } else {
      context.go(RouteNames.onboarding);
    }
  }

  void _forceBypass() {
    if (_hasNavigated || !mounted) return;
    final authState = ref.read(authProvider);
    _executeNavigation(authState);
  }

  void _cleanupTimers() {
    _minTimer?.cancel();
    _slowTimer?.cancel();
    _safetyTimeout?.cancel();
  }

  @override
  void dispose() {
    _cleanupTimers();
    _controller.dispose();
    super.dispose();
  }

  String _getLoadingStatusText(AuthState auth) {
    if (_showSlowFallback) {
      return 'Finalizing your Repsi workspace...';
    }
    switch (auth.status) {
      case AuthStatus.loading:
        return 'Verifying your Repsi session...';
      case AuthStatus.authenticated:
        return 'Loading your Repsi dashboard...';
      case AuthStatus.error:
        return 'Connecting to available offline data...';
      case AuthStatus.initial:
      case AuthStatus.unauthenticated:
        return 'Setting up your Repsi workspace...';
    }
  }

  @override
  Widget build(BuildContext context) {
    // Reactively listen to auth state updates so navigation happens the exact instant auth resolves
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (_minAnimationElapsed && !_hasNavigated) {
        if (next.status != AuthStatus.initial && next.status != AuthStatus.loading) {
          _checkAndNavigate();
        }
      }
    });

    final authState = ref.watch(authProvider);
    final statusText = _getLoadingStatusText(authState);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: FadeTransition(
            opacity: _fadeIn,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(),

                  // 1. Repsi Logo Image & Wordmark
                  Image.asset(
                    'assets/logos/primary_logo.png',
                    height: 48,
                    fit: BoxFit.contain,
                    cacheWidth: 384,
                    errorBuilder: (_, __, ___) => Image.asset(
                      'assets/logos/app_icon.png',
                      height: 44,
                      fit: BoxFit.contain,
                      cacheWidth: 256,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Repsi',
                    style: AppTypography.display.copyWith(
                      fontSize: 26,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                      letterSpacing: -0.5,
                    ),
                  ),

                  const SizedBox(height: 32),

                  // 2. Animated Circular Progress Indicator
                  const SizedBox(
                    width: 42,
                    height: 42,
                    child: CircularProgressIndicator(
                      strokeWidth: 3.0,
                      valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                      backgroundColor: AppColors.primarySoft,
                    ),
                  ),

                  const SizedBox(height: 22),

                  // 3. Dynamic Context-Aware Status Subtitle
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 250),
                    child: Text(
                      statusText,
                      key: ValueKey<String>(statusText),
                      textAlign: TextAlign.center,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 13.5,
                        fontWeight: FontWeight.w500,
                        letterSpacing: 0.1,
                      ),
                    ),
                  ),

                  const Spacer(),

                  // 4. Stuck Loading Recovery / Manual Fallback Bypass
                  if (_showSlowFallback) ...[
                    GestureDetector(
                      onTap: _forceBypass,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceSubtle,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.arrow_forward_rounded,
                              size: 14,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Tap to continue directly',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.text,
                                fontWeight: FontWeight.w600,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ] else ...[
                    const SizedBox(height: 32),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
