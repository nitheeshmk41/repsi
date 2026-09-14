import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/member_repository.dart';

class MembershipPaymentsView extends ConsumerWidget {
  const MembershipPaymentsView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final paymentsAsync = ref.watch(memberPaymentsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Membership & Payments'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // MEMBERSHIP PLAN HERO CARD
            Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              color: Colors.blue.shade900,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Apex Fitness Premium',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.greenAccent,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'ACTIVE',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Access: Full Gym Equipment, Locker Room, Steam Bath & Personal Trainer Sessions',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    const Divider(color: Colors.white24, height: 24),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('START DATE', style: TextStyle(color: Colors.white54, fontSize: 10)),
                            Text('25 Sep 2025', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('EXPIRY DATE', style: TextStyle(color: Colors.white54, fontSize: 10)),
                            Text('25 Oct 2026', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('REMAINING', style: TextStyle(color: Colors.white54, fontSize: 10)),
                            Text('24 Days', style: TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.blue.shade900,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Redirecting to secure online payment portal...')),
                          );
                        },
                        child: const Text(
                          'RENEW MEMBERSHIP PLAN',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            const Text(
              'PAYMENT HISTORY & RECEIPTS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.1,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 12),

            paymentsAsync.when(
              data: (payments) => ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: payments.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final pay = payments[index];
                  return Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ListTile(
                      leading: const CircleAvatar(
                        backgroundColor: Colors.greenAccent,
                        child: Icon(Icons.receipt_long, color: Colors.black),
                      ),
                      title: Text(pay.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: Text(
                        'Ref: ${pay.receiptNumber} · ${pay.paymentMethod}',
                        style: const TextStyle(fontSize: 12),
                      ),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '₹${pay.amount.toInt()}',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                              color: theme.primaryColor,
                            ),
                          ),
                          Text(
                            pay.status,
                            style: const TextStyle(
                              color: Colors.green,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (_) => AlertDialog(
                            title: const Text('Digital Payment Receipt'),
                            content: Column(
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Receipt #: ${pay.receiptNumber}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                const SizedBox(height: 8),
                                Text('Description: ${pay.title}'),
                                Text('Amount Paid: ₹${pay.amount}'),
                                Text('Payment Mode: ${pay.paymentMethod}'),
                                Text('Status: ${pay.status}'),
                              ],
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Close'),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, __) => Text('Error: $err'),
            ),
          ],
        ),
      ),
    );
  }
}
