import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/splash/views/splash_view.dart';
import 'package:mobile/shared/widgets/repsi_avatar.dart';
import 'package:mobile/shared/widgets/repsi_network_image.dart';

void main() {
  group('Splash View & Performance Tests', () {
    testWidgets('SplashView renders branded logo and progress indicator on frame 1', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: SplashView(),
          ),
        ),
      );

      // Verify fast first frame renders immediately
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.byType(SplashView), findsOneWidget);
      expect(find.textContaining('Repsi'), findsWidgets);

      // Advance animation smoothly
      await tester.pump(const Duration(milliseconds: 500));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('RepsiAvatar gracefully renders initials placeholder on empty URL', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: RepsiAvatar(
              name: 'Rahul Sharma',
              imageUrl: null,
              size: 48,
            ),
          ),
        ),
      );

      // Initials 'RS' should be displayed cleanly
      expect(find.text('RS'), findsOneWidget);
    });

    testWidgets('RepsiNetworkImage renders skeleton placeholder and handles empty URLs safely', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: RepsiNetworkImage(
              imageUrl: '',
              width: 100,
              height: 100,
            ),
          ),
        ),
      );

      // Empty URL falls back safely to broken image placeholder without throwing exceptions
      expect(find.byIcon(Icons.broken_image_outlined), findsOneWidget);
    });
  });
}
