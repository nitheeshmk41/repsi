import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_press.dart';
import '../../../shared/widgets/repsi_badge.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';

class OperationsView extends ConsumerStatefulWidget {
  const OperationsView({super.key});

  @override
  ConsumerState<OperationsView> createState() => _OperationsViewState();
}

class _OperationsViewState extends ConsumerState<OperationsView> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header: Operations
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.pageHorizontalPadding,
                16,
                AppSpacing.pageHorizontalPadding,
                8,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Operations',
                          style: AppTypography.heading.copyWith(
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Attendance, CRM, QR & Staff RBAC',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 13,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 7,
                          height: 7,
                          decoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Indiranagar Hub',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.primaryDark,
                            fontWeight: FontWeight.w600,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Segmented Top Tab Bar
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pageHorizontalPadding,
                vertical: 8,
              ),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border, width: 1),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicator: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  labelColor: AppColors.primaryDark,
                  unselectedLabelColor: AppColors.textSecondary,
                  labelStyle: AppTypography.caption.copyWith(fontWeight: FontWeight.w600, fontSize: 12),
                  unselectedLabelStyle: AppTypography.caption.copyWith(fontWeight: FontWeight.w500, fontSize: 12),
                  tabs: const [
                    Tab(text: 'Attendance'),
                    Tab(text: 'CRM Leads'),
                    Tab(text: 'QR System'),
                    Tab(text: 'Staff & RBAC'),
                  ],
                ),
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildAttendanceTab(),
                  _buildCrmTab(),
                  _buildQrHubTab(),
                  _buildStaffRbacTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // 1. FAST ATTENDANCE TAB
  // -------------------------------------------------------------
  Widget _buildAttendanceTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.pageHorizontalPadding,
        vertical: 12,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Today's Stats Banner
          RepsiCard(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Attendance Today',
                      style: AppTypography.headingSmall.copyWith(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    const RepsiBadge(
                      label: '83.6% Turnout',
                      variant: RepsiBadgeVariant.active,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _buildStatCol('Check-ins', '184', AppColors.primary),
                    _buildDivider(),
                    _buildStatCol('Present', '184', AppColors.text),
                    _buildDivider(),
                    _buildStatCol('Expected', '220', AppColors.textSecondary),
                    _buildDivider(),
                    _buildStatCol('Peak Hour', '6-8 PM', const Color(0xFF2563EB)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Primary Speed Actions
          Row(
            children: [
              Expanded(
                flex: 3,
                child: RepsiPress(
                  onTap: () => context.push(RouteNames.checkIn),
                  child: Container(
                    height: 52,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.25),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.qr_code_scanner_rounded, color: Colors.white, size: 22),
                        const SizedBox(width: 8),
                        Text(
                          'SCAN MEMBER QR',
                          style: AppTypography.button.copyWith(
                            color: Colors.white,
                            fontSize: 13.5,
                            letterSpacing: 0.3,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                flex: 2,
                child: RepsiPress(
                  onTap: () => _showManualCheckInSheet(context),
                  child: Container(
                    height: 52,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border, width: 1.5),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'Manual Check-in',
                      style: AppTypography.button.copyWith(
                        color: AppColors.text,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Live Activity Feed
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Live Check-in Stream',
                style: AppTypography.headingSmall.copyWith(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    'Real-time',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _recentCheckins.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final c = _recentCheckins[index];
              return RepsiCard(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor: AppColors.primarySoft,
                      child: Text(
                        c['name']![0],
                        style: const TextStyle(
                          color: AppColors.primaryDark,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            c['name']!,
                            style: AppTypography.bodySmall.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppColors.text,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${c['plan']} • Gate: ${c['gate']}',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          c['time']!,
                          style: AppTypography.caption.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.text,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 2),
                        const RepsiBadge(
                          label: 'Checked in',
                          variant: RepsiBadgeVariant.active,
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // 2. CRM PIPELINE TAB
  // -------------------------------------------------------------
  Widget _buildCrmTab() {
    final stages = [
      {'name': 'NEW LEADS', 'count': 23, 'color': const Color(0xFF2563EB)},
      {'name': 'CONTACTED', 'count': 14, 'color': const Color(0xFFF59E0B)},
      {'name': 'TRIAL', 'count': 8, 'color': const Color(0xFF8B5CF6)},
      {'name': 'CONVERTED', 'count': 32, 'color': AppColors.primary},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.pageHorizontalPadding,
        vertical: 12,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Pipeline Summary Bar
          Row(
            children: stages.map((s) {
              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.border, width: 1),
                  ),
                  child: Column(
                    children: [
                      Text(
                        '${s['count']}',
                        style: AppTypography.headingSmall.copyWith(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: s['color'] as Color,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        s['name'] as String,
                        style: AppTypography.caption.copyWith(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Lead Automation Pipeline Banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.auto_awesome_rounded, color: AppColors.primary, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Automated Follow-up Flow Active',
                        style: AppTypography.caption.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.primaryDark,
                          fontSize: 12,
                        ),
                      ),
                      Text(
                        'Welcome Msg → Day 1 Follow-up → Trial Reminder → Offer',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 10.5,
                        ),
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    'Configure',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.primaryDark,
                      fontWeight: FontWeight.w700,
                      fontSize: 11,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Action Row: Add Lead
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Leads',
                style: AppTypography.headingSmall.copyWith(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              TextButton.icon(
                onPressed: () => _showAddLeadDialog(context),
                icon: const Icon(Icons.add_rounded, size: 16, color: AppColors.primary),
                label: Text(
                  '+ Add Lead',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Lead Cards
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _leads.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final lead = _leads[index];
              return RepsiCard(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 16,
                              backgroundColor: const Color(0xFFEBF5FF),
                              child: Text(
                                lead['name']![0],
                                style: const TextStyle(
                                  color: Color(0xFF2563EB),
                                  fontWeight: FontWeight.w700,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  lead['name']!,
                                  style: AppTypography.bodySmall.copyWith(
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.text,
                                    fontSize: 14,
                                  ),
                                ),
                                Text(
                                  'Source: ${lead['source']}',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.textMuted,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        RepsiBadge(
                          label: lead['stage']!,
                          variant: lead['stage'] == 'Trial'
                              ? RepsiBadgeVariant.expiring
                              : (lead['stage'] == 'Contacted' ? RepsiBadgeVariant.frozen : RepsiBadgeVariant.active),
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
                        children: [
                          const Icon(Icons.fitness_center_rounded, size: 14, color: AppColors.textSecondary),
                          const SizedBox(width: 6),
                          Text(
                            'Interest: ${lead['interest']}',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.text,
                              fontSize: 11.5,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const Spacer(),
                          Text(
                            lead['lastContact']!,
                            style: AppTypography.caption.copyWith(
                              color: AppColors.textMuted,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.phone_outlined, size: 14, color: AppColors.primaryDark),
                            label: const Text('Call', style: TextStyle(fontSize: 12)),
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
                            icon: const Icon(Icons.chat_bubble_outline_rounded, size: 14, color: Color(0xFF2563EB)),
                            label: const Text('Message', style: TextStyle(fontSize: 12)),
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
                            child: const Text('Follow-up', style: TextStyle(fontSize: 12, color: Colors.white)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // 3. QR HUB TAB
  // -------------------------------------------------------------
  Widget _buildQrHubTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.pageHorizontalPadding,
        vertical: 12,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Main Check-in QR Card
          RepsiCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Gym Check-in QR',
                          style: AppTypography.headingSmall.copyWith(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Indiranagar Main Hub',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const RepsiBadge(
                      label: '● Active',
                      variant: RepsiBadgeVariant.active,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                // QR Display Container
                Container(
                  width: 190,
                  height: 190,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.qr_code_2_rounded,
                          size: 130,
                          color: AppColors.text,
                        ),
                        Text(
                          'repsi.app/qr/indiranagar',
                          style: AppTypography.caption.copyWith(
                            fontSize: 9.5,
                            color: AppColors.textMuted,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Members scan this code with their Repsi app to mark entry',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 11.5,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 18),
                // 4 QR Action Buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildQrActionButton(Icons.refresh_rounded, 'Refresh', () {}),
                    _buildQrActionButton(Icons.download_rounded, 'Download', () {}),
                    _buildQrActionButton(Icons.print_rounded, 'Print', () {}),
                    _buildQrActionButton(Icons.fullscreen_rounded, 'Full Screen', () {}),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Multiple Dedicated QR Types
          Text(
            'Specialized QR Stations',
            style: AppTypography.headingSmall.copyWith(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 10),

          _buildQrTypeRow('Branch Entrance QR', 'Front gate auto-turnstile access', Icons.door_front_door_outlined),
          const SizedBox(height: 8),
          _buildQrTypeRow('Class Check-in QR', 'Group studio & CrossFit check-in', Icons.groups_rounded),
          const SizedBox(height: 8),
          _buildQrTypeRow('PT Session QR', '1-on-1 trainer credit deduction', Icons.sports_gymnastics_rounded),
        ],
      ),
    );
  }

  Widget _buildQrActionButton(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppColors.primaryDark, size: 20),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: AppTypography.caption.copyWith(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQrTypeRow(String title, String desc, IconData icon) {
    return RepsiCard(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppColors.text, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTypography.bodySmall.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.text,
                  ),
                ),
                Text(
                  desc,
                  style: AppTypography.caption.copyWith(
                    fontSize: 11,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.qr_code_rounded, color: AppColors.primary, size: 22),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // 4. STAFF & RBAC TAB
  // -------------------------------------------------------------
  Widget _buildStaffRbacTab() {
    final staff = [
      {'name': 'Nitheesh M', 'role': 'Owner', 'email': 'nitheesh@repsi.app', 'permissions': 'Full Root Access'},
      {'name': 'Vikram Rathore', 'role': 'Manager', 'email': 'vikram@repsi.app', 'permissions': 'Members, Payments, Ops'},
      {'name': 'Arun Kumar', 'role': 'Trainer', 'email': 'arun@repsi.app', 'permissions': 'Client Training, Workouts'},
      {'name': 'Pooja Hegde', 'role': 'Front Desk', 'email': 'pooja@repsi.app', 'permissions': 'Attendance, Check-in, Leads'},
      {'name': 'Ramesh Rao', 'role': 'Accountant', 'email': 'ramesh@repsi.app', 'permissions': 'Invoices, GST, Financials'},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.pageHorizontalPadding,
        vertical: 12,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Staff & Granular Permissions',
                style: AppTypography.headingSmall.copyWith(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              TextButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.person_add_rounded, size: 16, color: AppColors.primary),
                label: Text(
                  '+ Add Staff',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: staff.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final s = staff[index];
              return RepsiCard(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          s['name']!,
                          style: AppTypography.bodySmall.copyWith(
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                            fontSize: 14,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: s['role'] == 'Owner' ? AppColors.primarySoft : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            s['role']!,
                            style: AppTypography.caption.copyWith(
                              fontWeight: FontWeight.w700,
                              color: s['role'] == 'Owner' ? AppColors.primaryDark : AppColors.text,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      s['email']!,
                      style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11.5),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Permissions: ${s['permissions']}',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  Widget _buildStatCol(String label, String value, Color color) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: AppTypography.headingSmall.copyWith(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: AppTypography.caption.copyWith(
              fontSize: 10.5,
              color: AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 28,
      color: AppColors.border,
      margin: const EdgeInsets.symmetric(horizontal: 8),
    );
  }

  void _showManualCheckInSheet(BuildContext context) {
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
              Text(
                'Manual Member Check-in',
                style: AppTypography.headingSmall.copyWith(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Enter Member Phone or ID...',
                  prefixIcon: const Icon(Icons.search_rounded),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 16),
              RepsiButton(
                text: 'Record Check-in',
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Member check-in recorded successfully.')),
                  );
                },
                isFullWidth: true,
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAddLeadDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add New Lead'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(decoration: const InputDecoration(labelText: 'Full Name')),
            const SizedBox(height: 8),
            TextField(decoration: const InputDecoration(labelText: 'Phone Number')),
            const SizedBox(height: 8),
            TextField(decoration: const InputDecoration(labelText: 'Interest (e.g. Strength, Weight Loss)')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Lead added to CRM pipeline.')),
              );
            },
            child: const Text('Save Lead'),
          ),
        ],
      ),
    );
  }

  final List<Map<String, String>> _recentCheckins = const [
    {'name': 'Rahul Sharma', 'plan': 'Gold Membership', 'gate': 'Main Turnstile', 'time': '08:42 AM'},
    {'name': 'Priya Nair', 'plan': 'Platinum Pass', 'gate': 'Studio A', 'time': '08:35 AM'},
    {'name': 'Arjun Mehta', 'plan': 'PT Monthly', 'gate': 'Main Turnstile', 'time': '08:16 AM'},
    {'name': 'Kavita Sundaram', 'plan': 'Silver Plan', 'gate': 'Studio B', 'time': '07:54 AM'},
  ];

  final List<Map<String, String>> _leads = const [
    {'name': 'Arjun Nair', 'interest': 'Weight Training', 'source': 'Instagram Ads', 'stage': 'Trial', 'lastContact': 'Yesterday'},
    {'name': 'Sneha Rao', 'interest': 'HIIT & Weight Loss', 'source': 'Friend Referral', 'stage': 'Contacted', 'lastContact': '2 days ago'},
    {'name': 'Deepak Verma', 'interest': 'Personal Training', 'source': 'Walk-in', 'stage': 'New Leads', 'lastContact': 'Today, 10 AM'},
  ];
}
