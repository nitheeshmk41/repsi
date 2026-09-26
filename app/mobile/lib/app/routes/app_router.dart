import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/admin/views/admin_shell_view.dart';
import '../../features/attendance/views/attendance_view.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../../features/auth/views/forgot_password_view.dart';
import '../../features/auth/views/login_view.dart';
import '../../features/auth/views/role_selection_view.dart';
import '../../features/auth/views/set_new_password_view.dart';
import '../../features/auth/views/signup_view.dart';
import '../../features/auth/views/verify_otp_view.dart';
import '../../features/dashboard/views/dashboard_view.dart';
import '../../features/finance/views/owner_finance_view.dart';
import '../../features/member/presentation/views/member_shell_view.dart';
import '../../features/member/presentation/views/qr_attendance_view.dart';
import '../../features/members/views/add_member_view.dart';
import '../../features/members/views/members_list_view.dart';
import '../../features/more/views/more_view.dart';
import '../../features/onboarding/views/onboarding_view.dart';
import '../../features/shell/views/app_shell_view.dart';
import '../../features/splash/views/splash_view.dart';
import '../../features/trainer/views/trainer_shell_view.dart';
import '../../shared/animations/repsi_page_transition.dart';
import 'route_names.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider);

  return GoRouter(
    initialLocation: RouteNames.splash,
    redirect: (context, state) {
      final location = state.matchedLocation;
      final isAuthRoute = location.startsWith('/auth') || location == RouteNames.onboarding;

      if (auth.status == AuthStatus.initial || auth.status == AuthStatus.loading) {
        return location == RouteNames.splash ? null : RouteNames.splash;
      }

      if (!auth.isAuthenticated) {
        return isAuthRoute || location == RouteNames.splash ? null : RouteNames.login;
      }

      if (auth.isAuthenticated && (location == RouteNames.login || location == RouteNames.splash)) {
        return RouteNames.roleDashboard(auth.user?.role);
      }

      return null;
    },
    routes: [
      GoRoute(
        path: RouteNames.splash,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const SplashView(),
        ),
      ),
      GoRoute(
        path: RouteNames.onboarding,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const OnboardingView(),
        ),
      ),
      GoRoute(
        path: RouteNames.login,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const LoginView(),
        ),
      ),
      GoRoute(
        path: RouteNames.signup,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const SignupView(),
        ),
      ),
      GoRoute(
        path: RouteNames.forgotPassword,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const ForgotPasswordView(),
        ),
      ),
      GoRoute(
        path: RouteNames.verifyOtp,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: VerifyOtpView(email: state.extra as String?),
        ),
      ),
      GoRoute(
        path: RouteNames.setNewPassword,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const SetNewPasswordView(),
        ),
      ),
      GoRoute(
        path: RouteNames.selectRole,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const RoleSelectionView(),
        ),
      ),

      // Direct Role Shell Routes
      GoRoute(
        path: RouteNames.userDashboard,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const MemberShellView(),
        ),
      ),
      GoRoute(
        path: RouteNames.trainerDashboard,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const TrainerShellView(),
        ),
      ),
      GoRoute(
        path: RouteNames.adminDashboard,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const AdminShellView(),
        ),
      ),

      // Check-in shortcut
      GoRoute(
        path: RouteNames.checkIn,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const QrAttendanceView(),
        ),
      ),

      // Add Member shortcut
      GoRoute(
        path: RouteNames.addMember,
        pageBuilder: (context, state) => buildRepsiPageTransition(
          context: context,
          state: state,
          child: const AddMemberView(),
        ),
      ),

      // Owner App Shell Route
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => AppShellView(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.dashboard,
                builder: (_, __) => const DashboardView(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.members,
                builder: (_, __) => const MembersListView(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.attendance,
                builder: (_, __) => const AttendanceView(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.finance,
                builder: (_, __) => const OwnerFinanceView(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.more,
                builder: (_, __) => const MoreView(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});