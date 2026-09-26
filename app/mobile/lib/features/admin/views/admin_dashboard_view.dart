import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';

class AdminDashboardView extends StatelessWidget {
  const AdminDashboardView({super.key});

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
              // Header
              RepsiStaggerItem(
                index: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'System Admin',
                          style: AppTypography.heading.copyWith(
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Platform-wide metrics & telemetry',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: () => context.push(RouteNames.selectRole),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3E8FF),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFD8B4FE)),
                        ),
                        child: Text(
                          'Switch Role',
                          style: AppTypography.caption.copyWith(
                            color: const Color(0xFF9333EA),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // System Stats 2x3 Grid (Section 34: Total Gyms, Active Users, Active Members, Trainers, Revenue, Subscriptions)
              RepsiStaggerItem(
                index: 1,
                child: Column(
                  children: [
                    Row(
                      children: const [
                        Expanded(
                          child: _AdminStatCard(
                            label: 'Total Gyms',
                            value: '42',
                            subtext: '+3 this month',
                            icon: Icons.storefront_rounded,
                          ),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: _AdminStatCard(
                            label: 'Active Users',
                            value: '3,840',
                            subtext: '+12% MoM',
                            icon: Icons.people_outline_rounded,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: const [
                        Expanded(
                          child: _AdminStatCard(
                            label: 'Active Members',
                            value: '3,210',
                            subtext: 'Paying members',
                            icon: Icons.card_membership_rounded,
                          ),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: _AdminStatCard(
                            label: 'Trainers',
                            value: '185',
                            subtext: 'Across all gyms',
                            icon: Icons.fitness_center_rounded,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: const [
                        Expanded(
                          child: _AdminStatCard(
                            label: 'Platform Revenue',
                            value: '₹14.2L',
                            subtext: 'MRR this month',
                            icon: Icons.account_balance_wallet_outlined,
                            valueColor: AppColors.primaryDark,
                          ),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: _AdminStatCard(
                            label: 'Subscriptions',
                            value: '38 Active',
                            subtext: '4 Trialing',
                            icon: Icons.star_outline_rounded,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Platform Health Status Card
              RepsiStaggerItem(
                index: 2,
                child: RepsiCard(
                  padding: const EdgeInsets.all(18),
                  child: Row(
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'All platform services operational',
                          style: AppTypography.headingSmall.copyWith(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.text,
                          ),
                        ),
                      ),
                      Text(
                        '99.98% uptime',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 12,
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

class _AdminStatCard extends StatelessWidget {
  final String label;
  final String value;
  final String subtext;
  final IconData icon;
  final Color? valueColor;

  const _AdminStatCard({
    required this.label,
    required this.value,
    required this.subtext,
    required this.icon,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: AppTypography.caption.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 12,
                ),
              ),
              Icon(icon, size: 18, color: AppColors.textMuted),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: AppTypography.heading.copyWith(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: valueColor ?? AppColors.text,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtext,
            style: AppTypography.caption.copyWith(
              color: AppColors.textMuted,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}
