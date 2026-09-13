import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../../../core/api/api_error.dart';
import '../../../shared/models/attendance_model.dart';

class AttendanceService {
  final ApiClient _apiClient;

  AttendanceService({required ApiClient apiClient}) : _apiClient = apiClient;

  Future<AttendanceSummaryModel> getSummary() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.attendanceSummary);
      return AttendanceSummaryModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<AttendanceRecordModel> checkIn({
    required String memberId,
    String method = 'QR_SCAN',
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.attendanceCheckIn,
        data: {
          'member_id': memberId,
          'check_in_method': method,
        },
      );
      return AttendanceRecordModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<AttendanceRecordModel> checkOut(String attendanceId) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.attendanceCheckOut,
        data: {'attendance_id': attendanceId},
      );
      return AttendanceRecordModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }
}
