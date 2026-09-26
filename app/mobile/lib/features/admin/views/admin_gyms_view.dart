import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_search_field.dart';

class AdminGymsView extends StatefulWidget {
  const AdminGymsView({super.key});

  @override
  State<AdminGymsView> createState() => _AdminGymsViewState();
}

class _AdminGymsViewState extends State<AdminGymsView> {
  final List<Map<String, dynamic>> _gyms = [
    {
      'name': 'Apex Fitness',
      'owner': 'Nitheesh M',
      'members': '186',
      'plan': 'Enterprise',
      'status': 'Active',
      'statusColor': AppColors.primary,
    },
    {
      'name': 'Iron Core Gym',
      'owner': 'David Miller',
      'members': '342',
      'plan': 'Pro',
      'status': 'Active',
      'statusColor': AppColors.primary,
    },
    {
      'name': 'Velocity Athletic Club',
      'owner': 'Sarah Jenkins',
      'members': '98',
      'plan': 'Starter',
      'status': 'Trialing',
      'statusColor': AppColors.warning,
    },
    {
      'name': 'Spartan Power Gym',
      'owner': 'Vikram Patel',
      'members': '210',
      'plan': 'Pro',
      'status': 'Active',
      'statusColor': AppColors.primary,
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
          'Gyms',
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
              RepsiStaggerItem(
                index: 0,
                child: const RepsiSearchField(hintText: 'Search gyms by name or owner...'),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.separated(
                  itemCount: _gyms.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final gym = _gyms[index];

                    return RepsiStaggerItem(
                      index: index + 1,
                      child: RepsiCard(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: AppColors.primarySoft,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.storefront_rounded, color: AppColors.primaryDark, size: 22),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        gym['name'] as String,
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
                                          color: (gym['statusColor'] as Color).withValues(alpha: 0.12),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          gym['status'] as String,
                                          style: AppTypography.caption.copyWith(
                                            color: gym['statusColor'] as Color,
                                            fontWeight: FontWeight.w700,
                                            fontSize: 11,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    'Owner: ${gym['owner']} · ${gym['plan']}',
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
                                  gym['members'] as String,
                                  style: AppTypography.headingSmall.copyWith(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.text,
                                  ),
                                ),
                                Text(
                                  'members',
                                  style: AppTypography.caption.copyWith(
                                    fontSize: 11,
                                    color: AppColors.textMuted,
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
