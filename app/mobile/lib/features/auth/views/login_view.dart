import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/google_logo_icon.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_error_banner.dart';
import '../../../shared/widgets/repsi_text_field.dart';
import '../providers/auth_provider.dart';

class LoginView extends ConsumerStatefulWidget {
  const LoginView({super.key});

  @override
  ConsumerState<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends ConsumerState<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _workspaceSlugController = TextEditingController();
  bool _showWorkspaceSlug = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _workspaceSlugController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    HapticFeedback.lightImpact();

    final success = await ref.read(authProvider.notifier).login(
      email: _emailController.text.trim(),
      password: _passwordController.text,
      workspaceSlug: _showWorkspaceSlug ? _workspaceSlugController.text.trim() : null,
    );

    if (success && mounted) {
      context.go(RouteNames.roleDashboard(ref.read(authProvider).user?.role));
    }
  }

  Future<void> _handleGoogleLogin() async {
    FocusScope.of(context).unfocus();
    HapticFeedback.lightImpact();
    final success = await ref.read(authProvider.notifier).loginWithGoogle();
    if (success && mounted) {
      context.go(RouteNames.roleDashboard(ref.read(authProvider).user?.role));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authProvider);
    final isLoading = authState.status == AuthStatus.loading;
    final isError = authState.status == AuthStatus.error && authState.errorMessage != null;

    final systemUiOverlay = isDark
        ? SystemUiOverlayStyle.light.copyWith(
            statusBarColor: Colors.transparent,
            systemNavigationBarColor: AppColors.darkBackground,
          )
        : SystemUiOverlayStyle.dark.copyWith(
            statusBarColor: Colors.transparent,
            systemNavigationBarColor: AppColors.background,
          );

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: systemUiOverlay,
      child: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Scaffold(
          backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
          body: SafeArea(
            child: Center(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.xxl,
                  vertical: AppSpacing.lg,
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Logo header with compact vertical spacing
                      Center(
                        child: Image.asset(
                          'assets/logos/repsi_logo.png',
                          width: 64,
                          height: 64,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Text(
                        'Welcome back',
                        textAlign: TextAlign.center,
                        style: AppTypography.headingLarge.copyWith(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        'Sign in to continue to REPSI',
                        textAlign: TextAlign.center,
                        style: AppTypography.bodyMedium.copyWith(
                          color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xl),

                      // Compact connection / server error banner - shown ONLY on actual action failure
                      if (isError) ...[
                        RepsiErrorBanner(
                          title: 'Connection problem',
                          message: authState.errorMessage ?? "We couldn't reach REPSI. Check your internet connection and try again.",
                          onRetry: isLoading ? null : _handleLogin,
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      // Email input field
                      RepsiTextField(
                        label: 'Email address',
                        hintText: 'you@example.com',
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        prefixIcon: Icon(
                          LucideIcons.mail,
                          size: 18,
                          color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                        ),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Email address is required';
                          }
                          final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                          if (!emailRegex.hasMatch(val.trim())) {
                            return 'Please enter a valid email address';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Password input field
                      RepsiTextField(
                        label: 'Password',
                        hintText: '••••••••',
                        controller: _passwordController,
                        isPassword: true,
                        textInputAction: TextInputAction.done,
                        onSubmitted: (_) => _handleLogin(),
                        prefixIcon: Icon(
                          LucideIcons.lock,
                          size: 18,
                          color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                        ),
                        validator: (val) {
                          if (val == null || val.isEmpty) {
                            return 'Password is required';
                          }
                          if (val.length < 4) {
                            return 'Password must be at least 4 characters';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppSpacing.xs),

                      // Forgot password (right-aligned beneath password field)
                      Align(
                        alignment: Alignment.centerRight,
                        child: InkWell(
                          onTap: () => context.push(RouteNames.forgotPassword),
                          borderRadius: BorderRadius.circular(4),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 2.0),
                            child: Text(
                              'Forgot password?',
                              style: AppTypography.caption.copyWith(
                                color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Main Sign In Button
                      RepsiButton(
                        text: 'Sign In',
                        isLoading: isLoading,
                        onPressed: isLoading ? null : _handleLogin,
                        isFullWidth: true,
                        size: RepsiButtonSize.large,
                      ),
                      const SizedBox(height: AppSpacing.sm),

                      // Quick Test User Fill Button
                      OutlinedButton.icon(
                        onPressed: isLoading
                            ? null
                            : () {
                                _emailController.text = 'test@repsi.app';
                                _passwordController.text = '12345678';
                                _handleLogin();
                              },
                        icon: const Icon(LucideIcons.userCheck, size: 16),
                        label: const Text('Quick Login as Test User (test@repsi.app)'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: isDark ? AppColors.primary : AppColors.primary,
                          side: BorderSide(color: AppColors.primary.withValues(alpha: 0.5)),
                          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Divider
                      Row(
                        children: [
                          Expanded(
                            child: Divider(
                              color: isDark ? AppColors.darkBorder : AppColors.border,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                            child: Text(
                              'or',
                              style: AppTypography.caption.copyWith(
                                color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                              ),
                            ),
                          ),
                          Expanded(
                            child: Divider(
                              color: isDark ? AppColors.darkBorder : AppColors.border,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Google Sign-In with official G logo
                      RepsiButton(
                        text: 'Continue with Google',
                        variant: RepsiButtonVariant.outline,
                        isFullWidth: true,
                        size: RepsiButtonSize.large,
                        leadingIcon: const GoogleLogoIcon(size: 18),
                        onPressed: isLoading ? null : _handleGoogleLogin,
                      ),
                      const SizedBox(height: AppSpacing.xl),

                      // Gym Slug option (Discrete advanced expander)
                      Center(
                        child: TextButton.icon(
                          onPressed: () {
                            setState(() {
                              _showWorkspaceSlug = !_showWorkspaceSlug;
                            });
                          },
                          icon: Icon(
                            _showWorkspaceSlug ? LucideIcons.chevronUp : LucideIcons.building,
                            size: 15,
                            color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                          ),
                          label: Text(
                            _showWorkspaceSlug ? 'Hide Gym Slug' : 'Need a gym slug?',
                            style: AppTypography.caption.copyWith(
                              color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),

                      if (_showWorkspaceSlug) ...[
                        const SizedBox(height: AppSpacing.xs),
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkSurface : AppColors.surface,
                            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                            border: Border.all(
                              color: isDark ? AppColors.darkBorder : AppColors.border,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Don't know your gym slug? You can select your gym after logging in.",
                                style: AppTypography.caption.copyWith(
                                  color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.sm),
                              RepsiTextField(
                                label: 'Gym Slug',
                                hintText: 'e.g. apex-fitness',
                                controller: _workspaceSlugController,
                                prefixIcon: Icon(
                                  LucideIcons.building,
                                  size: 18,
                                  color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      const SizedBox(height: AppSpacing.xl),

                      // Sign Up Footer Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'New to REPSI? ',
                            style: AppTypography.bodySmall.copyWith(
                              color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => context.push(RouteNames.signup),
                            child: Text(
                              'Sign Up',
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
