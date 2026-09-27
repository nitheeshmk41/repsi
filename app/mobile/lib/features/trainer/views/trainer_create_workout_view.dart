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
  final _nameController = TextEditingController(text: 'Upper Body A');
  final _notesController = TextEditingController(text: 'Focus on explosive concentric, controlled 3-second eccentric.');
  bool _saveAsTemplate = true;

  final List<Map<String, dynamic>> _exercises = [
    {
      'name': 'Bench Press',
      'sets': 4,
      'reps': 10,
      'weight': '60 kg',
      'rest': '90s',
      'tempo': '3-0-1-0',
      'isSuperset': false,
      'notes': 'Keep scapulae retracted and feet pinned.',
    },
    {
      'name': 'Lat Pulldown',
      'sets': 3,
      'reps': 12,
      'weight': '45 kg',
      'rest': '60s',
      'tempo': '2-0-2-0',
      'isSuperset': false,
      'notes': 'Drive with elbows downwards.',
    },
    {
      'name': 'Shoulder Press',
      'sets': 3,
      'reps': 10,
      'weight': '20 kg',
      'rest': '60s',
      'tempo': '2-0-1-0',
      'isSuperset': false,
      'notes': 'Full extension at top without hyperextending lower back.',
    },
  ];

  final List<String> _libraryExercises = [
    'Incline Dumbbell Press',
    'Barbell Bent-Over Row',
    'Cable Bicep Curl',
    'Tricep Rope Pushdown',
    'Lateral Dumbbell Raise',
    'Barbell Squat',
    'Romanian Deadlift',
    'Hanging Leg Raise',
    'Plank to Push-Up',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _notesController.dispose();
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

  void _showAddExerciseSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.7,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Exercise Library',
                    style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.separated(
                  itemCount: _libraryExercises.length,
                  separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.border),
                  itemBuilder: (context, idx) {
                    final exName = _libraryExercises[idx];
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primarySoft,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.fitness_center_rounded, color: AppColors.primaryDark, size: 20),
                      ),
                      title: Text(exName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                      subtitle: const Text('Compound · Hypertrophy', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                      trailing: const Icon(Icons.add_circle_outline_rounded, color: AppColors.primary),
                      onTap: () {
                        setState(() {
                          _exercises.add({
                            'name': exName,
                            'sets': 3,
                            'reps': 12,
                            'weight': '30 kg',
                            'rest': '60s',
                            'tempo': '2-0-1-0',
                            'isSuperset': false,
                            'notes': 'Form over ego weight.',
                          });
                        });
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Added $exName to workout')),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAssignModal() {
    final clients = ['Rahul Sharma', 'Priya Nair', 'Arjun Nair', 'Sneha Rao'];
    String selectedClient = clients[0];

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (dialogCtx, setDialogState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Text('Assign to Client', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Assign "${_nameController.text}" to:', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  const SizedBox(height: 12),
                  ...clients.map((c) {
                    final isSel = selectedClient == c;
                    return InkWell(
                      onTap: () => setDialogState(() => selectedClient = c),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          children: [
                            Icon(
                              isSel ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                              color: isSel ? AppColors.primary : AppColors.textMuted,
                              size: 20,
                            ),
                            const SizedBox(width: 10),
                            Text(c, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel'),
                ),
                RepsiButton(
                  text: 'Assign Now',
                  size: RepsiButtonSize.small,
                  onPressed: () {
                    Navigator.pop(ctx);
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Upper Body A successfully assigned to $selectedClient!'),
                        backgroundColor: AppColors.primary,
                      ),
                    );
                  },
                ),
              ],
            );
          },
        );
      },
    );
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
          'Workout Builder',
          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: _showAssignModal,
            child: const Text(
              'Assign',
              style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700),
            ),
          ),
        ],
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
              // Workout Title
              RepsiStaggerItem(
                index: 0,
                child: RepsiTextField(
                  label: 'Program Title',
                  controller: _nameController,
                  prefixIcon: const Icon(Icons.fitness_center_rounded, size: 20, color: AppColors.primary),
                ),
              ),
              const SizedBox(height: 14),

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
                    TextButton.icon(
                      onPressed: _showAddExerciseSheet,
                      icon: const Icon(Icons.add_rounded, size: 18, color: AppColors.primary),
                      label: const Text(
                        'Add Exercise',
                        style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),

              // Reorderable Exercise List
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
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: AppColors.primarySoft,
                                    borderRadius: BorderRadius.circular(8),
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
                                        '${ex['sets']} sets × ${ex['reps']} reps · ${ex['weight']}',
                                        style: AppTypography.caption.copyWith(
                                          color: AppColors.primaryDark,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Row(
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline_rounded, size: 20, color: AppColors.textMuted),
                                      onPressed: () {
                                        setState(() {
                                          _exercises.removeAt(index);
                                        });
                                      },
                                    ),
                                    const Icon(Icons.drag_indicator_rounded, color: AppColors.textMuted),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceSubtle,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Rest: ${ex['rest']}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                  Text('Tempo: ${ex['tempo']}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                  Text(
                                    ex['notes'] as String,
                                    style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontStyle: FontStyle.italic),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Bottom Template & Assign Controls
              RepsiStaggerItem(
                index: 2,
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Save as Gym Template',
                          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.text),
                        ),
                        Switch(
                          value: _saveAsTemplate,
                          activeTrackColor: AppColors.primary,
                          onChanged: (val) => setState(() => _saveAsTemplate = val),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    RepsiButton(
                      text: 'Assign to Client',
                      leadingIcon: const Icon(Icons.person_add_alt_1_rounded, size: 20),
                      onPressed: _showAssignModal,
                      isFullWidth: true,
                      size: RepsiButtonSize.large,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
