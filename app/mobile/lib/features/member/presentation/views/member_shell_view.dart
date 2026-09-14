import 'package:flutter/material.dart';

import 'exercise_library_view.dart';
import 'gym_machines_view.dart';
import 'member_home_view.dart';
import 'member_profile_view.dart';
import 'membership_payments_view.dart';
import 'progress_dashboard_view.dart';
import 'qr_attendance_view.dart';
import 'running_tracker_view.dart';
import 'trainer_chat_view.dart';
import 'workout_dashboard_view.dart';

class MemberShellView extends StatefulWidget {
  const MemberShellView({super.key});

  @override
  State<MemberShellView> createState() => _MemberShellViewState();
}

class _MemberShellViewState extends State<MemberShellView> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    MemberHomeView(),
    WorkoutDashboardView(),
    ProgressDashboardView(),
    RunningTrackerView(),
    MemberProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const QrAttendanceView()),
          );
        },
        backgroundColor: theme.primaryColor,
        child: const Icon(Icons.qr_code_scanner, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8.0,
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.home_rounded, 'Home'),
              _buildNavItem(1, Icons.fitness_center_rounded, 'Workout'),
              _buildNavItem(2, Icons.insights_rounded, 'Progress'),
              const SizedBox(width: 32), // Spacer for Floating QR button
              _buildNavItem(3, Icons.directions_run_rounded, 'Activity'),
              _buildNavItem(4, Icons.person_rounded, 'Profile'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    final theme = Theme.of(context);

    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected ? theme.primaryColor : Colors.grey,
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? theme.primaryColor : Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}
