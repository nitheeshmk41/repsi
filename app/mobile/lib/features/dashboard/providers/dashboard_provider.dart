import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_error.dart';
import '../../../core/providers/api_provider.dart';
import '../../../shared/models/dashboard_metrics_model.dart';
import '../services/dashboard_service.dart';

class DashboardState {
  final bool isLoading;
  final DashboardMetricsModel? metrics;
  final String? errorMessage;

  const DashboardState({
    this.isLoading = false,
    this.metrics,
    this.errorMessage,
  });

  DashboardState copyWith({
    bool? isLoading,
    DashboardMetricsModel? metrics,
    String? errorMessage,
    bool clearError = false,
  }) {
    return DashboardState(
      isLoading: isLoading ?? this.isLoading,
      metrics: metrics ?? this.metrics,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

final dashboardServiceProvider = Provider<DashboardService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return DashboardService(apiClient: apiClient);
});

class DashboardNotifier extends StateNotifier<DashboardState> {
  final DashboardService _service;

  DashboardNotifier({required DashboardService service})
      : _service = service,
        super(const DashboardState()) {
    fetchMetrics();
  }

  Future<void> fetchMetrics() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final data = await _service.getMetrics();
      state = state.copyWith(isLoading: false, metrics: data);
    } on ApiError catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.message);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Failed to load dashboard metrics');
    }
  }
}

final dashboardProvider = StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  final service = ref.watch(dashboardServiceProvider);
  return DashboardNotifier(service: service);
});
