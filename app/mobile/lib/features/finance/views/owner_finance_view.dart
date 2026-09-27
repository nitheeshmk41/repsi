import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_badge.dart';
import '../../../shared/widgets/repsi_card.dart';

class OwnerFinanceView extends StatefulWidget {
  const OwnerFinanceView({super.key});

  @override
  State<OwnerFinanceView> createState() => _OwnerFinanceViewState();
}

class _OwnerFinanceViewState extends State<OwnerFinanceView> with SingleTickerProviderStateMixin {
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

  void _showRecordPaymentSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Collect & Record Payment', style: AppTypography.headingSmall.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            TextField(decoration: InputDecoration(hintText: 'Member Name or ID', border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 10),
            TextField(decoration: InputDecoration(hintText: 'Amount (₹)', border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 10),
            TextField(decoration: InputDecoration(hintText: 'Payment Mode (Cash, UPI, Card)', border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Payment recorded and GST invoice generated.')));
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, minimumSize: const Size(double.infinity, 44)),
              child: const Text('Confirm Payment', style: TextStyle(color: Colors.white)),
            ),
          ],
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
        title: Text(
          'Finance & Revenue',
          style: AppTypography.heading.copyWith(fontSize: 22, fontWeight: FontWeight.w700),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_card_rounded, color: AppColors.primary),
            onPressed: () => _showRecordPaymentSheet(context),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Top Overview Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
              child: RepsiCard(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total Net Revenue (This Month)', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12.5)),
                        const RepsiBadge(label: '↑ 14.2% MoM', variant: RepsiBadgeVariant.active),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '₹2,84,500',
                      style: AppTypography.display.copyWith(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.text),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _buildMetricCol('Revenue', '₹2,84,500', AppColors.primaryDark),
                        _buildDivider(),
                        _buildMetricCol('Expenses', '₹92,400', const Color(0xFFE5484D)),
                        _buildDivider(),
                        _buildMetricCol('Outstanding', '₹38,000', const Color(0xFFD97706)),
                        _buildDivider(),
                        _buildMetricCol('Refunds', '₹4,200', AppColors.textSecondary),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Tab Bar: Payments | Invoices & GST | Expenses | Reports
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border),
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
                  labelStyle: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 11.5),
                  unselectedLabelStyle: AppTypography.caption.copyWith(fontWeight: FontWeight.w500, fontSize: 11.5),
                  tabs: const [
                    Tab(text: 'Payments'),
                    Tab(text: 'Invoices & GST'),
                    Tab(text: 'Expenses'),
                    Tab(text: 'P&L Reports'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Tab View
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildPaymentsSection(),
                  _buildInvoicesSection(),
                  _buildExpensesSection(),
                  _buildReportsSection(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentsSection() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding, vertical: 8),
      children: [
        // Payment Method Breakdown Cards
        Row(
          children: [
            Expanded(child: _buildMethodCard('UPI (Cashfree)', '₹1,54,000', '54%', const Color(0xFF2563EB))),
            const SizedBox(width: 8),
            Expanded(child: _buildMethodCard('Cash', '₹62,000', '22%', AppColors.primaryDark)),
            const SizedBox(width: 8),
            Expanded(child: _buildMethodCard('Cards', '₹48,000', '17%', const Color(0xFF8B5CF6))),
            const SizedBox(width: 8),
            Expanded(child: _buildMethodCard('NetBank', '₹20,500', '7%', const Color(0xFF0D9488))),
          ],
        ),
        const SizedBox(height: 16),
        Text('Recent Transactions', style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),

        _buildTxRow('Rahul Sharma', 'Gold Annual Plan', '₹18,000', 'UPI • Cashfree', 'Today, 08:21 AM'),
        _buildTxRow('Priya Nair', 'Monthly Standard', '₹2,499', 'Credit Card', 'Today, 07:45 AM'),
        _buildTxRow('Kavita S', 'PT 10-Session Pack', '₹8,500', 'Cash', 'Yesterday, 06:12 PM'),
        _buildTxRow('Arjun Mehta', 'Silver Quarterly', '₹6,200', 'UPI • GPay', '25 Sep, 11:30 AM'),
      ],
    );
  }

  Widget _buildInvoicesSection() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding, vertical: 8),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('GST Invoices (18% Slab)', style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700)),
            TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.download_rounded, size: 16),
              label: const Text('Export Tally/Excel'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        _buildInvoiceCard('INV-2026-0841', 'Rahul Sharma', '₹18,000', 'GST: ₹2,745 (18%)', '24 Sep 2026'),
        _buildInvoiceCard('INV-2026-0840', 'Priya Nair', '₹2,499', 'GST: ₹381 (18%)', '24 Sep 2026'),
        _buildInvoiceCard('INV-2026-0839', 'Kavita Sundaram', '₹8,500', 'GST: ₹1,296 (18%)', '23 Sep 2026'),
      ],
    );
  }

  Widget _buildExpensesSection() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding, vertical: 8),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Operational Expenses', style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700)),
            TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.add_rounded, size: 16, color: AppColors.error),
              label: const Text('+ Record Expense', style: TextStyle(color: AppColors.error)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        _buildExpenseRow('Facility Rent', 'Indiranagar Gym Floor', '₹50,000', 'Paid 01 Sep'),
        _buildExpenseRow('Trainer Payroll', '4 Full-time Trainers', '₹28,000', 'Paid 05 Sep'),
        _buildExpenseRow('Equipment Maintenance', 'Technogym Treadmills AMC', '₹8,000', 'Paid 12 Sep'),
        _buildExpenseRow('Electricity & Utilities', 'BESCOM Power Bill', '₹4,500', 'Paid 18 Sep'),
        _buildExpenseRow('Digital Marketing', 'Instagram & Meta Ads', '₹1,900', 'Paid 22 Sep'),
      ],
    );
  }

  Widget _buildReportsSection() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding, vertical: 8),
      children: [
        RepsiCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Monthly Profit & Loss Summary', style: AppTypography.headingSmall.copyWith(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              _buildReportLine('Gross Revenue', '₹2,84,500', AppColors.primaryDark),
              _buildReportLine('Total Operational Expenses', '- ₹92,400', const Color(0xFFE5484D)),
              _buildReportLine('Refunds & Chargebacks', '- ₹4,200', AppColors.textSecondary),
              const Divider(height: 20, color: AppColors.border),
              _buildReportLine('Net Operating Profit', '₹1,87,900', AppColors.primaryDark, isBold: true),
              const SizedBox(height: 4),
              Text('Net Profit Margin: 66.0% • Collections Rate: 92.4%', style: AppTypography.caption.copyWith(color: AppColors.textMuted)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMethodCard(String method, String amount, String share, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(method, style: AppTypography.caption.copyWith(fontSize: 10.5, color: AppColors.textMuted, fontWeight: FontWeight.w500)),
          const SizedBox(height: 4),
          Text(amount, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700, fontSize: 12.5, color: color)),
          Text(share, style: AppTypography.caption.copyWith(fontSize: 10, color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildTxRow(String member, String plan, String amount, String mode, String time) {
    return RepsiCard(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(member, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700)),
              Text('$plan • $mode', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(amount, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w800, color: AppColors.primaryDark)),
              Text(time, style: AppTypography.caption.copyWith(color: AppColors.textMuted, fontSize: 10.5)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInvoiceCard(String invNo, String member, String total, String gst, String date) {
    return RepsiCard(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          const Icon(Icons.receipt_long_rounded, color: AppColors.primary, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('$invNo • $member', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700)),
                Text('$gst • Date: $date', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11)),
              ],
            ),
          ),
          Text(total, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700, color: AppColors.text)),
        ],
      ),
    );
  }

  Widget _buildExpenseRow(String category, String desc, String amount, String date) {
    return RepsiCard(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(category, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700)),
              Text('$desc • $date', style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11)),
            ],
          ),
          Text(amount, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700, color: const Color(0xFFE5484D))),
        ],
      ),
    );
  }

  Widget _buildReportLine(String label, String value, Color color, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontWeight: isBold ? FontWeight.w700 : FontWeight.w500, fontSize: isBold ? 14.5 : 13, color: AppColors.text)),
          Text(value, style: TextStyle(fontWeight: isBold ? FontWeight.w800 : FontWeight.w600, fontSize: isBold ? 15 : 13.5, color: color)),
        ],
      ),
    );
  }

  Widget _buildMetricCol(String label, String value, Color color) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700, fontSize: 13, color: color)),
          const SizedBox(height: 2),
          Text(label, style: AppTypography.caption.copyWith(fontSize: 10, color: AppColors.textMuted)),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(width: 1, height: 24, color: AppColors.border, margin: const EdgeInsets.symmetric(horizontal: 6));
  }
}
