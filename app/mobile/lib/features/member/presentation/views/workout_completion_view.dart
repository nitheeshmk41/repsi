import 'package:flutter/material.dart';

import '../../../../shared/models/workout_models.dart';

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

  String _formatDuration(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins}m ${secs}s';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Workout Summary'),
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              backgroundColor: Colors.green,
              child: Icon(Icons.emoji_events_rounded, color: Colors.white, size: 48),
            ),
            const SizedBox(height: 16),
            const Text(
              'WORKOUT COMPLETE!',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Great job Nitheesh! You crushed your session.',
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
            ),
            const SizedBox(height: 24),

            // PR Banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.amber.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.amber),
              ),
              child: const Row(
                children: [
                  Icon(Icons.workspace_premium_rounded, color: Colors.amber),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'NEW PERSONAL RECORD!\nBench Press: 75 kg × 6 reps',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Stats grid
            Row(
              children: [
                _buildStatBox(
                  'Duration',
                  _formatDuration(widget.durationSeconds),
                  Icons.timer_outlined,
                  Colors.blue,
                ),
                const SizedBox(width: 12),
                _buildStatBox(
                  'Volume',
                  '${widget.totalVolumeKg.toInt()} kg',
                  Icons.fitness_center_rounded,
                  Colors.purple,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildStatBox(
                  'Exercises',
                  '${widget.exercisesCount}',
                  Icons.list_alt_rounded,
                  Colors.orange,
                ),
                const SizedBox(width: 12),
                _buildStatBox(
                  'Sets Done',
                  '${widget.totalSetsCount}',
                  Icons.check_circle_outline_rounded,
                  Colors.green,
                ),
              ],
            ),

            const SizedBox(height: 24),

            // How did it feel?
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'How did this workout feel?',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: WorkoutDifficulty.values.map((rating) {
                final isSelected = _selectedRating == rating;
                return ChoiceChip(
                  label: Text(rating.name.toUpperCase()),
                  selected: isSelected,
                  onSelected: (_) => setState(() => _selectedRating = rating),
                  selectedColor: theme.primaryColor,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : Colors.grey,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 20),

            TextField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Session Notes (Optional)',
                hintText: 'e.g. Felt strong on bench press, shoulder slightly tight.',
              ),
              maxLines: 2,
            ),

            const SizedBox(height: 28),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.primaryColor,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Workout saved successfully!')),
                  );
                  Navigator.pop(context);
                },
                child: const Text(
                  'SAVE WORKOUT',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatBox(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              label,
              style: const TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
