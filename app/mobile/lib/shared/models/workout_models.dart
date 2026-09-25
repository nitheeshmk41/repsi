
enum WorkoutDifficulty { easy, good, hard, veryHard }

enum MuscleGroup { chest, back, shoulders, arms, legs, core, cardio, fullBody }

enum EquipmentType { barbell, dumbbell, machine, cable, bodyweight, cardio }

class Exercise {
  final String id;
  final String name;
  final String description;
  final MuscleGroup muscleGroup;
  final EquipmentType equipment;
  final String instructions;
  final String? videoUrl;
  final String? imageUrl;
  final List<String> safetyNotes;

  const Exercise({
    required this.id,
    required this.name,
    required this.description,
    required this.muscleGroup,
    required this.equipment,
    required this.instructions,
    this.videoUrl,
    this.imageUrl,
    this.safetyNotes = const [],
  });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String? ?? '',
      muscleGroup: MuscleGroup.values.firstWhere(
        (e) => e.name.toLowerCase() == (json['muscleGroup'] as String? ?? '').toLowerCase(),
        orElse: () => MuscleGroup.fullBody,
      ),
      equipment: EquipmentType.values.firstWhere(
        (e) => e.name.toLowerCase() == (json['equipment'] as String? ?? '').toLowerCase(),
        orElse: () => EquipmentType.bodyweight,
      ),
      instructions: json['instructions'] as String? ?? '',
      videoUrl: json['videoUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
      safetyNotes: List<String>.from(json['safetyNotes'] ?? []),
    );
  }
}

class WorkoutSet {
  final int setNumber;
  final double weightKg;
  final int reps;
  final bool isCompleted;

  const WorkoutSet({
    required this.setNumber,
    required this.weightKg,
    required this.reps,
    this.isCompleted = false,
  });

  WorkoutSet copyWith({
    int? setNumber,
    double? weightKg,
    int? reps,
    bool? isCompleted,
  }) {
    return WorkoutSet(
      setNumber: setNumber ?? this.setNumber,
      weightKg: weightKg ?? this.weightKg,
      reps: reps ?? this.reps,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

class WorkoutExercise {
  final Exercise exercise;
  final List<WorkoutSet> sets;
  final int targetRestSeconds;
  final String? notes;

  const WorkoutExercise({
    required this.exercise,
    required this.sets,
    this.targetRestSeconds = 60,
    this.notes,
  });

  WorkoutExercise copyWith({
    Exercise? exercise,
    List<WorkoutSet>? sets,
    int? targetRestSeconds,
    String? notes,
  }) {
    return WorkoutExercise(
      exercise: exercise ?? this.exercise,
      sets: sets ?? this.sets,
      targetRestSeconds: targetRestSeconds ?? this.targetRestSeconds,
      notes: notes ?? this.notes,
    );
  }
}

class WorkoutPlan {
  final String id;
  final String title;
  final String description;
  final List<MuscleGroup> targetMuscles;
  final int estimatedDurationMinutes;
  final List<WorkoutExercise> exercises;

  const WorkoutPlan({
    required this.id,
    required this.title,
    required this.description,
    required this.targetMuscles,
    required this.estimatedDurationMinutes,
    required this.exercises,
  });
}

class WorkoutSession {
  final String id;
  final String planId;
  final String title;
  final DateTime startTime;
  final DateTime? endTime;
  final List<WorkoutExercise> completedExercises;
  final double totalVolumeKg;
  final int totalDurationSeconds;
  final WorkoutDifficulty? rating;
  final String? notes;

  const WorkoutSession({
    required this.id,
    required this.planId,
    required this.title,
    required this.startTime,
    this.endTime,
    required this.completedExercises,
    required this.totalVolumeKg,
    required this.totalDurationSeconds,
    this.rating,
    this.notes,
  });
}
