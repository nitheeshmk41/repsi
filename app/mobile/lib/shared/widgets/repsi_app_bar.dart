import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../models/workspace_model.dart';
import 'repsi_avatar.dart';

class RepsiAppBar extends ConsumerWidget implements PreferredSizeWidget {
  final String? title;
  final bool showWorkspaceSelector;
  final WorkspaceModel? currentWorkspace;
  final List<WorkspaceModel> workspaces;
  final ValueChanged<WorkspaceModel>? onWorkspaceSelected;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onProfileTap;
  final String? userFullName;
  final String? userAvatarUrl;
  final List<Widget>? actions;
  final Widget? leading;

  const RepsiAppBar({
    super.key,
    this.title,
    this.showWorkspaceSelector = true,
    this.currentWorkspace,
    this.workspaces = const [],
    this.onWorkspaceSelected,
    this.onNotificationTap,
    this.onProfileTap,
    this.userFullName,
    this.userAvatarUrl,
    this.actions,
    this.leading,
  });

  @override
  Size get preferredSize => const Size.fromHeight(60);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + AppSpacing.xs,
        bottom: AppSpacing.xs,
        left: AppSpacing.md,
        right: AppSpacing.md,
      ),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkBackground : AppColors.background,
        border: Border(
          bottom: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.border,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          if (leading != null) ...[
            leading!,
            const SizedBox(width: AppSpacing.sm),
          ],
          if (showWorkspaceSelector && currentWorkspace != null)
            Expanded(
              child: InkWell(
                onTap: workspaces.length > 1
                    ? () => _showWorkspacePicker(context)
                    : null,
                borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.xs,
                    vertical: AppSpacing.xs / 2,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          currentWorkspace!.name.isNotEmpty
                              ? currentWorkspace!.name[0].toUpperCase()
                              : 'R',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Flexible(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Flexible(
                                  child: Text(
                                    currentWorkspace!.name,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTypography.headingSmall.copyWith(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: isDark
                                          ? AppColors.darkTextPrimary
                                          : AppColors.textPrimary,
                                    ),
                                  ),
                                ),
                                if (workspaces.length > 1) ...[
                                  const SizedBox(width: 4),
                                  Icon(
                                    LucideIcons.chevronDown,
                                    size: 14,
                                    color: isDark
                                        ? AppColors.darkTextMuted
                                        : AppColors.textMuted,
                                  ),
                                ],
                              ],
                            ),
                            Text(
                              'repsi.app/${currentWorkspace!.slug}',
                              style: AppTypography.caption.copyWith(
                                fontSize: 11,
                                color: isDark
                                    ? AppColors.darkTextMuted
                                    : AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else if (title != null)
            Expanded(
              child: Text(
                title!,
                style: AppTypography.headingMedium.copyWith(
                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                ),
              ),
            )
          else
            const Spacer(),
          if (actions != null)
            ...actions!
          else ...[
            if (onNotificationTap != null)
              IconButton(
                onPressed: onNotificationTap,
                tooltip: 'Notifications',
                icon: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Icon(
                      LucideIcons.bell,
                      size: 20,
                      color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                    ),
                    Positioned(
                      right: -4,
                      top: -4,
                      child: Container(
                        padding: const EdgeInsets.all(3),
                        decoration: const BoxDecoration(
                          color: AppColors.error,
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 14,
                          minHeight: 14,
                        ),
                        child: const Text(
                          '3',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(width: AppSpacing.xs / 2),
            if (onProfileTap != null)
              GestureDetector(
                onTap: onProfileTap,
                child: RepsiAvatar(
                  name: userFullName ?? 'User',
                  imageUrl: userAvatarUrl,
                  size: 30,
                ),
              ),
            const SizedBox(width: AppSpacing.xs / 2),
            // Explicit Logout Button
            IconButton(
              tooltip: 'Logout',
              icon: const Icon(
                LucideIcons.logOut,
                size: 19,
                color: AppColors.error,
              ),
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Logout'),
                    content: const Text('Are you sure you want to log out of REPSI?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        style: TextButton.styleFrom(foregroundColor: AppColors.error),
                        child: const Text('Logout'),
                      ),
                    ],
                  ),
                );
                if (confirm == true) {
                  await ref.read(authProvider.notifier).logout();
                }
              },
            ),
          ],
        ],
      ),
    );
  }

  void _showWorkspacePicker(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showModalBottomSheet(
      context: context,
      backgroundColor: isDark ? AppColors.darkSurface : AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusXl)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              vertical: AppSpacing.lg,
              horizontal: AppSpacing.md,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkBorder : AppColors.border,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'Switch Workspace',
                  style: AppTypography.headingSmall.copyWith(
                    color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: workspaces.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (ctx, index) {
                    final ws = workspaces[index];
                    final isSelected = ws.id == currentWorkspace?.id;

                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.primary
                              : (isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          ws.name.isNotEmpty ? ws.name[0].toUpperCase() : 'R',
                          style: TextStyle(
                            color: isSelected ? Colors.white : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      title: Text(
                        ws.name,
                        style: AppTypography.labelLarge.copyWith(
                          color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                        ),
                      ),
                      subtitle: Text(
                        'repsi.app/${ws.slug}',
                        style: AppTypography.caption.copyWith(
                          color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                        ),
                      ),
                      trailing: isSelected
                          ? const Icon(LucideIcons.check, color: AppColors.primary, size: 20)
                          : null,
                      onTap: () {
                        Navigator.pop(ctx);
                        onWorkspaceSelected?.call(ws);
                      },
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
