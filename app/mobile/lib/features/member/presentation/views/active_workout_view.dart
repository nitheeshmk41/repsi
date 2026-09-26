import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_press.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';

class ActiveWorkoutView extends StatefulWidget {
  const ActiveWorkoutView({super.key});

  @override
  State<ActiveWorkoutView> createState() => _ActiveWorkoutViewState();
}

class _ActiveWorkoutViewState extends State<ActiveWorkoutView> {
  int _activeSet = 1;
  final int _totalSets = 4;
  int _weight = 60;
  int _reps = 10;
  bool _isWeightMode = true;

  final List<bool> _completedSets = [false, false, false, false];
  bool _isCompleting = false;

  void _onCompleteSet() {
    if (_activeSet > _totalSets) return;
    HapticFeedback.lightImpact();

    setState(() {
      _isCompleting = true;
    });

    Future.delayed(const Duration(milliseconds: 350), () {
      if (mounted) {
        setState(() {
          _completedSets[_activeSet - 1] = true;
          _isCompleting = false;
          if (_activeSet < _totalSets) {
            _activeSet++;
          }
        });
      }
    });
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
        title: Column(
          children: [
            Text(
              'Bench Press',
              style: AppTypography.heading.copyWith(
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Set $_activeSet of $_totalSets',
              style: AppTypography.caption.copyWith(
                color: AppColors.textSecondary,
                fontSize: 13,
              ),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 16,
          ),
          child: Column(
            children: [
              // Weight / Reps Toggle Pill (Mockup Screen 4)
              Container(
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
                        onTap: () {
                          HapticFeedback.selectionClick();
                          setState(() => _isWeightMode = true);
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: _isWeightMode ? AppColors.primarySoft : Colors.transparent,
                            borderRadius: BorderRadius.circular(9),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Weight',
                            style: AppTypography.buttonSmall.copyWith(
                              color: _isWeightMode ? AppColors.primaryDark : AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          HapticFeedback.selectionClick();
                          setState(() => _isWeightMode = false);
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: !_isWeightMode ? AppColors.primarySoft : Colors.transparent,
                            borderRadius: BorderRadius.circular(9),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Reps',
                            style: AppTypography.buttonSmall.copyWith(
                              color: !_isWeightMode ? AppColors.primaryDark : AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Big interactive value counter
              RepsiCard(
                padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                child: Column(
                  children: [
                    Text(
                      _isWeightMode ? '$_weight kg' : '$_reps reps',
                      style: AppTypography.display.copyWith(
                        fontSize: 48,
                        fontWeight: FontWeight.w800,
                        color: AppColors.text,
                        letterSpacing: -1.0,
                      ),
                    ),
                    const SizedBox(height: 18),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Minus button
                        RepsiPress(
                          onTap: () {
                            setState(() {
                              if (_isWeightMode) {
                                if (_weight > 5) _weight -= 5;
                              } else {
                                if (_reps > 1) _reps--;
                              }
                            });
                          },
                          child: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.border, width: 1.5),
                              color: Colors.white,
                            ),
                            child: const Icon(Icons.remove_rounded, color: AppColors.text, size: 24),
                          ),
                        ),
                        const SizedBox(width: 32),
                        // Plus button
                        RepsiPress(
                          onTap: () {
                            setState(() {
                              if (_isWeightMode) {
                                _weight += 5;
                              } else {
                                _reps++;
                              }
                            });
                          },
                          child: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.primary,
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x3318B968),
                                  blurRadius: 10,
                                  offset: Offset(0, 4),
                                ),
                              ],
                            ),
                            child: const Icon(Icons.add_rounded, color: Colors.white, size: 24),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Complete Set Button (Mockup Screen 4)
              RepsiButton(
                text: _isCompleting ? 'Set Completed!' : 'Complete Set',
                leadingIcon: _isCompleting
                    ? const Icon(Icons.check_rounded, color: Colors.white, size: 22)
                    : null,
                onPressed: _onCompleteSet,
                isFullWidth: true,
                size: RepsiButtonSize.large,
              ),
              const SizedBox(height: 24),

              // Sets Checklist Table
              Expanded(
                child: ListView.separated(
                  itemCount: _totalSets,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final setNum = index + 1;
                    final isDone = _completedSets[index];
                    final isCurrent = setNum == _activeSet;

                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isCurrent ? AppColors.primary : AppColors.border,
                          width: isCurrent ? 1.5 : 1.0,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Set $setNum',
                            style: AppTypography.headingSmall.copyWith(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: AppColors.text,
                            ),
                          ),
                          Text(
                            '60 kg × 10',
                            style: AppTypography.body.copyWith(
                              fontSize: 14,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              color: isDone ? AppColors.primary : Colors.transparent,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isDone ? AppColors.primary : AppColors.border,
                                width: 1.5,
                              ),
                            ),
                            child: isDone
                                ? const Icon(Icons.check_rounded, size: 16, color: Colors.white)
                                : null,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
