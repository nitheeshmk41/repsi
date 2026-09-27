import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_stagger.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';
import 'workout_completion_view.dart';

class ActiveWorkoutView extends StatefulWidget {
  const ActiveWorkoutView({super.key});

  @override
  State<ActiveWorkoutView> createState() => _ActiveWorkoutViewState();
}

class _ActiveWorkoutViewState extends State<ActiveWorkoutView> {
  final List<Map<String, dynamic>> _exercises = [
    {
      'name': 'Bench Press',
      'sets': 4,
      'reps': 10,
      'weight': '60 kg',
      'completedSets': 4,
      'isLogged': true,
    },
    {
      'name': 'Lat Pulldown',
      'sets': 3,
      'reps': 12,
      'weight': '45 kg',
      'completedSets': 3,
      'isLogged': true,
    },
    {
      'name': 'Shoulder Press',
      'sets': 3,
      'reps': 10,
      'weight': '20 kg',
      'completedSets': 2,
      'isLogged': false,
    },
    {
      'name': 'Incline Dumbbell Curl',
      'sets': 3,
      'reps': 12,
      'weight': '12.5 kg',
      'completedSets': 0,
      'isLogged': false,
    },
    {
      'name': 'Tricep Rope Pushdown',
      'sets': 3,
      'reps': 15,
      'weight': '20 kg',
      'completedSets': 0,
      'isLogged': false,
    },
    {
      'name': 'Dumbbell Lateral Raise',
      'sets': 3,
      'reps': 15,
      'weight': '10 kg',
      'completedSets': 0,
      'isLogged': false,
    },
  ];

  double get _progress {
    int total = 0;
    int done = 0;
    for (var ex in _exercises) {
      total += (ex['sets'] as int);
      done += (ex['completedSets'] as int);
    }
    return total == 0 ? 0.0 : done / total;
  }

  void _showLogDialog(int index) {
    final ex = _exercises[index];
    int sets = ex['sets'];
    int reps = ex['reps'];
    String weightStr = (ex['weight'] as String).replaceAll(' kg', '');
    int weight = int.tryParse(weightStr) ?? 60;
    int completed = ex['completedSets'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (sheetCtx, setSheetState) {
            return Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: SafeArea(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Log ${ex['name']}',
                          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Weight adjuster
                    RepsiCard(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Target Weight', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline_rounded, color: AppColors.primary),
                                onPressed: () {
                                  if (weight > 2) setSheetState(() => weight -= 2);
                                },
                              ),
                              Text('$weight kg', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.primary),
                                onPressed: () {
                                  setSheetState(() => weight += 2);
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Reps adjuster
                    RepsiCard(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Reps per Set', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline_rounded, color: AppColors.primary),
                                onPressed: () {
                                  if (reps > 1) setSheetState(() => reps -= 1);
                                },
                              ),
                              Text('$reps', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.primary),
                                onPressed: () {
                                  setSheetState(() => reps += 1);
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Sets Checkmarks
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: List.generate(sets, (sIdx) {
                        final isSetDone = sIdx < completed;
                        return GestureDetector(
                          onTap: () {
                            HapticFeedback.lightImpact();
                            setSheetState(() {
                              completed = sIdx + 1;
                            });
                          },
                          child: Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: isSetDone ? AppColors.primary : AppColors.surfaceSubtle,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isSetDone ? AppColors.primary : AppColors.border,
                                width: 1.5,
                              ),
                            ),
                            child: Center(
                              child: Text(
                                'S${sIdx + 1}',
                                style: TextStyle(
                                  color: isSetDone ? Colors.white : AppColors.textSecondary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ),
                        );
                      }),
                    ),
                    const SizedBox(height: 20),

                    RepsiButton(
                      text: 'Save Exercise Sets',
                      onPressed: () {
                        setState(() {
                          ex['weight'] = '$weight kg';
                          ex['reps'] = reps;
                          ex['completedSets'] = completed;
                          ex['isLogged'] = completed == sets;
                        });
                        Navigator.pop(ctx);
                        HapticFeedback.mediumImpact();
                      },
                      isFullWidth: true,
                      size: RepsiButtonSize.large,
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _finishWorkout() {
    HapticFeedback.heavyImpact();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => const WorkoutCompletionView(
          durationSeconds: 47 * 60, // 47 min
          exercisesCount: 6,
          totalSetsCount: 19,
          totalVolumeKg: 4250.0,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final progressPct = (_progress * 100).toInt();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          children: [
            Text(
              "Today's Workout",
              style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12),
            ),
            Text(
              'Upper Body A',
              style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 12,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Progress Bar Card (Progress ████████░░ 80%)
              RepsiStaggerItem(
                index: 0,
                child: RepsiCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Workout Progress',
                            style: AppTypography.caption.copyWith(
                              fontWeight: FontWeight.w700,
                              color: AppColors.text,
                              fontSize: 13,
                            ),
                          ),
                          Text(
                            '$progressPct%',
                            style: const TextStyle(
                              color: AppColors.primaryDark,
                              fontWeight: FontWeight.w800,
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: _progress,
                          minHeight: 10,
                          backgroundColor: AppColors.surfaceSubtle,
                          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: const [
                          Text('Target: 6 exercises', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                          Text('Est: 45-50 min', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Exercises List
              Expanded(
                child: ListView.separated(
                  itemCount: _exercises.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final ex = _exercises[index];
                    final isComplete = ex['completedSets'] == ex['sets'];

                    return RepsiStaggerItem(
                      index: 1 + index,
                      child: RepsiCard(
                        padding: const EdgeInsets.all(14),
                        child: Row(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: isComplete ? AppColors.primary : AppColors.primarySoft,
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: isComplete
                                    ? const Icon(Icons.check_rounded, color: Colors.white, size: 18)
                                    : Text(
                                        '${index + 1}',
                                        style: const TextStyle(
                                          color: AppColors.primaryDark,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                        ),
                                      ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    ex['name'] as String,
                                    style: AppTypography.headingSmall.copyWith(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.text,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${ex['sets']} × ${ex['reps']} · ${ex['weight']}',
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            RepsiButton(
                              text: isComplete ? 'Logged' : 'Log',
                              variant: isComplete ? RepsiButtonVariant.outline : RepsiButtonVariant.primary,
                              size: RepsiButtonSize.small,
                              leadingIcon: isComplete ? const Icon(Icons.check_rounded, size: 14) : null,
                              onPressed: () => _showLogDialog(index),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Complete Workout Button
              RepsiStaggerItem(
                index: 8,
                child: Padding(
                  padding: const EdgeInsets.only(top: 10, bottom: 8),
                  child: RepsiButton(
                    text: 'Complete Workout',
                    leadingIcon: const Icon(Icons.flag_rounded, size: 20),
                    onPressed: _finishWorkout,
                    isFullWidth: true,
                    size: RepsiButtonSize.large,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
