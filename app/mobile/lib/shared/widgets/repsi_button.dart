import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';
import '../animations/repsi_motion.dart';

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

class RepsiButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final RepsiButtonVariant variant;
  final RepsiButtonSize size;
  final bool isLoading;
  final Widget? leadingIcon;
  final Widget? trailingIcon;
  final bool isFullWidth;
  final double? width;
  final double? height;
  final BorderRadius? borderRadius;

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
    this.width,
    this.height,
    this.borderRadius,
  });

  @override
  State<RepsiButton> createState() => _RepsiButtonState();
}

class _RepsiButtonState extends State<RepsiButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: RepsiMotion.buttonRelease,
      reverseDuration: RepsiMotion.buttonPress,
    );

    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _controller, curve: RepsiMotion.easeOut),
    );

    _opacityAnimation = Tween<double>(begin: 1.0, end: 0.90).animate(
      CurvedAnimation(parent: _controller, curve: RepsiMotion.easeOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.onPressed == null || widget.isLoading) return;
    HapticFeedback.lightImpact();
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.onPressed == null || widget.isLoading) return;
    _controller.reverse();
    widget.onPressed?.call();
  }

  void _onTapCancel() {
    if (widget.onPressed == null || widget.isLoading) return;
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    double btnHeight;
    EdgeInsets padding;
    TextStyle textStyle;

    switch (widget.size) {
      case RepsiButtonSize.small:
        btnHeight = 40;
        padding = const EdgeInsets.symmetric(horizontal: 14);
        textStyle = AppTypography.buttonSmall;
        break;
      case RepsiButtonSize.medium:
        btnHeight = 52;
        padding = const EdgeInsets.symmetric(horizontal: 20);
        textStyle = AppTypography.button;
        break;
      case RepsiButtonSize.large:
        btnHeight = 56;
        padding = const EdgeInsets.symmetric(horizontal: 24);
        textStyle = AppTypography.buttonLarge;
        break;
    }

    if (widget.height != null) {
      btnHeight = widget.height!;
    }

    Color bgColor;
    Color fgColor;
    BorderSide borderSide = BorderSide.none;

    switch (widget.variant) {
      case RepsiButtonVariant.primary:
        bgColor = AppColors.primary;
        fgColor = Colors.white;
        break;
      case RepsiButtonVariant.secondary:
        bgColor = isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle;
        fgColor = isDark ? AppColors.darkText : AppColors.text;
        break;
      case RepsiButtonVariant.outline:
        bgColor = Colors.transparent;
        fgColor = isDark ? AppColors.darkText : AppColors.text;
        borderSide = BorderSide(color: isDark ? AppColors.darkBorder : AppColors.border, width: 1);
        break;
      case RepsiButtonVariant.destructive:
        bgColor = AppColors.error;
        fgColor = Colors.white;
        break;
      case RepsiButtonVariant.ghost:
        bgColor = Colors.transparent;
        fgColor = isDark ? AppColors.darkText : AppColors.text;
        break;
    }

    final bool isDisabled = widget.onPressed == null || widget.isLoading;
    final radius = widget.borderRadius ?? BorderRadius.circular(AppSpacing.radiusButton);

    Widget content = Row(
      mainAxisSize: widget.isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (widget.isLoading) ...[
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2.2,
              valueColor: AlwaysStoppedAnimation<Color>(fgColor),
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
        ] else if (widget.leadingIcon != null) ...[
          widget.leadingIcon!,
          const SizedBox(width: AppSpacing.sm),
        ],
        Text(
          widget.text,
          style: textStyle.copyWith(
            color: isDisabled && !widget.isLoading
                ? (isDark ? AppColors.darkTextMuted : AppColors.textMuted)
                : fgColor,
            fontWeight: FontWeight.w600,
          ),
        ),
        if (widget.trailingIcon != null && !widget.isLoading) ...[
          const SizedBox(width: AppSpacing.sm),
          widget.trailingIcon!,
        ],
      ],
    );

    return SizedBox(
      height: btnHeight,
      width: widget.isFullWidth ? double.infinity : widget.width,
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        behavior: HitTestBehavior.opaque,
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Transform.scale(
              scale: _scaleAnimation.value,
              child: Opacity(
                opacity: isDisabled && !widget.isLoading
                    ? 0.55
                    : _opacityAnimation.value,
                child: child,
              ),
            );
          },
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: isDisabled && widget.variant != RepsiButtonVariant.outline && widget.variant != RepsiButtonVariant.ghost
                  ? (isDark ? AppColors.darkSurface : AppColors.borderLight)
                  : bgColor,
              borderRadius: radius,
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
