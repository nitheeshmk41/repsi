import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_error.dart';
import '../../../core/providers/api_provider.dart';
import '../../../core/providers/storage_provider.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../../shared/models/workspace_model.dart';
import '../services/workspace_service.dart';

class WorkspaceState {
  final bool isLoading;
  final List<WorkspaceModel> workspaces;
  final WorkspaceModel? activeWorkspace;
  final String? errorMessage;

  const WorkspaceState({
    this.isLoading = false,
    this.workspaces = const [],
    this.activeWorkspace,
    this.errorMessage,
  });

  WorkspaceState copyWith({
    bool? isLoading,
    List<WorkspaceModel>? workspaces,
    WorkspaceModel? activeWorkspace,
    String? errorMessage,
    bool clearActiveWorkspace = false,
    bool clearError = false,
  }) {
    return WorkspaceState(
      isLoading: isLoading ?? this.isLoading,
      workspaces: workspaces ?? this.workspaces,
      activeWorkspace: clearActiveWorkspace ? null : (activeWorkspace ?? this.activeWorkspace),
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

final workspaceServiceProvider = Provider<WorkspaceService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return WorkspaceService(apiClient: apiClient);
});

class WorkspaceNotifier extends StateNotifier<WorkspaceState> {
  final WorkspaceService _workspaceService;
  final SecureStorageService _storage;

  WorkspaceNotifier({
    required WorkspaceService workspaceService,
    required SecureStorageService storage,
  })  : _workspaceService = workspaceService,
        _storage = storage,
        super(const WorkspaceState());

  Future<void> fetchWorkspaces() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final list = await _workspaceService.getWorkspaces();
      final savedWorkspaceId = _storage.getActiveWorkspaceId();

      WorkspaceModel? active;
      if (list.isNotEmpty) {
        if (savedWorkspaceId != null) {
          active = list.firstWhere(
            (w) => w.id == savedWorkspaceId,
            orElse: () => list.first,
          );
        } else {
          active = list.first;
        }
        await _storage.saveActiveWorkspaceId(active.id);
        await _storage.saveActiveWorkspaceSlug(active.slug);
      }

      state = state.copyWith(
        isLoading: false,
        workspaces: list,
        activeWorkspace: active,
      );
    } on ApiError catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.message);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to load workspaces.',
      );
    }
  }

  Future<void> selectWorkspace(WorkspaceModel workspace) async {
    await _storage.saveActiveWorkspaceId(workspace.id);
    await _storage.saveActiveWorkspaceSlug(workspace.slug);
    state = state.copyWith(activeWorkspace: workspace);
  }

  Future<bool> completeOnboarding(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final updated = await _workspaceService.completeOnboarding(data);
      final updatedList = state.workspaces.map((w) => w.id == updated.id ? updated : w).toList();
      state = state.copyWith(
        isLoading: false,
        activeWorkspace: updated,
        workspaces: updatedList,
      );
      return true;
    } on ApiError catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.message);
      return false;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Failed to complete onboarding');
      return false;
    }
  }
}

final workspaceProvider = StateNotifierProvider<WorkspaceNotifier, WorkspaceState>((ref) {
  final service = ref.watch(workspaceServiceProvider);
  final storage = ref.watch(secureStorageServiceProvider);
  return WorkspaceNotifier(workspaceService: service, storage: storage);
});
