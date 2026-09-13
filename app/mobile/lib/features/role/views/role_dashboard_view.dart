import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/models/user_model.dart';

class RoleDashboardView extends StatelessWidget {
  final UserRole role;

  const RoleDashboardView({super.key, required this.role});

  @override
  Widget build(BuildContext context) {
    final isTrainer = role == UserRole.trainer;
    final title = isTrainer ? 'Trainer workspace' : 'Your fitness space';
    final subtitle = isTrainer ? 'Your members and sessions at a glance.' : 'Your workouts, progress, and membership in one place.';
    final cards = isTrainer
        ? const [('Assigned members', '0'), ('Today\'s sessions', '0'), ('Pending tasks', '0')]
        : const [('Membership', 'Active'), ('Today\'s workout', 'Not assigned'), ('Attendance', '0 days')];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('REPSI'), actions: const [Padding(padding: EdgeInsets.only(right: 16), child: Icon(Icons.account_circle_outlined))]),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Text(title, style: AppTypography.headingLarge.copyWith(color: AppColors.textPrimary)),
          const SizedBox(height: AppSpacing.xs),
          Text(subtitle, style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.xl),
          ...cards.map((card) => Card(
                child: ListTile(
                  title: Text(card.$1, style: AppTypography.labelLarge),
                  trailing: Text(card.$2, style: AppTypography.headingMedium.copyWith(color: AppColors.primaryDark)),
                ),
              )),
        ],
      ),
    );
  }
}