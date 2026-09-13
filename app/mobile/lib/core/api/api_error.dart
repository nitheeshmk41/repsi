import 'package:dio/dio.dart';

class ApiError implements Exception {
  final String message;
  final int? statusCode;
  final String? code;
  final dynamic details;

  ApiError({
    required this.message,
    this.statusCode,
    this.code,
    this.details,
  });

  factory ApiError.fromDio(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.receiveTimeout) {
      return ApiError(
        message: 'Connection timed out. Please check your internet connection.',
        statusCode: 408,
        code: 'TIMEOUT',
      );
    }

    if (error.type == DioExceptionType.connectionError) {
      return ApiError(
        message: 'Unable to connect to server. Please verify your connection.',
        statusCode: 0,
        code: 'CONNECTION_ERROR',
      );
    }

    final response = error.response;
    if (response != null && response.data is Map<String, dynamic>) {
      final data = response.data as Map<String, dynamic>;
      
      // Standard FastAPI detail string
      if (data.containsKey('detail') && data['detail'] is String) {
        return ApiError(
          message: data['detail'] as String,
          statusCode: response.statusCode,
          code: 'API_ERROR',
        );
      }

      // Structured error format
      if (data.containsKey('error') && data['error'] is Map<String, dynamic>) {
        final errMap = data['error'] as Map<String, dynamic>;
        return ApiError(
          message: errMap['message']?.toString() ?? 'An error occurred',
          code: errMap['code']?.toString(),
          statusCode: response.statusCode,
          details: errMap['details'],
        );
      }
    }

    switch (response?.statusCode) {
      case 400:
        return ApiError(message: 'Invalid request data.', statusCode: 400);
      case 401:
        return ApiError(message: 'Session expired. Please log in again.', statusCode: 401);
      case 403:
        return ApiError(message: 'You do not have permission for this action.', statusCode: 403);
      case 404:
        return ApiError(message: 'Requested resource not found.', statusCode: 404);
      case 409:
        return ApiError(message: 'Conflict with existing data.', statusCode: 409);
      case 422:
        return ApiError(message: 'Validation failed. Please verify input fields.', statusCode: 422);
      case 500:
        return ApiError(message: 'Internal server error. Please try again later.', statusCode: 500);
      default:
        return ApiError(
          message: 'An unexpected error occurred. Please try again.',
          statusCode: response?.statusCode,
        );
    }
  }

  factory ApiError.fromDioException(DioException error) => ApiError.fromDio(error);

  @override
  String toString() => message;
}
