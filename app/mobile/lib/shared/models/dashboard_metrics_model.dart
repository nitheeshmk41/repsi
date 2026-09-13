class ChartDataPointModel {
  final String label;
  final double value;

  const ChartDataPointModel({
    required this.label,
    required this.value,
  });

  factory ChartDataPointModel.fromJson(Map<String, dynamic> json) {
    return ChartDataPointModel(
      label: json['label']?.toString() ?? '',
      value: (json['value'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'value': value,
    };
  }
}

class DashboardMetricsModel {
  final int activeMembers;
  final double monthlyRevenue;
  final int todayAttendance;
  final int expiringMemberships;
  final double revenueGrowthPct;
  final String attendancePeakHour;
  final int recentCheckinsCount;
  final List<ChartDataPointModel> revenueChart;
  final List<ChartDataPointModel> attendanceChart;

  const DashboardMetricsModel({
    required this.activeMembers,
    required this.monthlyRevenue,
    required this.todayAttendance,
    required this.expiringMemberships,
    this.revenueGrowthPct = 0.0,
    this.attendancePeakHour = '6:00 PM',
    this.recentCheckinsCount = 0,
    this.revenueChart = const [],
    this.attendanceChart = const [],
  });

  factory DashboardMetricsModel.fromJson(Map<String, dynamic> json) {
    final revList = (json['revenue_chart'] as List<dynamic>?)
            ?.map((e) => ChartDataPointModel.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];
    final attList = (json['attendance_chart'] as List<dynamic>?)
            ?.map((e) => ChartDataPointModel.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return DashboardMetricsModel(
      activeMembers: (json['active_members'] as num?)?.toInt() ?? 0,
      monthlyRevenue: (json['monthly_revenue'] as num?)?.toDouble() ?? 0.0,
      todayAttendance: (json['today_attendance'] as num?)?.toInt() ?? 0,
      expiringMemberships: (json['expiring_memberships'] as num?)?.toInt() ?? 0,
      revenueGrowthPct: (json['revenue_growth_pct'] as num?)?.toDouble() ?? 0.0,
      attendancePeakHour: json['attendance_peak_hour'] as String? ?? '6:00 PM',
      recentCheckinsCount: (json['recent_checkins_count'] as num?)?.toInt() ?? 0,
      revenueChart: revList,
      attendanceChart: attList,
    );
  }

  factory DashboardMetricsModel.empty() {
    return const DashboardMetricsModel(
      activeMembers: 0,
      monthlyRevenue: 0.0,
      todayAttendance: 0,
      expiringMemberships: 0,
      revenueGrowthPct: 0.0,
      attendancePeakHour: 'N/A',
      recentCheckinsCount: 0,
      revenueChart: [],
      attendanceChart: [],
    );
  }
}
