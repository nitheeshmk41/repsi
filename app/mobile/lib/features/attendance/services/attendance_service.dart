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
    String? memberId,
    String? qrToken,
    String method = 'qr',
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.attendanceCheckIn,
        data: {
          if (memberId != null) 'member_id': memberId,
          if (qrToken != null) 'qr_token': qrToken,
          'method': method,
        },
      );
      return AttendanceRecordModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<Map<String, dynamic>> scanGymQr({
    required String qrPayload,
  }) async {
    try {
      final response = await _apiClient.post(
        '/attendance/scan-qr',
        data: {
          'identifier': qrPayload,
          'method': 'qr',
        },
      );
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }

  Future<AttendanceRecordModel> checkOut(String attendanceId) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.attendanceCheckOut,
        data: {'attendance_id': attendanceId, 'checkout_type': 'MANUAL'},
      );
      return AttendanceRecordModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiError.fromDioException(e);
    }
  }
}
