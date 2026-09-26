import 'package:flutter/animation.dart';

/// Centralized Repsi Motion Constants & Curves
class RepsiMotion {
  // Durations
  static const Duration buttonPress = Duration(milliseconds: 100);
  static const Duration buttonRelease = Duration(milliseconds: 120);
  static const Duration input = Duration(milliseconds: 180);
  static const Duration icon = Duration(milliseconds: 180);
  static const Duration nav = Duration(milliseconds: 200);
  static const Duration card = Duration(milliseconds: 400);
  static const Duration page = Duration(milliseconds: 400);
  static const Duration success = Duration(milliseconds: 700);

  // Stagger intervals
  static const Duration staggerDelay = Duration(milliseconds: 70);

  // Curves
  static const Curve easeOut = Curves.easeOutCubic;
  static const Curve easeInOut = Curves.easeInOutCubic;
  static const Curve easeBack = Curves.easeOutBack;
}
