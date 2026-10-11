enum UserRole {
  owner,
  admin,
  manager,
  trainer,
  staff,
  user,
  superAdmin;

  String get dbValue {
    switch (this) {
      case UserRole.superAdmin:
        return 'SUPER_ADMIN';
      case UserRole.owner:
        return 'OWNER';
      case UserRole.admin:
        return 'ADMIN';
      case UserRole.manager:
        return 'MANAGER';
      case UserRole.trainer:
        return 'TRAINER';
      case UserRole.staff:
        return 'STAFF';
      case UserRole.user:
        return 'USER';
    }
  }

  static UserRole fromString(String value) {
    final clean = value.replaceAll('_', '').toUpperCase();
    switch (clean) {
      case 'ADMIN':
        return UserRole.admin;
      case 'MANAGER':
        return UserRole.manager;
      case 'TRAINER':
        return UserRole.trainer;
      case 'STAFF':
        return UserRole.staff;
      case 'USER':
      case 'MEMBER':
        return UserRole.user;
      case 'SUPERADMIN':
        return UserRole.superAdmin;
      default:
        return UserRole.owner;
    }
  }
}

class UserModel {
  final String id;
  final String email;
  final String fullName;
  final String? phone;
  final bool isSuperadmin;
  final bool isActive;
  final String role;
  final String? workspaceId;

  String? get avatarUrl => null;

  UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
    required this.isSuperadmin,
    required this.isActive,
    this.role = 'OWNER',
    this.workspaceId,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      fullName: json['full_name']?.toString() ?? 'User',
      phone: json['phone']?.toString(),
      isSuperadmin: json['is_superadmin'] == true,
      isActive: json['is_active'] != false,
      role: json['role']?.toString() ?? 'OWNER',
      workspaceId: json['workspace_id']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'phone': phone,
      'is_superadmin': isSuperadmin,
      'is_active': isActive,
      'role': role,
      'workspace_id': workspaceId,
    };
  }

  UserModel copyWith({
    String? id,
    String? email,
    String? fullName,
    String? phone,
    bool? isSuperadmin,
    bool? isActive,
    String? role,
    String? workspaceId,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      isSuperadmin: isSuperadmin ?? this.isSuperadmin,
      isActive: isActive ?? this.isActive,
      role: role ?? this.role,
      workspaceId: workspaceId ?? this.workspaceId,
    );
  }
}
