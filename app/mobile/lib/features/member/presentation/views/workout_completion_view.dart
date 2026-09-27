import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/models/workout_models.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';

class WorkoutCompletionView extends StatefulWidget {
  final int durationSeconds;
  final int exercisesCount;
  final int totalSetsCount;
  final double totalVolumeKg;

  const WorkoutCompletionView({
    super.key,
    required this.durationSeconds,
    required this.exercisesCount,
    required this.totalSetsCount,
    required this.totalVolumeKg,
  });

  @override
  State<WorkoutCompletionView> createState() => _WorkoutCompletionViewState();
}

class _WorkoutCompletionViewState extends State<WorkoutCompletionView> {
  WorkoutDifficulty _selectedRating = WorkoutDifficulty.good;
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Workout Summary', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18, color: AppColors.text)),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12),
        child: Column(
          children: [
            // Success Trophy Icon
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: AppColors.primarySoft,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.primary, width: 2),
              ),
              child: const Icon(Icons.emoji_events_rounded, color: AppColors.primaryDark, size: 40),
            ),
            const SizedBox(height: 14),
            Text(
              'WORKOUT COMPLETE!',
              style: AppTypography.heading.copyWith(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.1,
                color: AppColors.text,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Crushed it Rahul! Upper Body A recorded to your fitness profile.',
              textAlign: TextAlign.center,
              style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Streak Extended Banner: 🔥 +1 workout streak (Streak extended to 5 days!)
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: Row(
                children: [
                  const Text('🔥', style: TextStyle(fontSize: 24)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          '+1 WORKOUT STREAK',
                          style: TextStyle(
                            color: Color(0xFFB45309),
                            fontWeight: FontWeight.w800,
                            fontSize: 13,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'You are on fire! Streak reached 5 consecutive days.',
                          style: TextStyle(color: Color(0xFF92400E), fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 4 Stats Grid: 412 kcal · 47 min · 6 exercises · 4,250 kg
            Row(
              children: [
                _buildStatBox('Active Burn', '🔥 412 kcal', Icons.local_fire_department_rounded, const Color(0xFFEF4444)),
                const SizedBox(width: 12),
                _buildStatBox('Duration', '⏱ 47 min', Icons.timer_outlined, const Color(0xFF3B82F6)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildStatBox('Exercises', '🏋️ 6 done', Icons.fitness_center_rounded, AppColors.primaryDark),
                const SizedBox(width: 12),
                _buildStatBox('Total Volume', '4,250 kg', Icons.bar_chart_rounded, const Color(0xFF8B5CF6)),
              ],
            ),
            const SizedBox(height: 16),

            // New PR Card
            RepsiCard(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.workspace_premium_rounded, color: Color(0xFFD97706), size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'NEW PERSONAL RECORD!',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFFB45309)),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Bench Press: 60 kg × 10 reps (Set 4)',
                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.text),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Effort / Difficulty Selection
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'How did this workout feel?',
                style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.text),
              ),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: WorkoutDifficulty.values.map((rating) {
                final isSelected = _selectedRating == rating;
                return ChoiceChip(
                  label: Text(rating.name.toUpperCase()),
                  selected: isSelected,
                  onSelected: (_) => setState(() => _selectedRating = rating),
                  selectedColor: AppColors.primary,
                  backgroundColor: AppColors.surfaceSubtle,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : AppColors.textSecondary,
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Save Workout Button
            RepsiButton(
              text: 'Save & Return to Dashboard',
              leadingIcon: const Icon(Icons.check_circle_outline_rounded, size: 20),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Workout saved and synced with Health Connect!'),
                    backgroundColor: AppColors.primary,
                  ),
                );
                Navigator.pop(context);
              },
              isFullWidth: true,
              size: RepsiButtonSize.large,
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildStatBox(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: RepsiCard(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 16),
                const SizedBox(width: 6),
                Text(
                  label,
                  style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: AppColors.text,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
