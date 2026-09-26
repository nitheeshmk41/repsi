import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../member/presentation/views/qr_attendance_view.dart';

class AttendanceView extends StatefulWidget {
  const AttendanceView({super.key});

  @override
  State<AttendanceView> createState() => _AttendanceViewState();
}

class _AttendanceViewState extends State<AttendanceView> with SingleTickerProviderStateMixin {
  late AnimationController _progressController;
  late Animation<double> _progressAnimation;
  int _selectedTab = 0;

  final int _presentCount = 82;
  final int _totalCount = 186;

  final List<Map<String, String>> _presentMembers = [
    {'name': 'Rahul Kumar', 'time': '8:42 AM', 'plan': 'Premium'},
    {'name': 'Arun Kumar', 'time': '8:47 AM', 'plan': 'Trainer'},
    {'name': 'Sneha', 'time': '9:15 AM', 'plan': 'Premium'},
    {'name': 'Vijay', 'time': '9:30 AM', 'plan': 'Standard'},
  ];

  final List<Map<String, String>> _absentMembers = [
    {'name': 'Kavya', 'time': 'Not checked in', 'plan': 'Premium'},
    {'name': 'Arjun', 'time': 'Not checked in', 'plan': 'Standard'},
  ];

  @override
  void initState() {
    super.initState();
    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _progressAnimation = Tween<double>(
      begin: 0.0,
      end: _presentCount / _totalCount,
    ).animate(CurvedAnimation(parent: _progressController, curve: Curves.easeOutCubic));

    _progressController.forward();
  }

  @override
  void dispose() {
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Attendance',
          style: AppTypography.heading.copyWith(fontSize: 20, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 8,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Date Navigator: < Mon, 22 Sep 2025 > (Owner Mockup Screen 3)
              RepsiStaggerItem(
                index: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.chevron_left_rounded, color: AppColors.textSecondary),
                      onPressed: () {},
                    ),
                    Text(
                      'Mon, 22 Sep 2025',
                      style: AppTypography.headingSmall.copyWith(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Animated Circular Progress Ring Card
              RepsiStaggerItem(
                index: 1,
                child: RepsiCard(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      SizedBox(
                        width: 120,
                        height: 120,
                        child: AnimatedBuilder(
                          animation: _progressAnimation,
                          builder: (context, _) {
                            return Stack(
                              alignment: Alignment.center,
                              children: [
                                SizedBox(
                                  width: 120,
                                  height: 120,
                                  child: CircularProgressIndicator(
                                    value: _progressAnimation.value,
                                    strokeWidth: 10,
                                    backgroundColor: AppColors.border,
                                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
                                  ),
                                ),
                                Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      '$_presentCount / $_totalCount',
                                      style: AppTypography.headingSmall.copyWith(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.text,
                                      ),
                                    ),
                                    Text(
                                      'Present',
                                      style: AppTypography.caption.copyWith(
                                        color: AppColors.textSecondary,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18),

              // Present / Absent Tabs
              RepsiStaggerItem(
                index: 2,
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
                              'Present ($_presentCount)',
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
                              'Absent (${_totalCount - _presentCount})',
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
              const SizedBox(height: 16),

              // Member Attendance List
              Expanded(
                child: ListView.separated(
                  itemCount: _selectedTab == 0 ? _presentMembers.length : _absentMembers.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final item = _selectedTab == 0 ? _presentMembers[index] : _absentMembers[index];

                    return RepsiCard(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 18,
                            backgroundColor: _selectedTab == 0 ? AppColors.primarySoft : AppColors.surfaceSubtle,
                            child: Text(
                              item['name']![0],
                              style: TextStyle(
                                color: _selectedTab == 0 ? AppColors.primaryDark : AppColors.textSecondary,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item['name']!,
                                  style: AppTypography.headingSmall.copyWith(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.text,
                                  ),
                                ),
                                Text(
                                  item['plan']!,
                                  style: AppTypography.caption.copyWith(
                                    fontSize: 12,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            item['time']!,
                            style: AppTypography.caption.copyWith(
                              color: _selectedTab == 0 ? AppColors.primaryDark : AppColors.textMuted,
                              fontWeight: _selectedTab == 0 ? FontWeight.w600 : FontWeight.w400,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),

              // Scan QR button (Mockup Screen 3)
              RepsiButton(
                text: 'Scan QR',
                leadingIcon: const Icon(Icons.qr_code_scanner_rounded, size: 20),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const QrAttendanceView()),
                  );
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
