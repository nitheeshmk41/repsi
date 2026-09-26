class RouteNames {
  static const String splash = '/splash';
  static const String onboarding = '/onboarding';
  static const String login = '/auth/login';
  static const String signup = '/auth/signup';
  static const String verifyEmail = '/auth/verify-email';
  static const String forgotPassword = '/auth/forgot-password';
  static const String verifyOtp = '/auth/verify-otp';
  static const String setNewPassword = '/auth/set-new-password';
  static const String selectRole = '/auth/select-role';

  // Role dashboards
  static const String userDashboard = '/member/dashboard';
  static const String trainerDashboard = '/trainer/dashboard';
  static const String ownerDashboard = '/dashboard';
  static const String adminDashboard = '/admin/dashboard';

  static String roleDashboard(String? role) {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return adminDashboard;
      case 'TRAINER':
        return trainerDashboard;
      case 'USER':
      case 'MEMBER':
        return userDashboard;
      case 'OWNER':
      default:
        return ownerDashboard;
    }
  }

  // Owner / Standard tabs
  static const String dashboard = '/dashboard';
  static const String members = '/members';
  static const String attendance = '/attendance';
  static const String finance = '/finance';
  static const String more = '/more';

  // Secondary screens
  static const String checkIn = '/check-in';
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
