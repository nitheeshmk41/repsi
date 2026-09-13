import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../../../core/api/api_error.dart';
import '../../../shared/models/member_model.dart';

class MemberService {
  final ApiClient _apiClient;

  MemberService({required ApiClient apiClient}) : _apiClient = apiClient;

  Future<List<MemberModel>> getMembers({
    String? search,
    String? status,
    int skip = 0,
    int limit = 50,
  }) async {
    try {
      final response = await _apiClient.get(
        ApiEndpoints.members,
        queryParameters: {
          'skip': skip,
          'limit': limit,
          if (search != null && search.isNotEmpty) 'search': search.trim(),
          if (status != null && status.isNotEmpty && status != 'ALL') 'status': status.toUpperCase(),
        },
      );
      final rawList = response.data;
      if (rawList is List) {
        return rawList.map((e) => MemberModel.fromJson(e as Map<String, dynamic>)).toList();
      } else if (rawList is Map && rawList['items'] is List) {
        return (rawList['items'] as List).map((e) => MemberModel.fromJson(e as Map<String, dynamic>)).toList();
      }
      return [];
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<MemberModel> getMemberById(String id) async {
    try {
      final response = await _apiClient.get('${ApiEndpoints.members}/$id');
      return MemberModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<MemberModel> createMember(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.post(ApiEndpoints.members, data: data);
      return MemberModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<MemberModel> updateMember(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.put('${ApiEndpoints.members}/$id', data: data);
      return MemberModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<void> deleteMember(String id) async {
    try {
      await _apiClient.delete('${ApiEndpoints.members}/$id');
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }
}
