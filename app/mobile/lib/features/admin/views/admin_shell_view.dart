import 'package:flutter/material.dart';
import '../../../shared/models/user_model.dart';
import '../../../shared/navigation/repsi_bottom_nav.dart';
import 'admin_analytics_view.dart';
import 'admin_dashboard_view.dart';
import 'admin_gyms_view.dart';
import 'admin_more_view.dart';
import 'admin_users_view.dart';

class AdminShellView extends StatefulWidget {
  const AdminShellView({super.key});

  @override
  State<AdminShellView> createState() => _AdminShellViewState();
}

class _AdminShellViewState extends State<AdminShellView> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    AdminDashboardView(),
    AdminGymsView(),
    AdminUsersView(),
    AdminAnalyticsView(),
    AdminMoreView(),
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
        role: UserRole.admin,
      ),
    );
  }
}
