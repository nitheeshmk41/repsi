import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../auth/providers/auth_provider.dart';

class MoreView extends ConsumerWidget {
  const MoreView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final ownerName = user?.fullName ?? 'Nitheesh';

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
              // User / Gym Profile Card (Owner Mockup Screen 5)
              RepsiStaggerItem(
                index: 0,
                child: RepsiCard(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.primarySoft,
                          border: Border.all(color: AppColors.primary, width: 1.5),
                        ),
                        child: const Center(
                          child: Icon(Icons.storefront_rounded, color: AppColors.primaryDark, size: 24),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              ownerName,
                              style: AppTypography.headingSmall.copyWith(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppColors.text,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Gym Owner · Apex Fitness',
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

              // SECTION: GYM
              RepsiStaggerItem(
                index: 1,
                child: _buildSection(
                  title: 'Gym',
                  items: [
                    {'icon': Icons.business_outlined, 'title': 'Gym Profile'},
                    {'icon': Icons.map_outlined, 'title': 'Branches'},
                    {'icon': Icons.schedule_rounded, 'title': 'Operating Hours'},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 20),

              // SECTION: PEOPLE
              RepsiStaggerItem(
                index: 2,
                child: _buildSection(
                  title: 'People',
                  items: [
                    {'icon': Icons.fitness_center_outlined, 'title': 'Trainers'},
                    {'icon': Icons.badge_outlined, 'title': 'Staff'},
                    {'icon': Icons.security_rounded, 'title': 'Permissions'},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 20),

              // SECTION: OPERATIONS
              RepsiStaggerItem(
                index: 3,
                child: _buildSection(
                  title: 'Operations',
                  items: [
                    {'icon': Icons.card_membership_rounded, 'title': 'Membership Plans'},
                    {'icon': Icons.sports_gymnastics_rounded, 'title': 'Classes'},
                    {'icon': Icons.receipt_long_outlined, 'title': 'Expenses'},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 20),

              // SECTION: REPORTS
              RepsiStaggerItem(
                index: 4,
                child: _buildSection(
                  title: 'Reports',
                  items: [
                    {'icon': Icons.insights_rounded, 'title': 'Revenue Reports'},
                    {'icon': Icons.people_outline_rounded, 'title': 'Member Analytics'},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 20),

              // SECTION: ACCOUNT & SIGN OUT
              RepsiStaggerItem(
                index: 5,
                child: Column(
                  children: [
                    RepsiCard(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Subscription active: Repsi Pro')),
                        );
                      },
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                      child: Row(
                        children: [
                          const Icon(Icons.star_outline_rounded, size: 20, color: AppColors.textSecondary),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Text(
                              'Subscription',
                              style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w500),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'PRO',
                              style: AppTypography.caption.copyWith(color: AppColors.primaryDark, fontWeight: FontWeight.w700, fontSize: 11),
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.chevron_right_rounded, size: 20, color: AppColors.textMuted),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    RepsiCard(
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
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required List<Map<String, dynamic>> items,
    required BuildContext context,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            title,
            style: AppTypography.caption.copyWith(
              fontWeight: FontWeight.w700,
              fontSize: 13,
              color: AppColors.textSecondary,
              letterSpacing: 0.5,
            ),
          ),
        ),
        RepsiCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: List.generate(items.length, (index) {
              final item = items[index];
              final isLast = index == items.length - 1;

              return Column(
                children: [
                  InkWell(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('${item['title']} selected')),
                      );
                    },
                    borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                  if (!isLast) const Divider(height: 1),
                ],
              );
            }),
          ),
        ),
      ],
    );
  }
}
