import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../shared/models/user_model.dart';

class SecureStorageService {
  final FlutterSecureStorage _secureStorage;
  final SharedPreferences? _prefs;
  final Map<String, Object> _memory = {};

  static const _tokenKey = 'repsi_access_token';
  static const _workspaceKey = 'repsi_active_workspace_id';
  static const _workspaceSlugKey = 'repsi_active_workspace_slug';
  static const _userKey = 'repsi_current_user_json';
  static const _onboardingCompleteKey = 'repsi_onboarding_completed';
  static const _themeKey = 'repsi_theme_mode';

  SecureStorageService({
    FlutterSecureStorage? secureStorage,
    SharedPreferences? prefs,
  })  : _secureStorage = secureStorage ?? const FlutterSecureStorage(),
        _prefs = prefs;

  // Token management
  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: _tokenKey, value: token);
  }

  Future<String?> getToken() async {
    return await _secureStorage.read(key: _tokenKey);
  }

  Future<void> clearToken() async {
    await _secureStorage.delete(key: _tokenKey);
  }

  // Active Workspace
  Future<void> saveActiveWorkspace({required String id, required String slug}) async {
    await saveActiveWorkspaceId(id);
    await saveActiveWorkspaceSlug(slug);
  }

  Future<void> saveActiveWorkspaceId(String id) async {
    if (_prefs != null) {
      await _prefs.setString(_workspaceKey, id);
    } else {
      _memory[_workspaceKey] = id;
    }
  }

  Future<void> saveActiveWorkspaceSlug(String slug) async {
    if (_prefs != null) {
      await _prefs.setString(_workspaceSlugKey, slug);
    } else {
      _memory[_workspaceSlugKey] = slug;
    }
  }

  String? getActiveWorkspaceId() {
    return _prefs?.getString(_workspaceKey) ?? _memory[_workspaceKey] as String?;
  }

  String? getActiveWorkspaceSlug() {
    return _prefs?.getString(_workspaceSlugKey) ?? _memory[_workspaceSlugKey] as String? ?? 'apex-fitness';
  }

  // User details cache
  Future<void> saveUserJson(String jsonStr) async {
    if (_prefs != null) {
      await _prefs.setString(_userKey, jsonStr);
    } else {
      _memory[_userKey] = jsonStr;
    }
  }

  String? getUserJson() {
    return _prefs?.getString(_userKey) ?? _memory[_userKey] as String?;
  }

  Future<void> saveUser(UserModel user) => saveUserJson(jsonEncode(user.toJson()));

  UserModel? getCachedUser() {
    final json = getUserJson();
    if (json == null) return null;
    return UserModel.fromJson(jsonDecode(json) as Map<String, dynamic>);
  }

  // Onboarding status
  Future<void> setOnboardingCompleted(bool completed) async {
    if (_prefs != null) {
      await _prefs.setBool(_onboardingCompleteKey, completed);
    } else {
      _memory[_onboardingCompleteKey] = completed;
    }
  }

  bool isOnboardingCompleted() {
    return _prefs?.getBool(_onboardingCompleteKey) ?? _memory[_onboardingCompleteKey] as bool? ?? true;
  }

  // Theme
  Future<void> saveThemeMode(String mode) async {
    if (_prefs != null) {
      await _prefs.setString(_themeKey, mode);
    } else {
      _memory[_themeKey] = mode;
    }
  }

  String getThemeMode() {
    return _prefs?.getString(_themeKey) ?? _memory[_themeKey] as String? ?? 'system';
  }

  // Clear all on logout
  Future<void> clearAll() async {
    await _secureStorage.deleteAll();
    if (_prefs != null) {
      await _prefs.remove(_tokenKey);
      await _prefs.remove(_workspaceKey);
      await _prefs.remove(_workspaceSlugKey);
      await _prefs.remove(_userKey);
    }
    _memory.clear();
  }
}
