import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';

class RepsiErrorBanner extends StatelessWidget {
  final String message;
  final String? title;
  final VoidCallback? onRetry;
  final IconData icon;

  const RepsiErrorBanner({
    super.key,
    required this.message,
    this.title,
    this.onRetry,
    this.icon = LucideIcons.wifiOff,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm + 2,
      ),
      decoration: BoxDecoration(
        color: isDark
            ? AppColors.error.withValues(alpha: 0.12)
            : AppColors.errorLight,
        borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
        border: Border.all(
          color: AppColors.error.withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 2),
            child: Icon(
              icon,
              size: 18,
              color: AppColors.error,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (title != null) ...[
                  Text(
                    title!,
                    style: AppTypography.labelMedium.copyWith(
                      color: isDark ? const Color(0xFFFCA5A5) : AppColors.error,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                ],
                Text(
                  message,
                  style: AppTypography.bodySmall.copyWith(
                    color: isDark ? const Color(0xFFFCA5A5) : AppColors.error,
                    fontWeight: FontWeight.w400,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
          if (onRetry != null) ...[
            const SizedBox(width: AppSpacing.xs),
            InkWell(
              onTap: onRetry,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Retry',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.error,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
