import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_text_field.dart';
import '../../workspaces/providers/workspace_provider.dart';

class OnboardingView extends ConsumerStatefulWidget {
  const OnboardingView({super.key});

  @override
  ConsumerState<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends ConsumerState<OnboardingView> {
  int _currentStep = 0;
  final int _totalSteps = 5;

  // Step 1: Gym Identity
  final _taglineController = TextEditingController(text: 'Transform your body and mind');
  final _addressController = TextEditingController(text: '100 Feet Road, Indiranagar');

  // Step 2: Business Setup
  String _selectedCurrency = 'INR';
  final String _selectedTimezone = 'Asia/Kolkata (IST)';
  final String _openTime = '06:00 AM';
  final String _closeTime = '10:00 PM';

  // Step 3: Membership Plans
  bool _includeMonthly = true;
  final double _monthlyPrice = 2499;
  bool _includeQuarterly = true;
  final double _quarterlyPrice = 6499;
  bool _includeAnnual = true;
  final double _annualPrice = 19999;

  // Step 4: Team invites
  final _staffEmailController = TextEditingController();
  final List<String> _invitedEmails = [];

  @override
  void dispose() {
    _taglineController.dispose();
    _addressController.dispose();
    _staffEmailController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
    } else {
      _finishOnboarding();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  Future<void> _finishOnboarding() async {
    final plans = <Map<String, dynamic>>[];
    if (_includeMonthly) {
      plans.add({'name': 'Monthly Standard', 'duration_in_days': 30, 'price': _monthlyPrice});
    }
    if (_includeQuarterly) {
      plans.add({'name': 'Quarterly Pro', 'duration_in_days': 90, 'price': _quarterlyPrice});
    }
    if (_includeAnnual) {
      plans.add({'name': 'Annual VIP', 'duration_in_days': 365, 'price': _annualPrice});
    }

    final data = {
      'tagline': _taglineController.text,
      'address': _addressController.text,
      'currency': _selectedCurrency,
      'timezone': _selectedTimezone,
      'operating_hours': '$_openTime - $_closeTime',
      'plans': plans,
      'team_invites': _invitedEmails,
    };

    final success = await ref.read(workspaceProvider.notifier).completeOnboarding(data);
    if (mounted) {
      if (success) {
        context.go(RouteNames.dashboard);
      } else {
          final message = ref.read(workspaceProvider).errorMessage ?? 'Failed to complete onboarding';
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final workspaceState = ref.watch(workspaceProvider);
    final currentGymName = workspaceState.activeWorkspace?.name ?? 'Your Gym';

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Gym Setup',
          style: AppTypography.headingSmall.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
        leading: _currentStep > 0
            ? IconButton(
                icon: Icon(
                  LucideIcons.arrowLeft,
                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                ),
                onPressed: _prevStep,
              )
            : null,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: Row(
                children: List.generate(_totalSteps, (index) {
                  final isActive = index <= _currentStep;
                  return Expanded(
                    child: Container(
                      height: 4,
                      margin: EdgeInsets.only(right: index == _totalSteps - 1 ? 0 : 6),
                      decoration: BoxDecoration(
                        color: isActive
                            ? AppColors.primary
                            : (isDark ? AppColors.darkSurfaceElevated : AppColors.border),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  );
                }),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: _buildCurrentStep(isDark, currentGymName),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkSurface : AppColors.surface,
                border: Border(
                  top: BorderSide(
                    color: isDark ? AppColors.darkBorder : AppColors.border,
                  ),
                ),
              ),
              child: RepsiButton(
                text: _currentStep == _totalSteps - 1 ? 'Launch $currentGymName' : 'Continue',
                isLoading: workspaceState.isLoading,
                onPressed: _nextStep,
                isFullWidth: true,
                size: RepsiButtonSize.large,
                trailingIcon: _currentStep == _totalSteps - 1
                    ? const Icon(LucideIcons.rocket, size: 18)
                    : const Icon(LucideIcons.arrowRight, size: 18),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentStep(bool isDark, String gymName) {
    switch (_currentStep) {
      case 0:
        return _buildStep1GymIdentity(isDark, gymName);
      case 1:
        return _buildStep2BusinessSetup(isDark);
      case 2:
        return _buildStep3MembershipPlans(isDark);
      case 3:
        return _buildStep4InviteTeam(isDark);
      case 4:
        return _buildStep5Launch(isDark, gymName);
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildStep1GymIdentity(bool isDark, String gymName) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Gym Identity',
          style: AppTypography.headingLarge.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Let members and staff know what makes $gymName special.',
          style: AppTypography.bodySmall.copyWith(
            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.xl),
        RepsiTextField(
          label: 'Gym Tagline',
          hintText: 'e.g. Elevate Your Strength Every Day',
          controller: _taglineController,
          prefixIcon: const Icon(LucideIcons.sparkles, size: 18),
        ),
        const SizedBox(height: AppSpacing.md),
        RepsiTextField(
          label: 'Street Address',
          hintText: '100 Feet Road, Indiranagar',
          controller: _addressController,
          prefixIcon: const Icon(LucideIcons.mapPin, size: 18),
        ),
        const SizedBox(height: AppSpacing.xl),
        RepsiCard(
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(LucideIcons.image, color: AppColors.primary),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Upload Gym Logo',
                      style: AppTypography.labelLarge.copyWith(
                        color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      'PNG, JPG up to 5MB (optional)',
                      style: AppTypography.caption.copyWith(
                        color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              RepsiButton(
                text: 'Browse',
                variant: RepsiButtonVariant.outline,
                size: RepsiButtonSize.small,
                onPressed: () {},
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStep2BusinessSetup(bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Business Setup',
          style: AppTypography.headingLarge.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Configure your base currency, timezone, and operating hours.',
          style: AppTypography.bodySmall.copyWith(
            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.xl),
        Text('Base Currency', style: AppTypography.labelMedium),
        const SizedBox(height: AppSpacing.xs),
        Wrap(
          spacing: AppSpacing.sm,
          children: ['INR (₹)', 'USD (\$)', 'EUR (€)', 'AED (د.إ)'].map((c) {
            final code = c.split(' ').first;
            final isSelected = _selectedCurrency == code;
            return ChoiceChip(
              label: Text(c),
              selected: isSelected,
              selectedColor: AppColors.primary,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              ),
              onSelected: (val) {
                if (val) setState(() => _selectedCurrency = code);
              },
            );
          }).toList(),
        ),
        const SizedBox(height: AppSpacing.lg),
        Text('Operating Hours', style: AppTypography.labelMedium),
        const SizedBox(height: AppSpacing.xs),
        Row(
          children: [
            Expanded(
              child: RepsiCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Opens At', style: AppTypography.caption),
                    const SizedBox(height: 4),
                    Text(_openTime, style: AppTypography.labelLarge),
                  ],
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: RepsiCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Closes At', style: AppTypography.caption),
                    const SizedBox(height: 4),
                    Text(_closeTime, style: AppTypography.labelLarge),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStep3MembershipPlans(bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Starter Plans',
          style: AppTypography.headingLarge.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Pre-populate standard membership tiers. You can edit or add more later.',
          style: AppTypography.bodySmall.copyWith(
            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.xl),
        CheckboxListTile(
          value: _includeMonthly,
          activeColor: AppColors.primary,
          title: const Text('Monthly Plan (30 Days)'),
          subtitle: Text('₹${_monthlyPrice.toInt()} / month'),
          onChanged: (val) => setState(() => _includeMonthly = val ?? true),
        ),
        CheckboxListTile(
          value: _includeQuarterly,
          activeColor: AppColors.primary,
          title: const Text('Quarterly Plan (90 Days)'),
          subtitle: Text('₹${_quarterlyPrice.toInt()} / quarter'),
          onChanged: (val) => setState(() => _includeQuarterly = val ?? true),
        ),
        CheckboxListTile(
          value: _includeAnnual,
          activeColor: AppColors.primary,
          title: const Text('Annual Plan (365 Days)'),
          subtitle: Text('₹${_annualPrice.toInt()} / year'),
          onChanged: (val) => setState(() => _includeAnnual = val ?? true),
        ),
      ],
    );
  }

  Widget _buildStep4InviteTeam(bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Invite Team',
          style: AppTypography.headingLarge.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Add your managers, front-desk staff, and trainers.',
          style: AppTypography.bodySmall.copyWith(
            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.xl),
        Row(
          children: [
            Expanded(
              child: RepsiTextField(
                hintText: 'colleague@gym.com',
                controller: _staffEmailController,
                prefixIcon: const Icon(LucideIcons.mail, size: 18),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            RepsiButton(
              text: 'Invite',
              onPressed: () {
                final email = _staffEmailController.text.trim();
                if (email.isNotEmpty && email.contains('@')) {
                  setState(() {
                    _invitedEmails.add(email);
                    _staffEmailController.clear();
                  });
                }
              },
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.lg),
        if (_invitedEmails.isNotEmpty) ...[
          Text('Invited Members (${_invitedEmails.length})', style: AppTypography.labelMedium),
          const SizedBox(height: AppSpacing.sm),
          ..._invitedEmails.map((email) => ListTile(
                dense: true,
                leading: const Icon(LucideIcons.userCheck, color: AppColors.primary, size: 18),
                title: Text(email),
                trailing: IconButton(
                  icon: const Icon(LucideIcons.x, size: 16),
                  onPressed: () {
                    setState(() => _invitedEmails.remove(email));
                  },
                ),
              )),
        ],
      ],
    );
  }

  Widget _buildStep5Launch(bool isDark, String gymName) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: AppSpacing.xl),
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: const Icon(LucideIcons.checkCircle2, size: 48, color: AppColors.primary),
        ),
        const SizedBox(height: AppSpacing.lg),
        Text(
          'You are ready to launch!',
          textAlign: TextAlign.center,
          style: AppTypography.headingLarge.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          '$gymName is fully configured and ready for live check-ins, member registrations, and revenue tracking.',
          textAlign: TextAlign.center,
          style: AppTypography.bodySmall.copyWith(
            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.xxl),
        RepsiCard(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            children: [
              _buildSummaryRow('Gym Name', gymName),
              const Divider(height: 24),
              _buildSummaryRow('Currency', _selectedCurrency),
              const Divider(height: 24),
              _buildSummaryRow('Operating Hours', '$_openTime - $_closeTime'),
              const Divider(height: 24),
              _buildSummaryRow('Plans Configured', '${(_includeMonthly ? 1 : 0) + (_includeQuarterly ? 1 : 0) + (_includeAnnual ? 1 : 0)} tiers'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.caption),
        Text(value, style: AppTypography.labelLarge),
      ],
    );
  }
}
