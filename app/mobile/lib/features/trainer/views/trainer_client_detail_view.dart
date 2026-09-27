import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';
import 'trainer_create_workout_view.dart';
import 'trainer_diet_plan_view.dart';
import '../../member/presentation/views/trainer_chat_view.dart';

class TrainerClientDetailView extends StatefulWidget {
  final Map<String, String> client;

  const TrainerClientDetailView({super.key, required this.client});

  @override
  State<TrainerClientDetailView> createState() => _TrainerClientDetailViewState();
}

class _TrainerClientDetailViewState extends State<TrainerClientDetailView> {
  int _selectedTab = 0;
  final List<String> _tabs = ['Overview', 'Workout', 'Diet', 'Progress'];

  @override
  Widget build(BuildContext context) {
    final clientName = widget.client['name'] ?? 'Rahul Sharma';
    final goal = widget.client['goal'] ?? 'Weight loss';
    final weight = widget.client['weight'] ?? '78.4 kg';
    final attendance = widget.client['attendance'] ?? '82%';
    final nextSession = widget.client['nextSession'] ?? 'Today • 6 PM';
    final plan = widget.client['plan'] ?? 'Gold Membership';

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
          'Client Profile',
          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.text),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const TrainerChatView()),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 12,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Client Header Card
              RepsiStaggerItem(
                index: 0,
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: AppColors.primarySoft,
                      child: Text(
                        clientName[0],
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primaryDark,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                clientName,
                                style: AppTypography.heading.copyWith(
                                  fontSize: 19,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.text,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.primarySoft,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'Active',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.primaryDark,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '$plan · Indiranagar Hub',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Tabs: Overview | Workout | Diet | Progress
              RepsiStaggerItem(
                index: 1,
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  padding: const EdgeInsets.all(3),
                  child: Row(
                    children: List.generate(_tabs.length, (index) {
                      final isSelected = _selectedTab == index;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () {
                            HapticFeedback.selectionClick();
                            setState(() => _selectedTab = index);
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.primarySoft : Colors.transparent,
                              borderRadius: BorderRadius.circular(9),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              _tabs[index],
                              style: AppTypography.caption.copyWith(
                                color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Tab Content
              if (_selectedTab == 0) _buildOverviewTab(goal, weight, attendance, nextSession),
              if (_selectedTab == 1) _buildWorkoutTab(),
              if (_selectedTab == 2) _buildDietTab(),
              if (_selectedTab == 3) _buildProgressTab(),

              const SizedBox(height: 24),

              // Actions: Assign Workout & Assign Diet Plan & Message
              RepsiStaggerItem(
                index: 4,
                child: Column(
                  children: [
                    RepsiButton(
                      text: 'Assign Workout Plan',
                      leadingIcon: const Icon(Icons.fitness_center_rounded, size: 18),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const TrainerCreateWorkoutView()),
                        );
                      },
                      isFullWidth: true,
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: RepsiButton(
                            text: 'Assign Diet',
                            variant: RepsiButtonVariant.outline,
                            leadingIcon: const Icon(Icons.restaurant_menu_rounded, size: 18),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const TrainerDietPlanView()),
                              );
                            },
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: RepsiButton(
                            text: 'Open Chat',
                            variant: RepsiButtonVariant.outline,
                            leadingIcon: const Icon(Icons.chat_bubble_outline_rounded, size: 18),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const TrainerChatView()),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewTab(String goal, String weight, String attendance, String nextSession) {
    return Column(
      children: [
        // 4 Core Spec KPI Cards
        Row(
          children: [
            Expanded(
              child: RepsiCard(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Goal', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(
                      goal,
                      style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: RepsiCard(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Weight', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          weight,
                          style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.arrow_downward_rounded, size: 14, color: AppColors.primary),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: RepsiCard(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Attendance', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(
                      attendance,
                      style: AppTypography.headingSmall.copyWith(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryDark,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: RepsiCard(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Next Session', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(
                      nextSession,
                      style: AppTypography.headingSmall.copyWith(fontSize: 14, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Session Note
        RepsiCard(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Trainer Notes',
                    style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, color: AppColors.text),
                  ),
                  const Text('Updated Yesterday', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'Focusing on compound pressing volume. Increased bench press working set to 60 kg x 10 reps. Client feeling high energy, recovery on track.',
                style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary, height: 1.4),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildWorkoutTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RepsiCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Active Plan: Upper Body A',
                    style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: AppColors.primarySoft, borderRadius: BorderRadius.circular(6)),
                    child: const Text('Week 3 of 6', style: TextStyle(color: AppColors.primaryDark, fontSize: 11, fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _buildExerciseItem('1. Bench Press', '4 sets × 10 reps', '60 kg · Rest: 90s'),
              _buildExerciseItem('2. Lat Pulldown', '3 sets × 12 reps', '45 kg · Rest: 60s'),
              _buildExerciseItem('3. Shoulder Press', '3 sets × 10 reps', '20 kg · Rest: 60s'),
              _buildExerciseItem('4. Incline Dumbbell Curl', '3 sets × 12 reps', '12.5 kg · Rest: 45s'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildExerciseItem(String name, String sets, String weight) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: AppTypography.body.copyWith(fontWeight: FontWeight.w600, fontSize: 13)),
              Text(sets, style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12)),
            ],
          ),
          Text(weight, style: AppTypography.caption.copyWith(color: AppColors.primaryDark, fontWeight: FontWeight.w600, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildDietTab() {
    return Column(
      children: [
        RepsiCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Nutrition Plan: Fat Loss', style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700)),
                  const Text('2,100 kcal', style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.primaryDark, fontSize: 15)),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _macroBadge('Protein', '150g', const Color(0xFF3B82F6)),
                  _macroBadge('Carbs', '220g', const Color(0xFFF59E0B)),
                  _macroBadge('Fat', '65g', const Color(0xFFEC4899)),
                ],
              ),
              const SizedBox(height: 14),
              const Divider(height: 1, color: AppColors.border),
              const SizedBox(height: 10),
              _buildMealRow('Breakfast', 'Oats + Eggs (450 kcal)'),
              _buildMealRow('Lunch', 'Chicken Rice Bowl (650 kcal)'),
              _buildMealRow('Snack', 'Greek Yogurt & Almonds (220 kcal)'),
              _buildMealRow('Dinner', 'Paneer Stir-fry (550 kcal)'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _macroBadge(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontWeight: FontWeight.w700, color: color, fontSize: 14)),
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
      ],
    );
  }

  Widget _buildMealRow(String meal, String items) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(meal, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
          Text(items, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildProgressTab() {
    return Column(
      children: [
        RepsiCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Weight Trend', style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('Start: 83.2 kg (Aug 1)', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  Text('Now: 78.4 kg (↓ 4.8 kg)', style: TextStyle(color: AppColors.primaryDark, fontWeight: FontWeight.w700, fontSize: 13)),
                ],
              ),
              const SizedBox(height: 16),
              Text('Body Measurements', style: AppTypography.headingSmall.copyWith(fontSize: 14, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: const [
                  _MeasurementItem(label: 'Chest', value: '102 cm'),
                  _MeasurementItem(label: 'Waist', value: '84 cm'),
                  _MeasurementItem(label: 'Arms', value: '35 cm'),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _MeasurementItem extends StatelessWidget {
  final String label;
  final String value;
  const _MeasurementItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.text)),
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
      ],
    );
  }
}
