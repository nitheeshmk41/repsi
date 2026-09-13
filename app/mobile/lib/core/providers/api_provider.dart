import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/api_client.dart';
import 'storage_provider.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(secureStorageServiceProvider);
  return ApiClient(storage: storage);
});
