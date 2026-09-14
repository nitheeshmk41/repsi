import 'package:flutter/foundation.dart';

enum MachineStatus { available, inUse, maintenance, unavailable }

class GymMachine {
  final String id;
  final String name;
  final String category;
  final String targetMuscles;
  final String description;
  final String instructions;
  final MachineStatus status;

  const GymMachine({
    required this.id,
    required this.name,
    required this.category,
    required this.targetMuscles,
    required this.description,
    required this.instructions,
    required this.status,
  });
}

class BodyMeasurement {
  final DateTime date;
  final double weightKg;
  final double? chestCm;
  final double? waistCm;
  final double? armsCm;
  final double? thighsCm;

  const BodyMeasurement({
    required this.date,
    required this.weightKg,
    this.chestCm,
    this.waistCm,
    this.armsCm,
    this.thighsCm,
  });
}

class FitnessGoal {
  final String id;
  final String title;
  final double current;
  final double target;
  final String unit;
  final String category;

  const FitnessGoal({
    required this.id,
    required this.title,
    required this.current,
    required this.target,
    required this.unit,
    required this.category,
  });

  double get progressPercentage => (current / target).clamp(0.0, 1.0);
}

class RunSession {
  final String id;
  final DateTime dateTime;
  final double distanceKm;
  final int durationSeconds;
  final double paceMinPerKm;
  final int caloriesEstimated;

  const RunSession({
    required this.id,
    required this.dateTime,
    required this.distanceKm,
    required this.durationSeconds,
    required this.paceMinPerKm,
    required this.caloriesEstimated,
  });
}

class ChatMessage {
  final String id;
  final String senderId;
  final String text;
  final DateTime timestamp;
  final bool isFromTrainer;

  const ChatMessage({
    required this.id,
    required this.senderId,
    required this.text,
    required this.timestamp,
    required this.isFromTrainer,
  });
}

class MemberPayment {
  final String id;
  final String title;
  final double amount;
  final DateTime date;
  final String status;
  final String paymentMethod;
  final String receiptNumber;

  const MemberPayment({
    required this.id,
    required this.title,
    required this.amount,
    required this.date,
    required this.status,
    required this.paymentMethod,
    required this.receiptNumber,
  });
}
