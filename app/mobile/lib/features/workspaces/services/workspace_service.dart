import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../../../core/api/api_error.dart';
import '../../../shared/models/workspace_model.dart';

class WorkspaceService {
  final ApiClient _apiClient;

  WorkspaceService({required ApiClient apiClient}) : _apiClient = apiClient;

  Future<List<WorkspaceModel>> getWorkspaces() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.workspaces);
      final list = (response.data as List<dynamic>)
          .map((e) => WorkspaceModel.fromJson(e as Map<String, dynamic>))
          .toList();
      return list;
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<WorkspaceModel> getWorkspaceById(String id) async {
    try {
      final response = await _apiClient.get('${ApiEndpoints.workspaces}/$id');
      return WorkspaceModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<WorkspaceModel> updateWorkspace(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.put('${ApiEndpoints.workspaces}/$id', data: data);
      return WorkspaceModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<WorkspaceModel> completeOnboarding(Map<String, dynamic> onboardingData) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.completeOnboarding,
        data: onboardingData,
      );
      return WorkspaceModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }
}
