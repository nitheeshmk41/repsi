import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_search_field.dart';
import 'add_member_view.dart';
import 'member_detail_view.dart';

class MembersListView extends StatefulWidget {
  const MembersListView({super.key});

  @override
  State<MembersListView> createState() => _MembersListViewState();
}

class _MembersListViewState extends State<MembersListView> {
  int _selectedFilter = 0;
  final List<String> _filters = ['Active', 'Expired', 'Expiring', 'Pending'];

  final List<Map<String, dynamic>> _members = [
    {
      'id': '1',
      'name': 'Rahul Kumar',
      'plan': 'Premium',
      'status': 'Active',
      'statusColor': AppColors.primary,
      'expires': '24 Oct',
      'attendance': '18/24',
    },
    {
      'id': '2',
      'name': 'Vijay',
      'plan': 'Standard',
      'status': 'Active',
      'statusColor': AppColors.primary,
      'expires': '15 Nov',
      'attendance': '12/24',
    },
    {
      'id': '3',
      'name': 'Sneha',
      'plan': 'Premium',
      'status': 'Expiring',
      'statusColor': AppColors.warning,
      'expires': '28 Sep',
      'attendance': '20/24',
    },
    {
      'id': '4',
      'name': 'Arjun',
      'plan': 'Standard',
      'status': 'Pending',
      'statusColor': Color(0xFF6B7280),
      'expires': 'Unpaid',
      'attendance': '0/0',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Members',
          style: AppTypography.heading.copyWith(fontSize: 20, fontWeight: FontWeight.w700),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_outlined, color: AppColors.primary),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AddMemberView()),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 8,
          ),
          child: Column(
            children: [
              // Search Input (Owner Mockup Screen 2)
              RepsiStaggerItem(
                index: 0,
                child: const RepsiSearchField(
                  hintText: 'Search members...',
                ),
              ),
              const SizedBox(height: 14),

              // Filter Pills
              RepsiStaggerItem(
                index: 1,
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: List.generate(_filters.length, (index) {
                      final isSelected = _selectedFilter == index;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedFilter = index),
                        child: Container(
                          margin: const EdgeInsets.only(right: 10),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primary : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected ? AppColors.primary : AppColors.border,
                            ),
                          ),
                          child: Text(
                            _filters[index],
                            style: AppTypography.caption.copyWith(
                              color: isSelected ? Colors.white : AppColors.textSecondary,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Member Cards
              Expanded(
                child: ListView.separated(
                  itemCount: _members.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final m = _members[index];

                    return RepsiStaggerItem(
                      index: index + 2,
                      child: RepsiCard(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => MemberDetailView(memberId: m['id'] as String),
                            ),
                          );
                        },
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 24,
                              backgroundColor: AppColors.primarySoft,
                              child: Text(
                                (m['name'] as String)[0],
                                style: const TextStyle(
                                  color: AppColors.primaryDark,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        m['name'] as String,
                                        style: AppTypography.headingSmall.copyWith(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.text,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: (m['statusColor'] as Color).withValues(alpha: 0.12),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Text(
                                          m['status'] as String,
                                          style: AppTypography.caption.copyWith(
                                            color: m['statusColor'] as Color,
                                            fontWeight: FontWeight.w700,
                                            fontSize: 11,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${m['plan']} · Expires: ${m['expires']}',
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  'Attendance',
                                  style: AppTypography.caption.copyWith(
                                    fontSize: 11,
                                    color: AppColors.textMuted,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  m['attendance'] as String,
                                  style: AppTypography.headingSmall.copyWith(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.text,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
