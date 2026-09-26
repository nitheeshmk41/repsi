import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../shared/models/user_model.dart';

class RepsiNavItem {
  final IconData icon;
  final IconData? activeIcon;
  final String label;

  const RepsiNavItem({
    required this.icon,
    this.activeIcon,
    required this.label,
  });
}

class RepsiBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final UserRole role;
  final List<RepsiNavItem>? customItems;

  const RepsiBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.role = UserRole.user,
    this.customItems,
  });

  static List<RepsiNavItem> getItemsForRole(UserRole role) {
    switch (role) {
      case UserRole.trainer:
        return const [
          RepsiNavItem(icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: 'Home'),
          RepsiNavItem(icon: Icons.people_outline_rounded, activeIcon: Icons.people_rounded, label: 'Clients'),
          RepsiNavItem(icon: Icons.calendar_today_outlined, activeIcon: Icons.calendar_today_rounded, label: 'Schedule'),
          RepsiNavItem(icon: Icons.fitness_center_outlined, activeIcon: Icons.fitness_center_rounded, label: 'Plans'),
          RepsiNavItem(icon: Icons.menu_rounded, activeIcon: Icons.menu_rounded, label: 'More'),
        ];
      case UserRole.owner:
      case UserRole.manager:
        return const [
          RepsiNavItem(icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: 'Home'),
          RepsiNavItem(icon: Icons.group_outlined, activeIcon: Icons.group_rounded, label: 'Members'),
          RepsiNavItem(icon: Icons.qr_code_scanner_rounded, activeIcon: Icons.qr_code_scanner_rounded, label: 'Attendance'),
          RepsiNavItem(icon: Icons.account_balance_wallet_outlined, activeIcon: Icons.account_balance_wallet_rounded, label: 'Finance'),
          RepsiNavItem(icon: Icons.grid_view_rounded, activeIcon: Icons.grid_view_rounded, label: 'More'),
        ];
      case UserRole.admin:
      case UserRole.superAdmin:
        return const [
          RepsiNavItem(icon: Icons.dashboard_outlined, activeIcon: Icons.dashboard_rounded, label: 'Home'),
          RepsiNavItem(icon: Icons.fitness_center_outlined, activeIcon: Icons.fitness_center_rounded, label: 'Gyms'),
          RepsiNavItem(icon: Icons.people_outline_rounded, activeIcon: Icons.people_rounded, label: 'Users'),
          RepsiNavItem(icon: Icons.analytics_outlined, activeIcon: Icons.analytics_rounded, label: 'Analytics'),
          RepsiNavItem(icon: Icons.settings_outlined, activeIcon: Icons.settings_rounded, label: 'More'),
        ];
      case UserRole.user:
      case UserRole.staff:
        return const [
          RepsiNavItem(icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: 'Home'),
          RepsiNavItem(icon: Icons.fitness_center_outlined, activeIcon: Icons.fitness_center_rounded, label: 'Workout'),
          RepsiNavItem(icon: Icons.show_chart_rounded, activeIcon: Icons.show_chart_rounded, label: 'Progress'),
          RepsiNavItem(icon: Icons.calendar_month_outlined, activeIcon: Icons.calendar_month_rounded, label: 'Classes'),
          RepsiNavItem(icon: Icons.grid_view_rounded, activeIcon: Icons.grid_view_rounded, label: 'More'),
        ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final items = customItems ?? getItemsForRole(role);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkNavigation : AppColors.surface,
        border: Border(
          top: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.border,
            width: 1.0,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (index) {
              final isSelected = currentIndex == index;
              final item = items[index];

              return Expanded(
                child: _RepsiNavItemWidget(
                  item: item,
                  isSelected: isSelected,
                  onTap: () {
                    HapticFeedback.selectionClick();
                    onTap(index);
                  },
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _RepsiNavItemWidget extends StatelessWidget {
  final RepsiNavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  const _RepsiNavItemWidget({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activeColor = AppColors.primary;
    final inactiveColor = isDark ? AppColors.darkTextMuted : AppColors.textSecondary;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Subtle green indicator line at top of item
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOutCubic,
            height: 3,
            width: isSelected ? 20 : 0,
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary : Colors.transparent,
              borderRadius: BorderRadius.circular(1.5),
            ),
          ),
          const Spacer(),
          // Icon with scale animation 1.0 -> 1.08
          AnimatedScale(
            scale: isSelected ? 1.08 : 1.0,
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOutCubic,
            child: Icon(
              isSelected ? (item.activeIcon ?? item.icon) : item.icon,
              size: 22,
              color: isSelected ? activeColor : inactiveColor,
            ),
          ),
          const SizedBox(height: 3),
          AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOutCubic,
            style: AppTypography.caption.copyWith(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              color: isSelected ? activeColor : inactiveColor,
            ),
            child: Text(item.label),
          ),
          const SizedBox(height: 6),
        ],
      ),
    );
  }
}
