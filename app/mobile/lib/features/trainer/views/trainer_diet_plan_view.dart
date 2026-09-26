import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';

class TrainerDietPlanView extends StatefulWidget {
  const TrainerDietPlanView({super.key});

  @override
  State<TrainerDietPlanView> createState() => _TrainerDietPlanViewState();
}

class _TrainerDietPlanViewState extends State<TrainerDietPlanView> {
  int _selectedTab = 0;

  final List<Map<String, String>> _meals = const [
    {'meal': 'Breakfast', 'items': 'Oats + Eggs', 'calories': '450 kcal'},
    {'meal': 'Lunch', 'items': 'Rice + Chicken', 'calories': '650 kcal'},
    {'meal': 'Snack', 'items': 'Fruits + Nuts', 'calories': '220 kcal'},
    {'meal': 'Dinner', 'items': 'Rice + Paneer', 'calories': '550 kcal'},
  ];

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
          'Diet Plan',
          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
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
              // Tabs: Plan | Nutrition (Trainer Mockup Screen 5)
              RepsiStaggerItem(
                index: 0,
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  padding: const EdgeInsets.all(3),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedTab = 0),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            decoration: BoxDecoration(
                              color: _selectedTab == 0 ? AppColors.primarySoft : Colors.transparent,
                              borderRadius: BorderRadius.circular(9),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'Plan',
                              style: AppTypography.caption.copyWith(
                                color: _selectedTab == 0 ? AppColors.primaryDark : AppColors.textSecondary,
                                fontWeight: _selectedTab == 0 ? FontWeight.w700 : FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedTab = 1),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            decoration: BoxDecoration(
                              color: _selectedTab == 1 ? AppColors.primarySoft : Colors.transparent,
                              borderRadius: BorderRadius.circular(9),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'Nutrition',
                              style: AppTypography.caption.copyWith(
                                color: _selectedTab == 1 ? AppColors.primaryDark : AppColors.textSecondary,
                                fontWeight: _selectedTab == 1 ? FontWeight.w700 : FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Meal cards
              Expanded(
                child: ListView.separated(
                  itemCount: _meals.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final meal = _meals[index];

                    return RepsiStaggerItem(
                      index: index + 1,
                      child: RepsiCard(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: AppColors.primarySoft,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.restaurant_rounded,
                                size: 20,
                                color: AppColors.primaryDark,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    meal['meal']!,
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 12,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    meal['items']!,
                                    style: AppTypography.headingSmall.copyWith(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.text,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              meal['calories']!,
                              style: AppTypography.caption.copyWith(
                                color: AppColors.textMuted,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Water Target Indicator
              RepsiCard(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Row(
                  children: [
                    const Icon(Icons.water_drop_rounded, color: Color(0xFF3B82F6), size: 24),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Target Water Intake',
                        style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600),
                      ),
                    ),
                    Text(
                      '3L / day',
                      style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Save Plan Button
              RepsiButton(
                text: 'Save Plan',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Diet plan saved and assigned!'),
                      backgroundColor: AppColors.primary,
                    ),
                  );
                  Navigator.pop(context);
                },
                isFullWidth: true,
                size: RepsiButtonSize.large,
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
