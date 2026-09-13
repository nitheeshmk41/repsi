import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_avatar.dart';
import '../../../shared/widgets/repsi_bottom_sheet.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_empty_state.dart';
import '../../../shared/widgets/repsi_error_state.dart';
import '../../../shared/widgets/repsi_metric_card.dart';
import '../../../shared/widgets/repsi_skeleton.dart';
import '../providers/attendance_provider.dart';
import 'qr_scanner_sheet.dart';

class AttendanceView extends ConsumerWidget {
  const AttendanceView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(attendanceProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primary,
        icon: const Icon(LucideIcons.scanLine, color: Colors.white, size: 20),
        label: const Text(
          'Scan QR Check-In',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        onPressed: () {
          RepsiBottomSheet.show(
            context: context,
            child: const QrScannerSheet(),
          );
        },
      ),
      body: _buildContent(context, ref, state, isDark),
    );
  }

  Widget _buildContent(BuildContext context, WidgetRef ref, AttendanceState state, bool isDark) {
    if (state.isLoading && state.summary == null) {
      return ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: const [
          Row(
            children: [
              Expanded(child: RepsiSkeleton(height: 90)),
              SizedBox(width: AppSpacing.sm),
              Expanded(child: RepsiSkeleton(height: 90)),
            ],
          ),
          SizedBox(height: AppSpacing.md),
          RepsiSkeleton(height: 300),
        ],
      );
    }

    if (state.errorMessage != null && state.summary == null) {
      return RepsiErrorState(
        message: state.errorMessage!,
        onRetry: () => ref.read(attendanceProvider.notifier).fetchSummary(),
      );
    }

    final summary = state.summary;
    final totalToday = summary?.totalToday ?? 42;
    final currentlyInside = summary?.currentlyInside ?? 18;
    final peakHour = summary?.peakHourTime ?? '6:00 PM - 7:00 PM';
    final recentList = summary?.recentCheckIns ?? [];

    final timeFormat = DateFormat('hh:mm a');

    return RefreshIndicator(
      onRefresh: () => ref.read(attendanceProvider.notifier).fetchSummary(),
      color: AppColors.primary,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.md, AppSpacing.md, 80),
        children: [
          Row(
            children: [
              Expanded(
                child: RepsiMetricCard(
                  title: 'Today Total',
                  value: '$totalToday',
                  icon: LucideIcons.checkCircle,
                  iconColor: AppColors.primary,
                  subtitle: 'Members attended',
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: RepsiMetricCard(
                  title: 'Inside Now',
                  value: '$currentlyInside',
                  icon: LucideIcons.userCheck,
                  iconColor: AppColors.success,
                  subtitle: 'Active on floor',
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Peak hour banner
          RepsiCard(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm + 2),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(LucideIcons.flame, color: AppColors.primaryDark, size: 16),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Peak Floor Traffic',
                        style: AppTypography.labelMedium.copyWith(
                          color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        peakHour,
                        style: AppTypography.caption.copyWith(
                          color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          Text(
            'Recent Check-Ins',
            style: AppTypography.headingSmall.copyWith(
              color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          if (recentList.isEmpty)
            const RepsiEmptyState(
              icon: LucideIcons.qrCode,
              title: 'No check-ins yet today',
              message: 'Check-ins recorded via QR scanner will appear here in real-time.',
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: recentList.length,
              separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.xs),
              itemBuilder: (context, index) {
                final record = recentList[index];
                return RepsiCard(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Row(
                    children: [
                      RepsiAvatar(
                        name: record.memberName ?? 'Member',
                        imageUrl: record.memberPhotoUrl,
                        size: 38,
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              record.memberName ?? 'Member #${record.memberId.substring(0, 6)}',
                              style: AppTypography.labelLarge.copyWith(
                                color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              'Via ${record.checkInMethod ?? 'QR SCAN'}',
                              style: AppTypography.caption.copyWith(
                                color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            timeFormat.format(record.checkInTime),
                            style: AppTypography.caption.copyWith(
                              fontWeight: FontWeight.w600,
                              color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.only(top: 2),
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                            decoration: BoxDecoration(
                              color: AppColors.successLight,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'IN',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                color: AppColors.successDark,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
