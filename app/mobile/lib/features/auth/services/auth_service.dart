import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../../../core/api/api_error.dart';
import '../../../shared/models/user_model.dart';
import '../../../shared/models/workspace_model.dart';

class AuthResponse {
  final String accessToken;
  final String? tokenType;
  final String? workspaceId;
  final UserRole? role;
  final UserModel? user;
  final WorkspaceModel? workspace;

  const AuthResponse({
    required this.accessToken,
    this.tokenType,
    this.workspaceId,
    this.role,
    this.user,
    this.workspace,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['access_token']?.toString() ?? '',
      tokenType: json['token_type'] as String?,
      workspaceId: json['workspace_id']?.toString(),
      role: json['role'] != null ? UserRole.fromString(json['role'] as String) : null,
      user: json['user'] != null ? UserModel.fromJson(json['user'] as Map<String, dynamic>) : null,
      workspace: json['workspace'] != null ? WorkspaceModel.fromJson(json['workspace'] as Map<String, dynamic>) : null,
    );
  }
}

class AuthService {
  final ApiClient _apiClient;

  AuthService({required ApiClient apiClient}) : _apiClient = apiClient;

  Future<AuthResponse> login({
    required String email,
    required String password,
    String? workspaceSlug,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.login,
        data: {
          'email': email.trim(),
          'password': password,
          if (workspaceSlug != null && workspaceSlug.isNotEmpty) 'workspace_slug': workspaceSlug.trim(),
        },
      );
      return AuthResponse.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<AuthResponse> loginWithGoogle({required String token}) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.googleLogin,
        data: {'token': token},
      );
      return AuthResponse.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<AuthResponse> register({
    required String fullName,
    required String email,
    required String password,
    required String gymName,
    String? gymPhone,
    String? gymCity,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.register,
        data: {
          'full_name': fullName.trim(),
          'email': email.trim(),
          'password': password,
          'gym_name': gymName.trim(),
          if (gymPhone != null && gymPhone.isNotEmpty) 'gym_phone': gymPhone.trim(),
          if (gymCity != null && gymCity.isNotEmpty) 'gym_city': gymCity.trim(),
        },
      );
      return AuthResponse.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<AuthResponse> registerMember({
    required String fullName,
    required String email,
    required String password,
    required String workspaceSlug,
    String? phone,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.registerMember,
        data: {
          'full_name': fullName.trim(),
          'email': email.trim(),
          'password': password,
          'workspace_slug': workspaceSlug.trim(),
          if (phone != null && phone.isNotEmpty) 'phone': phone.trim(),
        },
      );
      return AuthResponse.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<UserModel> getMe() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.me);
      return UserModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<void> forgotPassword(String email) async {
    try {
      await _apiClient.post(
        ApiEndpoints.forgotPassword,
        data: {'email': email.trim()},
      );
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<void> logout() async {
    try {
      await _apiClient.post(ApiEndpoints.logout);
    } catch (_) {
      // Ignore network errors on logout
    }
  }
}
