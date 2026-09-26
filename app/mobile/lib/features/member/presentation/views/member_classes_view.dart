import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_stagger.dart';
import '../../../../shared/widgets/repsi_card.dart';

class MemberClassesView extends StatefulWidget {
  const MemberClassesView({super.key});

  @override
  State<MemberClassesView> createState() => _MemberClassesViewState();
}

class _MemberClassesViewState extends State<MemberClassesView> {
  int _selectedDayIndex = 0;

  final List<Map<String, String>> _days = const [
    {'day': 'Mon', 'date': '22'},
    {'day': 'Tue', 'date': '23'},
    {'day': 'Wed', 'date': '24'},
    {'day': 'Thu', 'date': '25'},
    {'day': 'Fri', 'date': '26'},
  ];

  final List<Map<String, dynamic>> _classes = [
    {'name': 'Strength Training', 'time': '6:30 PM', 'trainer': 'Arun', 'booked': false},
    {'name': 'Yoga', 'time': '7:30 PM', 'trainer': 'Priya', 'booked': false},
    {'name': 'Zumba', 'time': '6:00 PM', 'trainer': 'Priya', 'booked': false},
    {'name': 'HIIT', 'time': '7:30 PM', 'trainer': 'Arun', 'booked': false},
  ];

  void _toggleBook(int index) {
    HapticFeedback.lightImpact();
    setState(() {
      _classes[index]['booked'] = !(_classes[index]['booked'] as bool);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Classes',
          style: AppTypography.heading.copyWith(
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
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
              // 1. Date Selector Pills (Mon 22, Tue 23, Wed 24, etc.)
              RepsiStaggerItem(
                index: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(_days.length, (index) {
                    final day = _days[index];
                    final isSelected = _selectedDayIndex == index;

                    return GestureDetector(
                      onTap: () {
                        HapticFeedback.selectionClick();
                        setState(() => _selectedDayIndex = index);
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: 58,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary : Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? AppColors.primary : AppColors.border,
                            width: 1,
                          ),
                        ),
                        child: Column(
                          children: [
                            Text(
                              day['day']!,
                              style: AppTypography.caption.copyWith(
                                color: isSelected ? Colors.white : AppColors.textSecondary,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              day['date']!,
                              style: AppTypography.headingSmall.copyWith(
                                color: isSelected ? Colors.white : AppColors.text,
                                fontWeight: FontWeight.w700,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ),
              ),
              const SizedBox(height: 24),

              // 2. Class Cards (Mockup Screen 6)
              ...List.generate(_classes.length, (index) {
                final cls = _classes[index];
                final isBooked = cls['booked'] as bool;

                return RepsiStaggerItem(
                  index: index + 1,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: RepsiCard(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  cls['name'] as String,
                                  style: AppTypography.headingSmall.copyWith(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.text,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${cls['time']} · ${cls['trainer']}',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.textSecondary,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Animated Book Button: Book -> Booked ✓
                          GestureDetector(
                            onTap: () => _toggleBook(index),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 250),
                              curve: Curves.easeOutCubic,
                              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                              decoration: BoxDecoration(
                                color: isBooked ? AppColors.primarySoft : AppColors.primary,
                                borderRadius: BorderRadius.circular(12),
                                border: isBooked
                                    ? Border.all(color: AppColors.primary, width: 1.2)
                                    : null,
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    isBooked ? 'Booked' : 'Book',
                                    style: AppTypography.buttonSmall.copyWith(
                                      color: isBooked ? AppColors.primaryDark : Colors.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  if (isBooked) ...[
                                    const SizedBox(width: 4),
                                    const Icon(
                                      Icons.check_rounded,
                                      size: 16,
                                      color: AppColors.primaryDark,
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
