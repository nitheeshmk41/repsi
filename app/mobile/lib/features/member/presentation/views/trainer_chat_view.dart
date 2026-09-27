import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/widgets/repsi_card.dart';

class TrainerChatView extends StatefulWidget {
  final String initialClient;
  const TrainerChatView({super.key, this.initialClient = 'Rahul Sharma'});

  @override
  State<TrainerChatView> createState() => _TrainerChatViewState();
}

class _TrainerChatViewState extends State<TrainerChatView> {
  final _messageController = TextEditingController();
  late String _activeClient;

  final Map<String, List<Map<String, dynamic>>> _conversations = {
    'Rahul Sharma': [
      {
        'sender': 'client',
        'text': 'Can I move tomorrow\'s session?',
        'time': '08:42 AM',
        'isRead': true,
      },
      {
        'sender': 'trainer',
        'text': 'Yes, 6 PM works well. I updated your schedule slot.',
        'time': '08:45 AM',
        'isRead': true,
      },
      {
        'sender': 'trainer',
        'type': 'workout_card',
        'title': 'Assigned: Upper Body A',
        'subtitle': '4 exercises · 45 min · Strength Focus',
        'time': '08:46 AM',
        'isRead': true,
      },
      {
        'sender': 'client',
        'text': 'Perfect! See you at 6 PM.',
        'time': '08:48 AM',
        'isRead': true,
      },
    ],
    'Priya Nair': [
      {
        'sender': 'client',
        'text': 'Completed today\'s workout! Glute bridge felt great at 70 kg.',
        'time': 'Yesterday',
        'isRead': true,
      },
      {
        'sender': 'trainer',
        'text': 'Awesome work Priya! Progressive overload paying off. Make sure to hit your 140g protein target today.',
        'time': 'Yesterday',
        'isRead': true,
      },
    ],
    'Arjun Nair': [
      {
        'sender': 'client',
        'text': 'Hey Alex, should I do cardio before or after weights tomorrow?',
        'time': '2 days ago',
        'isRead': true,
      },
      {
        'sender': 'trainer',
        'text': 'After weights for 15 mins steady state so your glycogen stays primed for lifting.',
        'time': '2 days ago',
        'isRead': true,
      },
    ],
  };

