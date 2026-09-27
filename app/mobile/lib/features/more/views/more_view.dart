import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../auth/providers/auth_provider.dart';

class MoreView extends ConsumerWidget {
  const MoreView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final ownerName = user?.fullName ?? 'Nitheesh';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'More',
          style: AppTypography.heading.copyWith(fontSize: 20, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 12,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // User / Gym Profile Card
              RepsiStaggerItem(
                index: 0,
                child: RepsiCard(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.primarySoft,
                          border: Border.all(color: AppColors.primary, width: 1.5),
                        ),
                        child: const Center(
                          child: Icon(Icons.storefront_rounded, color: AppColors.primaryDark, size: 24),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              ownerName,
                              style: AppTypography.headingSmall.copyWith(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppColors.text,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Gym Owner · Repsi Fitness Hubs',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push(RouteNames.selectRole),
                        child: Text(
                          'Switch Role',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // SECTION 1: BUSINESS
              RepsiStaggerItem(
                index: 1,
                child: _buildSection(
                  title: 'Business',
                  items: [
                    {'icon': Icons.account_tree_outlined, 'title': 'Branches', 'badge': '3 Active'},
                    {'icon': Icons.badge_outlined, 'title': 'Staff Management', 'badge': '8 Staff'},
                    {'icon': Icons.security_rounded, 'title': 'Roles & Permissions', 'badge': null},
                    {'icon': Icons.card_membership_rounded, 'title': 'Membership Plans', 'badge': null},
                    {'icon': Icons.sports_gymnastics_rounded, 'title': 'Classes & Schedules', 'badge': null},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 18),

              // SECTION 2: FINANCE
              RepsiStaggerItem(
                index: 2,
                child: _buildSection(
                  title: 'Finance',
                  items: [
                    {'icon': Icons.currency_rupee_rounded, 'title': 'Payments & Collections', 'badge': '₹2.84L'},
                    {'icon': Icons.receipt_long_outlined, 'title': 'GST Invoices', 'badge': null},
                    {'icon': Icons.account_balance_wallet_outlined, 'title': 'Expenses & Payroll', 'badge': null},
                    {'icon': Icons.bar_chart_rounded, 'title': 'Financial P&L Reports', 'badge': null},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 18),

              // SECTION 3: GROWTH
              RepsiStaggerItem(
                index: 3,
                child: _buildSection(
                  title: 'Growth',
                  items: [
                    {'icon': Icons.filter_alt_outlined, 'title': 'CRM Lead Pipeline', 'badge': '23 Leads'},
                    {'icon': Icons.campaign_outlined, 'title': 'Automated Campaigns', 'badge': '3 Active'},
                    {'icon': Icons.card_giftcard_rounded, 'title': 'Referrals & Rewards', 'badge': null},
                    {'icon': Icons.local_offer_outlined, 'title': 'Seasonal Offers', 'badge': null},
                    {'icon': Icons.bolt_rounded, 'title': 'Automation Rules', 'badge': '3 Rules'},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 18),

              // SECTION 4: ONLINE
              RepsiStaggerItem(
                index: 4,
                child: _buildSection(
                  title: 'Online',
                  items: [
                    {'icon': Icons.language_rounded, 'title': 'Website Builder', 'badge': 'Published'},
                    {'icon': Icons.perm_media_outlined, 'title': 'Content & Media CMS', 'badge': null},
                    {'icon': Icons.qr_code_2_rounded, 'title': 'QR Codes Station', 'badge': null},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 18),

              // SECTION 5: SYSTEM
              RepsiStaggerItem(
                index: 5,
                child: _buildSection(
                  title: 'System',
                  items: [
                    {'icon': Icons.extension_outlined, 'title': 'Integrations (Health, Razorpay, WA)', 'badge': null},
                    {'icon': Icons.notifications_none_rounded, 'title': 'Notifications Center', 'badge': null},
                    {'icon': Icons.lock_outline_rounded, 'title': 'Security & Audit Logs', 'badge': null},
                    {'icon': Icons.settings_outlined, 'title': 'Settings', 'badge': null},
                  ],
                  context: context,
                ),
              ),
              const SizedBox(height: 20),

              // Sign Out Button
              RepsiStaggerItem(
                index: 6,
                child: RepsiCard(
                  onTap: () async {
                    final shouldLogout = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Sign Out'),
                        content: const Text('Are you sure you want to sign out of Repsi?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            child: const Text('Sign Out', style: TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                    );

                    if (shouldLogout == true) {
                      await ref.read(authProvider.notifier).logout();
                      if (context.mounted) {
                        context.go(RouteNames.login);
                      }
                    }
                  },
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Sign Out',
                        style: TextStyle(
                          color: Color(0xFFDC2626),
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required List<Map<String, dynamic>> items,
    required BuildContext context,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            title.toUpperCase(),
            style: AppTypography.caption.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w700,
              fontSize: 11,
              letterSpacing: 0.8,
            ),
          ),
        ),
        RepsiCard(
          padding: EdgeInsets.zero,
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: items.length,
            separatorBuilder: (_, __) => const Divider(
              height: 1,
              thickness: 1,
              indent: 52,
              color: AppColors.border,
            ),
            itemBuilder: (context, index) {
              final item = items[index];
              return ListTile(
                onTap: () {
                  HapticFeedback.lightImpact();
                  _handleMenuTap(context, item['title'] as String);
                },
                leading: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    item['icon'] as IconData,
                    size: 18,
                    color: AppColors.primaryDark,
                  ),
                ),
                title: Text(
                  item['title'] as String,
                  style: AppTypography.body.copyWith(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                    color: AppColors.text,
                  ),
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (item['badge'] != null) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceSubtle,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          item['badge'] as String,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.primaryDark),
                        ),
                      ),
                      const SizedBox(width: 6),
                    ],
                    const Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: AppColors.textMuted,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _handleMenuTap(BuildContext context, String title) {
    if (title.contains('Website Builder')) {
      _showWebsiteBuilderModal(context);
    } else if (title.contains('Automation')) {
      _showAutomationsModal(context);
    } else if (title.contains('Roles') || title.contains('Staff')) {
      context.push(RouteNames.operations);
    } else if (title.contains('Branches')) {
      _showBranchesModal(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Opened $title module')),
      );
    }
  }

  void _showWebsiteBuilderModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.75,
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            'Website Builder',
                            style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(color: AppColors.primarySoft, borderRadius: BorderRadius.circular(4)),
                            child: const Text('● Published', style: TextStyle(color: AppColors.primaryDark, fontSize: 10, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      const Text(
                        'repsifitness.repsi.app',
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: RepsiButton(
                      text: 'Preview Site',
                      variant: RepsiButtonVariant.outline,
                      leadingIcon: const Icon(Icons.visibility_outlined, size: 16),
                      size: RepsiButtonSize.small,
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Opening repsifitness.repsi.app preview...')),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: RepsiButton(
                      text: 'Share Link',
                      variant: RepsiButtonVariant.outline,
                      leadingIcon: const Icon(Icons.share_outlined, size: 16),
                      size: RepsiButtonSize.small,
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Website link copied to clipboard')),
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Text('Pages & Sections', style: AppTypography.sectionHeading.copyWith(fontSize: 14, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Expanded(
                child: ListView(
                  children: const [
                    _PageTile(title: 'Hero Section', subtitle: 'Main banner, slogan, lead capture form', isEnabled: true),
                    _PageTile(title: 'About Gym', subtitle: 'Philosophy, facilities, equipment showcase', isEnabled: true),
                    _PageTile(title: 'Membership Plans', subtitle: 'Gold, Silver, Platinum pricing tables', isEnabled: true),
                    _PageTile(title: 'Trainers Roster', subtitle: 'Alex Vance, Arun Kumar profiles', isEnabled: true),
                    _PageTile(title: 'Class Schedule', subtitle: 'Live class calendar with instant booking', isEnabled: true),
                    _PageTile(title: 'Member Testimonials', subtitle: 'Transformation photos & Google Reviews', isEnabled: true),
                    _PageTile(title: 'Contact & Location', subtitle: 'Indiranagar Hub map & WhatsApp hotline', isEnabled: true),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              RepsiButton(
                text: 'Publish Changes',
                isFullWidth: true,
                size: RepsiButtonSize.large,
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Website published live to repsifitness.repsi.app!'), backgroundColor: AppColors.primary),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAutomationsModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Automation Workflows',
                style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 4),
              const Text('Automated actions based on triggers', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              const SizedBox(height: 16),
              const _AutomationRuleTile(
                trigger: 'WHEN Membership expires in 7 days',
                action: 'THEN Send notification + WhatsApp renewal offer + Create task',
              ),
              const SizedBox(height: 10),
              const _AutomationRuleTile(
                trigger: 'WHEN Member has not visited for 14 days',
                action: 'THEN Notify assigned trainer + Create retention follow-up task',
              ),
              const SizedBox(height: 10),
              const _AutomationRuleTile(
                trigger: 'WHEN Payment fails',
                action: 'THEN Notify member + Notify owner + Auto-retry payment in 24h',
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  void _showBranchesModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('My Businesses: Repsi Fitness', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              SizedBox(height: 14),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.location_on_rounded, color: AppColors.primary),
                title: Text('Indiranagar Hub', style: TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text('1,248 members · ₹84,200 today'),
                trailing: Icon(Icons.check_circle_rounded, color: AppColors.primary),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.location_on_outlined, color: AppColors.textSecondary),
                title: Text('Koramangala Center', style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: Text('842 members · ₹52,300 today'),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.location_on_outlined, color: AppColors.textSecondary),
                title: Text('Whitefield Arena', style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: Text('531 members · ₹31,800 today'),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _PageTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool isEnabled;

  const _PageTile({required this.title, required this.subtitle, required this.isEnabled});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: const Icon(Icons.web_outlined, color: AppColors.primary),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
      trailing: const Icon(Icons.edit_note_rounded, color: AppColors.textSecondary),
    );
  }
}

class _AutomationRuleTile extends StatelessWidget {
  final String trigger;
  final String action;

  const _AutomationRuleTile({required this.trigger, required this.action});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceSubtle,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.bolt_rounded, size: 16, color: Color(0xFFD97706)),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  trigger,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.text),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            action,
            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
