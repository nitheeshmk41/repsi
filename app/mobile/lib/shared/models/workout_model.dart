class ExerciseModel {
  final String name;
  final int sets;
  final int reps;
  final double? weightKg;
  final int? restSeconds;

  const ExerciseModel({
    required this.name,
    required this.sets,
    required this.reps,
    this.weightKg,
    this.restSeconds,
  });

  factory ExerciseModel.fromJson(Map<String, dynamic> json) {
    return ExerciseModel(
      name: json['name'] as String? ?? 'Exercise',
      sets: (json['sets'] as num?)?.toInt() ?? 3,
      reps: (json['reps'] as num?)?.toInt() ?? 10,
      weightKg: (json['weight_kg'] as num?)?.toDouble(),
      restSeconds: (json['rest_seconds'] as num?)?.toInt(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'sets': sets,
      'reps': reps,
      'weight_kg': weightKg,
      'rest_seconds': restSeconds,
    };
  }
}

class WorkoutPlanModel {
  final String id;
  final String workspaceId;
  final String title;
  final String? description;
  final String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED
  final int durationWeeks;
  final List<ExerciseModel> exercises;

  const WorkoutPlanModel({
    required this.id,
    required this.workspaceId,
    required this.title,
    this.description,
    this.difficulty = 'BEGINNER',
    this.durationWeeks = 4,
    this.exercises = const [],
  });

  factory WorkoutPlanModel.fromJson(Map<String, dynamic> json) {
    final rawExercises = json['exercises'] as List<dynamic>? ?? [];
    return WorkoutPlanModel(
      id: json['id']?.toString() ?? '',
      workspaceId: json['workspace_id']?.toString() ?? '',
      title: json['title'] as String? ?? json['name'] as String? ?? 'Workout Plan',
      description: json['description'] as String?,
      difficulty: json['difficulty'] as String? ?? 'BEGINNER',
      durationWeeks: (json['duration_weeks'] as num?)?.toInt() ?? 4,
      exercises: rawExercises
          .map((e) => ExerciseModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'workspace_id': workspaceId,
      'title': title,
      'description': description,
      'difficulty': difficulty,
      'duration_weeks': durationWeeks,
      'exercises': exercises.map((e) => e.toJson()).toList(),
    };
  }
}
