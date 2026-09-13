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
        body: RepsiErrorState(
          message: state.errorMessage!,
          onRetry: () => ref.read(dashboardProvider.notifier).fetchMetrics(),
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

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      body: RefreshIndicator(
        onRefresh: () => ref.read(dashboardProvider.notifier).fetchMetrics(),
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // KPI Grid
              GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: AppSpacing.sm,
                mainAxisSpacing: AppSpacing.sm,
                childAspectRatio: 1.35,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  RepsiMetricCard(
                    title: 'Active Members',
                    value: '$activeCount',
                    icon: LucideIcons.users,
                    iconColor: AppColors.primary,
                    subtitle: '+8 this month',
                    onTap: () => context.go(RouteNames.members),
                  ),
                  RepsiMetricCard(
                    title: 'Revenue (MTD)',
                    value: currencyFormatter.format(monthlyRev),
                    icon: LucideIcons.indianRupee,
                    iconColor: AppColors.success,
                    trendPct: growthPct,
                    onTap: () => context.push(RouteNames.payments),
                  ),
                  RepsiMetricCard(
                    title: 'Today Check-ins',
                    value: '$todayAtt',
                    icon: LucideIcons.qrCode,
                    iconColor: AppColors.info,
                    subtitle: 'Peak: $peakHour',
                    onTap: () => context.go(RouteNames.attendance),
                  ),
                  RepsiMetricCard(
                    title: 'Expiring Soon',
                    value: '$expiringCount',
                    icon: LucideIcons.alertTriangle,
                    iconColor: AppColors.warning,
                    subtitle: 'Next 7 days',
                    onTap: () => context.go(RouteNames.members),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Quick Action Bar
              Text(
                'Quick Actions',
                style: AppTypography.headingSmall.copyWith(
                  color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Row(
                children: [
                  Expanded(
                    child: _buildQuickActionButton(
                      context: context,
                      isDark: isDark,
                      icon: LucideIcons.userPlus,
                      label: 'Add Member',
                      onTap: () => context.push(RouteNames.addMember),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: _buildQuickActionButton(
                      context: context,
                      isDark: isDark,
                      icon: LucideIcons.creditCard,
                      label: 'Record Pay',
                      onTap: () => context.push(RouteNames.recordPayment),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: _buildQuickActionButton(
                      context: context,
                      isDark: isDark,
                      icon: LucideIcons.calendarPlus,
                      label: 'Classes',
                      onTap: () => context.push(RouteNames.classes),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: _buildQuickActionButton(
                      context: context,
                      isDark: isDark,
                      icon: LucideIcons.dumbbell,
                      label: 'Workouts',
                      onTap: () => context.push(RouteNames.workouts),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Revenue Trends Chart
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
                    Text(
                      'Monthly financial trajectory',
                      style: AppTypography.caption.copyWith(
                        color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                      ),
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
                                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                                  final idx = value.toInt();
                                  if (idx >= 0 && idx < months.length) {
                                    return Padding(
                                      padding: const EdgeInsets.only(top: 8.0),
                                      child: Text(
                                        months[idx],
                                        style: TextStyle(
                                          fontSize: 10,
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

              // Operational Status Card
              RepsiCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Live Floor Activity',
                          style: AppTypography.labelLarge.copyWith(
                            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: const BoxDecoration(
                                  color: AppColors.primaryDark,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'Peak: $peakHour',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.primaryDark,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: (todayAtt / 80).clamp(0.0, 1.0),
                        minHeight: 8,
                        backgroundColor: isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle,
                        valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Estimated capacity utilization',
                          style: AppTypography.caption.copyWith(
                            color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                          ),
                        ),
                        Text(
                          '${((todayAtt / 80) * 100).toInt()}%',
                          style: AppTypography.caption.copyWith(
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),
            ],
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
      body: SingleChildScrollView(
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
    );
  }
}
