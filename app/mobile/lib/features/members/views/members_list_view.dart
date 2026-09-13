import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/models/member_model.dart';
import '../../../shared/widgets/repsi_avatar.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_empty_state.dart';
import '../../../shared/widgets/repsi_error_state.dart';
import '../../../shared/widgets/repsi_search_field.dart';
import '../../../shared/widgets/repsi_skeleton.dart';
import '../../../shared/widgets/repsi_status_badge.dart';
import '../providers/member_provider.dart';

class MembersListView extends ConsumerWidget {
  const MembersListView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(memberListProvider);
    final notifier = ref.read(memberListProvider.notifier);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primary,
        icon: const Icon(LucideIcons.userPlus, color: Colors.white, size: 18),
        label: const Text(
          'Add Member',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        onPressed: () => context.push(RouteNames.addMember),
      ),
      body: Column(
        children: [
          // Filter & Search bar header
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.md, AppSpacing.md, AppSpacing.xs),
            child: Column(
              children: [
                RepsiSearchField(
                  hintText: 'Search by name, phone or email...',
                  onChanged: (q) => notifier.setSearchQuery(q),
                  onClear: () => notifier.setSearchQuery(''),
                ),
                const SizedBox(height: AppSpacing.sm),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFilterChip(context, ref, 'All', 'ALL', state.selectedStatusFilter),
                      _buildFilterChip(context, ref, 'Active', 'ACTIVE', state.selectedStatusFilter),
                      _buildFilterChip(context, ref, 'Expiring', 'EXPIRING', state.selectedStatusFilter),
                      _buildFilterChip(context, ref, 'Expired', 'EXPIRED', state.selectedStatusFilter),
                      _buildFilterChip(context, ref, 'Frozen', 'FROZEN', state.selectedStatusFilter),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Expanded(
            child: _buildBody(context, ref, state, isDark),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    BuildContext context,
    WidgetRef ref,
    String label,
    String value,
    String currentSelection,
  ) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isSelected = currentSelection == value;

    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.xs),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        selectedColor: AppColors.primary,
        checkmarkColor: Colors.white,
        backgroundColor: isDark ? AppColors.darkSurface : AppColors.surface,
        side: BorderSide(
          color: isSelected ? Colors.transparent : (isDark ? AppColors.darkBorder : AppColors.border),
        ),
        labelStyle: TextStyle(
          fontSize: 12,
          color: isSelected ? Colors.white : (isDark ? AppColors.darkTextSecondary : AppColors.textSecondary),
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
        ),
        onSelected: (_) {
          ref.read(memberListProvider.notifier).setStatusFilter(value);
        },
      ),
    );
  }

  Widget _buildBody(BuildContext context, WidgetRef ref, MemberListState state, bool isDark) {
    if (state.isLoading && state.members.isEmpty) {
      return ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.md),
        itemCount: 8,
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
        itemBuilder: (_, __) => const RepsiSkeleton(height: 72),
      );
    }

    if (state.errorMessage != null && state.members.isEmpty) {
      return RepsiErrorState(
        message: state.errorMessage!,
        onRetry: () => ref.read(memberListProvider.notifier).fetchMembers(),
      );
    }

    if (state.members.isEmpty) {
      return RepsiEmptyState(
        icon: LucideIcons.users,
        title: 'No members found',
        message: state.searchQuery.isNotEmpty
            ? 'No members match "${state.searchQuery}". Try a different filter or search term.'
            : 'Get started by adding your first gym member.',
        actionLabel: 'Add New Member',
        onAction: () => context.push(RouteNames.addMember),
      );
    }

    final dateFormat = DateFormat('dd MMM yyyy');

    return RefreshIndicator(
      onRefresh: () => ref.read(memberListProvider.notifier).fetchMembers(),
      color: AppColors.primary,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.xs, AppSpacing.md, 80),
        itemCount: state.members.length,
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
        itemBuilder: (context, index) {
          final member = state.members[index];
          return RepsiCard(
            onTap: () => context.push('/members/${member.id}', extra: member),
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                RepsiAvatar(
                  name: member.fullName,
                  imageUrl: member.photoUrl,
                  size: 44,
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            child: Text(
                              member.fullName,
                              style: AppTypography.labelLarge.copyWith(
                                color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                                fontWeight: FontWeight.w600,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          RepsiStatusBadge(status: member.status),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          if (member.membershipPlanName != null) ...[
                            Text(
                              member.membershipPlanName!,
                              style: AppTypography.caption.copyWith(
                                color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text('•', style: TextStyle(color: isDark ? AppColors.darkTextMuted : AppColors.textMuted)),
                            const SizedBox(width: 6),
                          ],
                          if (member.endDate != null)
                            Text(
                              'Expires ${dateFormat.format(member.endDate!)}',
                              style: AppTypography.caption.copyWith(
                                color: member.status == MemberStatus.expiring
                                    ? AppColors.warning
                                    : (isDark ? AppColors.darkTextMuted : AppColors.textMuted),
                                fontWeight: member.status == MemberStatus.expiring ? FontWeight.w600 : FontWeight.w400,
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: AppSpacing.xs),
                Icon(
                  LucideIcons.chevronRight,
                  size: 16,
                  color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
