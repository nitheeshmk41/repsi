import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_screen_background.dart';
import '../providers/auth_provider.dart';

class RoleSelectionView extends ConsumerWidget {
  const RoleSelectionView({super.key});

  void _selectRole(BuildContext context, WidgetRef ref, String role) {
    ref.read(authProvider.notifier).setRole(role);
    context.go(RouteNames.roleDashboard(role));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => context.pop(),
        ),
      ),
      body: RepsiScreenBackground(
        imagePath: 'assets/images/ownerscreen.png',
        imageOpacity: 0.04,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.pageHorizontalPadding,
              vertical: 12,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 8),
                // Heading: Choose your workspace
                RepsiStaggerItem(
                  index: 0,
                  child: Text(
                    'Choose your workspace',
                    style: AppTypography.heading.copyWith(
                      fontSize: 26,
                      fontWeight: FontWeight.w700,
                      color: AppColors.text,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                RepsiStaggerItem(
                  index: 1,
                  child: Text(
                    "Select the organization and workspace you'd like to access",
                    style: AppTypography.body.copyWith(
                      fontSize: 15,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Workspace 1: Repsi Fitness — Owner
                RepsiStaggerItem(
                  index: 2,
                  child: _RoleCard(
                    emoji: '🏢',
                    title: 'Repsi Fitness — Owner',
                    subtitle: 'Business command center: revenue, members, attendance & ops',
                    tag: 'Indiranagar Hub',
                    iconBgColor: AppColors.primarySoft,
                    onTap: () => _selectRole(context, ref, 'OWNER'),
                  ),
                ),
                const SizedBox(height: 14),

                // Workspace 2: Repsi Fitness — Trainer
                RepsiStaggerItem(
                  index: 3,
                  child: _RoleCard(
                    emoji: '🏋️',
                    title: 'Repsi Fitness — Trainer',
                    subtitle: 'Coaching workspace: client training, workout & diet builder, chat',
                    tag: 'Active Coach',
                    iconBgColor: const Color(0xFFEBF5FF),
                    onTap: () => _selectRole(context, ref, 'TRAINER'),
                  ),
                ),
                const SizedBox(height: 14),

                // Workspace 3: Repsi Fitness — Member
                RepsiStaggerItem(
                  index: 4,
                  child: _RoleCard(
                    emoji: '👤',
                    title: 'Repsi Fitness — Member',
                    subtitle: 'Personal fitness companion: streak, workouts, QR check-in & progress',
                    tag: 'Gold Member',
                    iconBgColor: const Color(0xFFF0FDF4),
                    onTap: () => _selectRole(context, ref, 'USER'),
                  ),
                ),
                const SizedBox(height: 14),

                // Workspace 4: Platform Admin
                RepsiStaggerItem(
                  index: 5,
                  child: _RoleCard(
                    emoji: '🛡️',
                    title: 'Repsi Platform — Admin',
                    subtitle: 'Internal administration: gym tenants, accounts & system metrics',
                    tag: 'Superadmin',
                    iconBgColor: const Color(0xFFF3E8FF),
                    onTap: () => _selectRole(context, ref, 'ADMIN'),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String emoji;
  final String title;
  final String subtitle;
  final String? tag;
  final Color iconBgColor;
  final VoidCallback onTap;

  const _RoleCard({
    required this.emoji,
    required this.title,
    required this.subtitle,
    this.tag,
    required this.iconBgColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return RepsiCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Text(
              emoji,
              style: const TextStyle(fontSize: 22),
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
                        title,
                        style: AppTypography.headingSmall.copyWith(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.text,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (tag != null) ...[
                      const SizedBox(width: 6),
                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primarySoft,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            tag!,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppTypography.caption.copyWith(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primaryDark,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: AppTypography.caption.copyWith(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 4),
          const Icon(
            Icons.chevron_right_rounded,
            size: 20,
            color: AppColors.textMuted,
          ),
        ],
      ),
    );
  }
}
