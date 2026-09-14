import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';
import 'repsi_card.dart';

class RepsiMetricCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color? iconColor;
  final Color? iconBackgroundColor;
  final double? trendPct;
  final String? subtitle;
  final VoidCallback? onTap;

  const RepsiMetricCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    this.iconColor,
    this.iconBackgroundColor,
    this.trendPct,
    this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryAccent = iconColor ?? AppColors.primary;
    final primaryAccentBg = iconBackgroundColor ?? (isDark ? primaryAccent.withValues(alpha: 0.15) : primaryAccent.withValues(alpha: 0.1));

    return RepsiCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm + 4, vertical: AppSpacing.sm + 2),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.labelMedium.copyWith(
                    color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(width: 4),
              Container(
                padding: const EdgeInsets.all(AppSpacing.xs),
                decoration: BoxDecoration(
                  color: primaryAccentBg,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                ),
                child: Icon(
                  icon,
                  size: 15,
                  color: primaryAccent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppTypography.headingMedium.copyWith(
              color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
              fontWeight: FontWeight.w700,
              fontSize: 20,
            ),
          ),
          const SizedBox(height: 2),
          if (trendPct != null)
            Row(
              children: [
                Icon(
                  trendPct! >= 0 ? LucideIcons.trendingUp : LucideIcons.trendingDown,
                  size: 13,
                  color: trendPct! >= 0 ? AppColors.success : AppColors.error,
                ),
                const SizedBox(width: AppSpacing.xs / 2),
                Text(
                  '${trendPct! >= 0 ? '+' : ''}${trendPct!.toStringAsFixed(1)}%',
                  style: AppTypography.caption.copyWith(
                    color: trendPct! >= 0 ? AppColors.success : AppColors.error,
                    fontWeight: FontWeight.w600,
                    fontSize: 11,
                  ),
                ),
                if (subtitle != null) ...[
                  const SizedBox(width: AppSpacing.xs),
                  Expanded(
                    child: Text(
                      subtitle!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTypography.caption.copyWith(
                        color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ],
            )
          else if (subtitle != null)
            Text(
              subtitle!,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.caption.copyWith(
                color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                fontSize: 11,
              ),
            ),
        ],
      ),
    );
  }
}
