import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/models/member_model.dart';
import '../../../shared/widgets/repsi_badge.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_search_field.dart';
import '../providers/member_provider.dart';
import 'member_detail_view.dart';

class MembersListView extends ConsumerStatefulWidget {
  const MembersListView({super.key});

  @override
  ConsumerState<MembersListView> createState() => _MembersListViewState();
}

class _MembersListViewState extends ConsumerState<MembersListView> {
  int _selectedFilter = 0;
  final List<String> _filters = ['All', 'Active', 'Expiring', 'Expired', 'Frozen'];

  RepsiBadgeVariant _getBadgeVariant(MemberStatus status) {
    switch (status) {
      case MemberStatus.active:
        return RepsiBadgeVariant.active;
      case MemberStatus.expiring:
        return RepsiBadgeVariant.expiring;
      case MemberStatus.expired:
        return RepsiBadgeVariant.expired;
      case MemberStatus.frozen:
        return RepsiBadgeVariant.frozen;
      case MemberStatus.cancelled:
        return RepsiBadgeVariant.neutral;
    }
  }

  @override
  Widget build(BuildContext context) {
    final memberState = ref.watch(memberListProvider);
    final members = memberState.members;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Members CRM',
          style: AppTypography.heading.copyWith(fontSize: 22, fontWeight: FontWeight.w700),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppColors.text),
            onPressed: () => ref.read(memberListProvider.notifier).fetchMembers(),
          ),
          IconButton(
            icon: const Icon(Icons.person_add_outlined, color: AppColors.primary),
            onPressed: () async {
              await context.push(RouteNames.addMember);
              if (mounted) {
                ref.read(memberListProvider.notifier).fetchMembers();
              }
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Input
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pageHorizontalPadding,
                vertical: 6,
              ),
              child: RepsiSearchField(
                hintText: 'Search by name, email or phone...',
                onChanged: (val) {
                  ref.read(memberListProvider.notifier).setSearchQuery(val);
                },
              ),
            ),
            const SizedBox(height: 8),

            // Horizontal Filter Chips
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
                itemCount: _filters.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final isSelected = index == _selectedFilter;
                  return ChoiceChip(
                    label: Text(_filters[index]),
                    selected: isSelected,
                    selectedColor: AppColors.primarySoft,
                    backgroundColor: Colors.white,
                    labelStyle: AppTypography.caption.copyWith(
                      color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    ),
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : AppColors.border,
                      width: isSelected ? 1.5 : 1,
                    ),
                    onSelected: (_) {
                      setState(() => _selectedFilter = index);
                      final filterKey = index == 0 ? 'ALL' : _filters[index].toUpperCase();
                      ref.read(memberListProvider.notifier).setStatusFilter(filterKey);
                    },
                  );
                },
              ),
            ),
            const SizedBox(height: 12),

            // Member Cards List
            Expanded(
              child: RefreshIndicator(
                color: AppColors.primary,
                onRefresh: () async {
                  await ref.read(memberListProvider.notifier).fetchMembers();
                },
                child: memberState.isLoading && members.isEmpty
                    ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                    : members.isEmpty
                        ? ListView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding, vertical: 40),
                            children: [
                              Center(
                                child: Container(
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: AppColors.border),
                                  ),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.people_outline_rounded, size: 48, color: AppColors.textMuted),
                                      const SizedBox(height: 12),
                                      Text(
                                        'No members registered yet',
                                        style: AppTypography.headingSmall.copyWith(fontSize: 16, fontWeight: FontWeight.w700),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        'Members registered through the website or added by you will appear here automatically.',
                                        textAlign: TextAlign.center,
                                        style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                                      ),
                                      const SizedBox(height: 16),
                                      ElevatedButton.icon(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: AppColors.primary,
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                        ),
                                        onPressed: () async {
                                          await context.push(RouteNames.addMember);
                                          if (context.mounted) {
                                            ref.read(memberListProvider.notifier).fetchMembers();
                                          }
                                        },
                                        icon: const Icon(Icons.person_add_outlined, size: 18),
                                        label: const Text('Add Member'),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          )
                        : ListView.separated(
                            physics: const AlwaysScrollableScrollPhysics(),
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.pageHorizontalPadding,
                              vertical: 4,
                            ),
                            itemCount: members.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final m = members[index];
                              final displayName = '${m.firstName} ${m.lastName}'.trim();
                              final displayInitial = displayName.isNotEmpty ? displayName[0].toUpperCase() : 'M';
                              final statusLabel = m.status.displayName;
                              final badgeVariant = _getBadgeVariant(m.status);

                              return RepsiCard(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => MemberDetailView(memberId: m.id),
                                    ),
                                  );
                                },
                                padding: const EdgeInsets.all(14),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 20,
                                          backgroundColor: AppColors.primarySoft,
                                          child: Text(
                                            displayInitial,
                                            style: const TextStyle(
                                              color: AppColors.primaryDark,
                                              fontWeight: FontWeight.w700,
                                              fontSize: 16,
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
                                                  Expanded(
                                                    child: Text(
                                                      displayName,
                                                      maxLines: 1,
                                                      overflow: TextOverflow.ellipsis,
                                                      style: AppTypography.bodySmall.copyWith(
                                                        fontWeight: FontWeight.w700,
                                                        fontSize: 15,
                                                        color: AppColors.text,
                                                      ),
                                                    ),
                                                  ),
                                                  const SizedBox(width: 8),
                                                  RepsiBadge(
                                                    label: statusLabel,
                                                    variant: badgeVariant,
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                '${m.planName ?? "General Membership"} • ${m.email}',
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: AppTypography.caption.copyWith(
                                                  color: AppColors.textSecondary,
                                                  fontSize: 11.5,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: AppColors.background,
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Row(
                                            children: [
                                              const Icon(Icons.schedule_rounded, size: 13, color: AppColors.textMuted),
                                              const SizedBox(width: 5),
                                              Text(
                                                m.expiryDate != null ? 'Expires: ${m.expiryDate}' : 'Active membership',
                                                style: AppTypography.caption.copyWith(
                                                  color: m.status == MemberStatus.expiring || m.status == MemberStatus.expired
                                                      ? AppColors.error
                                                      : AppColors.textSecondary,
                                                  fontWeight: FontWeight.w600,
                                                  fontSize: 11,
                                                ),
                                              ),
                                            ],
                                          ),
                                          if (m.phone != null && m.phone!.isNotEmpty)
                                            Text(
                                              m.phone!,
                                              style: AppTypography.caption.copyWith(
                                                color: AppColors.textMuted,
                                                fontSize: 11,
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