  @override
  void initState() {
    super.initState();
    _activeClient = widget.initialClient;
    if (!_conversations.containsKey(_activeClient)) {
      _activeClient = 'Rahul Sharma';
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;
    HapticFeedback.lightImpact();

    setState(() {
      _conversations[_activeClient]!.add({
        'sender': 'trainer',
        'text': text,
        'time': 'Just now',
        'isRead': false,
      });
      _messageController.clear();
    });
  }

  void _sendAttachment(String title, String subtitle, String type) {
    HapticFeedback.lightImpact();
    setState(() {
      _conversations[_activeClient]!.add({
        'sender': 'trainer',
        'type': type,
        'title': title,
        'subtitle': subtitle,
        'time': 'Just now',
        'isRead': false,
      });
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Attached $title'), backgroundColor: AppColors.primary),
    );
  }

  @override
  Widget build(BuildContext context) {
    final messages = _conversations[_activeClient] ?? [];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => Navigator.pop(context),
        ),
        title: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: _activeClient,
            icon: const Icon(Icons.arrow_drop_down_rounded, color: AppColors.primary),
            items: _conversations.keys.map((name) {
              return DropdownMenuItem<String>(
                value: name,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: AppColors.primarySoft,
                      child: Text(
                        name[0],
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primaryDark,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          name,
                          style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
                        ),
                        Text(
                          'Client · Indiranagar',
                          style: AppTypography.caption.copyWith(color: AppColors.primary, fontSize: 10),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }).toList(),
            onChanged: (val) {
              if (val != null) setState(() => _activeClient = val);
            },
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert_rounded, color: AppColors.text),
            onPressed: () {
              _showChatOptions();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Business Retention Notice
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              color: AppColors.surfaceSubtle,
              child: Row(
                children: [
                  const Icon(Icons.shield_outlined, size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Official gym coaching channel. Messages retained per Repsi business compliance.',
                      style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 10),
                    ),
                  ),
                ],
              ),
            ),

            // Messages Stream
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  final msg = messages[index];
                  final isTrainer = msg['sender'] == 'trainer';
                  final isCard = msg.containsKey('type');

                  return Align(
                    alignment: isTrainer ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      constraints: BoxConstraints(
                        maxWidth: MediaQuery.of(context).size.width * 0.78,
                      ),
                      child: isCard
                          ? _buildAttachmentBubble(msg, isTrainer)
                          : _buildTextBubble(msg, isTrainer),
                    ),
                  );
                },
              ),
            ),

            // Quick Attachment Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              color: Colors.white,
              child: Row(
                children: [
                  _buildAttachChip(
                    icon: Icons.fitness_center_rounded,
                    label: 'Workout',
                    onTap: () => _sendAttachment('Assigned: Upper Body A', '4 sets × 10 reps @ 60kg', 'workout_card'),
                  ),
                  const SizedBox(width: 8),
                  _buildAttachChip(
                    icon: Icons.restaurant_menu_rounded,
                    label: 'Diet Plan',
                    onTap: () => _sendAttachment('Nutrition: Fat Loss 2,100 kcal', '150g P · 220g C · 65g F', 'diet_card'),
                  ),
                  const SizedBox(width: 8),
                  _buildAttachChip(
                    icon: Icons.calendar_today_rounded,
                    label: 'PT Slot',
                    onTap: () => _sendAttachment('Session Booked: Today 6 PM', 'Personal Training confirmed', 'slot_card'),
                  ),
                ],
              ),
            ),

            // Bottom Input Field
            Container(
              padding: const EdgeInsets.fromLTRB(12, 8, 8, 12),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: TextField(
                        controller: _messageController,
                        decoration: InputDecoration(
                          hintText: 'Message $_activeClient...',
                          hintStyle: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                          border: InputBorder.none,
                        ),
                        onSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _sendMessage,
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(Icons.send_rounded, color: Colors.white, size: 18),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextBubble(Map<String, dynamic> msg, bool isTrainer) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isTrainer ? AppColors.primary : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: isTrainer ? null : Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: isTrainer ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Text(
            msg['text'] as String,
            style: TextStyle(
              color: isTrainer ? Colors.white : AppColors.text,
              fontSize: 14,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                msg['time'] as String,
                style: TextStyle(
                  color: isTrainer ? Colors.white70 : AppColors.textSecondary,
                  fontSize: 10,
                ),
              ),
              if (isTrainer) ...[
                const SizedBox(width: 4),
                const Icon(Icons.done_all_rounded, size: 12, color: Colors.white70),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAttachmentBubble(Map<String, dynamic> msg, bool isTrainer) {
    return RepsiCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.attachment_rounded, color: AppColors.primaryDark, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      msg['title'] as String,
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                    ),
                    Text(
                      msg['subtitle'] as String,
                      style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.surfaceSubtle,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Tap to view details', style: TextStyle(fontSize: 11, color: AppColors.primaryDark, fontWeight: FontWeight.w600)),
                Text(msg['time'] as String, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAttachChip({required IconData icon, required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: AppColors.surfaceSubtle,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: AppColors.primaryDark),
            const SizedBox(width: 4),
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.text)),
          ],
        ),
      ),
    );
  }

  void _showChatOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.person_outline_rounded),
                title: Text('View $_activeClient Profile'),
                onTap: () {
                  Navigator.pop(ctx);
                },
              ),
              ListTile(
                leading: const Icon(Icons.notifications_off_outlined),
                title: const Text('Mute Notifications'),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Notifications muted for 8 hours')),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.block_outlined, color: Color(0xFFDC2626)),
                title: const Text('Report / Restrict Contact', style: TextStyle(color: Color(0xFFDC2626))),
                onTap: () {
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
