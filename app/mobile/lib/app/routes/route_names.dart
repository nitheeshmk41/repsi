class RouteNames {
  static const String splash = '/splash';
  static const String login = '/auth/login';
  static const String signup = '/auth/signup';
  static const String verifyEmail = '/auth/verify-email';
  static const String forgotPassword = '/auth/forgot-password';
  static const String onboarding = '/onboarding';
  static const String trainerDashboard = '/trainer/dashboard';
  static const String userDashboard = '/user/dashboard';

  static String roleDashboard(String? role) {
    switch (role?.toUpperCase()) {
      case 'TRAINER':
        return trainerDashboard;
      case 'USER':
      case 'MEMBER':
        return userDashboard;
      default:
        return dashboard;
    }
  }

  // Shell tabs
  static const String dashboard = '/dashboard';
  static const String members = '/members';
  static const String attendance = '/attendance';
  static const String more = '/more';

  // Secondary screens
  static const String memberDetail = '/members/:id';
  static const String addMember = '/members/add';
  static const String memberships = '/memberships';
  static const String payments = '/payments';
  static const String recordPayment = '/payments/record';
  static const String expenses = '/expenses';
  static const String trainers = '/trainers';
  static const String classes = '/classes';
  static const String workouts = '/workouts';
  static const String reports = '/reports';
  static const String analytics = '/analytics';
  static const String settings = '/settings';
  static const String notifications = '/notifications';
}
