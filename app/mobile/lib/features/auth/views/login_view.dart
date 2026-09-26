import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/google_logo_icon.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_error_banner.dart';
import '../../../shared/widgets/repsi_screen_background.dart';
import '../../../shared/widgets/repsi_text_field.dart';
import '../providers/auth_provider.dart';

class LoginView extends ConsumerStatefulWidget {
  const LoginView({super.key});

  @override
  ConsumerState<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends ConsumerState<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'nitheesh@gmail.com');
  final _passwordController = TextEditingController(text: 'password123');

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    HapticFeedback.lightImpact();

    final email = _emailController.text.trim();
    final pass = _passwordController.text;

    final success = await ref.read(authProvider.notifier).login(
          email: email,
          password: pass,
        );

    if (mounted) {
      if (success) {
        context.go(RouteNames.roleDashboard(ref.read(authProvider).user?.role));
      } else {
        // Fallback to role selection if offline or dev demo
        context.push('/auth/select-role');
      }
    }
  }

  Future<void> _handleGoogleLogin() async {
    FocusScope.of(context).unfocus();
    HapticFeedback.lightImpact();
    final success = await ref.read(authProvider.notifier).loginWithGoogle();
    if (mounted) {
      if (success) {
        context.go(RouteNames.roleDashboard(ref.read(authProvider).user?.role));
      } else {
        context.push('/auth/select-role');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final isLoading = authState.status == AuthStatus.loading;
    final isError =
        authState.status == AuthStatus.error && authState.errorMessage != null;

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: RepsiScreenBackground(
          imagePath: 'assets/images/main_splash1.png',
          imageOpacity: 0.07,
          child: SafeArea(
            child: Center(
              child: SingleChildScrollView(

              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pageHorizontalPadding,
                vertical: 24,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Stagger 0: Logo
                    RepsiStaggerItem(
                      index: 0,
                      child: Center(
                        child: Container(
                          width: 68,
                          height: 68,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: AppColors.border),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.03),
                                blurRadius: 12,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(12),
                          child: Image.asset(
                            'assets/logos/logo_trans.png',
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => Image.asset(
                              'assets/logos/primary_logo.png',
                              fit: BoxFit.contain,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.fitness_center_rounded,
                                size: 32,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Stagger 1: Heading
                    RepsiStaggerItem(
                      index: 1,
                      child: Column(
                        children: [
                          Text(
                            'Welcome back',
                            textAlign: TextAlign.center,
                            style: AppTypography.heading.copyWith(
                              fontSize: 26,
                              fontWeight: FontWeight.w700,
                              color: AppColors.text,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Sign in to your account',
                            textAlign: TextAlign.center,
                            style: AppTypography.body.copyWith(
                              fontSize: 15,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    if (isError) ...[
                      RepsiErrorBanner(
                        title: 'Notice',
                        message: authState.errorMessage!,
                        onRetry: isLoading ? null : _handleLogin,
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Stagger 2: Email Field
                    RepsiStaggerItem(
                      index: 2,
                      child: RepsiTextField(
                        label: 'Email',
                        hintText: 'nitheesh@gmail.com',
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        prefixIcon:
                            const Icon(Icons.mail_outline_rounded, size: 20),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Email is required';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Stagger 3: Password Field
                    RepsiStaggerItem(
                      index: 3,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          RepsiTextField(
                            label: 'Password',
                            hintText: '••••••••',
                            controller: _passwordController,
                            isPassword: true,
                            textInputAction: TextInputAction.done,
                            onSubmitted: (_) => _handleLogin(),
                            prefixIcon: const Icon(Icons.lock_outline_rounded,
                                size: 20),
                            validator: (val) {
                              if (val == null || val.isEmpty) {
                                return 'Password is required';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerRight,
                            child: GestureDetector(
                              onTap: () =>
                                  context.push(RouteNames.forgotPassword),
                              child: Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 4),
                                child: Text(
                                  'Forgot password?',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.textSecondary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Stagger 4: Primary Button (Sign In)
                    RepsiStaggerItem(
                      index: 4,
                      child: RepsiButton(
                        text: 'Sign In',
                        isLoading: isLoading,
                        onPressed: isLoading ? null : _handleLogin,
                        isFullWidth: true,
                        size: RepsiButtonSize.large,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Stagger 5: Divider "OR"
                    RepsiStaggerItem(
                      index: 5,
                      child: Row(
                        children: [
                          const Expanded(
                              child: Divider(color: AppColors.border)),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Text(
                              'OR',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.textMuted,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const Expanded(
                              child: Divider(color: AppColors.border)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Stagger 6: Continue with Google
                    RepsiStaggerItem(
                      index: 6,
                      child: RepsiButton(
                        text: 'Continue with Google',
                        variant: RepsiButtonVariant.outline,
                        isFullWidth: true,
                        size: RepsiButtonSize.large,
                        leadingIcon: const GoogleLogoIcon(size: 18),
                        onPressed: isLoading ? null : _handleGoogleLogin,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Stagger 7: Contact your gym / Select Role shortcut
                    RepsiStaggerItem(
                      index: 7,
                      child: Column(
                        children: [
                          Text(
                            "Don't have an account? Contact your gym",
                            textAlign: TextAlign.center,
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                          const SizedBox(height: 12),
                          // Quick role switch for prototype & testing
                          TextButton.icon(
                            onPressed: () => context.push('/auth/select-role'),
                            icon: const Icon(Icons.swap_horiz_rounded,
                                size: 16, color: AppColors.primary),
                            label: Text(
                              'Switch / Test Roles',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
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

