import 'package:flutter/material.dart';

class AppSpacing {
  // 4/8-point Spacing System
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double xxxl = 32.0;

  // Corner Radii
  static const double radiusSm = 6.0;
  static const double radiusButton = 8.0;
  static const double radiusInput = 8.0;
  static const double radiusCard = 12.0;
  static const double radiusDialog = 16.0;
  static const double radiusSheet = 20.0;
  static const double radiusPill = 999.0;
  static const double radiusMd = radiusCard;
  static const double radiusLg = radiusDialog;
  static const double radiusXl = radiusSheet;
  static const double radiusFull = radiusPill;

  // Minimum Touch Target
  static const double minTouchTarget = 44.0;

  // Padding Insets
  static const EdgeInsets pagePadding = EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0);
  static const EdgeInsets cardPadding = EdgeInsets.all(16.0);
  static const EdgeInsets compactCardPadding = EdgeInsets.all(12.0);
  static const EdgeInsets buttonPadding = EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0);
}
