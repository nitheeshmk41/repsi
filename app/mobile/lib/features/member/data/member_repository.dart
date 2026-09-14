import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/providers/api_provider.dart';
import '../../../shared/models/fitness_models.dart';
import '../../../shared/models/workout_models.dart';

class MemberRepository {
  final ApiClient _apiClient;

  MemberRepository(this._apiClient);

  Future<WorkoutPlan> getTodayWorkout() async {
    // Clean mock fallback dataset representing Apex Fitness Push Day
    final exercises = [
      const WorkoutExercise(
        exercise: Exercise(
          id: 'ex_1',
          name: 'Barbell Bench Press',
          description: 'Compound chest movement focusing on overall mass.',
          muscleGroup: MuscleGroup.chest,
          equipment: EquipmentType.barbell,
          instructions: 'Keep feet flat, retract shoulder blades, lower bar to mid-chest, and press up smoothly.',
          safetyNotes: ['Do not bounce bar off chest', 'Use a spotter for heavy weights'],
        ),
        sets: [
          WorkoutSet(setNumber: 1, weightKg: 60.0, reps: 10, isCompleted: true),
          WorkoutSet(setNumber: 2, weightKg: 70.0, reps: 8, isCompleted: true),
          WorkoutSet(setNumber: 3, weightKg: 75.0, reps: 6, isCompleted: false),
          WorkoutSet(setNumber: 4, weightKg: 75.0, reps: 6, isCompleted: false),
        ],
        targetRestSeconds: 90,
      ),
      const WorkoutExercise(
        exercise: Exercise(
          id: 'ex_2',
          name: 'Incline Dumbbell Press',
          description: 'Targets the clavicular head of the pectoralis major.',
          muscleGroup: MuscleGroup.chest,
          equipment: EquipmentType.dumbbell,
          instructions: 'Set bench to 30 degrees. Press dumbbells overhead while keeping elbows at 45 degrees.',
          safetyNotes: ['Control the descent'],
        ),
        sets: [
          WorkoutSet(setNumber: 1, weightKg: 24.0, reps: 10, isCompleted: false),
          WorkoutSet(setNumber: 2, weightKg: 26.0, reps: 8, isCompleted: false),
          WorkoutSet(setNumber: 3, weightKg: 28.0, reps: 8, isCompleted: false),
        ],
        targetRestSeconds: 75,
      ),
      const WorkoutExercise(
        exercise: Exercise(
          id: 'ex_3',
          name: 'Seated Overhead Dumbbell Press',
          description: 'Primary anterior and lateral deltoid builder.',
          muscleGroup: MuscleGroup.shoulders,
          equipment: EquipmentType.dumbbell,
          instructions: 'Press dumbbells up vertically without arching lower back excessively.',
          safetyNotes: ['Maintain core stability'],
        ),
        sets: [
          WorkoutSet(setNumber: 1, weightKg: 18.0, reps: 12, isCompleted: false),
          WorkoutSet(setNumber: 2, weightKg: 20.0, reps: 10, isCompleted: false),
          WorkoutSet(setNumber: 3, weightKg: 22.0, reps: 8, isCompleted: false),
        ],
        targetRestSeconds: 60,
      ),
      const WorkoutExercise(
        exercise: Exercise(
          id: 'ex_4',
          name: 'Cable Tricep Pushdown',
          description: 'Isolated tricep extension movements.',
          muscleGroup: MuscleGroup.arms,
          equipment: EquipmentType.cable,
          instructions: 'Keep upper arms pinned to your torso and extend elbows downwards fully.',
          safetyNotes: ['Avoid flaring elbows out'],
        ),
        sets: [
          WorkoutSet(setNumber: 1, weightKg: 25.0, reps: 15, isCompleted: false),
          WorkoutSet(setNumber: 2, weightKg: 30.0, reps: 12, isCompleted: false),
          WorkoutSet(setNumber: 3, weightKg: 35.0, reps: 10, isCompleted: false),
        ],
        targetRestSeconds: 45,
      ),
    ];

    return WorkoutPlan(
      id: 'plan_push_day_1',
      title: 'Hypertrophy Push Day',
      description: 'Focus on Upper Chest, Anterior Deltoids, and Lateral Triceps.',
      targetMuscles: [MuscleGroup.chest, MuscleGroup.shoulders, MuscleGroup.arms],
      estimatedDurationMinutes: 52,
      exercises: exercises,
    );
  }

