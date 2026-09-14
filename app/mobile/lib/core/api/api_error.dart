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
        message: 'Unable to connect to REPSI. Check your internet connection or server status.',
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
        return ApiError(message: 'Invalid request parameters.', statusCode: 400);
      case 401:
        return ApiError(message: 'Invalid email or password.', statusCode: 401);
      case 403:
        return ApiError(message: "You don't have permission to access this gym.", statusCode: 403);
      case 404:
        return ApiError(message: 'Account or gym not found.', statusCode: 404);
      case 408:
        return ApiError(message: 'Request timed out. Please try again.', statusCode: 408);
      case 409:
        return ApiError(message: 'Account with these details already exists.', statusCode: 409);
      case 422:
        return ApiError(message: 'Please check your inputs and try again.', statusCode: 422);
      case 429:
        return ApiError(message: 'Too many attempts. Please try again later.', statusCode: 429);
      case 500:
        return ApiError(message: 'REPSI is temporarily unavailable.', statusCode: 500);
      default:
        return ApiError(
          message: 'Unable to process request. Please try again.',
          statusCode: response?.statusCode,
        );
    }
  }

  factory ApiError.fromDioException(DioException error) => ApiError.fromDio(error);

  @override
  String toString() => message;
}
