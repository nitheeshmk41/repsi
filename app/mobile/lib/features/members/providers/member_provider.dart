import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_error.dart';
import '../../../core/providers/api_provider.dart';
import '../../../shared/models/member_model.dart';
import '../services/member_service.dart';

class MemberListState {
  final bool isLoading;
  final List<MemberModel> members;
  final String searchQuery;
  final String selectedStatusFilter; // ALL, ACTIVE, EXPIRING, EXPIRED
  final String? errorMessage;

  const MemberListState({
    this.isLoading = false,
    this.members = const [],
    this.searchQuery = '',
    this.selectedStatusFilter = 'ALL',
    this.errorMessage,
  });

  MemberListState copyWith({
    bool? isLoading,
    List<MemberModel>? members,
    String? searchQuery,
    String? selectedStatusFilter,
    String? errorMessage,
    bool clearError = false,
  }) {
    return MemberListState(
      isLoading: isLoading ?? this.isLoading,
      members: members ?? this.members,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedStatusFilter: selectedStatusFilter ?? this.selectedStatusFilter,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

final memberServiceProvider = Provider<MemberService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return MemberService(apiClient: apiClient);
});

class MemberListNotifier extends StateNotifier<MemberListState> {
  final MemberService _service;

  MemberListNotifier({required MemberService service})
      : _service = service,
        super(const MemberListState()) {
    fetchMembers();
  }

  Future<void> fetchMembers() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final list = await _service.getMembers(
        search: state.searchQuery,
        status: state.selectedStatusFilter,
      );
      state = state.copyWith(isLoading: false, members: list);
    } on ApiError catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.message);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Failed to load members');
    }
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
    fetchMembers();
  }

  void setStatusFilter(String status) {
    state = state.copyWith(selectedStatusFilter: status);
    fetchMembers();
  }

  Future<bool> addMember(Map<String, dynamic> data) async {
    try {
      final newMember = await _service.createMember(data);
      state = state.copyWith(members: [newMember, ...state.members]);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateMember(String id, Map<String, dynamic> data) async {
    try {
      final updated = await _service.updateMember(id, data);
      final updatedList = state.members.map((m) => m.id == id ? updated : m).toList();
      state = state.copyWith(members: updatedList);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> deleteMember(String id) async {
    try {
      await _service.deleteMember(id);
      final updatedList = state.members.where((m) => m.id != id).toList();
      state = state.copyWith(members: updatedList);
      return true;
    } catch (e) {
      return false;
    }
  }
}

final memberListProvider = StateNotifierProvider<MemberListNotifier, MemberListState>((ref) {
  final service = ref.watch(memberServiceProvider);
  return MemberListNotifier(service: service);
});
