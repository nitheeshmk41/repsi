class TrainerModel {
  final String id;
  final String workspaceId;
  final String fullName;
  final String email;
  final String? phone;
  final String? specialization;
  final String? bio;
  final String? photoUrl;
  final double? rating;
  final int activeClientsCount;
  final bool isActive;

  const TrainerModel({
    required this.id,
    required this.workspaceId,
    required this.fullName,
    required this.email,
    this.phone,
    this.specialization,
    this.bio,
    this.photoUrl,
    this.rating = 4.8,
    this.activeClientsCount = 0,
    this.isActive = true,
  });

  factory TrainerModel.fromJson(Map<String, dynamic> json) {
    return TrainerModel(
      id: json['id']?.toString() ?? '',
      workspaceId: json['workspace_id']?.toString() ?? '',
      fullName: json['full_name'] as String? ?? 'Trainer',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String?,
      specialization: json['specialization'] as String?,
      bio: json['bio'] as String?,
      photoUrl: json['photo_url'] as String?,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      activeClientsCount: (json['active_clients_count'] as num?)?.toInt() ?? 0,
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'workspace_id': workspaceId,
      'full_name': fullName,
      'email': email,
      'phone': phone,
      'specialization': specialization,
      'bio': bio,
      'photo_url': photoUrl,
      'is_active': isActive,
    };
  }
}
