import 'package:dio/dio.dart';
import '../storage/secure_storage_service.dart';

class AuthInterceptor extends Interceptor {
  final SecureStorageService _storage;

  AuthInterceptor(this._storage);

  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.getToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    final workspaceId = _storage.getActiveWorkspaceId();
    if (workspaceId != null && workspaceId.isNotEmpty) {
      options.headers['X-Workspace-ID'] = workspaceId;
    }

    final workspaceSlug = _storage.getActiveWorkspaceSlug();
    if (workspaceSlug != null && workspaceSlug.isNotEmpty) {
      options.headers['X-Tenant-Slug'] = workspaceSlug;
    }

    options.headers['Accept'] = 'application/json';
    options.headers['Content-Type'] = 'application/json';

    return handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // 401 unauthenticated hook can be handled here if token refresh exists
    return handler.next(err);
  }
}
