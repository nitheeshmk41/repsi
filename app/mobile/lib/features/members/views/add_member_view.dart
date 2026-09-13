import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_text_field.dart';
import '../providers/member_provider.dart';

class AddMemberView extends ConsumerStatefulWidget {
  const AddMemberView({super.key});

  @override
  ConsumerState<AddMemberView> createState() => _AddMemberViewState();
}

class _AddMemberViewState extends ConsumerState<AddMemberView> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emergencyPhoneController = TextEditingController();
  String _selectedPlan = 'Monthly Standard';
  bool _isLoading = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _emergencyPhoneController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    final data = {
      'full_name': _fullNameController.text.trim(),
      'email': _emailController.text.trim(),
      'phone': _phoneController.text.trim(),
      'emergency_contact_phone': _emergencyPhoneController.text.trim(),
      'membership_plan_name': _selectedPlan,
      'status': 'ACTIVE',
      'start_date': DateTime.now().toIso8601String(),
      'end_date': DateTime.now().add(const Duration(days: 30)).toIso8601String(),
    };

    final success = await ref.read(memberListProvider.notifier).addMember(data);
    if (mounted) {
      setState(() => _isLoading = false);
      if (success) {
        context.pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Member added successfully!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to add member. Please retry.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Add New Member',
          style: AppTypography.headingSmall.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
        leading: IconButton(
          icon: Icon(
            LucideIcons.arrowLeft,
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                RepsiTextField(
                  label: 'Full Name *',
                  hintText: 'John Doe',
                  controller: _fullNameController,
                  prefixIcon: const Icon(LucideIcons.user, size: 18),
                  validator: (val) => val == null || val.trim().isEmpty ? 'Name is required' : null,
                ),
                const SizedBox(height: AppSpacing.md),
                RepsiTextField(
                  label: 'Email Address *',
                  hintText: 'john@example.com',
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  prefixIcon: const Icon(LucideIcons.mail, size: 18),
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) return 'Email is required';
                    if (!val.contains('@')) return 'Enter a valid email';
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.md),
                RepsiTextField(
                  label: 'Phone Number',
                  hintText: '+91 98765 43210',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  prefixIcon: const Icon(LucideIcons.phone, size: 18),
                ),
                const SizedBox(height: AppSpacing.md),
                RepsiTextField(
                  label: 'Emergency Contact Phone',
                  hintText: '+91 98765 00000',
                  controller: _emergencyPhoneController,
                  keyboardType: TextInputType.phone,
                  prefixIcon: const Icon(LucideIcons.phoneCall, size: 18),
                ),
                const SizedBox(height: AppSpacing.lg),
                Text('Membership Plan', style: AppTypography.labelMedium),
                const SizedBox(height: AppSpacing.xs),
                Wrap(
                  spacing: AppSpacing.sm,
                  children: [
                    'Monthly Standard',
                    'Quarterly Pro',
                    'Annual VIP',
                  ].map((plan) {
                    final isSelected = _selectedPlan == plan;
                    return ChoiceChip(
                      label: Text(plan),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                      onSelected: (val) {
                        if (val) setState(() => _selectedPlan = plan);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppSpacing.xxl),
                RepsiButton(
                  text: 'Save Member',
                  isLoading: _isLoading,
                  onPressed: _handleSubmit,
                  isFullWidth: true,
                  size: RepsiButtonSize.large,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
