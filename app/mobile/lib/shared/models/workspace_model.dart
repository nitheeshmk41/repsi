class WorkspaceModel {
  final String id;
  final String name;
  final String slug;
  final String? phone;
  final String? email;
  final String? address;
  final String? city;
  final String? country;
  final String gymType;
  final String currency;
  final String timezone;
  final String openingHours;
  final bool isActive;

  WorkspaceModel({
    required this.id,
    required this.name,
    required this.slug,
    this.phone,
    this.email,
    this.address,
    this.city,
    this.country,
    this.gymType = 'Strength & Conditioning',
    this.currency = 'INR',
    this.timezone = 'Asia/Kolkata',
    this.openingHours = '05:30 AM – 10:30 PM',
    this.isActive = true,
  });

  factory WorkspaceModel.fromJson(Map<String, dynamic> json) {
    return WorkspaceModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Apex Fitness Club',
      slug: json['slug']?.toString() ?? 'apex-fitness',
      phone: json['phone']?.toString(),
      email: json['email']?.toString(),
      address: json['address']?.toString(),
      city: json['city']?.toString() ?? 'Coimbatore',
      country: json['country']?.toString() ?? 'India',
      gymType: json['gym_type']?.toString() ?? 'Strength & Conditioning',
      currency: json['currency']?.toString() ?? 'INR',
      timezone: json['timezone']?.toString() ?? 'Asia/Kolkata',
      openingHours: json['opening_hours']?.toString() ?? '05:30 AM – 10:30 PM',
      isActive: json['is_active'] != false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'phone': phone,
      'email': email,
      'address': address,
      'city': city,
      'country': country,
      'gym_type': gymType,
      'currency': currency,
      'timezone': timezone,
      'opening_hours': openingHours,
      'is_active': isActive,
    };
  }
}
