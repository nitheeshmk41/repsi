import 'package:flutter/material.dart';
import 'repsi_motion.dart';

/// Stagger entrance animation:
/// Fades opacity 0 -> 1 and translates vertically from 20px -> 0.
/// Allows setting a stagger index with customizable delay (default 70ms).
class RepsiStaggerItem extends StatefulWidget {
  final Widget child;
  final int index;
  final Duration delay;
  final Duration duration;
  final double translationY;

  const RepsiStaggerItem({
    super.key,
    required this.child,
    this.index = 0,
    this.delay = const Duration(milliseconds: 70),
    this.duration = const Duration(milliseconds: 400),
    this.translationY = 20.0,
  });

  @override
  State<RepsiStaggerItem> createState() => _RepsiStaggerItemState();
}

class _RepsiStaggerItemState extends State<RepsiStaggerItem> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: RepsiMotion.easeOut),
    );

    _slideAnimation = Tween<double>(begin: widget.translationY, end: 0.0).animate(
      CurvedAnimation(parent: _controller, curve: RepsiMotion.easeOut),
    );

    final totalDelay = widget.delay * widget.index;
    Future.delayed(totalDelay, () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _fadeAnimation.value,
          child: Transform.translate(
            offset: Offset(0, _slideAnimation.value),
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}
