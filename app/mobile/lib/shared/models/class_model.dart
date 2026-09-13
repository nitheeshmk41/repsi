class FitnessClassModel {
  final String id;
  final String workspaceId;
  final String name;
  final String? description;
  final String? trainerId;
  final String? trainerName;
  final DateTime startTime;
  final DateTime endTime;
  final int capacity;
  final int enrolledCount;
  final String? location;

  const FitnessClassModel({
    required this.id,
    required this.workspaceId,
    required this.name,
    this.description,
    this.trainerId,
    this.trainerName,
    required this.startTime,
    required this.endTime,
    required this.capacity,
    this.enrolledCount = 0,
    this.location,
  });

  factory FitnessClassModel.fromJson(Map<String, dynamic> json) {
    return FitnessClassModel(
      id: json['id']?.toString() ?? '',
      workspaceId: json['workspace_id']?.toString() ?? '',
      name: json['name'] as String? ?? json['title'] as String? ?? 'Class',
      description: json['description'] as String?,
      trainerId: json['trainer_id']?.toString(),
      trainerName: json['trainer_name'] as String? ?? json['trainer']?['full_name'] as String?,
      startTime: json['start_time'] != null
          ? DateTime.parse(json['start_time'].toString())
          : DateTime.now(),
      endTime: json['end_time'] != null
          ? DateTime.parse(json['end_time'].toString())
          : DateTime.now().add(const Duration(hours: 1)),
      capacity: (json['capacity'] as num?)?.toInt() ?? 20,
      enrolledCount: (json['enrolled_count'] as num?)?.toInt() ?? (json['booked_count'] as num?)?.toInt() ?? 0,
      location: json['location'] as String? ?? json['room'] as String? ?? 'Main Studio',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'workspace_id': workspaceId,
      'name': name,
      'description': description,
      'trainer_id': trainerId,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime.toIso8601String(),
      'capacity': capacity,
      'location': location,
    };
  }
}
