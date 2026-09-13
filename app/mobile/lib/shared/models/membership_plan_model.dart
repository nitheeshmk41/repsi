class MembershipPlanModel {
  final String id;
  final String workspaceId;
  final String name;
  final String? description;
  final int durationInDays;
  final double price;
  final String? currency;
  final bool isActive;
  final List<String> features;
  final DateTime? createdAt;

  const MembershipPlanModel({
    required this.id,
    required this.workspaceId,
    required this.name,
    this.description,
    required this.durationInDays,
    required this.price,
    this.currency = 'INR',
    this.isActive = true,
    this.features = const [],
    this.createdAt,
  });

  factory MembershipPlanModel.fromJson(Map<String, dynamic> json) {
    return MembershipPlanModel(
      id: json['id']?.toString() ?? '',
      workspaceId: json['workspace_id']?.toString() ?? '',
      name: json['name'] as String? ?? 'General Plan',
      description: json['description'] as String?,
      durationInDays: (json['duration_in_days'] as num?)?.toInt() ?? 30,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'INR',
      isActive: json['is_active'] as bool? ?? true,
      features: (json['features'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at'].toString()) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'workspace_id': workspaceId,
      'name': name,
      'description': description,
      'duration_in_days': durationInDays,
      'price': price,
      'currency': currency,
      'is_active': isActive,
      'features': features,
      if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
    };
  }
}
