import 'package:flutter/material.dart';

/// Repsi Design System - Color Palette
/// Green + Deep Charcoal + Soft Mint as core Repsi identity.
class AppColors {
  // Core Brand Colors
  static const Color primary = Color(0xFF18B968); // Repsi Green
  static const Color primaryDark = Color(0xFF0E8F50); // Deep Green
  static const Color emerald = Color(0xFF08A95B); // Emerald
  static const Color primarySoft = Color(0xFFE8F8EF); // Soft Mint
  static const Color primaryLight = Color(0xFFE8F8EF);
  static const Color paleMint = Color(0xFFF2FBF6);
  static const Color primaryHover = Color(0xFF15A85E);

  // Light Theme
  static const Color background = Color(0xFFF7FAF8);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceSecondary = Color(0xFFF2F7F4);
  static const Color surfaceSubtle = Color(0xFFF2F7F4);

  // Typography - Light
  static const Color text = Color(0xFF101918); // Dark Charcoal
  static const Color textPrimary = Color(0xFF101918);
  static const Color textSecondary = Color(0xFF66736E); // Slate
  static const Color textMuted = Color(0xFF8A9691);

  // Borders & Dividers - Light
  static const Color border = Color(0xFFDDE6E1);
  static const Color borderLight = Color(0xFFE8EEEB);
  static const Color divider = Color(0xFFE8EEEB);
  static const Color borderStrong = Color(0xFFCBD5D0);

  // Semantic Status
  static const Color success = Color(0xFF18B968);
  static const Color successSoft = Color(0xFFE8F8EF);
  static const Color successLight = Color(0xFFE8F8EF);
  static const Color successDark = Color(0xFF0E8F50);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningSoft = Color(0xFFFEF3C7);
  static const Color error = Color(0xFFE5484D);
  static const Color errorSoft = Color(0xFFFEE2E2);
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color info = Color(0xFF3B82F6);
  static const Color infoSoft = Color(0xFFEFF6FF);

  // Dark Theme
  static const Color darkBackground = Color(0xFF08110D);
  static const Color darkSurface = Color(0xFF101B16);
  static const Color darkSurfaceElevated = Color(0xFF16241E);
  static const Color darkSurfaceSoft = Color(0xFF1B2C24);
  static const Color darkPrimary = Color(0xFF25D979);
  static const Color darkPrimaryDark = Color(0xFF18B968);
  static const Color darkPrimaryLight = Color(0xFF9AF0C0);
  static const Color darkText = Color(0xFFF4F8F6);
  static const Color darkTextPrimary = Color(0xFFF4F8F6);
  static const Color darkTextSecondary = Color(0xFFAAB8B1);
  static const Color darkTextMuted = Color(0xFF718079);
  static const Color darkBorder = Color(0xFF263831);
  static const Color darkDivider = Color(0xFF1E2D26);
  static const Color darkSuccess = Color(0xFF25D979);
  static const Color darkWarning = Color(0xFFFBBF24);
  static const Color darkError = Color(0xFFFF6B70);
  static const Color darkInfo = Color(0xFF60A5FA);

  // Gradients
  static const List<Color> brandGradient = [
    Color(0xFF0E8F50),
    Color(0xFF18B968),
    Color(0xFF25D979),
  ];

  static const List<Color> softMintGradient = [
    Color(0xFFE8F8EF),
    Color(0xFFC9F2DB),
    Color(0xFF8BE9B5),
  ];

  // Badges
  static const Color badgeActiveBg = Color(0xFFE8F8EF);
  static const Color badgeActiveFg = Color(0xFF0E8F50);
  static const Color badgeExpiringBg = Color(0xFFFEF3C7);
  static const Color badgeExpiringFg = Color(0xFFB45309);
  static const Color badgeExpiredBg = Color(0xFFFEE2E2);
  static const Color badgeExpiredFg = Color(0xFFB91C1C);
  static const Color badgeFrozenBg = Color(0xFFEFF6FF);
  static const Color badgeFrozenFg = Color(0xFF1D4ED8);
  static const Color badgeCancelledBg = Color(0xFFF1F5F9);
  static const Color badgeCancelledFg = Color(0xFF475569);

  // Compatibility aliases
  static const Color lightBackground = background;
  static const Color lightSurface = surface;
  static const Color lightSurfaceElevated = surface;
  static const Color lightText = text;
  static const Color lightTextSecondary = textSecondary;
  static const Color lightTextMuted = textMuted;
  static const Color lightBorder = border;
  static const Color lightBorderStrong = borderStrong;
  static const Color darkNavigation = darkSurface;
}

