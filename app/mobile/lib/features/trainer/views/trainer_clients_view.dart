import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_search_field.dart';
import 'trainer_client_detail_view.dart';

class TrainerClientsView extends StatefulWidget {
  const TrainerClientsView({super.key});

  @override
  State<TrainerClientsView> createState() => _TrainerClientsViewState();
}

class _TrainerClientsViewState extends State<TrainerClientsView> {
  int _selectedFilter = 0;
  final List<String> _filters = ['All', 'Active', 'Pending Plans', 'Inactive'];
  String _searchQuery = '';

  final List<Map<String, String>> _clients = [
    {
      'name': 'Rahul Sharma',
      'plan': 'Gold Membership',
      'goal': 'Weight loss',
      'status': 'Active',
      'weight': '78.4 kg',
      'weightTrend': '↓ 4.8 kg',
      'attendance': '82%',
      'nextSession': 'Today • 6 PM',
      'program': 'Upper Body A',
      'calories': '2,100 kcal',
    },
    {
      'name': 'Priya Nair',
      'plan': 'Platinum Plan',
      'goal': 'Strength',
      'status': 'Active',
      'weight': '58.2 kg',
      'weightTrend': '↑ 2.1 kg',
      'attendance': '90%',
      'nextSession': 'Tomorrow • 10 AM',
      'program': 'Lower Body Power',
      'calories': '1,950 kcal',
    },
    {
      'name': 'Arjun Nair',
      'plan': 'Gold Membership',
      'goal': 'Muscle gain',
      'status': 'Active',
      'weight': '74.1 kg',
      'weightTrend': '↑ 3.2 kg',
      'attendance': '75%',
      'nextSession': 'Fri • 12 PM',
      'program': 'Hypertrophy Split',
      'calories': '2,600 kcal',
    },
    {
      'name': 'Sneha Rao',
      'plan': 'Silver Plan',
      'goal': 'Mobility & Core',
      'status': 'Active',
      'weight': '61.0 kg',
      'weightTrend': '↓ 1.5 kg',
      'attendance': '85%',
      'nextSession': 'Thu • 4 PM',
      'program': 'Functional Core',
      'calories': '1,800 kcal',
    },
    {
      'name': 'Kavya Menon',
      'plan': 'Standard Plan',
      'goal': 'General Fitness',
      'status': 'Inactive',
      'weight': '54.0 kg',
      'weightTrend': '0.0 kg',
      'attendance': '50%',
      'nextSession': 'No upcoming session',
      'program': 'None assigned',
      'calories': '1,600 kcal',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredClients = _clients.where((client) {
      if (_selectedFilter == 1 && client['status'] != 'Active') return false;
      if (_selectedFilter == 2 && client['program'] != 'None assigned') return false;
      if (_selectedFilter == 3 && client['status'] != 'Inactive') return false;
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final name = client['name']!.toLowerCase();
        final goal = client['goal']!.toLowerCase();
        return name.contains(query) || goal.contains(query);
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'My Clients',
          style: AppTypography.heading.copyWith(fontSize: 20, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 8,
          ),
          child: Column(
            children: [
              // Search Input
              RepsiStaggerItem(
                index: 0,
                child: RepsiSearchField(
                  hintText: 'Search clients by name or goal...',
                  onChanged: (val) => setState(() => _searchQuery = val),
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
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
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
                              fontSize: 12,
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Client Cards
              Expanded(
                child: filteredClients.isEmpty
                    ? Center(
                        child: Text(
                          'No clients found matching filter',
                          style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                        ),
                      )
                    : ListView.separated(
                        itemCount: filteredClients.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final client = filteredClients[index];
                          final isActive = client['status'] == 'Active';

                          return RepsiStaggerItem(
                            index: index + 2,
                            child: RepsiCard(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => TrainerClientDetailView(client: client),
                                  ),
                                );
                              },
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 24,
                                        backgroundColor: AppColors.primarySoft,
                                        child: Text(
                                          client['name']![0],
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
                                                Flexible(
                                                  child: Text(
                                                    client['name']!,
                                                    maxLines: 1,
                                                    overflow: TextOverflow.ellipsis,
                                                    style: AppTypography.headingSmall.copyWith(
                                                      fontSize: 15,
                                                      fontWeight: FontWeight.w700,
                                                      color: AppColors.text,
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(width: 6),
                                                Container(
                                                  width: 7,
                                                  height: 7,
                                                  decoration: BoxDecoration(
                                                    color: isActive ? AppColors.primary : AppColors.textMuted,
                                                    shape: BoxShape.circle,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 3),
                                            Text(
                                              '${client['goal']} · ${client['plan']}',
                                              style: AppTypography.caption.copyWith(
                                                color: AppColors.textSecondary,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const Icon(
                                        Icons.chevron_right_rounded,
                                        size: 20,
                                        color: AppColors.textMuted,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: AppColors.surfaceSubtle,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Weight: ${client['weight']}',
                                          style: AppTypography.caption.copyWith(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 11,
                                            color: AppColors.text,
                                          ),
                                        ),
                                        Text(
                                          'Attendance: ${client['attendance']}',
                                          style: AppTypography.caption.copyWith(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 11,
                                            color: AppColors.primaryDark,
                                          ),
                                        ),
                                        Text(
                                          client['nextSession']!,
                                          style: AppTypography.caption.copyWith(
                                            fontSize: 11,
                                            color: AppColors.textSecondary,
                                          ),
                                        ),
                                      ],
                                    ),
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
