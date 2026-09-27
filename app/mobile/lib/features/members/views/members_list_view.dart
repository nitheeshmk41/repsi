import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_badge.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_search_field.dart';
import 'member_detail_view.dart';

class MembersListView extends StatefulWidget {
  const MembersListView({super.key});

  @override
  State<MembersListView> createState() => _MembersListViewState();
}

class _MembersListViewState extends State<MembersListView> {
  int _selectedFilter = 0;
  final List<String> _filters = ['All', 'Active', 'Expiring', 'Expired', 'Leads', 'At-risk'];
  String _searchQuery = '';

  final List<Map<String, dynamic>> _members = [
    {
      'id': 'mem_001',
      'name': 'Rahul Sharma',
      'plan': 'Gold Membership',
      'status': 'Active',
      'variant': RepsiBadgeVariant.active,
      'visits': '24 visits',
      'attendance': '82%',
      'expiresIn': 'Expires in 43 days',
      'trainer': 'Alex',
      'branch': 'Indiranagar',
      'phone': '+91 98765 43210',
    },
    {
      'id': 'mem_002',
      'name': 'Priya Nair',
      'plan': 'Platinum Pass',
      'status': 'Active',
      'variant': RepsiBadgeVariant.active,
      'visits': '48 visits',
      'attendance': '94%',
      'expiresIn': 'Expires in 18 days',
      'trainer': 'Arun',
      'branch': 'Indiranagar',
      'phone': '+91 98765 43211',
    },
    {
      'id': 'mem_003',
      'name': 'Arjun Mehta',
      'plan': 'Silver Plan',
      'status': 'Expiring',
      'variant': RepsiBadgeVariant.expiring,
      'visits': '12 visits',
      'attendance': '65%',
      'expiresIn': 'Expires in 3 days',
      'trainer': 'Alex',
      'branch': 'Koramangala',
      'phone': '+91 98765 43212',
    },
    {
      'id': 'mem_004',
      'name': 'Sneha Rao',
      'plan': 'Gold Membership',
      'status': 'At-risk',
      'variant': RepsiBadgeVariant.expired,
      'visits': '2 visits',
      'attendance': '15%',
      'expiresIn': 'Inactive 16 days',
      'trainer': 'Vikram',
      'branch': 'Indiranagar',
      'phone': '+91 98765 43213',
    },
    {
      'id': 'mem_005',
      'name': 'Karan Verma',
      'plan': 'Trial Pass',
      'status': 'Leads',
      'variant': RepsiBadgeVariant.frozen,
      'visits': '1 visit',
      'attendance': 'Trial',
      'expiresIn': 'Trial ends tomorrow',
      'trainer': 'Alex',
      'branch': 'Whitefield',
      'phone': '+91 98765 43214',
    },
    {
      'id': 'mem_006',
      'name': 'Vikram Singh',
      'plan': 'Monthly Standard',
      'status': 'Expired',
      'variant': RepsiBadgeVariant.expired,
      'visits': '31 visits',
      'attendance': 'Overdue',
      'expiresIn': 'Expired 4 days ago',
      'trainer': 'Arun',
      'branch': 'Indiranagar',
      'phone': '+91 98765 43215',
    },
  ];

  void _showFilterModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Filter Members CRM', style: AppTypography.headingSmall.copyWith(fontWeight: FontWeight.w700)),
                  TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Reset')),
                ],
              ),
              const SizedBox(height: 12),
              const Text('Branch: Indiranagar, Koramangala, Whitefield'),
              const SizedBox(height: 8),
              const Text('Membership Tier: Gold, Platinum, Silver, Trial'),
              const SizedBox(height: 8),
              const Text('Payment Status: Paid, Outstanding, Overdue'),
              const SizedBox(height: 8),
              const Text('Assigned Trainer: Alex, Arun, Vikram'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  minimumSize: const Size(double.infinity, 44),
                ),
                child: const Text('Apply Filters', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredMembers = _members.where((m) {
      if (_searchQuery.isNotEmpty && !m['name'].toString().toLowerCase().contains(_searchQuery.toLowerCase())) {
        return false;
      }
      if (_selectedFilter == 0) return true; // All
      final filterName = _filters[_selectedFilter];
      return m['status'] == filterName;
    }).toList();

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
            icon: const Icon(Icons.tune_rounded, color: AppColors.text),
            onPressed: () => _showFilterModal(context),
          ),
          IconButton(
            icon: const Icon(Icons.person_add_outlined, color: AppColors.primary),
            onPressed: () => context.push(RouteNames.addMember),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Input with filter icon
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pageHorizontalPadding,
                vertical: 6,
              ),
              child: RepsiSearchField(
                hintText: 'Search by name, phone or plan...',
                onChanged: (val) => setState(() => _searchQuery = val),
              ),
            ),
            const SizedBox(height: 8),

            // Horizontal Filter Chips (All, Active, Expiring, Expired, Leads, At-risk)
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
                    onSelected: (_) => setState(() => _selectedFilter = index),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),

            // Member Cards List
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.pageHorizontalPadding,
                  vertical: 4,
                ),
                itemCount: filteredMembers.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final m = filteredMembers[index];
                  return RepsiCard(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => MemberDetailView(memberId: m['id'] as String),
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
                                m['name']![0],
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
                                      Text(
                                        m['name'] as String,
                                        style: AppTypography.bodySmall.copyWith(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 15,
                                          color: AppColors.text,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      RepsiBadge(
                                        label: m['status'] as String,
                                        variant: m['variant'] as RepsiBadgeVariant,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${m['plan']} • ${m['visits']} • ${m['branch']}',
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
                                    m['expiresIn'] as String,
                                    style: AppTypography.caption.copyWith(
                                      color: m['status'] == 'Expiring' || m['status'] == 'Expired'
                                          ? AppColors.error
                                          : AppColors.textSecondary,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                'Trainer: ${m['trainer']}',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.textMuted,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.phone_outlined, size: 14, color: AppColors.primaryDark),
                                label: const Text('Call', style: TextStyle(fontSize: 12)),
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 6),
                                  side: const BorderSide(color: AppColors.border),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.chat_bubble_outline_rounded, size: 14, color: Color(0xFF2563EB)),
                                label: const Text('Message', style: TextStyle(fontSize: 12)),
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 6),
                                  side: const BorderSide(color: AppColors.border),
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
            ),
          ],
        ),
      ),
    );
  }
}
