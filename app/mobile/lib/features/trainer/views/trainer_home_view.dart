import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import 'trainer_client_detail_view.dart';
import 'trainer_create_workout_view.dart';
import 'trainer_diet_plan_view.dart';
import 'trainer_sessions_view.dart';
import '../../member/presentation/views/trainer_chat_view.dart';

class TrainerHomeView extends StatefulWidget {
  const TrainerHomeView({super.key});

  @override
  State<TrainerHomeView> createState() => _TrainerHomeViewState();
}

class _TrainerHomeViewState extends State<TrainerHomeView> {
  final List<Map<String, dynamic>> _todaySessions = [
    {
      'time': '09:00',
      'client': 'Rahul Sharma',
      'type': 'Weight Loss',
      'status': 'Confirmed',
      'statusColor': AppColors.primary,
      'isLive': true,
      'plan': 'Gold Membership',
      'weight': '78.4 kg',
      'attendance': '82%',
    },
    {
      'time': '10:00',
      'client': 'Priya Nair',
      'type': 'Strength',
      'status': 'Confirmed',
      'statusColor': AppColors.primary,
      'isLive': false,
      'plan': 'Platinum Plan',
      'weight': '58.2 kg',
      'attendance': '90%',
    },
    {
      'time': '12:00',
      'client': 'Arjun Nair',
      'type': 'PT Session',
      'status': 'Confirmed',
      'statusColor': AppColors.primary,
      'isLive': false,
      'plan': 'Gold Membership',
      'weight': '74.1 kg',
      'attendance': '75%',
    },
    {
      'time': '16:00',
      'client': 'Sneha Rao',
      'type': 'Mobility & Core',
      'status': 'Scheduled',
      'statusColor': AppColors.info,
      'isLive': false,
      'plan': 'Silver Plan',
      'weight': '61.0 kg',
      'attendance': '85%',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 16,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Header: Coaching Workspace
              RepsiStaggerItem(
                index: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppColors.primarySoft,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'COACHING WORKSPACE',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.primaryDark,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 10,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  'Good morning, Alex',
                                  style: AppTypography.heading.copyWith(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.text,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Text('👋', style: TextStyle(fontSize: 20)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.push(RouteNames.selectRole),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.border, width: 1.5),
                          color: Colors.white,
                        ),
                        child: const Center(
                          child: Text(
                            'AL',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // 2. Coaching Metrics Bar: Clients 12 | Pending Plans 4 | Messages 3 | Attendance 8
              RepsiStaggerItem(
                index: 1,
                child: RepsiCard(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildMetricTile('12', "Today's clients", Icons.people_outline_rounded, AppColors.primary),
                      _buildDivider(),
                      _buildMetricTile('4', 'Pending plans', Icons.assignment_outlined, const Color(0xFFF59E0B)),
                      _buildDivider(),
                      _buildMetricTile('3', 'Messages', Icons.chat_bubble_outline_rounded, const Color(0xFF3B82F6), hasBadge: true),
                      _buildDivider(),
                      _buildMetricTile('8', 'Attendance', Icons.check_circle_outline_rounded, AppColors.primaryDark),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // 3. Quick Coaching Actions
              RepsiStaggerItem(
                index: 2,
                child: Row(
                  children: [
                    Expanded(
                      child: _buildActionTile(
                        icon: Icons.fitness_center_rounded,
                        label: 'Workout Builder',
                        color: AppColors.primarySoft,
                        iconColor: AppColors.primaryDark,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const TrainerCreateWorkoutView()),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _buildActionTile(
                        icon: Icons.restaurant_menu_rounded,
                        label: 'Diet Plan',
                        color: const Color(0xFFFEF3C7),
                        iconColor: const Color(0xFFD97706),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const TrainerDietPlanView()),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _buildActionTile(
                        icon: Icons.chat_rounded,
                        label: 'Client Chat',
                        color: const Color(0xFFEFF6FF),
                        iconColor: const Color(0xFF2563EB),
                        badgeText: '3',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const TrainerChatView()),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 4. Today's Sessions Section Header
              RepsiStaggerItem(
                index: 3,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          "Today's sessions",
                          style: AppTypography.sectionHeading.copyWith(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primarySoft,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '${_todaySessions.length}',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.primaryDark,
                              fontWeight: FontWeight.w700,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const TrainerSessionsView()),
                        );
                      },
                      child: Text(
                        'Full schedule →',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),

              // 5. Today's Sessions Cards
              ...List.generate(_todaySessions.length, (index) {
                final session = _todaySessions[index];
                return RepsiStaggerItem(
                  index: 4 + index,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: RepsiCard(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => TrainerClientDetailView(
                              client: {
                                'name': session['client'] as String,
                                'plan': session['plan'] as String,
                                'goal': session['type'] as String,
                                'status': 'Active',
                                'weight': session['weight'] as String,
                                'attendance': session['attendance'] as String,
                              },
                            ),
                          ),
                        );
                      },
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: session['isLive'] ? AppColors.primary : AppColors.surfaceSubtle,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  session['time'] as String,
                                  style: AppTypography.caption.copyWith(
                                    color: session['isLive'] ? Colors.white : AppColors.text,
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
                                    Row(
                                      children: [
                                        Flexible(
                                          child: Text(
                                            session['client'] as String,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: AppTypography.headingSmall.copyWith(
                                              fontSize: 15,
                                              fontWeight: FontWeight.w700,
                                              color: AppColors.text,
                                            ),
                                          ),
                                        ),
                                        if (session['isLive']) ...[
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFDC2626).withValues(alpha: 0.12),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: const Text(
                                              'NEXT UP',
                                              style: TextStyle(
                                                color: Color(0xFFDC2626),
                                                fontSize: 9,
                                                fontWeight: FontWeight.w800,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      session['type'] as String,
                                      style: AppTypography.caption.copyWith(
                                        color: AppColors.textSecondary,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppColors.primarySoft,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 6,
                                      height: 6,
                                      decoration: const BoxDecoration(
                                        color: AppColors.primary,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 5),
                                    Text(
                                      session['status'] as String,
                                      style: AppTypography.caption.copyWith(
                                        color: AppColors.primaryDark,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Divider(height: 1, color: AppColors.border),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  'Weight: ${session['weight']} · Att: ${session['attendance']}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.textSecondary,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              Row(
                                children: [
                                  InkWell(
                                    onTap: () {
                                      HapticFeedback.lightImpact();
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text('Session started with ${session['client']}'),
                                          backgroundColor: AppColors.primary,
                                        ),
                                      );
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                      decoration: BoxDecoration(
                                        color: AppColors.primary,
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: const Text(
                                        'Start Session',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  InkWell(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => const TrainerChatView(),
                                        ),
                                      );
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.all(5),
                                      decoration: BoxDecoration(
                                        border: Border.all(color: AppColors.border),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: const Icon(Icons.chat_bubble_outline_rounded, size: 14, color: AppColors.textSecondary),
                                    ),
                                  ),
                                ],
                              ),
                            ],
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

  Widget _buildMetricTile(String value, String label, IconData icon, Color color, {bool hasBadge = false}) {
    return Expanded(
      child: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Text(
                value,
                style: AppTypography.headingSmall.copyWith(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.text,
                ),
              ),
              if (hasBadge)
                Positioned(
                  right: -6,
                  top: -2,
                  child: Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEF4444),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 3),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppTypography.caption.copyWith(
              color: AppColors.textSecondary,
              fontSize: 10,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 24,
      color: AppColors.border,
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String label,
    required Color color,
    required Color iconColor,
    required VoidCallback onTap,
    String? badgeText,
  }) {
    return RepsiCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      child: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              if (badgeText != null)
                Positioned(
                  top: -4,
                  right: -4,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEF4444),
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      badgeText,
                      style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: AppTypography.caption.copyWith(
              fontWeight: FontWeight.w600,
              fontSize: 11,
              color: AppColors.text,
            ),
          ),
        ],
      ),
    );
  }
}
