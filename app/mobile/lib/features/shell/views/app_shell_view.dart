import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../shared/widgets/repsi_app_bar.dart';
import '../../auth/providers/auth_provider.dart';
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
    // Fetch user's workspaces
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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final workspaceState = ref.watch(workspaceProvider);
    final authState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      appBar: RepsiAppBar(
        showWorkspaceSelector: true,
        currentWorkspace: workspaceState.activeWorkspace,
        workspaces: workspaceState.workspaces,
        userFullName: authState.user?.fullName ?? 'Admin',
        userAvatarUrl: authState.user?.avatarUrl,
        onWorkspaceSelected: (ws) {
          ref.read(workspaceProvider.notifier).selectWorkspace(ws);
          ref.read(authProvider.notifier).updateActiveWorkspace(ws.id, ws.slug);
        },
        onNotificationTap: () => context.push(RouteNames.notifications),
        onProfileTap: () => context.push(RouteNames.settings),
      ),
      body: widget.navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.surface,
          border: Border(
            top: BorderSide(
              color: isDark ? AppColors.darkBorder : AppColors.border,
              width: 1,
            ),
          ),
        ),
        child: NavigationBar(
          selectedIndex: widget.navigationShell.currentIndex,
          onDestinationSelected: _onTabSelected,
          backgroundColor: isDark ? AppColors.darkSurface : AppColors.surface,
          indicatorColor: isDark ? AppColors.darkSurfaceElevated : AppColors.surfaceSubtle,
          destinations: const [
            NavigationDestination(
              icon: Icon(LucideIcons.layoutDashboard),
              selectedIcon: Icon(LucideIcons.layoutDashboard, color: AppColors.primary),
              label: 'Dashboard',
            ),
            NavigationDestination(
              icon: Icon(LucideIcons.users),
              selectedIcon: Icon(LucideIcons.users, color: AppColors.primary),
              label: 'Members',
            ),
            NavigationDestination(
              icon: Icon(LucideIcons.qrCode),
              selectedIcon: Icon(LucideIcons.qrCode, color: AppColors.primary),
              label: 'Attendance',
            ),
            NavigationDestination(
              icon: Icon(LucideIcons.grid),
              selectedIcon: Icon(LucideIcons.grid, color: AppColors.primary),
              label: 'More',
            ),
          ],
        ),
      ),
    );
  }
}
