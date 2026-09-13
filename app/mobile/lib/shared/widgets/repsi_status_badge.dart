import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';
import '../models/member_model.dart';

class RepsiStatusBadge extends StatelessWidget {
  final MemberStatus status;
  final String? customLabel;

  const RepsiStatusBadge({
    super.key,
    required this.status,
    this.customLabel,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;

    switch (status) {
      case MemberStatus.active:
        bg = AppColors.badgeActiveBg;
        fg = AppColors.badgeActiveFg;
        break;
      case MemberStatus.expiring:
        bg = AppColors.badgeExpiringBg;
        fg = AppColors.badgeExpiringFg;
        break;
      case MemberStatus.expired:
        bg = AppColors.badgeExpiredBg;
        fg = AppColors.badgeExpiredFg;
        break;
      case MemberStatus.frozen:
        bg = AppColors.badgeFrozenBg;
        fg = AppColors.badgeFrozenFg;
        break;
      case MemberStatus.cancelled:
        bg = AppColors.badgeCancelledBg;
        fg = AppColors.badgeCancelledFg;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs / 2,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: fg,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: AppSpacing.xs),
          Text(
            customLabel ?? status.displayName,
            style: AppTypography.caption.copyWith(
              color: fg,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
