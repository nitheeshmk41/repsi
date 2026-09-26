import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_stagger.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';
import 'active_workout_view.dart';

class WorkoutDashboardView extends StatelessWidget {
  const WorkoutDashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    final exercises = [
      {'name': 'Bench Press', 'sets': '4 × 10', 'weight': '60 kg', 'icon': Icons.fitness_center_rounded},
      {'name': 'Incline Dumbbell Press', 'sets': '3 × 12', 'weight': '20 kg', 'icon': Icons.fitness_center_rounded},
      {'name': 'Cable Fly', 'sets': '3 × 15', 'weight': '15 kg', 'icon': Icons.sports_gymnastics_rounded},
      {'name': 'Triceps Pushdown', 'sets': '3 × 12', 'weight': '25 kg', 'icon': Icons.trending_down_rounded},
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Workout Plan',
          style: AppTypography.heading.copyWith(
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 12,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Badge + Plan Header (Mockup Screen 3)
              RepsiStaggerItem(
                index: 0,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(color: AppColors.border, width: 1),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.bolt_rounded, size: 14, color: AppColors.primaryDark),
                                const SizedBox(width: 4),
                                Text(
                                  "Today's Workout",
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.primaryDark,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Chest + Triceps',
                        style: AppTypography.heading.copyWith(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: AppColors.text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '4 exercises · 45 min',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 20),
                      RepsiButton(
                        text: 'Start Workout',
                        leadingIcon: const Icon(Icons.play_arrow_rounded, size: 22),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const ActiveWorkoutView()),
                          );
                        },
                        isFullWidth: true,
                        size: RepsiButtonSize.large,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Exercises List Header
              RepsiStaggerItem(
                index: 1,
                child: Text(
                  'Exercises (${exercises.length})',
                  style: AppTypography.sectionHeading.copyWith(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Exercise Cards
              ...List.generate(exercises.length, (index) {
                final ex = exercises[index];
                return RepsiStaggerItem(
                  index: index + 2,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: RepsiCard(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceSubtle,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.border, width: 0.8),
                            ),
                            child: Icon(
                              ex['icon'] as IconData,
                              size: 22,
                              color: AppColors.text,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  ex['name'] as String,
                                  style: AppTypography.headingSmall.copyWith(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.text,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${ex['sets']} · ${ex['weight']}',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.textSecondary,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(
                            Icons.chevron_right_rounded,
                            size: 20,
                            color: AppColors.textMuted,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
