import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';
import '../animations/repsi_motion.dart';

class RepsiTextField extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? initialValue;
  final TextEditingController? controller;
  final bool isPassword;
  final TextInputType keyboardType;
  final String? errorText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final FormFieldValidator<String>? validator;
  final bool enabled;
  final int maxLines;
  final int? minLines;
  final TextInputAction? textInputAction;
  final FocusNode? focusNode;
  final bool shakeOnError;

  const RepsiTextField({
    super.key,
    this.label,
    this.hintText,
    this.initialValue,
    this.controller,
    this.isPassword = false,
    this.keyboardType = TextInputType.text,
    this.errorText,
    this.prefixIcon,
    this.suffixIcon,
    this.onChanged,
    this.onSubmitted,
    this.validator,
    this.enabled = true,
    this.maxLines = 1,
    this.minLines,
    this.textInputAction,
    this.focusNode,
    this.shakeOnError = true,
  });

  @override
  State<RepsiTextField> createState() => _RepsiTextFieldState();
}

class _RepsiTextFieldState extends State<RepsiTextField> with SingleTickerProviderStateMixin {
  late FocusNode _focusNode;
  bool _isFocused = false;
  bool _obscureText = true;
  late AnimationController _shakeController;
  late Animation<double> _shakeAnimation;

  @override
  void initState() {
    super.initState();
    _focusNode = widget.focusNode ?? FocusNode();
    _focusNode.addListener(_handleFocusChange);

    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _shakeAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: -6.0), weight: 1),
      TweenSequenceItem(tween: Tween(begin: -6.0, end: 6.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 6.0, end: -4.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: -4.0, end: 4.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 4.0, end: 0.0), weight: 1),
    ]).animate(CurvedAnimation(parent: _shakeController, curve: Curves.easeInOut));
  }

  @override
  void didUpdateWidget(RepsiTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != null && widget.errorText != oldWidget.errorText && widget.shakeOnError) {
      _shakeController.forward(from: 0.0);
    }
  }

  void _handleFocusChange() {
    if (_isFocused != _focusNode.hasFocus) {
      setState(() {
        _isFocused = _focusNode.hasFocus;
      });
    }
  }

  @override
  void dispose() {
    if (widget.focusNode == null) {
      _focusNode.dispose();
    } else {
      _focusNode.removeListener(_handleFocusChange);
    }
    _shakeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final hasError = widget.errorText != null && widget.errorText!.isNotEmpty;

    final Color activeBorderColor = hasError
        ? AppColors.error
        : (_isFocused ? AppColors.primary : (isDark ? AppColors.darkBorder : AppColors.border));

    final double activeBorderWidth = _isFocused ? 1.5 : 1.0;

    final activeShadow = _isFocused
        ? [
            BoxShadow(
              color: AppColors.primary.withValues(alpha: 0.12),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ]
        : [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 2,
              offset: const Offset(0, 1),
            ),
          ];

    return AnimatedBuilder(
      animation: _shakeAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(_shakeAnimation.value, 0),
          child: child,
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.label != null) ...[
            AnimatedDefaultTextStyle(
              duration: RepsiMotion.input,
              style: AppTypography.caption.copyWith(
                fontWeight: FontWeight.w600,
                color: hasError
                    ? AppColors.error
                    : (_isFocused ? AppColors.primary : (isDark ? AppColors.darkTextSecondary : AppColors.textSecondary)),
              ),
              child: Text(widget.label!),
            ),
            const SizedBox(height: AppSpacing.sm),
          ],
          AnimatedContainer(
            duration: RepsiMotion.input,
            curve: Curves.easeOutCubic,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.surface,
              borderRadius: BorderRadius.circular(AppSpacing.radiusInput),
              border: Border.all(
                color: activeBorderColor,
                width: activeBorderWidth,
              ),
              boxShadow: activeShadow,
            ),
            child: TextFormField(
              controller: widget.controller,
              initialValue: widget.initialValue,
              obscureText: widget.isPassword ? _obscureText : false,
              keyboardType: widget.keyboardType,
              enabled: widget.enabled,
              maxLines: widget.isPassword ? 1 : widget.maxLines,
              minLines: widget.minLines,
              textInputAction: widget.textInputAction,
              focusNode: _focusNode,
              onChanged: widget.onChanged,
              onFieldSubmitted: widget.onSubmitted,
              validator: widget.validator,
              style: AppTypography.body.copyWith(
                color: isDark ? AppColors.darkText : AppColors.text,
              ),
              decoration: InputDecoration(
                hintText: widget.hintText,
                hintStyle: AppTypography.body.copyWith(
                  color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                ),
                prefixIcon: widget.prefixIcon != null
                    ? AnimatedTheme(
                        data: Theme.of(context).copyWith(
                          iconTheme: IconThemeData(
                            color: _isFocused
                                ? AppColors.primary
                                : (isDark ? AppColors.darkTextMuted : AppColors.textSecondary),
                            size: 20,
                          ),
                        ),
                        child: widget.prefixIcon!,
                      )
                    : null,
                suffixIcon: widget.isPassword
                    ? IconButton(
                        icon: Icon(
                          _obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          size: 20,
                          color: _isFocused
                              ? AppColors.primary
                              : (isDark ? AppColors.darkTextMuted : AppColors.textSecondary),
                        ),
                        onPressed: () {
                          setState(() {
                            _obscureText = !_obscureText;
                          });
                        },
                      )
                    : widget.suffixIcon,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                errorBorder: InputBorder.none,
                focusedErrorBorder: InputBorder.none,
                filled: false,
              ),
            ),
          ),
          if (hasError) ...[
            const SizedBox(height: 6),
            Padding(
              padding: const EdgeInsets.only(left: 4),
              child: Text(
                widget.errorText!,
                style: AppTypography.caption.copyWith(
                  color: AppColors.error,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
