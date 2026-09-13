enum AttendanceStatus {
  present,
  absent,
  late,
  leftEarly;

  static AttendanceStatus fromString(String? status) {
    switch (status?.toLowerCase()) {
      case 'present':
        return AttendanceStatus.present;
      case 'absent':
        return AttendanceStatus.absent;
      case 'late':
        return AttendanceStatus.late;
      case 'left_early':
        return AttendanceStatus.leftEarly;
      default:
        return AttendanceStatus.present;
    }
  }

  String toApiString() {
    switch (this) {
      case AttendanceStatus.present:
        return 'PRESENT';
      case AttendanceStatus.absent:
        return 'ABSENT';
      case AttendanceStatus.late:
        return 'LATE';
      case AttendanceStatus.leftEarly:
        return 'LEFT_EARLY';
    }
  }
}

class AttendanceRecordModel {
  final String id;
  final String memberId;
  final String? memberName;
  final String? memberPhotoUrl;
  final String? checkInMethod; // QR_SCAN, MANUAL, FINGERPRINT
  final DateTime checkInTime;
  final DateTime? checkOutTime;
  final AttendanceStatus status;

  const AttendanceRecordModel({
    required this.id,
    required this.memberId,
    this.memberName,
    this.memberPhotoUrl,
    this.checkInMethod = 'QR_SCAN',
    required this.checkInTime,
    this.checkOutTime,
    this.status = AttendanceStatus.present,
  });

  factory AttendanceRecordModel.fromJson(Map<String, dynamic> json) {
    return AttendanceRecordModel(
      id: json['id']?.toString() ?? '',
      memberId: json['member_id']?.toString() ?? '',
      memberName: json['member_name'] as String? ?? json['member']?['full_name'] as String?,
      memberPhotoUrl: json['member_photo_url'] as String?,
      checkInMethod: json['check_in_method'] as String? ?? 'QR_SCAN',
      checkInTime: json['check_in_time'] != null
          ? DateTime.parse(json['check_in_time'].toString())
          : DateTime.now(),
      checkOutTime: json['check_out_time'] != null
          ? DateTime.tryParse(json['check_out_time'].toString())
          : null,
      status: AttendanceStatus.fromString(json['status'] as String?),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'member_id': memberId,
      'member_name': memberName,
      'check_in_method': checkInMethod,
      'check_in_time': checkInTime.toIso8601String(),
      if (checkOutTime != null) 'check_out_time': checkOutTime!.toIso8601String(),
      'status': status.toApiString(),
    };
  }
}

class AttendanceSummaryModel {
  final int totalToday;
  final int currentlyInside;
  final int peakHourCount;
  final String peakHourTime;
  final List<AttendanceRecordModel> recentCheckIns;

  const AttendanceSummaryModel({
    required this.totalToday,
    required this.currentlyInside,
    required this.peakHourCount,
    required this.peakHourTime,
    this.recentCheckIns = const [],
  });

  factory AttendanceSummaryModel.fromJson(Map<String, dynamic> json) {
    final recentList = (json['recent_check_ins'] as List<dynamic>?)
            ?.map((e) => AttendanceRecordModel.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return AttendanceSummaryModel(
      totalToday: (json['total_today'] as num?)?.toInt() ?? 0,
      currentlyInside: (json['currently_inside'] as num?)?.toInt() ?? 0,
      peakHourCount: (json['peak_hour_count'] as num?)?.toInt() ?? 0,
      peakHourTime: json['peak_hour_time'] as String? ?? '6:00 PM - 7:00 PM',
      recentCheckIns: recentList,
    );
  }
}
