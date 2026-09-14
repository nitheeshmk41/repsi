import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../../core/api/api_error.dart';
import '../../../core/providers/api_provider.dart';
import '../../../core/providers/storage_provider.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../../shared/models/user_model.dart';
import '../services/auth_service.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? token;
  final String? activeWorkspaceId;
  final String? activeWorkspaceSlug;
  final String? errorMessage;

  const AuthState({
    this.status = AuthStatus.initial,
    this.user,
    this.token,
    this.activeWorkspaceId,
    this.activeWorkspaceSlug,
    this.errorMessage,
  });

  bool get isAuthenticated => status == AuthStatus.authenticated && token != null;

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    String? token,
    String? activeWorkspaceId,
    String? activeWorkspaceSlug,
    String? errorMessage,
    bool clearUser = false,
    bool clearError = false,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: clearUser ? null : (user ?? this.user),
      token: clearUser ? null : (token ?? this.token),
      activeWorkspaceId: clearUser ? null : (activeWorkspaceId ?? this.activeWorkspaceId),
      activeWorkspaceSlug: clearUser ? null : (activeWorkspaceSlug ?? this.activeWorkspaceSlug),
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthService(apiClient: apiClient);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;
  final SecureStorageService _storage;

  AuthNotifier({
    required AuthService authService,
    required SecureStorageService storage,
  })  : _authService = authService,
        _storage = storage,
        super(const AuthState()) {
    initSession();
  }

  Future<void> initSession() async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      final token = await _storage.getToken();
      final workspaceId = _storage.getActiveWorkspaceId();
      final workspaceSlug = _storage.getActiveWorkspaceSlug();
      final user = _storage.getCachedUser();

      if (token != null && token.isNotEmpty) {
        state = state.copyWith(
          status: AuthStatus.authenticated,
          token: token,
          user: user,
          activeWorkspaceId: workspaceId,
          activeWorkspaceSlug: workspaceSlug,
        );

        // Background refresh user profile
        try {
          final me = await _authService.getMe();
          await _storage.saveUser(me);
          state = state.copyWith(user: me);
        } catch (_) {}
      } else {
        state = state.copyWith(status: AuthStatus.unauthenticated, clearError: true);
      }
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.unauthenticated,
        clearError: true,
      );
    }
  }

  Future<bool> login({
    required String email,
    required String password,
    String? workspaceSlug,
  }) async {
    if (state.status == AuthStatus.loading) return false;
    state = state.copyWith(status: AuthStatus.loading, clearError: true);
    try {
      final response = await _authService.login(
        email: email,
        password: password,
        workspaceSlug: workspaceSlug,
      );

      await _storage.saveToken(response.accessToken);
      if (response.workspaceId != null) {
        await _storage.saveActiveWorkspaceId(response.workspaceId!);
      }
      if (workspaceSlug != null && workspaceSlug.isNotEmpty) {
        await _storage.saveActiveWorkspaceSlug(workspaceSlug);
      }
      if (response.user != null) {
        await _storage.saveUser(response.user!);
      }

      // If user profile is not directly embedded in login response, fetch /me
      UserModel? user = response.user;
      if (user == null) {
        try {
          user = await _authService.getMe();
          await _storage.saveUser(user);
        } catch (_) {}
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        token: response.accessToken,
        user: user,
        activeWorkspaceId: response.workspaceId,
        activeWorkspaceSlug: workspaceSlug,
      );
      return true;
    } on ApiError catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.message,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: 'Failed to sign in. Please check your credentials.',
      );
      return false;
    }
  }

  Future<bool> loginWithGoogle() async {
    if (state.status == AuthStatus.loading) return false;
    state = state.copyWith(status: AuthStatus.loading, clearError: true);
    try {
      final googleSignIn = GoogleSignIn(scopes: ['email', 'profile']);
      final GoogleSignInAccount? googleUser = await googleSignIn.signIn();
      if (googleUser == null) {
        state = state.copyWith(status: AuthStatus.unauthenticated, errorMessage: 'Google Sign-In cancelled.');
        return false;
      }
      
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final accessToken = googleAuth.accessToken;
      if (accessToken == null) {
        throw Exception("Failed to get Google Access Token");
      }

      final response = await _authService.loginWithGoogle(token: accessToken);

      await _storage.saveToken(response.accessToken);
      if (response.workspaceId != null) {
        await _storage.saveActiveWorkspaceId(response.workspaceId!);
      }
      
      UserModel? user = response.user;
      if (user == null) {
        try {
          user = await _authService.getMe();
          await _storage.saveUser(user);
        } catch (_) {}
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        token: response.accessToken,
        user: user,
        activeWorkspaceId: response.workspaceId,
      );
      return true;
    } on ApiError catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.message,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: 'Google Sign-In failed. Please try again.',
      );
      return false;
    }
  }

  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
    required String gymName,
    String? gymPhone,
    String? gymCity,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, clearError: true);
    try {
      final response = await _authService.register(
        fullName: fullName,
        email: email,
        password: password,
        gymName: gymName,
        gymPhone: gymPhone,
        gymCity: gymCity,
      );

      await _storage.saveToken(response.accessToken);
      if (response.workspaceId != null) {
        await _storage.saveActiveWorkspaceId(response.workspaceId!);
      }
      if (response.workspace?.slug != null) {
        await _storage.saveActiveWorkspaceSlug(response.workspace!.slug);
      }
      if (response.user != null) {
        await _storage.saveUser(response.user!);
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        token: response.accessToken,
        user: response.user,
        activeWorkspaceId: response.workspaceId,
        activeWorkspaceSlug: response.workspace?.slug,
      );
      return true;
    } on ApiError catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.message,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: 'Registration failed. Please try again.',
      );
      return false;
    }
  }

  Future<bool> registerMember({
    required String fullName,
    required String email,
    required String password,
    required String workspaceSlug,
    String? phone,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, clearError: true);
    try {
      final response = await _authService.registerMember(
        fullName: fullName,
        email: email,
        password: password,
        workspaceSlug: workspaceSlug,
        phone: phone,
      );
      await _storage.saveToken(response.accessToken);
      if (response.workspaceId != null) await _storage.saveActiveWorkspaceId(response.workspaceId!);
      await _storage.saveActiveWorkspaceSlug(workspaceSlug);
      state = state.copyWith(status: AuthStatus.authenticated, token: response.accessToken, activeWorkspaceId: response.workspaceId, activeWorkspaceSlug: workspaceSlug);
      return true;
    } on ApiError catch (e) {
      state = state.copyWith(status: AuthStatus.error, errorMessage: e.message);
      return false;
    } catch (_) {
      state = state.copyWith(status: AuthStatus.error, errorMessage: 'Registration failed. Please try again.');
      return false;
    }
  }

  Future<void> updateActiveWorkspace(String workspaceId, String slug) async {
    await _storage.saveActiveWorkspaceId(workspaceId);
    await _storage.saveActiveWorkspaceSlug(slug);
    state = state.copyWith(
      activeWorkspaceId: workspaceId,
      activeWorkspaceSlug: slug,
    );
  }

  Future<void> logout() async {
    await _authService.logout();
    await _storage.clearAll();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  final storage = ref.watch(secureStorageServiceProvider);
  return AuthNotifier(authService: authService, storage: storage);
});
