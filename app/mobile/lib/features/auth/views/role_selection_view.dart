import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_screen_background.dart';
import '../providers/auth_provider.dart';

class RoleSelectionView extends ConsumerWidget {
  const RoleSelectionView({super.key});

  void _selectRole(BuildContext context, WidgetRef ref, String role) {
    ref.read(authProvider.notifier).setRole(role);
    context.go(RouteNames.roleDashboard(role));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
        imagePath: 'assets/images/ownerscreen.png',
        imageOpacity: 0.06,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.pageHorizontalPadding,
              vertical: 12,
            ),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 12),
              // Heading (Mockup Screen 8)
              RepsiStaggerItem(
                index: 0,
                child: Text(
                  'Select Your Role',
                  style: AppTypography.heading.copyWith(
                    fontSize: 26,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              RepsiStaggerItem(
                index: 1,
                child: Text(
                  "Choose how you'll use Repsi",
                  style: AppTypography.body.copyWith(
                    fontSize: 15,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Role 1: Gym Owner
              RepsiStaggerItem(
                index: 2,
                child: _RoleCard(
                  title: 'Gym Owner',
                  subtitle: 'Manage your gym, members, trainers and finances',
                  icon: Icons.storefront_rounded,
                  iconBgColor: AppColors.primarySoft,
                  iconColor: AppColors.primary,
                  onTap: () => _selectRole(context, ref, 'OWNER'),
                ),
              ),
              const SizedBox(height: 16),

              // Role 2: Trainer
              RepsiStaggerItem(
                index: 3,
                child: _RoleCard(
                  title: 'Trainer',
                  subtitle: 'Coach clients and create workouts',
                  icon: Icons.fitness_center_rounded,
                  iconBgColor: const Color(0xFFEBF5FF),
                  iconColor: const Color(0xFF2563EB),
                  onTap: () => _selectRole(context, ref, 'TRAINER'),
                ),
              ),
              const SizedBox(height: 16),

              // Role 3: Member
              RepsiStaggerItem(
                index: 4,
                child: _RoleCard(
                  title: 'Member',
                  subtitle: 'Follow workouts and track your progress',
                  icon: Icons.person_rounded,
                  iconBgColor: AppColors.primarySoft,
                  iconColor: AppColors.primary,
                  onTap: () => _selectRole(context, ref, 'USER'),
                ),
              ),
              const SizedBox(height: 16),

              // Role 4: System Admin
              RepsiStaggerItem(
                index: 5,
                child: _RoleCard(
                  title: 'System Admin',
                  subtitle: 'Platform-level gym management, users and analytics',
                  icon: Icons.admin_panel_settings_rounded,
                  iconBgColor: const Color(0xFFF3E8FF),
                  iconColor: const Color(0xFF9333EA),
                  onTap: () => _selectRole(context, ref, 'ADMIN'),
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

class _RoleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconBgColor;
  final Color iconColor;
  final VoidCallback onTap;

  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return RepsiCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              icon,
              size: 24,
              color: iconColor,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTypography.headingSmall.copyWith(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: AppTypography.caption.copyWith(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          const Icon(
            Icons.chevron_right_rounded,
            size: 20,
            color: AppColors.textMuted,
          ),
        ],
      ),
    );
  }
}
