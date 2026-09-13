import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../app/theme/app_spacing.dart';

class RepsiSkeleton extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const RepsiSkeleton({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.borderRadius = AppSpacing.radiusMd,
  });

  const RepsiSkeleton.circular({
    super.key,
    required double size,
  })  : width = size,
        height = size,
        borderRadius = 9999;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final baseColor = isDark ? const Color(0xFF1E261E) : const Color(0xFFE2E8DF);
    final highlightColor = isDark ? const Color(0xFF2C382C) : const Color(0xFFF1F5EE);

    return Shimmer.fromColors(
      baseColor: baseColor,
      highlightColor: highlightColor,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: baseColor,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}
