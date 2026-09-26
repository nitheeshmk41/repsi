import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../animations/repsi_press.dart';
import 'repsi_skeleton.dart';

class RepsiCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final BorderSide? borderSide;
  final double? borderRadius;
  final List<BoxShadow>? boxShadow;
  final bool isLoading;
  final bool isDisabled;

  const RepsiCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.backgroundColor,
    this.borderSide,
    this.borderRadius,
    this.boxShadow,
    this.isLoading = false,
    this.isDisabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final radius = BorderRadius.circular(borderRadius ?? AppSpacing.radiusCard);
    final bg = backgroundColor ?? (isDark ? AppColors.darkSurface : AppColors.surface);
    final border = borderSide ??
        BorderSide(
          color: isDark ? AppColors.darkBorder : AppColors.border,
          width: 1,
        );

    final defaultShadow = boxShadow ?? [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.02),
        blurRadius: 4,
        offset: const Offset(0, 1),
      ),
    ];

    if (isLoading) {
      return RepsiSkeleton(
        height: 100,
        borderRadius: radius,
      );
    }

    Widget cardContent = Container(
      padding: padding ?? AppSpacing.cardPadding,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: radius,
        border: Border.fromBorderSide(border),
        boxShadow: defaultShadow,
      ),
      child: child,
    );

    if (isDisabled) {
      return Opacity(
        opacity: 0.5,
        child: cardContent,
      );
    }

    if (onTap != null) {
      return RepsiPress(
        onTap: onTap,
        pressedScale: 0.98,
        pressedOpacity: 0.95,
        child: cardContent,
      );
    }

    return cardContent;
  }
}
