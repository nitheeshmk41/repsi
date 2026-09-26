import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';

/// RepsiScreenBackground
/// Provides a subtle, premium illustration background for screens.
class RepsiScreenBackground extends StatelessWidget {
  final Widget child;
  final String imagePath;
  final double imageOpacity;
  final Alignment imageAlignment;
  final BoxFit fit;

  const RepsiScreenBackground({
    super.key,
    required this.child,
    this.imagePath = 'assets/images/main_splash1.png',
    this.imageOpacity = 0.07,
    this.imageAlignment = Alignment.bottomCenter,
    this.fit = BoxFit.cover,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Background illustration
        Positioned.fill(
          child: Opacity(
            opacity: imageOpacity,
            child: Image.asset(
              imagePath,
              fit: fit,
              alignment: imageAlignment,
              errorBuilder: (_, __, ___) => const SizedBox.shrink(),
            ),
          ),
        ),

        // Gradient blend to maintain high contrast and readability
        Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppColors.background.withValues(alpha: 0.85),
                  AppColors.background.withValues(alpha: 0.60),
                  AppColors.background.withValues(alpha: 0.90),
                ],
              ),
            ),
          ),
        ),

        // Foreground content
        child,
      ],
    );
  }
}
