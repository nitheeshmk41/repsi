import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_press.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../auth/providers/auth_provider.dart';

class DashboardView extends ConsumerStatefulWidget {
  const DashboardView({super.key});

  @override
  ConsumerState<DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends ConsumerState<DashboardView> {
  String _selectedBranch = 'Indiranagar';

  final List<Map<String, dynamic>> _branches = const [
    {'name': 'Indiranagar', 'members': '1,248', 'revenue': '₹84,200', 'status': 'Open'},
    {'name': 'Koramangala', 'members': '842', 'revenue': '₹52,300', 'status': 'Open'},
    {'name': 'Whitefield', 'members': '531', 'revenue': '₹31,800', 'status': 'Open'},
  ];

  void _showBranchPicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.border,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Switch Gym Branch',
                  style: AppTypography.headingSmall.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 4),
                Text(
                  'Manage multiple locations seamlessly without logging out',
                  style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                ),
                const SizedBox(height: 16),
                ..._branches.map((b) {
                  final isSelected = b['name'] == _selectedBranch;
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: BorderSide(
                        color: isSelected ? AppColors.primary : AppColors.border,
                        width: isSelected ? 1.5 : 1,
                      ),
                    ),
                    tileColor: isSelected ? AppColors.primarySoft : Colors.white,
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primary : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      alignment: Alignment.center,
                      child: Icon(
                        Icons.storefront_rounded,
                        color: isSelected ? Colors.white : AppColors.text,
                        size: 20,
                      ),
                    ),
                    title: Text(
                      'Repsi Fitness — ${b['name']}',
                      style: AppTypography.bodySmall.copyWith(
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    subtitle: Text(
                      '${b['members']} members • ${b['revenue']} today',
                      style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                    ),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 20)
                        : null,
                    onTap: () {
                      setState(() => _selectedBranch = b['name'] as String);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Switched to ${b['name']} branch')),
                      );
                    },
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final ownerName = user?.fullName ?? 'Nitheesh';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 14,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 0. Top Bar: Repsi Primary Logo + Branch Picker + Notification + Role Switcher
              RepsiStaggerItem(
                index: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: Image.asset(
                        'assets/logos/primary_logo.png',
                        height: 28,
                        fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => const Text(
                          'Repsi',
                          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.primary),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Branch Switcher Pill
                        GestureDetector(
                          onTap: () => _showBranchPicker(context),
                          child: Container(
                            constraints: const BoxConstraints(maxWidth: 115),
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.border, width: 1),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: AppColors.primary,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 5),
                                Flexible(
                                  child: Text(
                                    _selectedBranch,
                                    style: AppTypography.caption.copyWith(
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.text,
                                      fontSize: 12,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const SizedBox(width: 2),
                                const Icon(Icons.keyboard_arrow_down_rounded, size: 14, color: AppColors.textMuted),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        // Notifications
                        Container(
                          width: 34,
                          height: 34,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.notifications_outlined, size: 18, color: AppColors.textSecondary),
                        ),
                        const SizedBox(width: 6),
                        // Role Switcher Avatar
                        GestureDetector(
                          onTap: () => context.push(RouteNames.selectRole),
                          child: Container(
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.primary, width: 1.5),
                              color: AppColors.primarySoft,
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              ownerName.isNotEmpty ? ownerName[0].toUpperCase() : 'N',
                              style: const TextStyle(
                                color: AppColors.primaryDark,
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // 1. Business Greeting
              RepsiStaggerItem(
                index: 1,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'Good morning, $ownerName',
                          style: AppTypography.heading.copyWith(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text('👋', style: TextStyle(fontSize: 18)),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Your gym $_selectedBranch • Open',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 13.5,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // 2. Today's Snapshot (4 KPI Cards)
              RepsiStaggerItem(
                index: 2,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Today's snapshot",
                      style: AppTypography.headingSmall.copyWith(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: _buildKpiCard(
                            title: "Today's revenue",
                            value: '₹42,800',
                            subtitle: '↑ 12.4% vs yesterday',
                            color: AppColors.primaryDark,
                            bgColor: AppColors.primarySoft,
                            icon: Icons.currency_rupee_rounded,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Check-ins today',
                            value: '168',
                            subtitle: '83.6% turnout',
                            color: const Color(0xFF2563EB),
                            bgColor: const Color(0xFFEBF5FF),
                            icon: Icons.qr_code_scanner_rounded,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Active members',
                            value: '1,248',
                            subtitle: '+42 this month',
                            color: const Color(0xFF059669),
                            bgColor: const Color(0xFFECFDF5),
                            icon: Icons.groups_rounded,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Renewals due',
                            value: '14',
                            subtitle: 'Next 7 days',
                            color: const Color(0xFFD97706),
                            bgColor: const Color(0xFFFEF3C7),
                            icon: Icons.event_repeat_rounded,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 3. Quick Actions Grid
              RepsiStaggerItem(
                index: 3,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Quick actions',
                      style: AppTypography.headingSmall.copyWith(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 10,
                      children: [
                        _buildQuickActionBtn(
                          label: '+ Add member',
                          icon: Icons.person_add_alt_1_rounded,
                          onTap: () => context.push(RouteNames.addMember),
                        ),
                        _buildQuickActionBtn(
                          label: '✓ Attendance',
                          icon: Icons.check_circle_outline_rounded,
                          onTap: () => context.go(RouteNames.operations),
                        ),
                        _buildQuickActionBtn(
                          label: '₹ Collect payment',
                          icon: Icons.payments_outlined,
                          onTap: () => context.go(RouteNames.finance),
                        ),
                        _buildQuickActionBtn(
                          label: '▣ Show QR',
                          icon: Icons.qr_code_rounded,
                          onTap: () => context.go(RouteNames.operations),
                        ),
                        _buildQuickActionBtn(
                          label: '+ Add lead',
                          icon: Icons.contact_phone_outlined,
                          onTap: () => context.go(RouteNames.operations),
                        ),
                        _buildQuickActionBtn(
                          label: '+ New sale',
                          icon: Icons.point_of_sale_rounded,
                          onTap: () => context.go(RouteNames.finance),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 4. Business Alerts (Immediate High-Value Attention)
              RepsiStaggerItem(
                index: 4,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Business alerts',
                      style: AppTypography.headingSmall.copyWith(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 10),
                    _buildAlertCard(
                      icon: Icons.warning_amber_rounded,
                      iconColor: const Color(0xFFD97706),
                      bgColor: const Color(0xFFFFFBEB),
                      borderColor: const Color(0xFFFDE68A),
                      title: '14 memberships expire this week',
                      actionLabel: 'Send reminders',
                      onAction: () => context.go(RouteNames.members),
                    ),
                    const SizedBox(height: 8),
                    _buildAlertCard(
                      icon: Icons.error_outline_rounded,
                      iconColor: AppColors.error,
                      bgColor: const Color(0xFFFEF2F2),
                      borderColor: const Color(0xFFFECACA),
                      title: '7 failed payments requiring retry',
                      actionLabel: 'View details',
                      onAction: () => context.go(RouteNames.finance),
                    ),
                    const SizedBox(height: 8),
                    _buildAlertCard(
                      icon: Icons.contact_support_outlined,
                      iconColor: const Color(0xFF2563EB),
                      bgColor: const Color(0xFFEFF6FF),
                      borderColor: const Color(0xFFBFDBFE),
                      title: '23 leads need follow-up today',
                      actionLabel: 'Open CRM',
                      onAction: () => context.go(RouteNames.operations),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 5. Live Activity Feed
              RepsiStaggerItem(
                index: 5,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.error,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                'LIVE',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 10,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Live activity',
                              style: AppTypography.headingSmall.copyWith(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: AppColors.text,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          'Today',
                          style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    RepsiCard(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      child: Column(
                        children: [
                          _buildActivityItem('Rahul checked in', '07:14', Icons.how_to_reg_rounded, AppColors.primary),
                          const Divider(height: 1, color: AppColors.border),
                          _buildActivityItem('Priya renewed membership', '08:02', Icons.autorenew_rounded, const Color(0xFF2563EB)),
                          const Divider(height: 1, color: AppColors.border),
                          _buildActivityItem('Arjun booked PT with Alex', '08:16', Icons.fitness_center_rounded, const Color(0xFF8B5CF6)),
                          const Divider(height: 1, color: AppColors.border),
                          _buildActivityItem('₹5,000 payment received', '08:21', Icons.payments_rounded, const Color(0xFF059669)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required String subtitle,
    required Color color,
    required Color bgColor,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: AppTypography.caption.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 11.5,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8)),
                child: Icon(icon, color: color, size: 16),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: AppTypography.headingSmall.copyWith(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: AppTypography.caption.copyWith(
              color: color,
              fontWeight: FontWeight.w600,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionBtn({
    required String label,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return RepsiPress(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.border, width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: AppColors.primaryDark),
            const SizedBox(width: 6),
            Text(
              label,
              style: AppTypography.caption.copyWith(
                fontSize: 12.5,
                fontWeight: FontWeight.w600,
                color: AppColors.text,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAlertCard({
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required Color borderColor,
    required String title,
    required String actionLabel,
    required VoidCallback onAction,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: borderColor, width: 1),
      ),
      child: Row(
        children: [
          Icon(icon, color: iconColor, size: 18),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: AppTypography.caption.copyWith(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.text,
              ),
            ),
          ),
          GestureDetector(
            onTap: onAction,
            child: Text(
              actionLabel,
              style: AppTypography.caption.copyWith(
                fontSize: 11.5,
                fontWeight: FontWeight.w700,
                color: iconColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem(String title, String time, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              title,
              style: AppTypography.bodySmall.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.text,
                fontSize: 13,
              ),
            ),
          ),
          Text(
            time,
            style: AppTypography.caption.copyWith(
              color: AppColors.textSecondary,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
