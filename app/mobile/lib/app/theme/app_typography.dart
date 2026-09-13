import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTypography {
  static const String fontFamily = 'Outfit';

  static final TextStyle headingLarge = GoogleFonts.outfit(
    fontSize: 24,
    fontWeight: FontWeight.w700,
  );
  static final TextStyle headingMedium = GoogleFonts.outfit(
    fontSize: 20,
    fontWeight: FontWeight.w700,
  );
  static final TextStyle headingSmall = GoogleFonts.outfit(
    fontSize: 18,
    fontWeight: FontWeight.w600,
  );
  static final TextStyle caption = GoogleFonts.outfit(fontSize: 12);
  static final TextStyle bodySmall = GoogleFonts.outfit(fontSize: 12, height: 1.3);
  static final TextStyle bodyMedium = GoogleFonts.outfit(fontSize: 14, height: 1.4);
  static final TextStyle labelLarge = GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600);
  static final TextStyle labelMedium = GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600);
  static final TextStyle buttonSmall = GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600);
  static final TextStyle buttonMedium = GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600);
  static final TextStyle buttonLarge = GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600);

  static TextTheme textTheme(Color textColor, Color secondaryColor, Color mutedColor) {
    return GoogleFonts.outfitTextTheme().copyWith(
      displayLarge: GoogleFonts.outfit(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        color: textColor,
        letterSpacing: -0.8,
      ),
      displayMedium: GoogleFonts.outfit(
        fontSize: 28,
        fontWeight: FontWeight.w800,
        color: textColor,
        letterSpacing: -0.6,
      ),
      headlineLarge: GoogleFonts.outfit(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        color: textColor,
        letterSpacing: -0.5,
      ),
      headlineMedium: GoogleFonts.outfit(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: textColor,
        letterSpacing: -0.4,
      ),
      titleLarge: GoogleFonts.outfit(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: textColor,
        letterSpacing: -0.2,
      ),
      titleMedium: GoogleFonts.outfit(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
      titleSmall: GoogleFonts.outfit(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
      bodyLarge: GoogleFonts.outfit(
        fontSize: 15,
        fontWeight: FontWeight.w400,
        color: textColor,
        height: 1.4,
      ),
      bodyMedium: GoogleFonts.outfit(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: secondaryColor,
        height: 1.4,
      ),
      bodySmall: GoogleFonts.outfit(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: mutedColor,
        height: 1.3,
      ),
      labelLarge: GoogleFonts.outfit(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
      labelMedium: GoogleFonts.outfit(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        color: secondaryColor,
      ),
      labelSmall: GoogleFonts.outfit(
        fontSize: 10,
        fontWeight: FontWeight.w700,
        color: mutedColor,
        letterSpacing: 0.5,
      ),
    );
  }
}
