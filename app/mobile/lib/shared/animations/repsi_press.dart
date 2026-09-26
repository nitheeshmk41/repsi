import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'repsi_motion.dart';

/// Reusable press animation wrapper:
/// Scales 1.0 -> 0.96 on press (100ms)
/// Releases 0.96 -> 1.0 (120ms)
/// Provides subtle opacity and light haptic feedback.
class RepsiPress extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final bool enableHaptics;
  final double pressedScale;
  final double pressedOpacity;

  const RepsiPress({
    super.key,
    required this.child,
    this.onTap,
    this.enableHaptics = true,
    this.pressedScale = 0.96,
    this.pressedOpacity = 0.92,
  });

  @override
  State<RepsiPress> createState() => _RepsiPressState();
}

class _RepsiPressState extends State<RepsiPress> with SingleTickerProviderStateMixin {
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

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.pressedScale,
    ).animate(CurvedAnimation(parent: _controller, curve: RepsiMotion.easeOut));

    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: widget.pressedOpacity,
    ).animate(CurvedAnimation(parent: _controller, curve: RepsiMotion.easeOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.onTap == null) return;
    if (widget.enableHaptics) {
      HapticFeedback.lightImpact();
    }
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.onTap == null) return;
    _controller.reverse();
    widget.onTap?.call();
  }

  void _onTapCancel() {
    if (widget.onTap == null) return;
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.onTap == null) {
      return widget.child;
    }

    return GestureDetector(
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
              opacity: _opacityAnimation.value,
              child: child,
            ),
          );
        },
        child: widget.child,
      ),
    );
  }
}
