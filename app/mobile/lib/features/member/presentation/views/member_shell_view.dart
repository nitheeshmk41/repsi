import 'package:flutter/material.dart';
import '../../../../shared/models/user_model.dart';
import '../../../../shared/navigation/repsi_bottom_nav.dart';
import 'member_classes_view.dart';
import 'member_home_view.dart';
import 'member_profile_view.dart';
import 'progress_dashboard_view.dart';
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
    MemberClassesView(),
    MemberProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: RepsiBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        role: UserRole.user,
      ),
    );
  }
}
