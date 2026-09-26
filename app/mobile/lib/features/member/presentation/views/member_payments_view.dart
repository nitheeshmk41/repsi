import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_stagger.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';

class MemberPaymentsView extends StatefulWidget {
  const MemberPaymentsView({super.key});

  @override
  State<MemberPaymentsView> createState() => _MemberPaymentsViewState();
}

class _MemberPaymentsViewState extends State<MemberPaymentsView> {
  int _selectedTab = 0;

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
          'Payments',
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
              // Tabs: Pending | History (Mockup Screen 8)
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
                              'Pending',
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
                              'History',
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

              // Amount Due Card (Mockup Screen 8)
              RepsiStaggerItem(
                index: 1,
                child: RepsiCard(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Amount Due', style: AppTypography.caption),
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: AppColors.warningSoft,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Icon(Icons.receipt_rounded, size: 14, color: AppColors.warning),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '₹1,999',
                        style: AppTypography.display.copyWith(
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          color: AppColors.text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Due on 24 Oct 2025',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 18),
                      RepsiButton(
                        text: 'Pay Now',
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Payment gateway opened')),
                          );
                        },
                        isFullWidth: true,
                        size: RepsiButtonSize.medium,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Recent Payments Section
              RepsiStaggerItem(
                index: 2,
                child: Text(
                  'Recent Payments',
                  style: AppTypography.sectionHeading.copyWith(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              RepsiStaggerItem(
                index: 3,
                child: Column(
                  children: [
                    _PaymentHistoryItem(
                      amount: '₹4,999',
                      title: 'Premium Plan',
                      date: '24 Aug 2025',
                    ),
                    const SizedBox(height: 10),
                    _PaymentHistoryItem(
                      amount: '₹1,999',
                      title: 'PT Session',
                      date: '10 Sep 2025',
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

class _PaymentHistoryItem extends StatelessWidget {
  final String amount;
  final String title;
  final String date;

  const _PaymentHistoryItem({
    required this.amount,
    required this.title,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    return RepsiCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                amount,
                style: AppTypography.headingSmall.copyWith(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                title,
                style: AppTypography.caption.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                ),
              ),
            ],
          ),
          Text(
            date,
            style: AppTypography.caption.copyWith(
              color: AppColors.textMuted,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
