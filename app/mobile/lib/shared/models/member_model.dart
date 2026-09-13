enum MemberStatus { active, expiring, expired, frozen, cancelled }

extension MemberStatusLabels on MemberStatus {
  String get displayName {
    switch (this) {
      case MemberStatus.active:
        return 'Active';
      case MemberStatus.expiring:
        return 'Expiring';
      case MemberStatus.expired:
        return 'Expired';
      case MemberStatus.frozen:
        return 'Frozen';
      case MemberStatus.cancelled:
        return 'Cancelled';
    }
  }
}

class MemberModel {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phone;
  final String? avatarUrl;
  final String? gender;
  final String? dateOfBirth;
  final String? emergencyContact;
  final MemberStatus status;
  final String? joinedDate;
  final String? trainerId;
  final String? notes;
  final String? planName;
  final String? expiryDate;

  String? get photoUrl => avatarUrl;
  String? get membershipPlanName => planName;
  DateTime? get startDate => joinedDate == null ? null : DateTime.tryParse(joinedDate!);
  DateTime? get endDate => expiryDate == null ? null : DateTime.tryParse(expiryDate!);
  String? get assignedTrainerName => null;
  String? get emergencyContactPhone => emergencyContact;
  String? get emergencyContactName => null;

  MemberModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.email = '',
    this.phone,
    this.avatarUrl,
    this.gender,
    this.dateOfBirth,
    this.emergencyContact,
    this.status = MemberStatus.active,
    this.joinedDate,
    this.trainerId,
    this.notes,
    this.planName,
    this.expiryDate,
  });

  String get fullName => '$firstName $lastName'.trim();

  String get initials {
    final first = firstName.isNotEmpty ? firstName[0] : '';
    final last = lastName.isNotEmpty ? lastName[0] : '';
    return '$first$last'.toUpperCase();
  }

  factory MemberModel.fromJson(Map<String, dynamic> json) {
    return MemberModel(
      id: json['id']?.toString() ?? '',
      firstName: json['first_name']?.toString() ?? '',
      lastName: json['last_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString(),
      avatarUrl: json['avatar_url']?.toString(),
      gender: json['gender']?.toString(),
      dateOfBirth: json['date_of_birth']?.toString(),
      emergencyContact: json['emergency_contact']?.toString(),
        status: json['status'] != null ? _statusFromJson(json['status']?.toString()) : MemberStatus.active,
      joinedDate: json['joined_date']?.toString(),
      trainerId: json['trainer_id']?.toString(),
      notes: json['notes']?.toString(),
      planName: json['plan_name']?.toString() ?? 'Monthly Standard',
      expiryDate: json['expiry_date']?.toString() ?? 'In 24 days',
    );
  }

  static MemberStatus _statusFromJson(String? value) {
    switch (value?.toUpperCase()) {
      case 'EXPIRING':
        return MemberStatus.expiring;
      case 'EXPIRED':
        return MemberStatus.expired;
      case 'FROZEN':
        return MemberStatus.frozen;
      case 'CANCELLED':
        return MemberStatus.cancelled;
      default:
        return MemberStatus.active;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'phone': phone,
      'avatar_url': avatarUrl,
      'gender': gender,
      'date_of_birth': dateOfBirth,
      'emergency_contact': emergencyContact,
        'status': status.name.toUpperCase(),
      'joined_date': joinedDate,
      'trainer_id': trainerId,
      'notes': notes,
    };
  }
}
