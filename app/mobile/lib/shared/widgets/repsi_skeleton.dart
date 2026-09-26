import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';

class RepsiSkeleton extends StatelessWidget {
  final double width;
  final double height;
  final BorderRadiusGeometry? borderRadius;

  const RepsiSkeleton({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.borderRadius,
  });

  RepsiSkeleton.circular({
    super.key,
    required double size,
  })  : width = size,
        height = size,
        borderRadius = BorderRadius.circular(size / 2);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final baseColor = isDark ? const Color(0xFF1E2824) : const Color(0xFFEAEFEA);
    final highlightColor = isDark ? const Color(0xFF283630) : const Color(0xFFF7FAF7);

    return Shimmer.fromColors(
      baseColor: baseColor,
      highlightColor: highlightColor,
      period: const Duration(milliseconds: 1400),
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: baseColor,
          borderRadius: borderRadius ?? BorderRadius.circular(AppSpacing.radiusCard),
        ),
      ),
    );
  }

  /// Preset: Dashboard Card Skeleton
  static Widget dashboardCard() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RepsiSkeleton(width: 120, height: 16, borderRadius: BorderRadius.circular(4)),
              RepsiSkeleton.circular(size: 28),
            ],
          ),
          const SizedBox(height: 16),
          RepsiSkeleton(width: 180, height: 28, borderRadius: BorderRadius.circular(6)),
          const SizedBox(height: 10),
          RepsiSkeleton(width: 140, height: 14, borderRadius: BorderRadius.circular(4)),
        ],
      ),
    );
  }

  /// Preset: Member List Item Skeleton
  static Widget memberListItem() {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          RepsiSkeleton.circular(size: 44),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RepsiSkeleton(width: 140, height: 16, borderRadius: BorderRadius.circular(4)),
                const SizedBox(height: 6),
                RepsiSkeleton(width: 90, height: 12, borderRadius: BorderRadius.circular(4)),
              ],
            ),
          ),
          RepsiSkeleton(width: 60, height: 24, borderRadius: BorderRadius.circular(12)),
        ],
      ),
    );
  }

  /// Preset: Chart Skeleton
  static Widget chartSkeleton() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RepsiSkeleton(width: 100, height: 16, borderRadius: BorderRadius.circular(4)),
          const SizedBox(height: 16),
          RepsiSkeleton(width: double.infinity, height: 140, borderRadius: BorderRadius.circular(8)),
        ],
      ),
    );
  }
}
