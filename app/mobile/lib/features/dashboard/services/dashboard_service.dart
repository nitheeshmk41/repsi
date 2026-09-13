import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../../../core/api/api_error.dart';
import '../../../shared/models/dashboard_metrics_model.dart';

class DashboardService {
  final ApiClient _apiClient;

  DashboardService({required ApiClient apiClient}) : _apiClient = apiClient;

  Future<DashboardMetricsModel> getMetrics() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.dashboardMetrics);
      return DashboardMetricsModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }
}
