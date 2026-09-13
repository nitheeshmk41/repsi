enum PaymentStatus {
  completed,
  pending,
  failed,
  refunded;

  static PaymentStatus fromString(String? status) {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return PaymentStatus.completed;
      case 'pending':
        return PaymentStatus.pending;
      case 'failed':
        return PaymentStatus.failed;
      case 'refunded':
        return PaymentStatus.refunded;
      default:
        return PaymentStatus.completed;
    }
  }
}

enum PaymentMethod {
  cash,
  upi,
  card,
  netBanking,
  other;

  static PaymentMethod fromString(String? method) {
    switch (method?.toLowerCase()) {
      case 'cash':
        return PaymentMethod.cash;
      case 'upi':
        return PaymentMethod.upi;
      case 'card':
        return PaymentMethod.card;
      case 'net_banking':
      case 'netbanking':
        return PaymentMethod.netBanking;
      default:
        return PaymentMethod.other;
    }
  }

  String get displayName {
    switch (this) {
      case PaymentMethod.cash:
        return 'Cash';
      case PaymentMethod.upi:
        return 'UPI';
      case PaymentMethod.card:
        return 'Card';
      case PaymentMethod.netBanking:
        return 'Net Banking';
      case PaymentMethod.other:
        return 'Other';
    }
  }
}

class PaymentModel {
  final String id;
  final String memberId;
  final String? memberName;
  final double amount;
  final String currency;
  final PaymentMethod method;
  final PaymentStatus status;
  final String? invoiceNumber;
  final String? planName;
  final String? notes;
  final DateTime paidAt;

  const PaymentModel({
    required this.id,
    required this.memberId,
    this.memberName,
    required this.amount,
    this.currency = 'INR',
    required this.method,
    this.status = PaymentStatus.completed,
    this.invoiceNumber,
    this.planName,
    this.notes,
    required this.paidAt,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      id: json['id']?.toString() ?? '',
      memberId: json['member_id']?.toString() ?? '',
      memberName: json['member_name'] as String? ?? json['member']?['full_name'] as String?,
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'INR',
      method: PaymentMethod.fromString(json['payment_method'] as String? ?? json['method'] as String?),
      status: PaymentStatus.fromString(json['status'] as String?),
      invoiceNumber: json['invoice_number'] as String?,
      planName: json['plan_name'] as String?,
      notes: json['notes'] as String?,
      paidAt: json['paid_at'] != null
          ? DateTime.parse(json['paid_at'].toString())
          : (json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'member_id': memberId,
      'amount': amount,
      'currency': currency,
      'payment_method': method.name.toUpperCase(),
      'status': status.name.toUpperCase(),
      'invoice_number': invoiceNumber,
      'notes': notes,
      'paid_at': paidAt.toIso8601String(),
    };
  }
}
