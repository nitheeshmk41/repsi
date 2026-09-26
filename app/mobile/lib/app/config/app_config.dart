import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static const String appName = 'REPSI';
  static const String appTagline = 'Your gym. Your progress.';
  static const String defaultWorkspaceSlug = 'apex-fitness';

  static String get baseUrl {
    // 1. Override via dotenv if provided and initialized
    if (dotenv.isInitialized) {
      final envUrl = dotenv.env['API_BASE_URL'];
      if (envUrl != null && envUrl.isNotEmpty) return envUrl;
    }

    // 2. Override via Dart define if provided
    const definedUrl = String.fromEnvironment('API_BASE_URL');
    if (definedUrl.isNotEmpty) return definedUrl;
    // 2. Web platform
    if (kIsWeb) {
      return 'https://repsi.fastapicloud.dev/api/v1';
    }

    // 3. Android mobile
    try {
      if (Platform.isAndroid) {
        return 'https://repsi.fastapicloud.dev/api/v1';
      }
    } catch (_) {}

    // 4. Default fallback to production cloud API
    return 'https://repsi.fastapicloud.dev/api/v1';
  }

  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}
