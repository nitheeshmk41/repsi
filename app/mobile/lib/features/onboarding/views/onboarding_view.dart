import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_press.dart';

class OnboardingView extends StatefulWidget {
  const OnboardingView({super.key});

  @override
  State<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends State<OnboardingView> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingSlideData> _slides = const [
    OnboardingSlideData(
      title: 'Train. Track.\nProgress.',
      subtitle: 'Your complete gym ecosystem. Every set, workout, and milestone connected.',
      imagePath: 'assets/images/main_splash1.png',
    ),
    OnboardingSlideData(
      title: 'Data-Driven\nWorkouts',
      subtitle: 'Real-time set logging, body weight curves, and visual fitness statistics.',
      imagePath: 'assets/images/tracking.png',
    ),
    OnboardingSlideData(
      title: 'Built For\nYour Gym',
      subtitle: 'Fast QR attendance, personalized trainer guidance, and seamless membership.',
      imagePath: 'assets/images/ownerscreen.png',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_currentPage < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeOutCubic,
      );
    } else {
      context.go(RouteNames.login);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top bar with Skip button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Subtle logo badge
                  Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.border, width: 1),
                        ),
                        padding: const EdgeInsets.all(4),
                        child: Image.asset(
                          'assets/logos/logo_trans.png',
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.fitness_center_rounded,
                            size: 16,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Repsi',
                        style: AppTypography.headingSmall.copyWith(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () => context.go(RouteNames.login),
                    child: Text(
                      'Skip',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // PageView
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _slides.length,
                onPageChanged: (index) => setState(() => _currentPage = index),
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return Stack(
                    children: [
                      // The illustration as the natural screen background
                      Positioned(
                        left: 0,
                        right: 0,
                        top: 130,
                        bottom: 10,
                        child: Image.asset(
                          slide.imagePath,
                          fit: BoxFit.contain,
                          alignment: Alignment.bottomCenter,
                          errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                        ),
                      ),
                      // Soft gradient so text remains clean and readable
                      Positioned.fill(
                        child: IgnorePointer(
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                stops: const [0.0, 0.32, 0.70, 1.0],
                                colors: [
                                  AppColors.background,
                                  AppColors.background.withValues(alpha: 0.90),
                                  Colors.transparent,
                                  AppColors.background.withValues(alpha: 0.35),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      // Foreground typography
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 12),
                            // Title
                            Text(
                              slide.title,
                              style: AppTypography.display.copyWith(
                                fontSize: 34,
                                height: 1.15,
                                fontWeight: FontWeight.w700,
                                color: AppColors.text,
                                letterSpacing: -0.8,
                              ),
                            ),
                            const SizedBox(height: 12),
                            // Subtitle
                            Text(
                              slide.subtitle,
                              style: AppTypography.body.copyWith(
                                fontSize: 15,
                                color: AppColors.textSecondary,
                                height: 1.45,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),

            // Bottom row: Dots indicators + Circular Green Next Button
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pageHorizontalPadding,
                vertical: 24,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Dot indicators
                  Row(
                    children: List.generate(_slides.length, (index) {
                      final isActive = index == _currentPage;
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        curve: Curves.easeOutCubic,
                        margin: const EdgeInsets.only(right: 8),
                        width: isActive ? 24 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: isActive ? AppColors.primary : AppColors.borderStrong,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      );
                    }),
                  ),
                  // Round green action button
                  RepsiPress(
                    onTap: _onNext,
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Color(0x3318B968),
                            blurRadius: 16,
                            offset: Offset(0, 6),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.arrow_forward_rounded,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class OnboardingSlideData {
  final String title;
  final String subtitle;
  final String imagePath;

  const OnboardingSlideData({
    required this.title,
    required this.subtitle,
    required this.imagePath,
  });
}

