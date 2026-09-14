import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_error_state.dart';
import '../../../shared/widgets/repsi_metric_card.dart';
import '../../../shared/widgets/repsi_skeleton.dart';
import '../../../shared/widgets/repsi_profile_bottom_sheet.dart';
import '../../auth/providers/auth_provider.dart';
import '../providers/dashboard_provider.dart';

class DashboardView extends ConsumerWidget {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(dashboardProvider);
    final currencyFormatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    if (state.isLoading && state.metrics == null) {
      return _buildSkeleton(isDark);
    }

    if (state.errorMessage != null && state.metrics == null) {
      return Scaffold(
        backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
        body: SafeArea(
          child: RepsiErrorState(
            message: state.errorMessage!,
            onRetry: () => ref.read(dashboardProvider.notifier).fetchMetrics(),
          ),
        ),
      );
    }

    final m = state.metrics;
    final activeCount = m?.activeMembers ?? 128;
    final monthlyRev = m?.monthlyRevenue ?? 384500.0;
    final todayAtt = m?.todayAttendance ?? 42;
    final expiringCount = m?.expiringMemberships ?? 14;
    final growthPct = m?.revenueGrowthPct ?? 12.4;
    final peakHour = m?.attendancePeakHour ?? '6:00 PM - 7:30 PM';

    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => ref.read(dashboardProvider.notifier).fetchMetrics(),
          color: AppColors.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Owner Welcome Banner
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Good morning, ${user?.fullName?.split(' ').first ?? 'Owner'}',
                            style: AppTypography.headingMedium.copyWith(
                              color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                              fontWeight: FontWeight.w700,
                              fontSize: 20,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Apex Fitness • Owner Dashboard',
                            style: AppTypography.caption.copyWith(
                              color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Icon(LucideIcons.bell, size: 22, color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary),
                              Positioned(
                                right: -2,
                                top: -2,
                                child: Container(
                                  width: 10,
                                  height: 10,
                                  decoration: BoxDecoration(color: AppColors.error, shape: BoxShape.circle, border: Border.all(color: isDark ? AppColors.darkBackground : AppColors.background, width: 2)),
                                ),
                              ),
                            ],
                          ),
                          onPressed: () => context.push(RouteNames.notifications),
                        ),
                        GestureDetector(
                          onTap: () => RepsiProfileBottomSheet.show(context),
                          child: CircleAvatar(
                            radius: 16,
                            backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                            backgroundImage: user?.avatarUrl != null ? NetworkImage(user!.avatarUrl!) : null,
                            child: user?.avatarUrl == null
                                ? Text(
                                    user?.fullName?.isNotEmpty == true ? user!.fullName![0].toUpperCase() : 'O',
                                    style: AppTypography.bodySmall.copyWith(color: AppColors.primary, fontWeight: FontWeight.w700),
                                  )
                                : null,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

              // 2. Needs Attention Card
              RepsiCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(LucideIcons.alertCircle, size: 18, color: AppColors.error),
                            const SizedBox(width: 6),
                            Text(
                              'NEEDS ATTENTION',
                              style: AppTypography.labelLarge.copyWith(
                                color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                        InkWell(
                          onTap: () => context.go(RouteNames.members),
                          child: Text(
                            'View all >',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    const Divider(height: 1),
                    const SizedBox(height: AppSpacing.xs),

                    // Item 1: Overdue payments
                    InkWell(
                      onTap: () => context.push(RouteNames.payments),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Colors.redAccent,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                '6 overdue payments',
                                style: AppTypography.bodySmall.copyWith(
                                  fontWeight: FontWeight.w600,
                                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                                ),
                              ),
                            ),
                            Text(
                              '₹18,500',
                              style: AppTypography.caption.copyWith(
                                fontWeight: FontWeight.w700,
                                color: AppColors.error,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Item 2: Expiring memberships
                    InkWell(
                      onTap: () => context.go(RouteNames.members),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Colors.orangeAccent,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                '24 memberships expiring',
                                style: AppTypography.bodySmall.copyWith(
                                  fontWeight: FontWeight.w600,
                                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                                ),
                              ),
                            ),
                            Text(
                              'Next 7 days',
                              style: AppTypography.caption.copyWith(
                                color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Item 3: Inactive members
                    InkWell(
                      onTap: () => context.go(RouteNames.members),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Colors.amber,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                '13 inactive members',
                                style: AppTypography.bodySmall.copyWith(
                                  fontWeight: FontWeight.w600,
                                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                                ),
                              ),
                            ),
                            Text(
                              '14+ days',
                              style: AppTypography.caption.copyWith(
                                color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 3. KPI Grid
              LayoutBuilder(
                builder: (context, constraints) {
                  final itemWidth = (constraints.maxWidth - AppSpacing.sm) / 2;
                  return Wrap(
                    spacing: AppSpacing.sm,
                    runSpacing: AppSpacing.sm,
                    children: [
                      SizedBox(
                        width: itemWidth,
                        child: RepsiMetricCard(
                          title: 'Active Members',
                          value: '$activeCount',
                          icon: LucideIcons.users,
                          iconColor: AppColors.primary,
                          subtitle: '+8 this month',
                          onTap: () => context.go(RouteNames.members),
                        ),
                      ),
                      SizedBox(
                        width: itemWidth,
                        child: RepsiMetricCard(
                          title: 'Revenue (MTD)',
                          value: currencyFormatter.format(monthlyRev),
                          icon: LucideIcons.indianRupee,
                          iconColor: AppColors.success,
                          trendPct: growthPct,
                          onTap: () => context.push(RouteNames.payments),
                        ),
                      ),
                      SizedBox(
                        width: itemWidth,
                        child: RepsiMetricCard(
                          title: 'Today Check-ins',
                          value: '$todayAtt',
                          icon: LucideIcons.qrCode,
                          iconColor: AppColors.info,
                          subtitle: 'Peak: $peakHour',
                          onTap: () => context.go(RouteNames.attendance),
                        ),
                      ),
                      SizedBox(
                        width: itemWidth,
                        child: RepsiMetricCard(
                          title: 'Expiring (7 Days)',
                          value: '$expiringCount',
                          icon: LucideIcons.alertTriangle,
                          iconColor: AppColors.warning,
                          subtitle: 'Next 7 days',
                          onTap: () => context.go(RouteNames.members),
                        ),
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: AppSpacing.lg),

              // 4. Quick Actions
              Text(
                'Quick Actions',
                style: AppTypography.headingSmall.copyWith(
                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              LayoutBuilder(
                builder: (context, constraints) {
                  final btnWidth = (constraints.maxWidth - (AppSpacing.sm * 3)) / 4;
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SizedBox(
                        width: btnWidth,
                        child: _buildQuickActionButton(
                          context: context,
                          isDark: isDark,
                          icon: LucideIcons.userPlus,
                          label: 'Add',
                          onTap: () => context.push(RouteNames.addMember),
                        ),
                      ),
                      SizedBox(
                        width: btnWidth,
                        child: _buildQuickActionButton(
                          context: context,
                          isDark: isDark,
                          icon: LucideIcons.creditCard,
                          label: 'Pay',
                          onTap: () => context.push(RouteNames.recordPayment),
                        ),
                      ),
                      SizedBox(
                        width: btnWidth,
                        child: _buildQuickActionButton(
                          context: context,
                          isDark: isDark,
                          icon: LucideIcons.qrCode,
                          label: 'Scan',
                          onTap: () => context.go(RouteNames.attendance),
                        ),
                      ),
                      SizedBox(
                        width: btnWidth,
                        child: _buildQuickActionButton(
                          context: context,
                          isDark: isDark,
                          icon: LucideIcons.users,
                          label: 'Members',
                          onTap: () => context.go(RouteNames.members),
                        ),
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: AppSpacing.lg),

              // 5. Revenue Trends Chart
              RepsiCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Revenue Growth',
                          style: AppTypography.labelLarge.copyWith(
                            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.successLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '+${growthPct.toStringAsFixed(1)}% MoM',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.successDark,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Monthly financial trajectory',
                          style: AppTypography.caption.copyWith(
                            color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                          ),
                        ),
                        Row(
                          children: ['1M', '3M', '6M', '1Y'].map((range) {
                            final isSel = range == '6M';
                            return Container(
                              margin: const EdgeInsets.only(left: 4),
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: isSel
                                    ? AppColors.primary
                                    : (isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                range,
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  color: isSel
                                      ? Colors.white
                                      : (isDark ? AppColors.darkTextMuted : AppColors.textMuted),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    SizedBox(
                      height: 180,
                      child: LineChart(
                        LineChartData(
                          gridData: FlGridData(
                            show: true,
                            drawVerticalLine: false,
                            getDrawingHorizontalLine: (value) => FlLine(
                              color: isDark ? AppColors.darkBorder : AppColors.border,
                              strokeWidth: 1,
                            ),
                          ),
                          titlesData: FlTitlesData(
                            leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (value, meta) {
                            // Distinct month labels every tick without duplication
                                  const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov']; // Skipped months to avoid overlapping
                                  final idx = value.toInt();
                                  if (idx >= 0 && idx < months.length) {
                                    return Padding(
                                      padding: const EdgeInsets.only(top: 8.0),
                                      child: Text(
                                        months[idx],
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                          color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                                        ),
                                      ),
                                    );
                                  }
                                  return const SizedBox.shrink();
                                },
                              ),
                            ),
                          ),
                          borderData: FlBorderData(show: false),
                          minX: 0,
                          maxX: 5,
                          minY: 0,
                          maxY: 6,
                          lineBarsData: [
                            LineChartBarData(
                              spots: const [
                                FlSpot(0, 1.8),
                                FlSpot(1, 2.5),
                                FlSpot(2, 3.1),
                                FlSpot(3, 3.8),
                                FlSpot(4, 4.2),
                                FlSpot(5, 5.4),
                              ],
                              isCurved: true,
                              color: AppColors.primary,
                              barWidth: 3,
                              isStrokeCapRound: true,
                              dotData: const FlDotData(show: false),
                              belowBarData: BarAreaData(
                                show: true,
                                color: AppColors.primary.withValues(alpha: 0.12),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 6. Live Gym Activity Card
              RepsiCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(
                              'LIVE GYM ACTIVITY',
                              style: AppTypography.labelLarge.copyWith(
                                color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.successLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: const BoxDecoration(
                                  color: AppColors.successDark,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'LIVE',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.successDark,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),

                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          '42',
                          style: AppTypography.headingLarge.copyWith(
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'members currently in gym',
                          style: AppTypography.bodyMedium.copyWith(
                            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),

                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: 0.42,
                        minHeight: 8,
                        backgroundColor: isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle,
                        valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Capacity: 42 / 100',
                          style: AppTypography.caption.copyWith(
                            color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                          ),
                        ),
                        Text(
                          'Peak today: 6:00 PM – 8:30 PM',
                          style: AppTypography.caption.copyWith(
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 7. Recent Activity Section
              RepsiCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Recent Activity',
                      style: AppTypography.labelLarge.copyWith(
                        color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    const Divider(height: 1),
                    const SizedBox(height: AppSpacing.xs),

                    Material(
                      color: Colors.transparent,
                      child: ListTile(
                        dense: true,
                        contentPadding: EdgeInsets.zero,
                        leading: CircleAvatar(
                          radius: 16,
                          backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                          child: const Icon(LucideIcons.userCheck, size: 16, color: AppColors.primary),
                        ),
                        title: Text('New member check-in', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                        subtitle: Text('Rahul Sharma • Annual Plan', style: AppTypography.caption),
                        trailing: Text('Today 10:42', style: AppTypography.caption),
                      ),
                    ),
                    Material(
                      color: Colors.transparent,
                      child: ListTile(
                        dense: true,
                        contentPadding: EdgeInsets.zero,
                        leading: CircleAvatar(
                          radius: 16,
                          backgroundColor: AppColors.success.withValues(alpha: 0.1),
                          child: const Icon(LucideIcons.creditCard, size: 16, color: AppColors.success),
                        ),
                        title: Text('Payment received', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                        subtitle: Text('₹2,500 via UPI', style: AppTypography.caption),
                        trailing: Text('Today 10:31', style: AppTypography.caption),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),
            ],
          ),
        ),
      ),
      ),
    );
  }

  Widget _buildQuickActionButton({
    required BuildContext context,
    required bool isDark,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.surface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.border,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: AppColors.primary),
            const SizedBox(height: 4),
            Text(
              label,
              style: AppTypography.caption.copyWith(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSkeleton(bool isDark) {
    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            children: [
              GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: AppSpacing.sm,
                mainAxisSpacing: AppSpacing.sm,
                childAspectRatio: 1.35,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: List.generate(4, (_) => const RepsiSkeleton(height: 100)),
              ),
              const SizedBox(height: AppSpacing.lg),
              const RepsiSkeleton(height: 220),
              const SizedBox(height: AppSpacing.md),
              const RepsiSkeleton(height: 120),
            ],
          ),
        ),
      ),
    );
  }
}
