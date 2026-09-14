import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../../features/auth/views/sign_out_dialog.dart';
import 'repsi_avatar.dart';

class RepsiProfileBottomSheet extends ConsumerWidget {
  const RepsiProfileBottomSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const RepsiProfileBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusXl)),
      ),
      padding: const EdgeInsets.only(
        top: AppSpacing.md,
        left: AppSpacing.md,
        right: AppSpacing.md,
        bottom: AppSpacing.xxl,
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: AppSpacing.lg),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkBorder : AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Text(
              'Owner Profile',
              style: AppTypography.headingSmall.copyWith(
                color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            
            // User info
            Row(
              children: [
                RepsiAvatar(
                  name: user?.fullName ?? 'Owner',
                  imageUrl: user?.avatarUrl,
                  size: 48,
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user?.fullName ?? 'Gym Owner',
                        style: AppTypography.labelLarge.copyWith(
                          color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        'Apex Fitness • Owner',
                        style: AppTypography.caption.copyWith(
                          color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
            Divider(color: isDark ? AppColors.darkBorder : AppColors.border, height: 1),
            const SizedBox(height: AppSpacing.sm),
            
            // Navigation Links
            ListTile(
              leading: Icon(LucideIcons.user, size: 20, color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
              title: Text('Profile', style: AppTypography.bodyMedium.copyWith(color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary, fontWeight: FontWeight.w600)),
              onTap: () {
                Navigator.pop(context);
                context.push(RouteNames.settings); // Or specific profile route
              },
            ),
            ListTile(
              leading: Icon(LucideIcons.settings, size: 20, color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
              title: Text('Gym Settings', style: AppTypography.bodyMedium.copyWith(color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary, fontWeight: FontWeight.w600)),
              onTap: () {
                Navigator.pop(context);
                context.push(RouteNames.settings);
              },
            ),
            ListTile(
              leading: Icon(LucideIcons.shield, size: 20, color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
              title: Text('Account Settings', style: AppTypography.bodyMedium.copyWith(color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary, fontWeight: FontWeight.w600)),
              onTap: () {
                Navigator.pop(context);
                context.push(RouteNames.settings);
              },
            ),
            
            const SizedBox(height: AppSpacing.sm),
            Divider(color: isDark ? AppColors.darkBorder : AppColors.border, height: 1),
            const SizedBox(height: AppSpacing.sm),
            
            // Sign Out
            ListTile(
              leading: const Icon(LucideIcons.logOut, size: 20, color: AppColors.error),
              title: Text(
                'Sign Out',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.error,
                  fontWeight: FontWeight.w600,
                ),
              ),
              onTap: () {
                Navigator.pop(context); // Close bottom sheet
                SignOutDialog.show(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
