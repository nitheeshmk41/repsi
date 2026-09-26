import 'package:flutter/material.dart';

class AppSpacing {
  // Spacing System: 4, 8, 12, 16, 20, 24, 32, 40
  static const double space4 = 4.0;
  static const double space8 = 8.0;
  static const double space12 = 12.0;
  static const double space16 = 16.0;
  static const double space20 = 20.0;
  static const double space24 = 24.0;
  static const double space32 = 32.0;
  static const double space40 = 40.0;

  // Aliases for compatibility
  static const double xs = space4;
  static const double sm = space8;
  static const double md = space12;
  static const double lg = space16;
  static const double xl = space20;
  static const double xxl = space24;
  static const double xxxl = space32;

  // Corner Radii: 12 - 18px
  static const double radiusSm = 10.0;
  static const double radiusDefault = 14.0;
  static const double radiusInput = 14.0;
  static const double radiusButton = 14.0;
  static const double radiusCard = 16.0;
  static const double radiusLg = 18.0;
  static const double radiusSheet = 20.0;
  static const double radiusPill = 999.0;
  static const double radiusMd = radiusInput;
  static const double radiusXl = radiusSheet;
  static const double radiusFull = radiusPill;

  // Element Heights
  static const double buttonHeight = 52.0;
  static const double inputHeight = 52.0;
  static const double minTouchTarget = 44.0;

  // Padding Insets (Consistent 20px horizontal padding)
  static const double pageHorizontalPadding = 20.0;
  static const EdgeInsets pagePadding = EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0);
  static const EdgeInsets pageHorizontal = EdgeInsets.symmetric(horizontal: 20.0);
  static const EdgeInsets cardPadding = EdgeInsets.all(16.0);
  static const EdgeInsets compactCardPadding = EdgeInsets.all(12.0);
  static const EdgeInsets buttonPadding = EdgeInsets.symmetric(horizontal: 20.0, vertical: 14.0);
}
