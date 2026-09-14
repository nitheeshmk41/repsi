import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_avatar.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../auth/providers/auth_provider.dart';
import '../../auth/views/sign_out_dialog.dart';

class MoreView extends ConsumerWidget {
  const MoreView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            children: [
              // User Header Card
              RepsiCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                onTap: () => context.push(RouteNames.settings),
                child: Row(
                  children: [
                    RepsiAvatar(
                      name: user?.fullName ?? 'Admin User',
                      imageUrl: user?.avatarUrl,
                      size: 50,
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.fullName ?? 'Gym Administrator',
                            style: AppTypography.labelLarge.copyWith(
                              color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            user?.email ?? 'admin@gym.com',
                            style: AppTypography.caption.copyWith(
                              color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      LucideIcons.chevronRight,
                      size: 18,
                      color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
  
              // Gym Management Group
              _buildSectionHeader(context, 'GYM MANAGEMENT', isDark),
              const SizedBox(height: AppSpacing.xs),
              RepsiCard(
                padding: EdgeInsets.zero,
                child: Column(
                  children: [
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.userCheck,
                      label: 'Trainers',
                      subtitle: 'Manage gym trainers',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.trainers),
                    ),
                    _buildDivider(isDark),
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.dumbbell,
                      label: 'Machines & Equipment',
                      subtitle: 'Inventory and maintenance',
                      isDark: isDark,
                      onTap: () {}, // To be implemented
                    ),
                    _buildDivider(isDark),
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.calendar,
                      label: 'Classes',
                      subtitle: 'Group sessions scheduling',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.classes),
                    ),
                    _buildDivider(isDark),
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.list,
                      label: 'Workouts',
                      subtitle: 'Manage workout templates',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.workouts),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
  
              // Business Group
              _buildSectionHeader(context, 'BUSINESS', isDark),
              const SizedBox(height: AppSpacing.xs),
              RepsiCard(
                padding: EdgeInsets.zero,
                child: Column(
                  children: [
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.badgePercent,
                      label: 'Membership Plans',
                      subtitle: 'Tiers, pricing, and rules',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.memberships),
                    ),
                    _buildDivider(isDark),
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.barChart3,
                      label: 'Reports',
                      subtitle: 'Financial and attendance data',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.reports),
                    ),
                    _buildDivider(isDark),
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.bellRing,
                      label: 'Notifications',
                      subtitle: 'Push and email alerts',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.notifications),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
  
              // Settings Group
              _buildSectionHeader(context, 'SETTINGS', isDark),
              const SizedBox(height: AppSpacing.xs),
              RepsiCard(
                padding: EdgeInsets.zero,
                child: Column(
                  children: [
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.settings,
                      label: 'Gym Settings',
                      subtitle: 'Name, address, branding',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.settings),
                    ),
                    _buildDivider(isDark),
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.shield,
                      label: 'Account Settings',
                      subtitle: 'Security and billing',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.settings),
                    ),
                    _buildDivider(isDark),
                    _buildMenuItem(
                      context: context,
                      icon: LucideIcons.user,
                      label: 'Profile',
                      subtitle: 'Personal information',
                      isDark: isDark,
                      onTap: () => context.push(RouteNames.settings),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
  
              // Logout Button
              RepsiCard(
                padding: EdgeInsets.zero,
                child: Material(
                  color: Colors.transparent,
                  child: ListTile(
                    leading: const Icon(LucideIcons.logOut, color: AppColors.error, size: 20),
                    title: const Text(
                      'Sign Out',
                      style: TextStyle(color: AppColors.error, fontWeight: FontWeight.w600),
                    ),
                    onTap: () => SignOutDialog.show(context),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, bool isDark) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: AppTypography.caption.copyWith(
          letterSpacing: 1.0,
          fontWeight: FontWeight.w700,
          color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required BuildContext context,
    required IconData icon,
    required String label,
    required String subtitle,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, size: 18, color: AppColors.primary),
        ),
        title: Text(
          label,
          style: AppTypography.labelLarge.copyWith(
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: AppTypography.caption.copyWith(
            color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
          ),
        ),
        trailing: Icon(
          LucideIcons.chevronRight,
          size: 16,
          color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
        ),
        onTap: onTap,
      ),
    );
  }

  Widget _buildDivider(bool isDark) {
    return Divider(
      height: 1,
      indent: 54,
      color: isDark ? AppColors.darkBorder : AppColors.border,
    );
  }
}
