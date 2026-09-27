import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_press.dart';
import '../../../shared/widgets/repsi_badge.dart';
import '../../../shared/widgets/repsi_card.dart';

class MemberDetailView extends ConsumerStatefulWidget {
  final String memberId;

  const MemberDetailView({
    super.key,
    required this.memberId,
  });

  @override
  ConsumerState<MemberDetailView> createState() => _MemberDetailViewState();
}

class _MemberDetailViewState extends ConsumerState<MemberDetailView> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 7, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showActionSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.edit_outlined, color: AppColors.primary),
                title: const Text('Edit Member Profile'),
                onTap: () => Navigator.pop(ctx),
              ),
              ListTile(
                leading: const Icon(Icons.ac_unit_rounded, color: Color(0xFF2563EB)),
                title: const Text('Freeze Membership (Vacation/Medical)'),
                onTap: () => Navigator.pop(ctx),
              ),
              ListTile(
                leading: const Icon(Icons.upgrade_rounded, color: Color(0xFF8B5CF6)),
                title: const Text('Upgrade / Change Tier'),
                onTap: () => Navigator.pop(ctx),
              ),
              ListTile(
                leading: const Icon(Icons.fitness_center_rounded, color: AppColors.primaryDark),
                title: const Text('Assign / Change Personal Trainer'),
                onTap: () => Navigator.pop(ctx),
              ),
              ListTile(
                leading: const Icon(Icons.block_rounded, color: AppColors.error),
                title: const Text('Suspend / Disable Account', style: TextStyle(color: AppColors.error)),
                onTap: () => Navigator.pop(ctx),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert_rounded, color: AppColors.text),
            onPressed: () => _showActionSheet(context),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Member Header Card (Rahul Sharma ● Active Gold Membership Expires 24 Oct)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
              child: RepsiCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const CircleAvatar(
                          radius: 26,
                          backgroundColor: AppColors.primarySoft,
                          child: Text(
                            'RS',
                            style: TextStyle(
                              color: AppColors.primaryDark,
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
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
                                    'Rahul Sharma',
                                    style: AppTypography.headingSmall.copyWith(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.text,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  const RepsiBadge(
                                    label: 'Active',
                                    variant: RepsiBadgeVariant.active,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Gold Membership • Expires 24 Oct 2026',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.textSecondary,
                                  fontSize: 12,
                                ),
                              ),
                              Text(
                                'Indiranagar Hub • Member since Jan 2025',
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
                    const SizedBox(height: 14),
                    // Quick Action Buttons: [ Call ] [ Message ] [ Renew ]
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.phone_outlined, size: 16, color: AppColors.primaryDark),
                            label: const Text('Call', style: TextStyle(fontSize: 12.5)),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              side: const BorderSide(color: AppColors.border),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.chat_bubble_outline_rounded, size: 16, color: Color(0xFF2563EB)),
                            label: const Text('Message', style: TextStyle(fontSize: 12.5)),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              side: const BorderSide(color: AppColors.border),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            child: const Text('Renew', style: TextStyle(fontSize: 12.5, color: Colors.white)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // 7 Tab Bar: Overview | Payments | Attendance | PT | Fitness | Documents | Activity
            Container(
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.border, width: 1)),
              ),
              child: TabBar(
                controller: _tabController,
                isScrollable: true,
                indicatorColor: AppColors.primary,
                indicatorWeight: 3,
                labelColor: AppColors.primaryDark,
                unselectedLabelColor: AppColors.textSecondary,
                labelStyle: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 13),
                unselectedLabelStyle: AppTypography.caption.copyWith(fontWeight: FontWeight.w500, fontSize: 13),
                tabs: const [
                  Tab(text: 'Overview'),
                  Tab(text: 'Payments'),
                  Tab(text: 'Attendance'),
                  Tab(text: 'PT'),
                  Tab(text: 'Fitness'),
                  Tab(text: 'Documents'),
                  Tab(text: 'Activity'),
                ],
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildOverviewTab(),
                  _buildPaymentsTab(),
                  _buildAttendanceTab(),
                  _buildPtTab(),
                  _buildFitnessTab(),
                  _buildDocumentsTab(),
                  _buildActivityTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 1. Overview Tab
  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.pageHorizontalPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(child: _buildMetricTile('Attendance', '82%', AppColors.primary)),
              const SizedBox(width: 8),
              Expanded(child: _buildMetricTile('Visits', '24 visits', AppColors.text)),
              const SizedBox(width: 8),
              Expanded(child: _buildMetricTile('Last Visit', 'Today', const Color(0xFF2563EB))),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: _buildMetricTile('Tier', 'Gold', AppColors.text)),
              const SizedBox(width: 8),
              Expanded(child: _buildMetricTile('Trainer', 'Alex', AppColors.text)),
              const SizedBox(width: 8),
              Expanded(child: _buildMetricTile('Outstanding', '₹0', AppColors.primaryDark)),
            ],
          ),
          const SizedBox(height: 18),

          Text('Owner Quick Actions', style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildActionChip(Icons.ac_unit_rounded, 'Freeze Membership', () {}),
              _buildActionChip(Icons.autorenew_rounded, 'Renew Plan', () {}),
              _buildActionChip(Icons.swap_horiz_rounded, 'Upgrade/Downgrade', () {}),
              _buildActionChip(Icons.person_add_alt_rounded, 'Assign Trainer', () {}),
              _buildActionChip(Icons.credit_card_rounded, 'Add Payment', () {}),
              _buildActionChip(Icons.description_outlined, 'Generate Invoice', () {}),
            ],
          ),
        ],
      ),
    );
  }

  // 2. Payments Tab
  Widget _buildPaymentsTab() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.pageHorizontalPadding),
      children: [
        _buildPaymentItem('Gold Membership Renewal', '₹2,499', '24 Sep 2026', 'Paid via UPI (Cashfree)', RepsiBadgeVariant.active),
        _buildPaymentItem('Personal Training 10-Pack', '₹8,500', '10 Aug 2026', 'Paid via Card', RepsiBadgeVariant.active),
        _buildPaymentItem('Locker Rental Deposit', '₹500', '15 Jan 2026', 'Paid in Cash', RepsiBadgeVariant.active),
      ],
    );
  }

  // 3. Attendance Tab
  Widget _buildAttendanceTab() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.pageHorizontalPadding),
      children: [
        _buildAttendanceRow('Today', '07:14 AM', 'Main Gate Turnstile (QR Scan)'),
        _buildAttendanceRow('Yesterday', '07:22 AM', 'Main Gate Turnstile (QR Scan)'),
        _buildAttendanceRow('25 Sep 2026', '06:58 AM', 'Studio A (Class Check-in)'),
        _buildAttendanceRow('24 Sep 2026', '07:30 AM', 'Main Gate Turnstile (Manual)'),
        _buildAttendanceRow('22 Sep 2026', '07:10 AM', 'Main Gate Turnstile (QR Scan)'),
      ],
    );
  }

  // 4. PT Tab
  Widget _buildPtTab() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.pageHorizontalPadding),
      children: [
        RepsiCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Assigned Coach: Alex Morgan', style: AppTypography.headingSmall.copyWith(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text('PT Package: 12 Sessions (6 remaining)', style: AppTypography.bodySmall.copyWith(color: AppColors.primaryDark, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.calendar_month_rounded, size: 16, color: Colors.white),
                label: const Text('Book Next Session', style: TextStyle(color: Colors.white)),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 5. Fitness Tab
  Widget _buildFitnessTab() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.pageHorizontalPadding),
      children: [
        RepsiCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Current Physical Stats', style: AppTypography.headingSmall.copyWith(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('Weight: 78.4 kg (↓ 3.7 kg)'),
                  Text('BMI: 24.8 (Normal)'),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('Chest: 102 cm'),
                  Text('Waist: 84 cm'),
                  Text('Arms: 35 cm'),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 6. Documents Tab
  Widget _buildDocumentsTab() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.pageHorizontalPadding),
      children: [
        _buildDocRow('Aadhaar ID Proof (Verified)', 'Uploaded 15 Jan 2025'),
        _buildDocRow('Gym Liability & Health Waiver', 'Signed digitally 15 Jan 2025'),
        _buildDocRow('Medical Clearance Certificate', 'Valid till Dec 2026'),
      ],
    );
  }

  // 7. Activity Tab
  Widget _buildActivityTab() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.pageHorizontalPadding),
      children: [
        _buildActivityRow('Membership Renewed', '₹2,499 paid online by member', '24 Sep, 08:02 AM'),
        _buildActivityRow('PT Session Completed', 'Chest & Triceps with Alex', '23 Sep, 09:00 AM'),
        _buildActivityRow('WhatsApp Notification Sent', '7-day renewal reminder delivered', '22 Sep, 10:00 AM'),
      ],
    );
  }

  // Helper widgets
  Widget _buildMetricTile(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTypography.caption.copyWith(fontSize: 10.5, color: AppColors.textMuted)),
          const SizedBox(height: 2),
          Text(value, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700, color: color, fontSize: 13.5)),
        ],
      ),
    );
  }

  Widget _buildActionChip(IconData icon, String label, VoidCallback onTap) {
    return RepsiPress(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: AppColors.primaryDark),
            const SizedBox(width: 5),
            Text(label, style: AppTypography.caption.copyWith(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.text)),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentItem(String title, String amount, String date, String method, RepsiBadgeVariant variant) {
    return RepsiCard(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700)),
              Text('$date • $method', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11)),
            ],
          ),
          Text(amount, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w800, color: AppColors.primaryDark)),
        ],
      ),
    );
  }

  Widget _buildAttendanceRow(String day, String time, String gate) {
    return RepsiCard(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(day, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                Text(gate, style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11)),
              ],
            ),
          ),
          Text(time, style: AppTypography.caption.copyWith(fontWeight: FontWeight.w600, color: AppColors.text)),
        ],
      ),
    );
  }

  Widget _buildDocRow(String title, String subtitle) {
    return RepsiCard(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          const Icon(Icons.verified_rounded, color: AppColors.primary, size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                Text(subtitle, style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11)),
              ],
            ),
          ),
          const Icon(Icons.download_rounded, color: AppColors.textMuted, size: 20),
        ],
      ),
    );
  }

  Widget _buildActivityRow(String title, String subtitle, String time) {
    return RepsiCard(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 8,
            height: 8,
            margin: const EdgeInsets.only(top: 5),
            decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                Text(subtitle, style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11)),
                Text(time, style: AppTypography.caption.copyWith(color: AppColors.textMuted, fontSize: 10.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
