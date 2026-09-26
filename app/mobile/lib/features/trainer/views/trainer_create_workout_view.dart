import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_text_field.dart';

class TrainerCreateWorkoutView extends StatefulWidget {
  const TrainerCreateWorkoutView({super.key});

  @override
  State<TrainerCreateWorkoutView> createState() => _TrainerCreateWorkoutViewState();
}

class _TrainerCreateWorkoutViewState extends State<TrainerCreateWorkoutView> {
  final _nameController = TextEditingController(text: 'Chest + Triceps');

  final List<Map<String, String>> _exercises = [
    {'name': 'Bench Press', 'sets': '4 × 10'},
    {'name': 'Incline Dumbbell Press', 'sets': '3 × 12'},
    {'name': 'Cable Fly', 'sets': '3 × 15'},
  ];

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _onReorder(int oldIndex, int newIndex) {
    HapticFeedback.lightImpact();
    setState(() {
      if (newIndex > oldIndex) {
        newIndex -= 1;
      }
      final item = _exercises.removeAt(oldIndex);
      _exercises.insert(newIndex, item);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Create Workout',
          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
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
              // Workout Name TextField (Trainer Mockup Screen 4)
              RepsiStaggerItem(
                index: 0,
                child: RepsiTextField(
                  label: 'Workout Name',
                  controller: _nameController,
                  prefixIcon: const Icon(Icons.edit_note_rounded, size: 20),
                ),
              ),
              const SizedBox(height: 20),

              // Reorderable Exercise List Header
              RepsiStaggerItem(
                index: 1,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Exercises (${_exercises.length})',
                      style: AppTypography.sectionHeading.copyWith(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    Text(
                      'Hold & drag to reorder',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Reorderable List
              Expanded(
                child: ReorderableListView.builder(
                  itemCount: _exercises.length,
                  // ignore: deprecated_member_use
                  onReorder: _onReorder,
                  proxyDecorator: (child, index, animation) {
                    return Material(
                      elevation: 4,
                      color: Colors.transparent,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                      child: child,
                    );
                  },
                  itemBuilder: (context, index) {
                    final ex = _exercises[index];
                    return Padding(
                      key: ValueKey(ex['name']),
                      padding: const EdgeInsets.only(bottom: 10),
                      child: RepsiCard(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: AppColors.primarySoft,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Center(
                                child: Text(
                                  '${index + 1}',
                                  style: AppTypography.headingSmall.copyWith(
                                    fontSize: 14,
                                    color: AppColors.primaryDark,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    ex['name']!,
                                    style: AppTypography.headingSmall.copyWith(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.text,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    ex['sets']!,
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(
                              Icons.drag_indicator_rounded,
                              color: AppColors.textMuted,
                              size: 22,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Add Exercise Button
              RepsiButton(
                text: '+ Add Exercise',
                variant: RepsiButtonVariant.outline,
                onPressed: () {
                  setState(() {
                    _exercises.add({'name': 'Triceps Extension', 'sets': '3 × 12'});
                  });
                },
                isFullWidth: true,
                size: RepsiButtonSize.medium,
              ),
              const SizedBox(height: 12),

              // Save Workout Button
              RepsiButton(
                text: 'Save Workout',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Workout plan saved successfully!'),
                      backgroundColor: AppColors.primary,
                    ),
                  );
                  Navigator.pop(context);
                },
                isFullWidth: true,
                size: RepsiButtonSize.large,
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
