import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/models/member_model.dart';
import '../../../shared/widgets/repsi_avatar.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';
import '../../../shared/widgets/repsi_status_badge.dart';
import '../providers/member_provider.dart';

class MemberDetailView extends ConsumerStatefulWidget {
  final String memberId;
  final MemberModel? initialMember;

  const MemberDetailView({
    super.key,
    required this.memberId,
    this.initialMember,
  });

  @override
  ConsumerState<MemberDetailView> createState() => _MemberDetailViewState();
}

class _MemberDetailViewState extends ConsumerState<MemberDetailView> {
  MemberModel? _member;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _member = widget.initialMember;
    if (_member == null) {
      _loadMember();
    }
  }

  Future<void> _loadMember() async {
    setState(() => _isLoading = true);
    try {
      final m = await ref.read(memberServiceProvider).getMemberById(widget.memberId);
      if (mounted) {
        setState(() {
          _member = m;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (_isLoading && _member == null) {
      return Scaffold(
        backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
        appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
        body: const Center(child: CircularProgressIndicator(color: AppColors.primary)),
      );
    }

    final m = _member;
    if (m == null) {
      return Scaffold(
        backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
        appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
        body: const Center(child: Text('Member not found')),
      );
    }

    final dateFormat = DateFormat('dd MMM yyyy');

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            LucideIcons.arrowLeft,
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.moreVertical, size: 20),
            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
            onPressed: () => _showActionsMenu(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          children: [
            // Profile Card
            RepsiCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                children: [
                  RepsiAvatar(
                    name: m.fullName,
                    imageUrl: m.photoUrl,
                    size: 80,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    m.fullName,
                    style: AppTypography.headingMedium.copyWith(
                      color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  RepsiStatusBadge(status: m.status),
                  const SizedBox(height: AppSpacing.lg),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildQuickAction(
                        icon: LucideIcons.phone,
                        label: 'Call',
                        onTap: () {},
                      ),
                      _buildQuickAction(
                        icon: LucideIcons.messageSquare,
                        label: 'WhatsApp',
                        onTap: () {},
                      ),
                      _buildQuickAction(
                        icon: LucideIcons.creditCard,
                        label: 'Renew',
                        onTap: () {},
                      ),
                      _buildQuickAction(
                        icon: LucideIcons.calendarCheck,
                        label: 'Check In',
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Checked in ${m.fullName}!')),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Membership Details
            RepsiCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Membership Details',
                    style: AppTypography.labelLarge.copyWith(
                      color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  _buildDetailRow('Plan', m.membershipPlanName ?? 'Standard Monthly', isDark),
                  const Divider(height: 20),
                  _buildDetailRow(
                    'Start Date',
                    m.startDate != null ? dateFormat.format(m.startDate!) : 'N/A',
                    isDark,
                  ),
                  const Divider(height: 20),
                  _buildDetailRow(
                    'End Date',
                    m.endDate != null ? dateFormat.format(m.endDate!) : 'N/A',
                    isDark,
                  ),
                  const Divider(height: 20),
                  _buildDetailRow(
                    'Assigned Trainer',
                    m.assignedTrainerName ?? 'None assigned',
                    isDark,
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Contact Info
            RepsiCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Contact Information',
                    style: AppTypography.labelLarge.copyWith(
                      color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  _buildDetailRow('Email', m.email.isNotEmpty ? m.email : 'N/A', isDark),
                  const Divider(height: 20),
                  _buildDetailRow('Phone', m.phone ?? 'N/A', isDark),
                  const Divider(height: 20),
                  _buildDetailRow(
                    'Emergency Contact',
                    m.emergencyContactPhone ?? m.emergencyContactName ?? 'None',
                    isDark,
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            RepsiButton(
              text: 'Renew Membership',
              onPressed: () {},
              isFullWidth: true,
              size: RepsiButtonSize.large,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 18, color: AppColors.primaryDark),
            ),
            const SizedBox(height: 4),
            Text(label, style: AppTypography.caption.copyWith(fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, bool isDark) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTypography.bodySmall.copyWith(
            color: isDark ? AppColors.darkTextMuted : AppColors.textMuted,
          ),
        ),
        Text(
          value,
          style: AppTypography.bodyMedium.copyWith(
            fontWeight: FontWeight.w600,
            color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  void _showActionsMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(LucideIcons.edit2),
              title: const Text('Edit Member'),
              onTap: () => Navigator.pop(ctx),
            ),
            ListTile(
              leading: const Icon(LucideIcons.pauseCircle),
              title: const Text('Freeze Membership'),
              onTap: () => Navigator.pop(ctx),
            ),
            ListTile(
              leading: const Icon(LucideIcons.trash2, color: AppColors.error),
              title: const Text('Delete Member', style: TextStyle(color: AppColors.error)),
              onTap: () {
                Navigator.pop(ctx);
                ref.read(memberListProvider.notifier).deleteMember(widget.memberId);
                context.pop();
              },
            ),
          ],
        ),
      ),
    );
  }
}
