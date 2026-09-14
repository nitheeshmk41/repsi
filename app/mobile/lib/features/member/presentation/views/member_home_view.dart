import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/member_repository.dart';
import 'active_workout_view.dart';
import 'gym_machines_view.dart';
import 'membership_payments_view.dart';
import 'qr_attendance_view.dart';
import 'running_tracker_view.dart';
import 'trainer_chat_view.dart';

class MemberHomeView extends ConsumerWidget {
  const MemberHomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final todayWorkoutAsync = ref.watch(todayWorkoutProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: theme.primaryColor.withOpacity(0.2),
              child: Text(
                'N',
                style: TextStyle(
                  color: theme.primaryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Good morning, Nitheesh 👋',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Apex Fitness · Member',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('No new unread notifications.')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // TODAY'S WORKOUT HERO CARD
            todayWorkoutAsync.when(
              data: (workout) => Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                color: theme.primaryColor,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text(
                              "TODAY'S WORKOUT",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          const Text(
                            '~52 min',
                            style: TextStyle(color: Colors.white70, fontSize: 13),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        workout.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${workout.exercises.length} Exercises · Target: Chest, Shoulders, Arms',
                        style: const TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 16),
                      const Row(
                        children: [
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.all(Radius.circular(4)),
                              child: LinearProgressIndicator(
                                value: 0.5,
                                backgroundColor: Colors.white24,
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.amberAccent),
                                minHeight: 6,
                              ),
                            ),
                          ),
                          SizedBox(width: 12),
                          Text(
                            '50%',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: theme.primaryColor,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ActiveWorkoutView(workout: workout),
                              ),
                            );
                          },
                          child: const Text(
                            'CONTINUE WORKOUT',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (_, __) => const SizedBox(),
            ),

            const SizedBox(height: 20),

            // MEMBERSHIP STATUS CARD
            Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.card_membership_rounded,
                        color: Colors.green,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'Premium Membership',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Text(
                                  'ACTIVE',
                                  style: TextStyle(
                                    color: Colors.green,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            '24 days remaining · Expires 25 Oct 2026',
                            style: TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const MembershipPaymentsView(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // ATTENDANCE & STREAK
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.orange.withOpacity(0.3)),
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.local_fire_department, color: Colors.orange),
                            SizedBox(width: 6),
                            Text(
                              '12 DAY STREAK',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.orange,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Keep going! You check in 4x / week on average.',
                          style: TextStyle(fontSize: 12, color: Colors.black87),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // QUICK ACTIONS GRID
            const Text(
              'QUICK ACTIONS',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.1,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              children: [
                _buildQuickAction(
                  context,
                  Icons.qr_code_scanner_rounded,
                  'Scan QR',
                  Colors.blue,
                  () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const QrAttendanceView()),
                  ),
                ),
                _buildQuickAction(
                  context,
                  Icons.directions_run_rounded,
                  'Start Run',
                  Colors.green,
                  () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const RunningTrackerView()),
                  ),
                ),
                _buildQuickAction(
                  context,
                  Icons.precision_manufacturing_rounded,
                  'Machines',
                  Colors.purple,
                  () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const GymMachinesView()),
                  ),
                ),
                _buildQuickAction(
                  context,
                  Icons.chat_bubble_outline_rounded,
                  'Trainer Chat',
                  Colors.orange,
                  () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const TrainerChatView()),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // ASSIGNED TRAINER CARD
            Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 26,
                      backgroundColor: Colors.blueAccent,
                      child: Icon(Icons.person, color: Colors.white, size: 30),
                    ),
                    const SizedBox(width: 14),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Marcus Vance',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            'Head Strength Trainer · Apex Gym',
                            style: TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const TrainerChatView()),
                        );
                      },
                      icon: const Icon(Icons.chat, size: 16),
                      label: const Text('Chat'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction(
    BuildContext context,
    IconData icon,
    String label,
    Color color,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
