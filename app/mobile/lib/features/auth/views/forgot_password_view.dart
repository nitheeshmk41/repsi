import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_screen_background.dart';
import '../../../shared/widgets/repsi_text_field.dart';

class ForgotPasswordView extends StatefulWidget {
  const ForgotPasswordView({super.key});

  @override
  State<ForgotPasswordView> createState() => _ForgotPasswordViewState();
}

class _ForgotPasswordViewState extends State<ForgotPasswordView> {
  final _emailController = TextEditingController(text: 'nitheesh@gmail.com');
  bool _isLoading = false;

  void _handleSend() {
    setState(() => _isLoading = true);
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) {
        setState(() => _isLoading = false);
        context.push('/auth/verify-otp', extra: _emailController.text.trim());
      }
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => context.pop(),
        ),
      ),
      body: RepsiScreenBackground(
        imagePath: 'assets/images/main_splash1.png',
        imageOpacity: 0.06,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.pageHorizontalPadding,
              vertical: 16,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 24),

              // Circular light green badge with green Mail icon (Mockup Screen 5)
              RepsiStaggerItem(
                index: 0,
                child: Center(
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: const BoxDecoration(
                      color: AppColors.primarySoft,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mail_outline_rounded,
                      size: 34,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Heading & Subtitle
              RepsiStaggerItem(
                index: 1,
                child: Column(
                  children: [
                    Text(
                      'Forgot Password',
                      textAlign: TextAlign.center,
                      style: AppTypography.heading.copyWith(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Enter your email to receive a reset link',
                      textAlign: TextAlign.center,
                      style: AppTypography.body.copyWith(
                        fontSize: 15,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Email TextField
              RepsiStaggerItem(
                index: 2,
                child: RepsiTextField(
                  label: 'Email',
                  hintText: 'nitheesh@gmail.com',
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  prefixIcon: const Icon(Icons.mail_outline_rounded, size: 20),
                ),
              ),
              const SizedBox(height: 28),

              // Send Reset Link Button
              RepsiStaggerItem(
                index: 3,
                child: RepsiButton(
                  text: 'Send Reset Link',
                  isLoading: _isLoading,
                  onPressed: _handleSend,
                  isFullWidth: true,
                  size: RepsiButtonSize.large,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
}

