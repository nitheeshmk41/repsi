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
  final List<String> _filters = ['All', 'Active', 'Inactive'];

  final List<Map<String, String>> _clients = [
    {'name': 'Rahul Kumar', 'plan': 'Premium', 'goal': 'Muscle Gain', 'status': 'Active'},
    {'name': 'Vijay', 'plan': 'Standard', 'goal': 'Weight Loss', 'status': 'Active'},
    {'name': 'Sneha', 'plan': 'Premium', 'goal': 'Strength', 'status': 'Active'},
    {'name': 'Kavya', 'plan': 'Premium', 'goal': 'Fitness', 'status': 'Inactive'},
  ];

  @override
  Widget build(BuildContext context) {
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
              // Search Input (Trainer Mockup Screen 2)
              RepsiStaggerItem(
                index: 0,
                child: const RepsiSearchField(
                  hintText: 'Search clients...',
                ),
              ),
              const SizedBox(height: 14),

              // Filter Pills
              RepsiStaggerItem(
                index: 1,
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
              const SizedBox(height: 16),

              // Client Cards
              Expanded(
                child: ListView.separated(
                  itemCount: _clients.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final client = _clients[index];

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
                        child: Row(
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
                                  Text(
                                    client['name']!,
                                    style: AppTypography.headingSmall.copyWith(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.text,
                                    ),
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    '${client['plan']} · ${client['goal']}',
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 13,
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
