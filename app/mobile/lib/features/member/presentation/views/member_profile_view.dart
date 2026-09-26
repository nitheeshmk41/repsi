import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/routes/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_stagger.dart';
import '../../../../shared/widgets/repsi_card.dart';
import '../../../auth/providers/auth_provider.dart';
import 'member_membership_view.dart';
import 'member_payments_view.dart';
import 'member_trainer_view.dart';
import 'qr_attendance_view.dart';

class MemberProfileView extends ConsumerWidget {
  const MemberProfileView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final menuItems = [
      {'icon': Icons.person_outline_rounded, 'title': 'My Profile', 'route': 'profile'},
      {'icon': Icons.card_membership_rounded, 'title': 'Membership', 'route': 'membership'},
      {'icon': Icons.payment_rounded, 'title': 'Payments', 'route': 'payments'},
      {'icon': Icons.calendar_today_outlined, 'title': 'Attendance', 'route': 'attendance'},
      {'icon': Icons.fitness_center_rounded, 'title': 'My Trainer', 'route': 'trainer'},
      {'icon': Icons.storefront_outlined, 'title': 'My Gym', 'route': 'gym'},
      {'icon': Icons.notifications_none_rounded, 'title': 'Notifications', 'route': 'notifications'},
      {'icon': Icons.help_outline_rounded, 'title': 'Help & Support', 'route': 'help'},
      {'icon': Icons.settings_outlined, 'title': 'Settings', 'route': 'settings'},
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'More',
          style: AppTypography.heading.copyWith(fontSize: 20, fontWeight: FontWeight.w700),
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
              // User summary card
              RepsiStaggerItem(
                index: 0,
                child: RepsiCard(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 26,
                        backgroundColor: AppColors.primarySoft,
                        child: const Text(
                          'RK',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primaryDark,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Rahul Kumar',
                              style: AppTypography.headingSmall.copyWith(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppColors.text,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'rahul@gmail.com',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push(RouteNames.selectRole),
                        child: Text(
                          'Switch Role',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Menu Options (Mockup Screen 10)
              ...List.generate(menuItems.length, (index) {
                final item = menuItems[index];
                return RepsiStaggerItem(
                  index: index + 1,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: RepsiCard(
                      onTap: () {
                        final route = item['route'];
                        if (route == 'membership') {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const MemberMembershipView()));
                        } else if (route == 'payments') {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const MemberPaymentsView()));
                        } else if (route == 'trainer') {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const MemberTrainerView()));
                        } else if (route == 'attendance') {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const QrAttendanceView()));
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('${item['title']} section')),
                          );
                        }
                      },
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                      child: Row(
                        children: [
                          Icon(item['icon'] as IconData, size: 20, color: AppColors.textSecondary),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Text(
                              item['title'] as String,
                              style: AppTypography.headingSmall.copyWith(
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                                color: AppColors.text,
                              ),
                            ),
                          ),
                          const Icon(Icons.chevron_right_rounded, size: 20, color: AppColors.textMuted),
                        ],
                      ),
                    ),
                  ),
                );
              }),
              const SizedBox(height: 12),

              // Sign Out button (Red text & icon)
              RepsiStaggerItem(
                index: menuItems.length + 1,
                child: RepsiCard(
                  onTap: () async {
                    await ref.read(authProvider.notifier).logout();
                    if (context.mounted) {
                      context.go(RouteNames.login);
                    }
                  },
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                  child: Row(
                    children: [
                      const Icon(Icons.logout_rounded, size: 20, color: AppColors.error),
                      const SizedBox(width: 14),
                      Text(
                        'Sign Out',
                        style: AppTypography.headingSmall.copyWith(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppColors.error,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
