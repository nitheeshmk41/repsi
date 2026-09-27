import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
  final String _clientName = 'Rahul Sharma';
  final String _goal = 'Fat Loss';
  final int _calories = 2100;
  final int _protein = 150;
  final int _carbs = 220;
  final int _fat = 65;

  final List<Map<String, dynamic>> _meals = [
    {
      'meal': 'Breakfast',
      'time': '08:00 AM',
      'items': 'Rolled Oats (60g) with 1 scoop Whey Isolate, 3 boiled egg whites, 50g berries',
      'calories': '450 kcal',
      'protein': '38g',
      'carbs': '55g',
      'fat': '8g',
    },
    {
      'meal': 'Lunch',
      'time': '01:00 PM',
      'items': 'Grilled Chicken Breast (180g) or Grilled Paneer (150g), 1 cup Brown Rice, Steamed Broccoli',
      'calories': '650 kcal',
      'protein': '52g',
      'carbs': '70g',
      'fat': '18g',
    },
    {
      'meal': 'Snacks (Pre-Workout)',
      'time': '05:00 PM',
      'items': '1 Medium Banana, Greek Yogurt (100g), 10 Almonds',
      'calories': '280 kcal',
      'protein': '16g',
      'carbs': '38g',
      'fat': '9g',
    },
    {
      'meal': 'Dinner',
      'time': '08:30 PM',
      'items': 'Tofu / Fish Fillet (160g), Quinoa Bowl, Mixed sautéed bell peppers & spinach',
      'calories': '550 kcal',
      'protein': '44g',
      'carbs': '57g',
      'fat': '16g',
    },
    {
      'meal': 'Post-Workout Fuel',
      'time': 'Optional',
      'items': 'Coconut water (250ml) or BCAA electrolyte hydration',
      'calories': '170 kcal',
      'protein': '0g',
      'carbs': '40g',
      'fat': '0g',
    },
  ];

  void _showAddCustomFoodDialog() {
    final foodCtrl = TextEditingController();
    final calCtrl = TextEditingController(text: '200');
    final pCtrl = TextEditingController(text: '15');
    final cCtrl = TextEditingController(text: '20');
    final fCtrl = TextEditingController(text: '5');

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Add Food Item', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: foodCtrl,
                  decoration: const InputDecoration(labelText: 'Food description (e.g., Boiled Egg)'),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: calCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Calories (kcal)'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: pCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Protein (g)'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            RepsiButton(
              text: 'Add to Plan',
              size: RepsiButtonSize.small,
              onPressed: () {
                if (foodCtrl.text.isNotEmpty) {
                  setState(() {
                    _meals.add({
                      'meal': 'Custom Snack',
                      'time': 'Anytime',
                      'items': foodCtrl.text,
                      'calories': '${calCtrl.text} kcal',
                      'protein': '${pCtrl.text}g',
                      'carbs': '${cCtrl.text}g',
                      'fat': '${fCtrl.text}g',
                    });
                  });
                }
                Navigator.pop(ctx);
              },
            ),
          ],
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
          'Nutrition Plan',
          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.text),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Nutrition Plan link copied')),
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
              // Client & Goal Banner
              RepsiStaggerItem(
                index: 0,
                child: RepsiCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _clientName,
                                style: AppTypography.headingSmall.copyWith(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.text,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Goal: $_goal',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.primaryDark,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'Target: $_calories kcal',
                              style: const TextStyle(
                                color: AppColors.primaryDark,
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(height: 1, color: AppColors.border),
                      const SizedBox(height: 10),

                      // Macro Distribution Bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildMacroPill('Protein', '${_protein}g', const Color(0xFF3B82F6)),
                          _buildMacroPill('Carbs', '${_carbs}g', const Color(0xFFF59E0B)),
                          _buildMacroPill('Fat', '${_fat}g', const Color(0xFFEC4899)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Disclaimer
              RepsiStaggerItem(
                index: 1,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFFDE68A)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, size: 16, color: Color(0xFFB45309)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'General fitness & training nutrition guidance. Not medical dietary advice.',
                          style: AppTypography.caption.copyWith(
                            color: const Color(0xFF92400E),
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Meal Plan Title & Add Food Button
              RepsiStaggerItem(
                index: 2,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Daily Meal Schedule',
                      style: AppTypography.sectionHeading.copyWith(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    TextButton.icon(
                      onPressed: _showAddCustomFoodDialog,
                      icon: const Icon(Icons.add_rounded, size: 18, color: AppColors.primary),
                      label: const Text(
                        'Add Food',
                        style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),

              // Meal cards
              ...List.generate(_meals.length, (index) {
                final meal = _meals[index];
                return RepsiStaggerItem(
                  index: 3 + index,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: RepsiCard(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                                    child: const Icon(Icons.restaurant_rounded, size: 16, color: AppColors.primaryDark),
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    meal['meal'] as String,
                                    style: AppTypography.headingSmall.copyWith(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.text,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                meal['calories'] as String,
                                style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.primaryDark, fontSize: 13),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            meal['items'] as String,
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                              height: 1.35,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceSubtle,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'P: ${meal['protein']}  ·  C: ${meal['carbs']}  ·  F: ${meal['fat']}  ·  Timing: ${meal['time']}',
                              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),

              const SizedBox(height: 14),

              // Send to Client Button
              RepsiStaggerItem(
                index: 10,
                child: Column(
                  children: [
                    RepsiButton(
                      text: 'Send Plan for Client Acknowledgement',
                      leadingIcon: const Icon(Icons.send_rounded, size: 18),
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Nutrition Plan sent to $_clientName!'),
                            backgroundColor: AppColors.primary,
                          ),
                        );
                      },
                      isFullWidth: true,
                      size: RepsiButtonSize.large,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Client will receive a push notification to review & acknowledge macros.',
                      textAlign: TextAlign.center,
                      style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
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

  Widget _buildMacroPill(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w800,
            fontSize: 15,
          ),
        ),
        Text(
          label,
          style: AppTypography.caption.copyWith(
            color: AppColors.textSecondary,
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}
