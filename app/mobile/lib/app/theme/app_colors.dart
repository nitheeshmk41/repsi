import 'package:flutter/material.dart';

class AppColors {
  // Brand Colors (REPSI Green)
  static const Color primary = Color(0xFF84CC16);
  static const Color primaryNeon = Color(0xFF65E729);
  static const Color primaryDark = Color(0xFF365314);
  static const Color primaryHover = Color(0xFFA3E635);
  static const Color primarySoft = Color(0xFFF0FBE2);
  static const Color primarySoftDark = Color(0xFF1D2A0F);

  // Light Theme Palette
  static const Color lightBackground = Color(0xFFF7F9F5);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceElevated = Color(0xFFFFFFFF);
  static const Color lightText = Color(0xFF111827);
  static const Color lightTextSecondary = Color(0xFF64748B);
  static const Color lightTextMuted = Color(0xFF94A3B8);
  static const Color lightBorder = Color(0xFFE2E8DF);
  static const Color lightBorderStrong = Color(0xFFCBD5C5);

  // Dark Theme Palette
  static const Color darkBackground = Color(0xFF0B0F0A);
  static const Color darkSurface = Color(0xFF151C15);
  static const Color darkSurfaceElevated = Color(0xFF1B241A);
  static const Color darkNavigation = Color(0xFF101610);
  static const Color darkText = Color(0xFFF1F5F0);
  static const Color darkTextSecondary = Color(0xFFA3ADA0);
  static const Color darkTextMuted = Color(0xFF6B7668);
  static const Color darkBorder = Color(0xFF263026);
  static const Color darkBorderStrong = Color(0xFF2E3C2D);

  // Status & Semantic Colors
  static const Color success = Color(0xFF22C55E);
  static const Color successSoft = Color(0xFFF0FDF4);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningSoft = Color(0xFFFFFBEB);
  static const Color error = Color(0xFFEF4444);
  static const Color errorSoft = Color(0xFFFEF2F2);
  static const Color info = Color(0xFF3B82F6);
  static const Color infoSoft = Color(0xFFEFF6FF);

  static const Color background = lightBackground;
  static const Color surface = lightSurface;
  static const Color surfaceSubtle = lightSurfaceElevated;
  static const Color textPrimary = lightText;
  static const Color textSecondary = lightTextSecondary;
  static const Color textMuted = lightTextMuted;
  static const Color border = lightBorder;
  static const Color borderLight = lightBorder;
  static const Color darkTextPrimary = darkText;
  static const Color primaryLight = primaryHover;
  static const Color successLight = successSoft;
  static const Color successDark = Color(0xFF166534);
  static const Color errorLight = errorSoft;

  static const Color badgeActiveBg = successSoft;
  static const Color badgeActiveFg = Color(0xFF15803D);
  static const Color badgeExpiringBg = warningSoft;
  static const Color badgeExpiringFg = Color(0xFFB45309);
  static const Color badgeExpiredBg = errorSoft;
  static const Color badgeExpiredFg = Color(0xFFB91C1C);
  static const Color badgeFrozenBg = infoSoft;
  static const Color badgeFrozenFg = Color(0xFF1D4ED8);
  static const Color badgeCancelledBg = Color(0xFFF1F5F9);
  static const Color badgeCancelledFg = Color(0xFF475569);

  // Utility Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF84CC16), Color(0xFF65E729)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
