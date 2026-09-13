import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_error.dart';
import '../../../core/providers/api_provider.dart';
import '../../../shared/models/attendance_model.dart';
import '../services/attendance_service.dart';

class AttendanceState {
  final bool isLoading;
  final AttendanceSummaryModel? summary;
  final String? errorMessage;

  const AttendanceState({
    this.isLoading = false,
    this.summary,
    this.errorMessage,
  });

  AttendanceState copyWith({
    bool? isLoading,
    AttendanceSummaryModel? summary,
    String? errorMessage,
    bool clearError = false,
  }) {
    return AttendanceState(
      isLoading: isLoading ?? this.isLoading,
      summary: summary ?? this.summary,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

final attendanceServiceProvider = Provider<AttendanceService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AttendanceService(apiClient: apiClient);
});

class AttendanceNotifier extends StateNotifier<AttendanceState> {
  final AttendanceService _service;

  AttendanceNotifier({required AttendanceService service})
      : _service = service,
        super(const AttendanceState()) {
    fetchSummary();
  }

  Future<void> fetchSummary() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final summary = await _service.getSummary();
      state = state.copyWith(isLoading: false, summary: summary);
    } on ApiError catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.message);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Failed to load attendance');
    }
  }

  Future<bool> checkInMember(String memberId, {String method = 'QR_SCAN'}) async {
    try {
      final record = await _service.checkIn(memberId: memberId, method: method);
      final currentSummary = state.summary;
      if (currentSummary != null) {
        final updatedList = [record, ...currentSummary.recentCheckIns];
        final updatedSummary = AttendanceSummaryModel(
          totalToday: currentSummary.totalToday + 1,
          currentlyInside: currentSummary.currentlyInside + 1,
          peakHourCount: currentSummary.peakHourCount,
          peakHourTime: currentSummary.peakHourTime,
          recentCheckIns: updatedList,
        );
        state = state.copyWith(summary: updatedSummary);
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}

final attendanceProvider = StateNotifierProvider<AttendanceNotifier, AttendanceState>((ref) {
  final service = ref.watch(attendanceServiceProvider);
  return AttendanceNotifier(service: service);
});
