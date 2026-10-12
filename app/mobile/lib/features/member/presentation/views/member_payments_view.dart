import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/localization/locale_provider.dart';
import '../../../../shared/animations/repsi_stagger.dart';
import '../../../../shared/widgets/language_selector_sheet.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';

class MemberPaymentsView extends ConsumerStatefulWidget {
  const MemberPaymentsView({super.key});

  @override
  ConsumerState<MemberPaymentsView> createState() => _MemberPaymentsViewState();
}

class _MemberPaymentsViewState extends ConsumerState<MemberPaymentsView> {
  int _selectedTab = 0;
  String _submissionStatus = 'none'; // 'none', 'pending_review', 'approved', 'rejected'
  String? _rejectionReason;
  String _submittedAmount = '1,500';

  void _showPaymentInstructionsSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => _PaymentInstructionsSheet(
        amount: '1,500',
        referenceTag: 'PAY-INV402',
        onSubmitProof: () {
          Navigator.pop(ctx);
          _showSubmitReceiptSheet();
        },
      ),
    );
  }

  void _showSubmitReceiptSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => _SubmitReceiptSheet(
        amount: '1500',
        onSubmitted: (amount, method, utr) {
          setState(() {
            _submissionStatus = 'pending_review';
            _submittedAmount = amount;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Payment receipt submitted! Waiting for owner verification.'),
              backgroundColor: AppColors.primary,
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = ref.watch(localeNotifierProvider.notifier).translate;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          t('payments'),
          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.language_rounded, color: AppColors.primary),
            onPressed: () => LanguageSelectorSheet.show(context),
            tooltip: t('language'),
          ),
        ],
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
              // Tabs: Pending | History
              RepsiStaggerItem(
                index: 0,
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  padding: const EdgeInsets.all(3),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedTab = 0),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            decoration: BoxDecoration(
                              color: _selectedTab == 0 ? AppColors.primarySoft : Colors.transparent,
                              borderRadius: BorderRadius.circular(9),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              t('pending'),
                              style: AppTypography.caption.copyWith(
                                color: _selectedTab == 0 ? AppColors.primaryDark : AppColors.textSecondary,
                                fontWeight: _selectedTab == 0 ? FontWeight.w700 : FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedTab = 1),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            decoration: BoxDecoration(
                              color: _selectedTab == 1 ? AppColors.primarySoft : Colors.transparent,
                              borderRadius: BorderRadius.circular(9),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'History',
                              style: AppTypography.caption.copyWith(
                                color: _selectedTab == 1 ? AppColors.primaryDark : AppColors.textSecondary,
                                fontWeight: _selectedTab == 1 ? FontWeight.w700 : FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18),

              if (_selectedTab == 0) ...[
                // Outstanding Fee Card with Manual Payment Actions
                RepsiStaggerItem(
                  index: 1,
                  child: RepsiCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(t('outstanding_balance'), style: AppTypography.caption),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _submissionStatus == 'pending_review'
                                    ? AppColors.warningSoft
                                    : _submissionStatus == 'approved'
                                        ? AppColors.primarySoft
                                        : AppColors.errorSoft,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                _submissionStatus == 'pending_review'
                                    ? t('pending_review')
                                    : _submissionStatus == 'approved'
                                        ? t('approved')
                                        : 'DUE',
                                style: TextStyle(
                                  color: _submissionStatus == 'pending_review'
                                      ? AppColors.warning
                                      : _submissionStatus == 'approved'
                                          ? AppColors.primaryDark
                                          : AppColors.error,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '₹$_submittedAmount',
                          style: AppTypography.display.copyWith(
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Invoice #INV-2026-0042 • Apex Monthly Plan',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 16),

                        if (_submissionStatus == 'pending_review') ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppColors.warningSoft.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppColors.warning.withOpacity(0.3)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.hourglass_top_rounded, color: AppColors.warning, size: 18),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    t('verification_notice'),
                                    style: AppTypography.caption.copyWith(
                                      color: Colors.brown.shade800,
                                      fontSize: 11.5,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ] else ...[
                          RepsiButton(
                            text: t('pay_membership_fee'),
                            onPressed: _showPaymentInstructionsSheet,
                            isFullWidth: true,
                            size: RepsiButtonSize.medium,
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Recent Payments Section
              RepsiStaggerItem(
                index: 2,
                child: Text(
                  'Verified Payment Records',
                  style: AppTypography.sectionHeading.copyWith(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              RepsiStaggerItem(
                index: 3,
                child: Column(
                  children: const [
                    _PaymentHistoryItem(
                      amount: '₹4,999',
                      title: 'Quarterly Membership (UPI Direct)',
                      date: '24 Aug 2025',
                      status: 'Paid',
                    ),
                    SizedBox(height: 10),
                    _PaymentHistoryItem(
                      amount: '₹1,500',
                      title: 'Monthly Renewal (Bank Transfer)',
                      date: '24 Jul 2025',
                      status: 'Paid',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// PAYMENT INSTRUCTIONS MODAL
class _PaymentInstructionsSheet extends StatelessWidget {
  final String amount;
  final String referenceTag;
  final VoidCallback onSubmitProof;

  const _PaymentInstructionsSheet({
    required this.amount,
    required this.referenceTag,
    required this.onSubmitProof,
  });

  void _copy(BuildContext context, String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Copied to clipboard!'), duration: Duration(seconds: 1)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Gym Payment Details', style: AppTypography.headingSmall.copyWith(fontWeight: FontWeight.w700)),
                IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(context)),
              ],
            ),
            const SizedBox(height: 12),

            // Transfer Reference Tag
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.warningSoft,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.warning.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Narration Reference Code', style: TextStyle(fontSize: 10, color: AppColors.warning, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text(referenceTag, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy_rounded, size: 18, color: AppColors.warning),
                    onPressed: () => _copy(context, referenceTag),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // UPI Section
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const Icon(Icons.smartphone_rounded, color: AppColors.primary, size: 20),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('UPI ID', style: TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                        Text('apexfitness@okaxis', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy_rounded, size: 18, color: AppColors.primary),
                    onPressed: () => _copy(context, 'apexfitness@okaxis'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Phone Number Section
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const Icon(Icons.phone_iphone_rounded, color: Colors.indigo, size: 20),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('GPay / PhonePe Number', style: TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                        Text('+91 98450 11223', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy_rounded, size: 18, color: Colors.indigo),
                    onPressed: () => _copy(context, '+919845011223'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Bank Details Section
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.account_balance_rounded, color: Colors.amber, size: 18),
                      SizedBox(width: 8),
                      Text('Direct Bank Transfer (NEFT/IMPS)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text('Account: Apex Fitness India Pvt Ltd', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  const Text('Bank: HDFC Bank, Indiranagar', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('A/C: 50200049281729', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                      IconButton(icon: const Icon(Icons.copy_rounded, size: 16), onPressed: () => _copy(context, '50200049281729')),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('IFSC: HDFC0001234', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                      IconButton(icon: const Icon(Icons.copy_rounded, size: 16), onPressed: () => _copy(context, 'HDFC0001234')),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            ElevatedButton(
              onPressed: onSubmitProof,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size(double.infinity, 44),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('I Have Paid → Submit Receipt', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}

// SUBMIT RECEIPT FORM MODAL
class _SubmitReceiptSheet extends StatefulWidget {
  final String amount;
  final Function(String amount, String method, String utr) onSubmitted;

  const _SubmitReceiptSheet({required this.amount, required this.onSubmitted});

  @override
  State<_SubmitReceiptSheet> createState() => _SubmitReceiptSheetState();
}

class _SubmitReceiptSheetState extends State<_SubmitReceiptSheet> {
  late TextEditingController _amountController;
  final TextEditingController _utrController = TextEditingController();
  String _method = 'upi';
  bool _receiptPicked = false;

  @override
  void initState() {
    super.initState();
    _amountController = TextEditingController(text: widget.amount);
  }

  @override
  void dispose() {
    _amountController.dispose();
    _utrController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Submit Payment Receipt', style: AppTypography.headingSmall.copyWith(fontWeight: FontWeight.w700)),
                IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(context)),
              ],
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Amount Paid (₹)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 10),

            DropdownButtonFormField<String>(
              value: _method,
              decoration: InputDecoration(
                labelText: 'Payment Method',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
              items: const [
                DropdownMenuItem(value: 'upi', child: Text('UPI Transfer')),
                DropdownMenuItem(value: 'qr', child: Text('Scanned QR Code')),
                DropdownMenuItem(value: 'phone', child: Text('GPay / PhonePe Number')),
                DropdownMenuItem(value: 'bank_transfer', child: Text('Bank Transfer (NEFT/IMPS)')),
              ],
              onChanged: (val) => setState(() => _method = val ?? 'upi'),
            ),
            const SizedBox(height: 10),

            TextField(
              controller: _utrController,
              decoration: InputDecoration(
                labelText: 'UTR / Transaction Reference (Optional)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 12),

            // Receipt Screenshot Selector
            GestureDetector(
              onTap: () => setState(() => _receiptPicked = !_receiptPicked),
              child: Container(
                height: 70,
                decoration: BoxDecoration(
                  color: _receiptPicked ? AppColors.primarySoft : AppColors.surface,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: _receiptPicked ? AppColors.primary : AppColors.border,
                    style: BorderStyle.solid,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _receiptPicked ? Icons.check_circle_rounded : Icons.upload_file_rounded,
                      color: _receiptPicked ? AppColors.primaryDark : AppColors.textSecondary,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _receiptPicked ? 'Screenshot attached (receipt.png)' : 'Tap to attach receipt screenshot',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _receiptPicked ? AppColors.primaryDark : AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                widget.onSubmitted(
                  _amountController.text.trim(),
                  _method,
                  _utrController.text.trim(),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size(double.infinity, 44),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Confirm & Submit Proof', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentHistoryItem extends StatelessWidget {
  final String amount;
  final String title;
  final String date;
  final String status;

  const _PaymentHistoryItem({
    required this.amount,
    required this.title,
    required this.date,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return RepsiCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                amount,
                style: AppTypography.headingSmall.copyWith(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                title,
                style: AppTypography.caption.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                date,
                style: AppTypography.caption.copyWith(
                  color: AppColors.textMuted,
                  fontSize: 11,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  status,
                  style: const TextStyle(color: AppColors.primaryDark, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
