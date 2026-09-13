import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';

enum RepsiButtonVariant {
  primary,
  secondary,
  outline,
  destructive,
  ghost,
}

enum RepsiButtonSize {
  small,
  medium,
  large,
}

class RepsiButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final RepsiButtonVariant variant;
  final RepsiButtonSize size;
  final bool isLoading;
  final Widget? leadingIcon;
  final Widget? trailingIcon;
  final bool isFullWidth;

  const RepsiButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = RepsiButtonVariant.primary,
    this.size = RepsiButtonSize.medium,
    this.isLoading = false,
    this.leadingIcon,
    this.trailingIcon,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    double height;
    EdgeInsets padding;
    TextStyle textStyle;

    switch (size) {
      case RepsiButtonSize.small:
        height = 36;
        padding = const EdgeInsets.symmetric(horizontal: AppSpacing.md);
        textStyle = AppTypography.buttonSmall;
        break;
      case RepsiButtonSize.medium:
        height = 44;
        padding = const EdgeInsets.symmetric(horizontal: AppSpacing.lg);
        textStyle = AppTypography.buttonMedium;
        break;
      case RepsiButtonSize.large:
        height = 50;
        padding = const EdgeInsets.symmetric(horizontal: AppSpacing.xl);
        textStyle = AppTypography.buttonLarge;
        break;
    }

    Color bgColor;
    Color fgColor;
    BorderSide borderSide = BorderSide.none;

    switch (variant) {
      case RepsiButtonVariant.primary:
        bgColor = AppColors.primary;
        fgColor = Colors.white;
        break;
      case RepsiButtonVariant.secondary:
        bgColor = isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle;
        fgColor = isDark ? AppColors.darkTextPrimary : AppColors.textPrimary;
        break;
      case RepsiButtonVariant.outline:
        bgColor = Colors.transparent;
        fgColor = isDark ? AppColors.darkTextPrimary : AppColors.textPrimary;
        borderSide = BorderSide(color: isDark ? AppColors.darkBorder : AppColors.border);
        break;
      case RepsiButtonVariant.destructive:
        bgColor = AppColors.error;
        fgColor = Colors.white;
        break;
      case RepsiButtonVariant.ghost:
        bgColor = Colors.transparent;
        fgColor = isDark ? AppColors.darkTextPrimary : AppColors.textPrimary;
        break;
    }

    final bool isDisabled = onPressed == null || isLoading;

    Widget content = Row(
      mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(fgColor),
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
        ] else if (leadingIcon != null) ...[
          leadingIcon!,
          const SizedBox(width: AppSpacing.sm),
        ],
        Text(
          text,
          style: textStyle.copyWith(
            color: isDisabled && !isLoading
                ? (isDark ? AppColors.darkTextMuted : AppColors.textMuted)
                : fgColor,
          ),
        ),
        if (trailingIcon != null && !isLoading) ...[
          const SizedBox(width: AppSpacing.sm),
          trailingIcon!,
        ],
      ],
    );

    return SizedBox(
      height: height,
      width: isFullWidth ? double.infinity : null,
      child: Material(
        color: isDisabled ? (variant == RepsiButtonVariant.outline || variant == RepsiButtonVariant.ghost ? Colors.transparent : (isDark ? AppColors.darkSurface : AppColors.borderLight)) : bgColor,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        child: InkWell(
          onTap: isDisabled ? null : onPressed,
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
              border: borderSide != BorderSide.none ? Border.fromBorderSide(borderSide) : null,
            ),
            alignment: Alignment.center,
            child: content,
          ),
        ),
      ),
    );
  }
}
