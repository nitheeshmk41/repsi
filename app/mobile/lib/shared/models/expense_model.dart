class ExpenseModel {
  final String id;
  final String workspaceId;
  final String title;
  final double amount;
  final String category;
  final String? notes;
  final DateTime expenseDate;
  final String? receiptUrl;

  const ExpenseModel({
    required this.id,
    required this.workspaceId,
    required this.title,
    required this.amount,
    required this.category,
    this.notes,
    required this.expenseDate,
    this.receiptUrl,
  });

  factory ExpenseModel.fromJson(Map<String, dynamic> json) {
    return ExpenseModel(
      id: json['id']?.toString() ?? '',
      workspaceId: json['workspace_id']?.toString() ?? '',
      title: json['title'] as String? ?? json['description'] as String? ?? 'Expense',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      category: json['category'] as String? ?? 'GENERAL',
      notes: json['notes'] as String?,
      expenseDate: json['expense_date'] != null
          ? DateTime.parse(json['expense_date'].toString())
          : (json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now()),
      receiptUrl: json['receipt_url'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'workspace_id': workspaceId,
      'title': title,
      'amount': amount,
      'category': category,
      'notes': notes,
      'expense_date': expenseDate.toIso8601String(),
    };
  }
}
