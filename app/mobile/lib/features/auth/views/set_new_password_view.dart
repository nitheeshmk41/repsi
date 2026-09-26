import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_screen_background.dart';
import '../../../shared/widgets/repsi_text_field.dart';

class SetNewPasswordView extends StatefulWidget {
  const SetNewPasswordView({super.key});

  @override
  State<SetNewPasswordView> createState() => _SetNewPasswordViewState();
}

class _SetNewPasswordViewState extends State<SetNewPasswordView> {
  final _passwordController = TextEditingController(text: 'Password123');
  bool _isLoading = false;

  bool get _hasMin8Chars => _passwordController.text.length >= 8;
  bool get _hasNumber => RegExp(r'[0-9]').hasMatch(_passwordController.text);
  bool get _hasUppercase => RegExp(r'[A-Z]').hasMatch(_passwordController.text);

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  void _handleUpdate() {
    setState(() => _isLoading = true);
    Future.delayed(const Duration(milliseconds: 650), () {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Password updated successfully!'),
            backgroundColor: AppColors.primary,
          ),
        );
        context.go('/auth/select-role');
      }
    });
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
              // Circular Lock Badge (Mockup Screen 7)
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
                      Icons.lock_rounded,
                      size: 34,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Title and Subtitle
              RepsiStaggerItem(
                index: 1,
                child: Column(
                  children: [
                    Text(
                      'Set New Password',
                      textAlign: TextAlign.center,
                      style: AppTypography.heading.copyWith(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Create a new password for your account',
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

              // Password input field
              RepsiStaggerItem(
                index: 2,
                child: RepsiTextField(
                  label: 'New password',
                  hintText: '••••••••',
                  controller: _passwordController,
                  isPassword: true,
                  onChanged: (_) => setState(() {}),
                  prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
                ),
              ),
              const SizedBox(height: 20),

              // Checklist with green checkmarks
              RepsiStaggerItem(
                index: 3,
                child: Column(
                  children: [
                    _buildCheckItem('Minimum 8 characters', _hasMin8Chars),
                    const SizedBox(height: 10),
                    _buildCheckItem('At least one number', _hasNumber),
                    const SizedBox(height: 10),
                    _buildCheckItem('At least one uppercase letter', _hasUppercase),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Update Password button
              RepsiStaggerItem(
                index: 4,
                child: RepsiButton(
                  text: 'Update Password',
                  isLoading: _isLoading,
                  onPressed: (_hasMin8Chars && _hasNumber && _hasUppercase) ? _handleUpdate : null,
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


  Widget _buildCheckItem(String text, bool isChecked) {
    return Row(
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            color: isChecked ? AppColors.primary : AppColors.border,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.check,
            size: 13,
            color: Colors.white,
          ),
        ),
        const SizedBox(width: 10),
        Text(
          text,
          style: AppTypography.caption.copyWith(
            fontSize: 14,
            color: isChecked ? AppColors.text : AppColors.textSecondary,
            fontWeight: isChecked ? FontWeight.w500 : FontWeight.w400,
          ),
        ),
      ],
    );
  }
}
