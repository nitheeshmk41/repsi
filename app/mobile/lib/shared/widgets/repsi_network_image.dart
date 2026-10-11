import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import 'repsi_skeleton.dart';

/// High-performance cached network image widget with bounded memory decoding,
/// lightweight skeleton shimmer placeholders, and graceful error fallbacks.
class RepsiNetworkImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadiusGeometry? borderRadius;
  final int? memCacheWidth;
  final int? memCacheHeight;
  final Widget? errorWidget;

  const RepsiNetworkImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.memCacheWidth,
    this.memCacheHeight,
    this.errorWidget,
  });

  @override
  Widget build(BuildContext context) {
    if (imageUrl.isEmpty) {
      return _buildError(context);
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final pixelRatio = MediaQuery.maybeDevicePixelRatioOf(context) ?? 2.0;

    // Calculate memory cache dimensions to prevent decoding multi-megabyte originals into RAM
    final computedCacheWidth = memCacheWidth ??
        (width != null && width! > 0 ? (width! * pixelRatio).toInt() : 512);
    final computedCacheHeight = memCacheHeight ??
        (height != null && height! > 0 ? (height! * pixelRatio).toInt() : 512);

    Widget image = CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      fit: fit,
      memCacheWidth: computedCacheWidth,
      memCacheHeight: computedCacheHeight,
      placeholder: (context, url) => RepsiSkeleton(
        width: width ?? double.infinity,
        height: height ?? double.infinity,
        borderRadius: borderRadius,
      ),
      errorWidget: (context, url, error) => errorWidget ?? _buildError(context),
    );

    if (borderRadius != null) {
      image = ClipRRect(
        borderRadius: borderRadius!,
        child: image,
      );
    }

    return image;
  }

  Widget _buildError(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle,
        borderRadius: borderRadius,
      ),
      alignment: Alignment.center,
      child: Icon(
        Icons.broken_image_outlined,
        size: (width != null && height != null) ? (width! < height! ? width! * 0.4 : height! * 0.4) : 24,
        color: isDark ? AppColors.darkTextMuted : AppColors.textTertiary,
      ),
    );
  }
}
