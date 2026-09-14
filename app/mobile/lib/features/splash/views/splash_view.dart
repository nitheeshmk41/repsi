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
  late AnimationController _animController;
  late Animation<double> _logoScaleAnim;
  late Animation<double> _logoGlowAnim;
  late Animation<Offset> _titleSlideAnim;
  late Animation<double> _titleFadeAnim;
  late Animation<double> _taglineFadeAnim;
  late Animation<double> _loadingFadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 850),
    );

    _logoScaleAnim = Tween<double>(begin: 0.92, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.0, 0.65, curve: Curves.easeOutCubic),
      ),
    );

    _logoGlowAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
      ),
    );

    _titleSlideAnim = Tween<Offset>(
      begin: const Offset(0.0, 0.15),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.2, 0.8, curve: Curves.easeOutCubic),
      ),
    );

    _titleFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.2, 0.75, curve: Curves.easeOut),
      ),
    );

    _taglineFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.4, 1.0, curve: Curves.easeOut),
      ),
    );

    _loadingFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.65, 1.0, curve: Curves.easeIn),
      ),
    );

    _animController.forward();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(milliseconds: 1400));
    if (!mounted) return;

    final authState = ref.read(authProvider);
    if (authState.isAuthenticated) {
      context.go(RouteNames.roleDashboard(authState.user?.role));
    } else {
      context.go(RouteNames.login);
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              Image.asset(
                'assets/logos/repsi_logo.png',
                width: 88,
                height: 88,
              ),
              const SizedBox(height: 24),
              // App Title
              Text(
                'REPSI',
                style: AppTypography.headingLarge.copyWith(
                  fontSize: 28,
                  letterSpacing: 3.0,
                  fontWeight: FontWeight.w800,
                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your gym. Your progress.',
                style: AppTypography.bodySmall.copyWith(
                  color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                  fontSize: 14,
                  letterSpacing: 0.6,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 48),
              // Simple circular loading indicator
              SizedBox(
                width: 32,
                height: 32,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
