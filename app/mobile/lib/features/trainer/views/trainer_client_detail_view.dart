import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';
import 'trainer_create_workout_view.dart';
import 'trainer_diet_plan_view.dart';

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
    final clientName = widget.client['name'] ?? 'Rahul Kumar';

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
              // Client Header Card (Trainer Mockup Screen 3)
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
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          clientName,
                          style: AppTypography.heading.copyWith(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Member since Aug 2025',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Tabs
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
                          onTap: () => setState(() => _selectedTab = index),
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
              const SizedBox(height: 20),

              // Summary Stats (Membership, Goal, Weight, Body Fat)
              RepsiStaggerItem(
                index: 2,
                child: Column(
                  children: [
                    RepsiCard(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Membership', style: AppTypography.caption),
                              const SizedBox(height: 4),
                              Text('Premium Plan', style: AppTypography.headingSmall.copyWith(fontSize: 16)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              'Active',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.primaryDark,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    RepsiCard(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Fitness Goal', style: AppTypography.caption),
                              const SizedBox(height: 4),
                              Text('Muscle Gain', style: AppTypography.headingSmall.copyWith(fontSize: 16)),
                            ],
                          ),
                          const Icon(Icons.track_changes_rounded, color: AppColors.primary, size: 24),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: RepsiCard(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Weight', style: AppTypography.caption),
                                const SizedBox(height: 4),
                                Text('72.4 kg', style: AppTypography.headingSmall.copyWith(fontSize: 18, fontWeight: FontWeight.w700)),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: RepsiCard(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Body Fat', style: AppTypography.caption),
                                const SizedBox(height: 4),
                                Text('18.2%', style: AppTypography.headingSmall.copyWith(fontSize: 18, fontWeight: FontWeight.w700)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Action buttons (Assign Workout, Assign Diet, Log Session, Add Note)
              RepsiStaggerItem(
                index: 3,
                child: Column(
                  children: [
                    RepsiButton(
                      text: 'Assign Workout',
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
                    RepsiButton(
                      text: 'Assign Diet Plan',
                      variant: RepsiButtonVariant.outline,
                      leadingIcon: const Icon(Icons.restaurant_menu_rounded, size: 18),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const TrainerDietPlanView()),
                        );
                      },
                      isFullWidth: true,
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
}
