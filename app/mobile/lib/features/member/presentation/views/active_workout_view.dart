import 'dart:async';
import 'package:flutter/material.dart';

import '../../../../shared/models/workout_models.dart';
import 'workout_completion_view.dart';

class ActiveWorkoutView extends StatefulWidget {
  final WorkoutPlan workout;

  const ActiveWorkoutView({super.key, required this.workout});

  @override
  State<ActiveWorkoutView> createState() => _ActiveWorkoutViewState();
}

class _ActiveWorkoutViewState extends State<ActiveWorkoutView> {
  late WorkoutPlan _activePlan;
  int _currentExerciseIndex = 0;
  int _elapsedSeconds = 0;
  Timer? _stopwatchTimer;

  // Rest Timer State
  bool _isResting = false;
  int _restSecondsRemaining = 60;
  Timer? _restTimer;

  @override
  void initState() {
    super.initState();
    _activePlan = widget.workout;
    _startStopwatch();
  }

  void _startStopwatch() {
    _stopwatchTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() => _elapsedSeconds++);
      }
    });
  }

  void _startRestTimer(int durationSeconds) {
    _restTimer?.cancel();
    setState(() {
      _isResting = true;
      _restSecondsRemaining = durationSeconds;
    });

    _restTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_restSecondsRemaining <= 1) {
        timer.cancel();
        if (mounted) setState(() => _isResting = false);
      } else {
        if (mounted) setState(() => _restSecondsRemaining--);
      }
    });
  }

  void _toggleSetCompletion(int exerciseIndex, int setIndex) {
    setState(() {
      final exercises = List<WorkoutExercise>.from(_activePlan.exercises);
      final currentExercise = exercises[exerciseIndex];
      final sets = List<WorkoutSet>.from(currentExercise.sets);

      final currentSet = sets[setIndex];
      final newStatus = !currentSet.isCompleted;

      sets[setIndex] = currentSet.copyWith(isCompleted: newStatus);
      exercises[exerciseIndex] = currentExercise.copyWith(sets: sets);

      _activePlan = WorkoutPlan(
        id: _activePlan.id,
        title: _activePlan.title,
        description: _activePlan.description,
        targetMuscles: _activePlan.targetMuscles,
        estimatedDurationMinutes: _activePlan.estimatedDurationMinutes,
        exercises: exercises,
      );

      if (newStatus) {
        _startRestTimer(currentExercise.targetRestSeconds);
      }
    });
  }

  String _formatDuration(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  void dispose() {
    _stopwatchTimer?.cancel();
    _restTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currentExercise = _activePlan.exercises[_currentExerciseIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text(_activePlan.title),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Row(
                children: [
                  const Icon(Icons.timer_outlined, size: 18, color: Colors.amber),
                  const SizedBox(width: 4),
                  Text(
                    _formatDuration(_elapsedSeconds),
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Exercise selector tabs
              Container(
                height: 50,
                color: theme.scaffoldBackgroundColor,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: _activePlan.exercises.length,
                  itemBuilder: (context, index) {
                    final isSelected = index == _currentExerciseIndex;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: ChoiceChip(
                        label: Text('Ex ${index + 1}'),
                        selected: isSelected,
                        onSelected: (_) => setState(() => _currentExerciseIndex = index),
                        selectedColor: theme.primaryColor,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : Colors.grey,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    );
                  },
                ),
              ),

              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Exercise header card
                      Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                currentExercise.exercise.name,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                currentExercise.exercise.instructions,
                                style: const TextStyle(color: Colors.grey, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Sets Table
                      const Text(
                        'LOG SETS',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey,
                          letterSpacing: 1.1,
                        ),
                      ),
                      const SizedBox(height: 8),

                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: currentExercise.sets.length,
                        itemBuilder: (context, setIdx) {
                          final setItem = currentExercise.sets[setIdx];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            color: setItem.isCompleted
                                ? Colors.green.withValues(alpha: 0.1)
                                : theme.cardTheme.color,
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 8,
                              ),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    radius: 14,
                                    backgroundColor: setItem.isCompleted
                                        ? Colors.green
                                        : Colors.grey.withValues(alpha: 0.3),
                                    child: Text(
                                      '${setItem.setNumber}',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Text(
                                      '${setItem.weightKg} kg  ×  ${setItem.reps} reps',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        decoration: setItem.isCompleted
                                            ? TextDecoration.lineThrough
                                            : null,
                                      ),
                                    ),
                                  ),
                                  IconButton(
                                    icon: Icon(
                                      setItem.isCompleted
                                          ? Icons.check_circle
                                          : Icons.radio_button_unchecked,
                                      color: setItem.isCompleted
                                          ? Colors.green
                                          : Colors.grey,
                                      size: 28,
                                    ),
                                    onPressed: () => _toggleSetCompletion(
                                      _currentExerciseIndex,
                                      setIdx,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Actions
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.cardColor,
                  border: const Border(top: BorderSide(color: Colors.white10)),
                ),
                child: Row(
                  children: [
                    if (_currentExerciseIndex > 0)
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _currentExerciseIndex--),
                          child: const Text('Previous'),
                        ),
                      ),
                    if (_currentExerciseIndex > 0) const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              _currentExerciseIndex == _activePlan.exercises.length - 1
                                  ? Colors.green
                                  : theme.primaryColor,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        onPressed: () {
                          if (_currentExerciseIndex < _activePlan.exercises.length - 1) {
                            setState(() => _currentExerciseIndex++);
                          } else {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (_) => WorkoutCompletionView(
                                  durationSeconds: _elapsedSeconds,
                                  exercisesCount: _activePlan.exercises.length,
                                  totalSetsCount: _activePlan.exercises.fold(
                                    0,
                                    (acc, ex) => acc + ex.sets.length,
                                  ),
                                  totalVolumeKg: 4250.0,
                                ),
                              ),
                            );
                          }
                        },
                        child: Text(
                          _currentExerciseIndex == _activePlan.exercises.length - 1
                              ? 'FINISH WORKOUT'
                              : 'Next Exercise',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Rest Timer Overlay
          if (_isResting)
            Positioned(
              bottom: 80,
              left: 16,
              right: 16,
              child: Card(
                elevation: 8,
                color: Colors.black87,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Colors.amber, width: 2),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.timer_rounded, color: Colors.amber, size: 28),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text(
                                'REST TIMER',
                                style: TextStyle(
                                  color: Colors.amber,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                '${_restSecondsRemaining}s',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          TextButton(
                            onPressed: () => setState(
                              () => _restSecondsRemaining += 15,
                            ),
                            child: const Text('+15s', style: TextStyle(color: Colors.white)),
                          ),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.amber,
                              foregroundColor: Colors.black,
                            ),
                            onPressed: () => setState(() => _isResting = false),
                            child: const Text('SKIP'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
