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

class MoreView extends ConsumerWidget {
  const MoreView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      body: SingleChildScrollView(
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

            // Operations Group
            _buildSectionHeader(context, 'OPERATIONS', isDark),
            const SizedBox(height: AppSpacing.xs),
            RepsiCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.badgePercent,
                    label: 'Membership Plans',
                    subtitle: 'Tiers, pricing, and duration rules',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.memberships),
                  ),
                  _buildDivider(isDark),
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.creditCard,
                    label: 'Payments & Invoices',
                    subtitle: 'Transactions and fee collection',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.payments),
                  ),
                  _buildDivider(isDark),
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.receipt,
                    label: 'Expenses',
                    subtitle: 'Rent, equipment, maintenance',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.expenses),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Coaching Group
            _buildSectionHeader(context, 'COACHING & SESSIONS', isDark),
            const SizedBox(height: AppSpacing.xs),
            RepsiCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.userCheck,
                    label: 'Trainers',
                    subtitle: 'Roster, specializations, ratings',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.trainers),
                  ),
                  _buildDivider(isDark),
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.calendar,
                    label: 'Classes & Bookings',
                    subtitle: 'Group sessions, Yoga, HIIT, Zumba',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.classes),
                  ),
                  _buildDivider(isDark),
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.dumbbell,
                    label: 'Workout Routines',
                    subtitle: 'Workout templates and plans',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.workouts),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Analytics & Settings
            _buildSectionHeader(context, 'SYSTEM & ANALYTICS', isDark),
            const SizedBox(height: AppSpacing.xs),
            RepsiCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.barChart3,
                    label: 'Reports',
                    subtitle: 'Financial summaries and CSV exports',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.reports),
                  ),
                  _buildDivider(isDark),
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.trendingUp,
                    label: 'Analytics',
                    subtitle: 'Retention and attendance patterns',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.analytics),
                  ),
                  _buildDivider(isDark),
                  _buildMenuItem(
                    context: context,
                    icon: LucideIcons.settings,
                    label: 'Settings',
                    subtitle: 'Theme, gym info, security',
                    isDark: isDark,
                    onTap: () => context.push(RouteNames.settings),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Logout Button
            ListTile(
              leading: const Icon(LucideIcons.logOut, color: AppColors.error, size: 20),
              title: const Text(
                'Log Out',
                style: TextStyle(color: AppColors.error, fontWeight: FontWeight.w600),
              ),
              onTap: () async {
                await ref.read(authProvider.notifier).logout();
                if (context.mounted) {
                  context.go(RouteNames.login);
                }
              },
            ),
            const SizedBox(height: AppSpacing.xxl),
          ],
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
    return ListTile(
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
