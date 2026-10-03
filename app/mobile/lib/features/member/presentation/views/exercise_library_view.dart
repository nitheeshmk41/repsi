import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_stagger.dart';

class ExerciseItem {
  final String id;
  final String name;
  final String category;
  final String subMuscle;
  final List<String> secondaryMuscles;
  final String equipment;
  final String difficulty;
  final String type;
  final List<String> steps;
  final int defaultSets;
  final int defaultReps;
  final int defaultRestSec;
  final List<Color> gradientColors;
  final String? trainerNote;

  const ExerciseItem({
    required this.id,
    required this.name,
    required this.category,
    required this.subMuscle,
    required this.secondaryMuscles,
    required this.equipment,
    required this.difficulty,
    required this.type,
    required this.steps,
    required this.defaultSets,
    required this.defaultReps,
    required this.defaultRestSec,
    required this.gradientColors,
    this.trainerNote,
  });
}

final List<ExerciseItem> kExerciseDatabase = [
  const ExerciseItem(
    id: 'ex-001',
    name: 'Barbell Bench Press',
    category: 'Chest',
    subMuscle: 'Mid Chest',
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Strength',
    steps: [
      'Set up flat on the bench with eyes directly under the bar.',
      'Grip the barbell slightly wider than shoulder-width.',
      'Unrack the weight and brace your core, pinching your shoulder blades together.',
      'Lower the bar under control toward your lower sternum.',
      'Press explosively back up to top lockout.',
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSec: 90,
    gradientColors: [Color(0xFF064E3B), Color(0xFF101918)],
    trainerNote: 'Focus on driving your feet firm into the ground and keeping your back neutral.',
  ),
  const ExerciseItem(
    id: 'ex-002',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    subMuscle: 'Upper Chest',
    secondaryMuscles: ['Triceps', 'Front Shoulders'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    type: 'Hypertrophy',
    steps: [
      'Set an adjustable bench to a 30 to 45 degree incline.',
      'Kick dumbbells up to shoulder level as you sit back.',
      'Press both dumbbells straight overhead, squeezing your upper chest at peak height.',
      'Lower under control until upper arms are parallel with the floor.',
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 75,
    gradientColors: [Color(0xFF0F766E), Color(0xFF101918)],
    trainerNote: 'Keep your elbows tucked at a 45-degree angle to protect your rotator cuffs.',
  ),
  const ExerciseItem(
    id: 'ex-003',
    name: 'Barbell Back Squat',
    category: 'Legs',
    subMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Lower Back'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    type: 'Strength',
    steps: [
      'Position the barbell across your upper trapezius muscles.',
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Break at your hips and knees simultaneously to sit down into the squat.',
      'Lower until thighs are parallel or below parallel to the ground.',
      'Drive through your mid-foot to stand back up.',
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSec: 120,
    gradientColors: [Color(0xFF1E3A8A), Color(0xFF101918)],
    trainerNote: 'Add 5kg to your top set this week if depth feels comfortable.',
  ),
  const ExerciseItem(
    id: 'ex-004',
    name: 'Lat Pulldown (Wide Grip)',
    category: 'Back',
    subMuscle: 'Lats',
    secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    type: 'Hypertrophy',
    steps: [
      'Grasp the wide bar with an overhand grip wider than shoulder width.',
      'Sit upright with thigh pads securely pressing down on your knees.',
      'Lean back slightly (about 10-15 degrees) and pull the bar down toward upper chest.',
      'Squeeze your lat muscles at the bottom position before controlled return.',
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60,
    gradientColors: [Color(0xFF312E81), Color(0xFF101918)],
  ),
  const ExerciseItem(
    id: 'ex-005',
    name: 'Overhead Dumbbell Shoulder Press',
    category: 'Shoulders',
    subMuscle: 'Anterior Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    type: 'Strength',
    steps: [
      'Sit erect on a bench with 90-degree back support.',
      'Hold dumbbells at shoulder height with palms facing forward.',
      'Press dumbbells directly overhead until arms extend smoothly.',
      'Lower under control back to shoulder level.',
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 75,
    gradientColors: [Color(0xFF581C87), Color(0xFF101918)],
    trainerNote: 'Avoid arching your lower back away from the bench pad.',
  ),
  const ExerciseItem(
    id: 'ex-006',
    name: 'Incline Dumbbell Biceps Curl',
    category: 'Arms',
    subMuscle: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    type: 'Hypertrophy',
    steps: [
      'Sit back on an incline bench angled at 45 degrees.',
      'Let dumbbells hang straight down at your sides with palms forward.',
      'Curl weights upward while keeping upper arms strictly fixed.',
      'Pause at top contraction then lower with a 3-second negative tempo.',
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60,
    gradientColors: [Color(0xFF78350F), Color(0xFF101918)],
  ),
  const ExerciseItem(
    id: 'ex-007',
    name: 'Hanging Leg Raise',
    category: 'Core',
    subMuscle: 'Lower Abs',
    secondaryMuscles: ['Hip Flexors', 'Grip Strength'],
    equipment: 'No Equipment',
    difficulty: 'Advanced',
    type: 'Endurance',
    steps: [
      'Hang from a pull-up bar with an overhand grip.',
      'Keep legs straight or slightly bent at knees.',
      'Raise legs upward toward waist level using abs without swinging momentum.',
      'Lower back down slowly.',
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSec: 45,
    gradientColors: [Color(0xFF881337), Color(0xFF101918)],
  ),
  const ExerciseItem(
    id: 'ex-008',
    name: 'Dumbbell Bent-Over Row',
    category: 'Back',
    subMuscle: 'Upper Back & Rhomboids',
    secondaryMuscles: ['Biceps', 'Lats'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    type: 'Hypertrophy',
    steps: [
      'Hinge forward at hips with flat back, knees slightly bent.',
      'Hold dumbbells hanging straight down below shoulders.',
      'Row dumbbells toward your hips, driving elbows up toward the ceiling.',
      'Squeeze shoulder blades together at top.',
    ],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 75,
    gradientColors: [Color(0xFF1E293B), Color(0xFF064E3B)],
    trainerNote: 'Drive with elbows, not your biceps, to maximize lat engagement.',
  ),
];

class ExerciseLibraryView extends ConsumerStatefulWidget {
  const ExerciseLibraryView({super.key});

  @override
  ConsumerState<ExerciseLibraryView> createState() => _ExerciseLibraryViewState();
}

class _ExerciseLibraryViewState extends ConsumerState<ExerciseLibraryView> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCategory = 'All';
  String _selectedEquipment = 'All Equipment';
  String _selectedDifficulty = 'All Levels';
  String _selectedTab = 'all'; // 'all', 'favorites', 'recommended'

  final Set<String> _favorites = {'ex-001', 'ex-003'};
  final List<ExerciseItem> _workoutBasket = [];

  final List<String> _categories = [
    'All',
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Core',
    'Cardio',
    'Full Body',
  ];

  final List<String> _equipmentOptions = [
    'All Equipment',
    'No Equipment',
    'Dumbbells',
    'Barbell',
    'Cable',
    'Machine',
    'Kettlebell',
    'Resistance Band',
    'Smith Machine',
  ];

  final List<String> _difficultyOptions = [
    'All Levels',
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _toggleFavorite(String id) {
    setState(() {
      if (_favorites.contains(id)) {
        _favorites.remove(id);
      } else {
        _favorites.add(id);
      }
    });
  }

  void _toggleWorkoutBasket(ExerciseItem item) {
    setState(() {
      if (_workoutBasket.any((e) => e.id == item.id)) {
        _workoutBasket.removeWhere((e) => e.id == item.id);
      } else {
        _workoutBasket.add(item);
      }
    });
  }

  List<ExerciseItem> get _filteredExercises {
    return kExerciseDatabase.where((ex) {
      if (_selectedTab == 'favorites' && !_favorites.contains(ex.id)) {
        return false;
      }
      if (_selectedTab == 'recommended' && ex.trainerNote == null) {
        return false;
      }

      if (_selectedCategory != 'All' && ex.category != _selectedCategory) {
        return false;
      }
      if (_selectedEquipment != 'All Equipment' && ex.equipment != _selectedEquipment) {
        return false;
      }
      if (_selectedDifficulty != 'All Levels' && ex.difficulty != _selectedDifficulty) {
        return false;
      }

      if (_searchQuery.isNotEmpty) {
        final words = _searchQuery.toLowerCase().trim().split(' ');
        final fullString = '${ex.name} ${ex.category} ${ex.subMuscle} ${ex.equipment} ${ex.difficulty} ${ex.type}'
            .toLowerCase();
        final matches = words.every((word) => fullString.contains(word));
        if (!matches) return false;
      }

      return true;
    }).toList();
  }

  void _showExerciseDetail(ExerciseItem item) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final isFav = _favorites.contains(item.id);
            final inBasket = _workoutBasket.any((e) => e.id == item.id);

            return Container(
              height: MediaQuery.of(context).size.height * 0.88,
              decoration: const BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  // Top Animated Gradient Header
                  Container(
                    height: 180,
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: item.gradientColors,
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                    ),
                    child: SafeArea(
                      bottom: false,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.5),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.white24),
                                ),
                                child: Text(
                                  '${item.category.toUpperCase()} • ${item.subMuscle.toUpperCase()}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                              GestureDetector(
                                onTap: () => Navigator.pop(ctx),
                                child: Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.5),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.close_rounded, color: Colors.white, size: 18),
                                ),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.name,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -0.5,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${item.equipment} · ${item.difficulty} · ${item.type}',
                                style: const TextStyle(color: Colors.white70, fontSize: 13),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Detail Body
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(20),
                      children: [
                        // Target Muscles Card
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceSecondary,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'TARGET MUSCLES',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textSecondary,
                                  letterSpacing: 0.8,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 6,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppColors.primarySoft,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                                    ),
                                    child: Text(
                                      'Primary: ${item.subMuscle} (${item.category})',
                                      style: const TextStyle(
                                        color: AppColors.primaryDark,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ),
                                  ...item.secondaryMuscles.map(
                                    (m) => Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: AppColors.border),
                                      ),
                                      child: Text(
                                        'Secondary: $m',
                                        style: const TextStyle(
                                          color: AppColors.textSecondary,
                                          fontWeight: FontWeight.w500,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Prescribed Protocol Specs
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceSecondary,
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: AppColors.border),
                                ),
                                child: Column(
                                  children: [
                                    const Text('Sets', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${item.defaultSets} Sets',
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.text,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceSecondary,
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: AppColors.border),
                                ),
                                child: Column(
                                  children: [
                                    const Text('Reps', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${item.defaultReps} Reps',
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.text,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceSecondary,
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: AppColors.border),
                                ),
                                child: Column(
                                  children: [
                                    const Text('Rest', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${item.defaultRestSec}s',
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.text,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Trainer Callout Note: "Why am I doing this?"
                        if (item.trainerNote != null) ...[
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Row(
                                  children: [
                                    Icon(Icons.verified_rounded, size: 16, color: AppColors.primaryDark),
                                    SizedBox(width: 6),
                                    Text(
                                      'Why am I doing this? (Coach Arun\'s Note)',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.primaryDark,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  '"${item.trainerNote}"',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontStyle: FontStyle.italic,
                                    color: AppColors.textPrimary,
                                    height: 1.35,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Step-by-Step Instructions
                        const Text(
                          'How to Perform',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.text),
                        ),
                        const SizedBox(height: 10),
                        ...item.steps.asMap().entries.map((entry) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(
                                    color: AppColors.primarySoft,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '${entry.key + 1}',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.primaryDark,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    entry.value,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: AppColors.textSecondary,
                                      height: 1.4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),

                  // Bottom Action Buttons
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      border: Border(top: BorderSide(color: AppColors.border)),
                    ),
                    child: SafeArea(
                      top: false,
                      child: Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () {
                                _toggleFavorite(item.id);
                                setModalState(() {});
                              },
                              icon: Icon(
                                isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                                color: isFav ? AppColors.error : AppColors.textSecondary,
                                size: 18,
                              ),
                              label: Text(
                                isFav ? 'Favorited' : 'Favorite',
                                style: TextStyle(
                                  color: isFav ? AppColors.error : AppColors.text,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 13,
                                ),
                              ),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                side: BorderSide(
                                  color: isFav ? AppColors.error.withValues(alpha: 0.3) : AppColors.border,
                                ),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            flex: 2,
                            child: ElevatedButton.icon(
                              onPressed: () {
                                _toggleWorkoutBasket(item);
                                setModalState(() {});
                              },
                              icon: Icon(
                                inBasket ? Icons.check_circle_rounded : Icons.add_rounded,
                                color: Colors.white,
                                size: 18,
                              ),
                              label: Text(
                                inBasket ? 'In Workout Plan' : 'Add to Workout',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 13,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: inBasket ? AppColors.primaryDark : AppColors.primary,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                elevation: 0,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showWorkoutBuilder() {
    final workoutNameCtrl = TextEditingController(text: 'My Custom Routine');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setBuilderState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.bolt_rounded, color: AppColors.primary, size: 24),
                          SizedBox(width: 8),
                          Text(
                            'Workout Builder',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.text,
                            ),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: () => Navigator.pop(ctx),
                        child: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Workout Routine Name',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: workoutNameCtrl,
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: AppColors.surfaceSecondary,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppColors.border),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppColors.border),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Selected Exercises (${_workoutBasket.length})',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 8),
                  Expanded(
                    child: _workoutBasket.isEmpty
                        ? const Center(
                            child: Text(
                              'No exercises selected.\nTap "+ Add to Workout" on any exercise card.',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                            ),
                          )
                        : ListView.separated(
                            itemCount: _workoutBasket.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 8),
                            itemBuilder: (context, index) {
                              final ex = _workoutBasket[index];
                              return Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceSecondary,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppColors.border),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 24,
                                      height: 24,
                                      decoration: BoxDecoration(
                                        color: AppColors.primarySoft,
                                        shape: BoxShape.circle,
                                        border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                                      ),
                                      child: Center(
                                        child: Text(
                                          '${index + 1}',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: AppColors.primaryDark,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            ex.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.w700,
                                              fontSize: 13,
                                              color: AppColors.text,
                                            ),
                                          ),
                                          Text(
                                            '${ex.defaultSets} sets · ${ex.defaultReps} reps',
                                            style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                          ),
                                        ],
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.remove_circle_outline_rounded,
                                          color: AppColors.error, size: 20),
                                      onPressed: () {
                                        setState(() {
                                          _workoutBasket.removeAt(index);
                                        });
                                        setBuilderState(() {});
                                      },
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _workoutBasket.isEmpty
                          ? null
                          : () {
                              Navigator.pop(ctx);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: AppColors.primaryDark,
                                  content: Row(
                                    children: [
                                      const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: Text(
                                          'Workout "${workoutNameCtrl.text}" saved to My Workouts!',
                                          style: const TextStyle(fontWeight: FontWeight.w700),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                              setState(() {
                                _workoutBasket.clear();
                              });
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text(
                        'Save & Create Workout',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final exercises = _filteredExercises;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Exercise Library',
          style: AppTypography.heading.copyWith(fontSize: 20, fontWeight: FontWeight.w800),
        ),
        actions: [
          if (_workoutBasket.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: GestureDetector(
                onTap: _showWorkoutBuilder,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withValues(alpha: 0.3),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.fitness_center_rounded, size: 14, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        '${_workoutBasket.length}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                  boxShadow: const [
                    BoxShadow(color: Color(0x05000000), blurRadius: 4, offset: Offset(0, 2)),
                  ],
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  decoration: InputDecoration(
                    hintText: "Search exercises... (e.g. 'chest dumbbell')",
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                    prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textMuted, size: 20),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? GestureDetector(
                            onTap: () {
                              _searchController.clear();
                              setState(() => _searchQuery = '');
                            },
                            child: const Icon(Icons.clear_rounded, color: AppColors.textMuted, size: 18),
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ),

            // 2. Horizontal Category Chips
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 6),
                itemBuilder: (context, index) {
                  final cat = _categories[index];
                  final isSelected = _selectedCategory == cat;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategory = cat),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primary : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppColors.primary : AppColors.border,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          cat,
                          style: TextStyle(
                            color: isSelected ? Colors.white : AppColors.textSecondary,
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 10),

            // 3. Dropdown Filters (Equipment & Difficulty) + Quick Tabs
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  // Equipment Dropdown
                  Expanded(
                    child: Container(
                      height: 34,
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedEquipment,
                          isExpanded: true,
                          icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: AppColors.textMuted),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.text),
                          items: _equipmentOptions
                              .map((eq) => DropdownMenuItem(value: eq, child: Text(eq, maxLines: 1)))
                              .toList(),
                          onChanged: (val) => setState(() => _selectedEquipment = val ?? 'All Equipment'),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Difficulty Dropdown
                  Expanded(
                    child: Container(
                      height: 34,
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedDifficulty,
                          isExpanded: true,
                          icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: AppColors.textMuted),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.text),
                          items: _difficultyOptions
                              .map((d) => DropdownMenuItem(value: d, child: Text(d, maxLines: 1)))
                              .toList(),
                          onChanged: (val) => setState(() => _selectedDifficulty = val ?? 'All Levels'),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // 4. Quick Segmented Filter Tabs
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceSecondary,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedTab = 'all'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          decoration: BoxDecoration(
                            color: _selectedTab == 'all' ? Colors.white : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: _selectedTab == 'all'
                                ? const [BoxShadow(color: Color(0x0A000000), blurRadius: 2, offset: Offset(0, 1))]
                                : null,
                          ),
                          child: Text(
                            'All (${kExerciseDatabase.length})',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: _selectedTab == 'all' ? FontWeight.w800 : FontWeight.w600,
                              color: _selectedTab == 'all' ? AppColors.text : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedTab = 'favorites'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          decoration: BoxDecoration(
                            color: _selectedTab == 'favorites' ? Colors.white : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: _selectedTab == 'favorites'
                                ? const [BoxShadow(color: Color(0x0A000000), blurRadius: 2, offset: Offset(0, 1))]
                                : null,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.favorite_rounded, size: 12, color: AppColors.error),
                              const SizedBox(width: 4),
                              Text(
                                'Favs (${_favorites.length})',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: _selectedTab == 'favorites' ? FontWeight.w800 : FontWeight.w600,
                                  color: _selectedTab == 'favorites' ? AppColors.text : AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedTab = 'recommended'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          decoration: BoxDecoration(
                            color: _selectedTab == 'recommended' ? Colors.white : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: _selectedTab == 'recommended'
                                ? const [BoxShadow(color: Color(0x0A000000), blurRadius: 2, offset: Offset(0, 1))]
                                : null,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.verified_rounded, size: 12, color: AppColors.primary),
                              const SizedBox(width: 4),
                              Text(
                                'Trainer Cues',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: _selectedTab == 'recommended' ? FontWeight.w800 : FontWeight.w600,
                                  color: _selectedTab == 'recommended' ? AppColors.text : AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),

            // 5. Exercise Cards List
            Expanded(
              child: exercises.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.fitness_center_rounded, size: 36, color: AppColors.textMuted),
                          const SizedBox(height: 10),
                          const Text(
                            'No exercises match your filters',
                            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                          ),
                          const SizedBox(height: 6),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _searchController.clear();
                                _searchQuery = '';
                                _selectedCategory = 'All';
                                _selectedEquipment = 'All Equipment';
                                _selectedDifficulty = 'All Levels';
                                _selectedTab = 'all';
                              });
                            },
                            child: const Text('Reset All Filters'),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      itemCount: exercises.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final ex = exercises[index];
                        final isFav = _favorites.contains(ex.id);
                        final inBasket = _workoutBasket.any((e) => e.id == ex.id);

                        return RepsiStaggerItem(
                          index: index,
                          child: GestureDetector(
                            onTap: () => _showExerciseDetail(ex),
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(color: AppColors.border),
                                boxShadow: const [
                                  BoxShadow(color: Color(0x06000000), blurRadius: 6, offset: Offset(0, 2)),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Visual Looping Demo Banner
                                  Container(
                                    height: 100,
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: ex.gradientColors,
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      ),
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                                    ),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        // Badge
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: Colors.black.withValues(alpha: 0.5),
                                            borderRadius: BorderRadius.circular(8),
                                            border: Border.all(color: Colors.white24),
                                          ),
                                          child: Text(
                                            '${ex.category.toUpperCase()} • ${ex.subMuscle.toUpperCase()}',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 10,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                              decoration: BoxDecoration(
                                                color: AppColors.primaryDark.withValues(alpha: 0.6),
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: const Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Icon(Icons.play_arrow_rounded, color: Colors.white, size: 12),
                                                  SizedBox(width: 3),
                                                  Text(
                                                    'Demo',
                                                    style: TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 10,
                                                      fontWeight: FontWeight.w700,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            GestureDetector(
                                              onTap: () => _toggleFavorite(ex.id),
                                              child: Container(
                                                width: 28,
                                                height: 28,
                                                decoration: BoxDecoration(
                                                  color: Colors.black.withValues(alpha: 0.4),
                                                  shape: BoxShape.circle,
                                                ),
                                                child: Icon(
                                                  isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                                                  color: isFav ? AppColors.error : Colors.white,
                                                  size: 16,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),

                                  // Card Content
                                  Padding(
                                    padding: const EdgeInsets.all(14),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Expanded(
                                              child: Text(
                                                ex.name,
                                                style: const TextStyle(
                                                  fontSize: 15,
                                                  fontWeight: FontWeight.w800,
                                                  color: AppColors.text,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: AppColors.surfaceSecondary,
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                ex.equipment,
                                                style: const TextStyle(
                                                  fontSize: 11,
                                                  color: AppColors.textSecondary,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: AppColors.surfaceSecondary,
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                ex.difficulty,
                                                style: const TextStyle(
                                                  fontSize: 11,
                                                  color: AppColors.textSecondary,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        if (ex.trainerNote != null) ...[
                                          const SizedBox(height: 8),
                                          Row(
                                            children: [
                                              const Icon(Icons.verified_rounded, size: 13, color: AppColors.primary),
                                              const SizedBox(width: 4),
                                              Expanded(
                                                child: Text(
                                                  'Coach Arun: "${ex.trainerNote}"',
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: const TextStyle(
                                                    fontSize: 11,
                                                    fontStyle: FontStyle.italic,
                                                    color: AppColors.primaryDark,
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                        const SizedBox(height: 12),
                                        const Divider(height: 1, color: AppColors.border),
                                        const SizedBox(height: 10),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              '${ex.defaultSets} sets · ${ex.defaultReps} reps',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w700,
                                                color: AppColors.textMuted,
                                              ),
                                            ),
                                            GestureDetector(
                                              onTap: () => _toggleWorkoutBasket(ex),
                                              child: Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                                decoration: BoxDecoration(
                                                  color: inBasket ? AppColors.primaryDark : AppColors.primarySoft,
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                                child: Row(
                                                  mainAxisSize: MainAxisSize.min,
                                                  children: [
                                                    Icon(
                                                      inBasket ? Icons.check_rounded : Icons.add_rounded,
                                                      size: 14,
                                                      color: inBasket ? Colors.white : AppColors.primaryDark,
                                                    ),
                                                    const SizedBox(width: 4),
                                                    Text(
                                                      inBasket ? 'Added' : 'Add to Workout',
                                                      style: TextStyle(
                                                        fontSize: 11,
                                                        fontWeight: FontWeight.w700,
                                                        color: inBasket ? Colors.white : AppColors.primaryDark,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _workoutBasket.isNotEmpty
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                border: const Border(top: BorderSide(color: AppColors.border)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 8,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${_workoutBasket.length} Exercises Selected',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppColors.text,
                            ),
                          ),
                          const Text(
                            'Ready to build custom workout routine',
                            style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: _showWorkoutBuilder,
                      icon: const Icon(Icons.bolt_rounded, color: Colors.white, size: 18),
                      label: const Text(
                        'Build Workout',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}
