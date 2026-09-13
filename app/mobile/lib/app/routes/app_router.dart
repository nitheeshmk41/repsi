import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/attendance/views/attendance_view.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../../features/auth/views/forgot_password_view.dart';
import '../../features/auth/views/login_view.dart';
import '../../features/auth/views/signup_view.dart';
import '../../features/dashboard/views/dashboard_view.dart';
import '../../features/members/views/members_list_view.dart';
import '../../features/more/views/more_view.dart';
import '../../features/onboarding/views/onboarding_view.dart';
import '../../features/role/views/role_dashboard_view.dart';
import '../../features/splash/views/splash_view.dart';
import 'route_names.dart';
import '../../shared/models/user_model.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider);

  return GoRouter(
    initialLocation: RouteNames.splash,
    redirect: (context, state) {
      final location = state.matchedLocation;
      final isAuthRoute = location.startsWith('/auth');
      final isProtected = location == RouteNames.dashboard ||
          location == RouteNames.members ||
          location == RouteNames.attendance ||
          location == RouteNames.more;

      if (auth.status == AuthStatus.initial || auth.status == AuthStatus.loading) {
        return location == RouteNames.splash ? null : RouteNames.splash;
      }
      if (auth.status == AuthStatus.unauthenticated || auth.status == AuthStatus.error) {
        return isAuthRoute || location == RouteNames.splash ? null : RouteNames.login;
      }
      if (auth.isAuthenticated && (isAuthRoute || location == RouteNames.splash)) {
        return RouteNames.roleDashboard(auth.user?.role);
      }
      if (auth.isAuthenticated && isProtected) {
        final role = auth.user?.role.toUpperCase() ?? 'OWNER';
        if (role == 'TRAINER' && location != RouteNames.dashboard) return RouteNames.dashboard;
        if (role == 'USER' && location != RouteNames.dashboard) return RouteNames.dashboard;
      }
      return null;
    },
    routes: [
      GoRoute(path: RouteNames.splash, builder: (_, __) => const SplashView()),
      GoRoute(path: RouteNames.login, builder: (_, __) => const LoginView()),
      GoRoute(path: RouteNames.signup, builder: (_, __) => const SignupView()),
      GoRoute(path: RouteNames.forgotPassword, builder: (_, __) => const ForgotPasswordView()),
      GoRoute(path: RouteNames.onboarding, builder: (_, __) => const OnboardingView()),
      GoRoute(path: RouteNames.trainerDashboard, builder: (_, __) => const RoleDashboardView(role: UserRole.trainer)),
      GoRoute(path: RouteNames.userDashboard, builder: (_, __) => const RoleDashboardView(role: UserRole.user)),
      ShellRoute(
        builder: (_, __, child) => child,
        routes: [
          GoRoute(path: RouteNames.dashboard, builder: (_, __) => const DashboardView()),
          GoRoute(path: RouteNames.members, builder: (_, __) => const MembersListView()),
          GoRoute(path: RouteNames.attendance, builder: (_, __) => const AttendanceView()),
          GoRoute(path: RouteNames.more, builder: (_, __) => const MoreView()),
        ],
      ),
    ],
  );
});