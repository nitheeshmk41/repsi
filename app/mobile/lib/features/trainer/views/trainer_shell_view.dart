import 'package:flutter/material.dart';
import '../../../shared/models/user_model.dart';
import '../../../shared/navigation/repsi_bottom_nav.dart';
import 'trainer_clients_view.dart';
import 'trainer_create_workout_view.dart';
import 'trainer_home_view.dart';
import 'trainer_more_view.dart';
import 'trainer_sessions_view.dart';

class TrainerShellView extends StatefulWidget {
  const TrainerShellView({super.key});

  @override
  State<TrainerShellView> createState() => _TrainerShellViewState();
}

class _TrainerShellViewState extends State<TrainerShellView> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    TrainerHomeView(),
    TrainerClientsView(),
    TrainerSessionsView(),
    TrainerCreateWorkoutView(),
    TrainerMoreView(),
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
        role: UserRole.trainer,
      ),
    );
  }
}
