import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/animations/repsi_press.dart';
import '../../../shared/animations/repsi_stagger.dart';
import '../../../shared/models/workspace_model.dart';
import '../../auth/providers/auth_provider.dart';
import '../providers/workspace_provider.dart';

class WorkspaceSelectionView extends ConsumerStatefulWidget {
  const WorkspaceSelectionView({super.key});

  @override
  ConsumerState<WorkspaceSelectionView> createState() => _WorkspaceSelectionViewState();
}

class _WorkspaceSelectionViewState extends ConsumerState<WorkspaceSelectionView> {
  final List<Map<String, dynamic>> _demoGyms = const [
    {
      'id': 'ws_cbe_01',
      'name': 'Repsi Fitness — Coimbatore',
      'slug': 'repsi-coimbatore',
      'city': 'Coimbatore',
      'members': '842',
      'revenue': '₹42,800',
      'status': 'Open',
    },
    {
      'id': 'ws_chn_02',
      'name': 'Repsi Fitness — Chennai',
      'slug': 'repsi-chennai',
      'city': 'Chennai',
      'members': '421',
      'revenue': '₹28,400',
      'status': 'Open',
    },
    {
      'id': 'ws_blr_03',
      'name': 'Repsi Fitness — Bangalore',
      'slug': 'repsi-bangalore',
      'city': 'Bangalore',
      'members': '1,204',
      'revenue': '₹64,100',
      'status': 'Open',
    },
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(workspaceProvider.notifier).fetchWorkspaces();
    });
  }

  void _onSelectWorkspace(Map<String, dynamic> gym) {
    final workspace = WorkspaceModel(
      id: gym['id'] as String,
      name: gym['name'] as String,
      slug: gym['slug'] as String,
      city: gym['city'] as String,
      country: 'India',
      isActive: true,
    );

    ref.read(workspaceProvider.notifier).selectWorkspace(workspace);
    ref.read(authProvider.notifier).updateActiveWorkspace(workspace.id, workspace.slug);

    if (mounted) {
      context.go(RouteNames.ownerDashboard);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final ownerName = user?.fullName ?? 'Nitheesh';
    final workspaceState = ref.watch(workspaceProvider);

    final gymsList = workspaceState.workspaces.isNotEmpty
        ? workspaceState.workspaces.map((w) => {
            'id': w.id,
            'name': w.name,
            'slug': w.slug,
            'city': w.city ?? 'Coimbatore',
            'members': '842',
            'revenue': '₹42,800',
            'status': w.isActive ? 'Open' : 'Suspended',
          }).toList()
        : _demoGyms;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 24,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top logo header
              RepsiStaggerItem(
                index: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Image.asset(
                      'assets/logos/primary_logo.png',
                      height: 32,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const Text(
                        'Repsi',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.logout_rounded, color: AppColors.textSecondary),
                      tooltip: 'Log out',
                      onPressed: () {
                        ref.read(authProvider.notifier).logout();
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Greeting & Title
              RepsiStaggerItem(
                index: 1,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Good morning, $ownerName',
                      style: AppTypography.caption.copyWith(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primaryDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Choose your workspace',
                      style: AppTypography.heading.copyWith(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Select which gym location you would like to view and manage today.',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Workspace cards list
              ...gymsList.asMap().entries.map((entry) {
                final idx = entry.key;
                final gym = entry.value;

                return RepsiStaggerItem(
                  index: 2 + idx,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border, width: 1),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppColors.primarySoft,
                                  borderRadius: BorderRadius.circular(20),
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
                                    const SizedBox(width: 6),
                                    Text(
                                      gym['status'] as String,
                                      style: AppTypography.caption.copyWith(
                                        color: AppColors.primaryDark,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                gym['city'] as String,
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.textMuted,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            gym['name'] as String,
                            style: AppTypography.headingSmall.copyWith(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: AppColors.text,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 12,
                            runSpacing: 4,
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.people_alt_outlined, size: 15, color: AppColors.textSecondary),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${gym['members']} members',
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.payments_outlined, size: 15, color: AppColors.textSecondary),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${gym['revenue']} today',
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Align(
                            alignment: Alignment.centerRight,
                            child: RepsiPress(
                              onTap: () => _onSelectWorkspace(gym),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                                decoration: BoxDecoration(
                                  color: AppColors.primary,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'Open',
                                      style: AppTypography.bodySmall.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),

              const SizedBox(height: 20),
              // Footnote about website workspace creation
              Center(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Want to register another gym location?',
                        textAlign: TextAlign.center,
                        style: AppTypography.bodySmall.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Gym workspaces must be created on our website repsi.app from a desktop computer.',
                        textAlign: TextAlign.center,
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
