class AppConfig {
  static const String appName = 'REPSI';
  static const String appTagline = 'Gym Management Operating System';
  static const String defaultWorkspaceSlug = 'apex-fitness';

  // Base API configuration with emulator/device compatibility
  static String get baseUrl {
    // Override via Dart define if provided
    const definedUrl = String.fromEnvironment('API_BASE_URL');
    if (definedUrl.isNotEmpty) return definedUrl;

    // Default to local FastAPI backend
    return 'http://127.0.0.1:8000/api/v1';
  }

  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}