  Future<List<Exercise>> getExerciseLibrary() async {
    return const [
      Exercise(
        id: 'ex_1',
        name: 'Barbell Bench Press',
        description: 'Classic compound press for chest development.',
        muscleGroup: MuscleGroup.chest,
        equipment: EquipmentType.barbell,
        instructions: 'Lower bar with control to sternum and drive upward.',
      ),
      Exercise(
        id: 'ex_2',
        name: 'Incline Dumbbell Press',
        description: 'Upper chest hypertrophy movement.',
        muscleGroup: MuscleGroup.chest,
        equipment: EquipmentType.dumbbell,
        instructions: 'Set incline bench to 30 degrees and press overhead.',
      ),
      Exercise(
        id: 'ex_5',
        name: 'Barbell Back Squat',
        description: 'King of leg exercises for quad and glute strength.',
        muscleGroup: MuscleGroup.legs,
        equipment: EquipmentType.barbell,
        instructions: 'Squat until hips drop below knee level and burst back up.',
      ),
      Exercise(
        id: 'ex_6',
        name: 'Conventional Deadlift',
        description: 'Full posterior chain strength builder.',
        muscleGroup: MuscleGroup.back,
        equipment: EquipmentType.barbell,
        instructions: 'Brace core, pull slack out of bar, and lock out hips.',
      ),
      Exercise(
        id: 'ex_7',
        name: 'Pull-Ups',
        description: 'Bodyweight latissimus dorsi movement.',
        muscleGroup: MuscleGroup.back,
        equipment: EquipmentType.bodyweight,
        instructions: 'Pull chest up to the bar and lower down under full control.',
      ),
    ];
  }

  Future<List<GymMachine>> getGymMachines() async {
    return const [
      GymMachine(
        id: 'm_1',
        name: 'Plate-Loaded Chest Press',
        category: 'Chest',
        targetMuscles: 'Chest, Triceps, Shoulders',
        description: 'Heavy duty converges chest press machine.',
        instructions: 'Adjust seat height so handles align with mid-chest.',
        status: MachineStatus.available,
      ),
      GymMachine(
        id: 'm_2',
        name: 'Dual Cable Cross Station',
        category: 'Functional / Arms',
        targetMuscles: 'Chest, Arms, Core',
        description: 'Multi-adjustable cable pulley system.',
        instructions: 'Select desired height pin and clip attachment.',
        status: MachineStatus.available,
      ),
      GymMachine(
        id: 'm_3',
        name: 'Hack Squat Machine',
        category: 'Legs',
        targetMuscles: 'Quadriceps, Glutes',
        description: '45-degree angle quads isolator.',
        instructions: 'Place feet shoulder width apart on platform.',
        status: MachineStatus.inUse,
      ),
      GymMachine(
        id: 'm_4',
        name: 'Lat Pulldown Machine',
        category: 'Back',
        targetMuscles: 'Latissimus Dorsi, Biceps',
        description: 'Upper back width builder.',
        instructions: 'Pull bar down towards upper chest while arching upper back slightly.',
        status: MachineStatus.maintenance,
      ),
    ];
  }

  Future<List<ChatMessage>> getTrainerChat() async {
    return [
      ChatMessage(
        id: 'c1',
        senderId: 'trainer_1',
        text: 'Hey Nitheesh! Great progress on your bench press sets earlier this week.',
        timestamp: DateTime.now().subtract(const Duration(hours: 4)),
        isFromTrainer: true,
      ),
      ChatMessage(
        id: 'c2',
        senderId: 'user_me',
        text: 'Thanks Coach Marcus! Increased weight to 75kg today.',
        timestamp: DateTime.now().subtract(const Duration(hours: 3, minutes: 45)),
        isFromTrainer: false,
      ),
      ChatMessage(
        id: 'c3',
        senderId: 'trainer_1',
        text: 'Awesome work! Focus on keeping a 2-second eccentric phase on the incline press today.',
        timestamp: DateTime.now().subtract(const Duration(minutes: 30)),
        isFromTrainer: true,
      ),
    ];
  }

  Future<List<MemberPayment>> getPayments() async {
    return [
      MemberPayment(
        id: 'pay_1',
        title: 'Monthly Gym Access (Apex Fitness)',
        amount: 2500.0,
        date: DateTime.now().subtract(const Duration(days: 6)),
        status: 'PAID',
        paymentMethod: 'UPI / Credit Card',
        receiptNumber: 'REC-2026-09081',
      ),
      MemberPayment(
        id: 'pay_2',
        title: 'Personal Training (4 Sessions)',
        amount: 4000.0,
        date: DateTime.now().subtract(const Duration(days: 36)),
        status: 'PAID',
        paymentMethod: 'Razorpay',
        receiptNumber: 'REC-2026-08014',
      ),
    ];
  }
}

final memberRepositoryProvider = Provider<MemberRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return MemberRepository(apiClient);
});

final todayWorkoutProvider = FutureProvider<WorkoutPlan>((ref) async {
  final repo = ref.watch(memberRepositoryProvider);
  return repo.getTodayWorkout();
});

final gymMachinesProvider = FutureProvider<List<GymMachine>>((ref) async {
  final repo = ref.watch(memberRepositoryProvider);
  return repo.getGymMachines();
});

final exerciseLibraryProvider = FutureProvider<List<Exercise>>((ref) async {
  final repo = ref.watch(memberRepositoryProvider);
  return repo.getExerciseLibrary();
});

final trainerChatProvider = FutureProvider<List<ChatMessage>>((ref) async {
  final repo = ref.watch(memberRepositoryProvider);
  return repo.getTrainerChat();
});

final memberPaymentsProvider = FutureProvider<List<MemberPayment>>((ref) async {
  final repo = ref.watch(memberRepositoryProvider);
  return repo.getPayments();
});
