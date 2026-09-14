class ApiEndpoints {
  // Auth
  static const String login = '/auth/login';
  static const String googleLogin = '/auth/google';
  static const String register = '/auth/register';
  static const String registerMember = '/auth/register/member';
  static const String me = '/auth/me';
  static const String forgotPassword = '/auth/forgot-password';
  static const String logout = '/auth/logout';

  // Workspaces
  static const String workspaces = '/workspaces';
  static String workspaceDetail(String id) => '/workspaces/$id';
  static const String completeOnboarding = '/workspaces/onboarding/complete';

  // Dashboard
  static const String dashboardMetrics = '/dashboard/metrics';

  // Members
  static const String members = '/members';
  static String memberDetail(String id) => '/members/$id';

  // Memberships
  static const String memberships = '/memberships';
  static String membershipDetail(String id) => '/memberships/$id';
  static const String membershipPlans = '/memberships/plans';

  // Attendance
  static const String checkIn = '/attendance/check-in';
  static const String checkOut = '/attendance/check-out';
  static const String attendanceCheckIn = checkIn;
  static const String attendanceCheckOut = checkOut;
  static const String attendanceSummary = '/attendance/summary';

  // Payments & Expenses
  static const String payments = '/payments';
  static const String paymentsSummary = '/payments/summary';
  static const String expenses = '/expenses';

  // Trainers & Classes & Workouts
  static const String trainers = '/trainers';
  static String trainerDetail(String id) => '/trainers/$id';
  static const String classes = '/classes';
  static String classDetail(String id) => '/classes/$id';
  static const String workoutPlans = '/workouts/plans';

  // Reports
  static const String reportsSummary = '/reports/summary';
  static const String revenueTrends = '/reports/revenue-trends';

  // Users & Staff
  static const String users = '/users';
}
