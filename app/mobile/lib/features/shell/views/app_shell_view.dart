import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../shared/models/user_model.dart';
import '../../../shared/navigation/repsi_bottom_nav.dart';
import '../../workspaces/providers/workspace_provider.dart';

class AppShellView extends ConsumerStatefulWidget {
  final StatefulNavigationShell navigationShell;

  const AppShellView({
    super.key,
    required this.navigationShell,
  });

  @override
  ConsumerState<AppShellView> createState() => _AppShellViewState();
}

class _AppShellViewState extends ConsumerState<AppShellView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(workspaceProvider.notifier).fetchWorkspaces();
    });
  }

  void _onTabSelected(int index) {
    widget.navigationShell.goBranch(
      index,
      initialLocation: index == widget.navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: widget.navigationShell,
      bottomNavigationBar: RepsiBottomNav(
        currentIndex: widget.navigationShell.currentIndex,
        onTap: _onTabSelected,
        role: UserRole.owner,
      ),
    );
  }
}
