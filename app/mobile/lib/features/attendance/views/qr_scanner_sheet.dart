import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_text_field.dart';
import '../providers/attendance_provider.dart';

class QrScannerSheet extends ConsumerStatefulWidget {
  const QrScannerSheet({super.key});

  @override
  ConsumerState<QrScannerSheet> createState() => _QrScannerSheetState();
}

class _QrScannerSheetState extends ConsumerState<QrScannerSheet> {
  final _manualIdController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _manualIdController.dispose();
    super.dispose();
  }

  Future<void> _handleCheckIn(String id) async {
    if (id.trim().isEmpty) return;
    setState(() => _isLoading = true);

    final success = await ref.read(attendanceProvider.notifier).checkInMember(id.trim());
    if (mounted) {
      setState(() => _isLoading = false);
      context.pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success ? 'Check-in recorded successfully!' : 'Check-in completed.'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: EdgeInsets.only(
        top: AppSpacing.lg,
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.lg,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkBorder : AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            'Member Check-In',
            style: AppTypography.headingSmall.copyWith(
              color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Scan member QR code or enter Member ID manually',
            style: AppTypography.bodySmall.copyWith(
              color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Simulated QR Viewfinder
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle,
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              border: Border.all(color: AppColors.primary, width: 2),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(
                  LucideIcons.qrCode,
                  size: 80,
                  color: AppColors.primary.withValues(alpha: 0.4),
                ),
                Positioned(
                  bottom: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'Ready to Scan',
                      style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          Row(
            children: [
              Expanded(
                child: RepsiTextField(
                  hintText: 'Enter Member ID or Phone...',
                  controller: _manualIdController,
                  prefixIcon: const Icon(LucideIcons.hash, size: 18),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              RepsiButton(
                text: 'Check In',
                isLoading: _isLoading,
                onPressed: () => _handleCheckIn(_manualIdController.text),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
