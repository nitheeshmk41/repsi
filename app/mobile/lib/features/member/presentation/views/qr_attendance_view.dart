import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';

class QrAttendanceView extends StatefulWidget {
  const QrAttendanceView({super.key});

  @override
  State<QrAttendanceView> createState() => _QrAttendanceViewState();
}

class _QrAttendanceViewState extends State<QrAttendanceView> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _qrFadeAnim;
  late Animation<double> _scanLineAnim;
  late Animation<double> _circleExpandAnim;
  late Animation<double> _checkDrawAnim;
  late Animation<double> _textFadeAnim;

  bool _isCheckedIn = false;
  String _checkInTime = '';

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 850),
    );

    // Timeline: 0-850ms
    // 0 - 200ms: QR fades
    _qrFadeAnim = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.0, 0.25, curve: Curves.easeOut),
      ),
    );

    // 150 - 450ms: green scanning line
    _scanLineAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.15, 0.50, curve: Curves.easeInOut),
      ),
    );

    // 400 - 650ms: green circle expands
    _circleExpandAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.40, 0.70, curve: Curves.easeOutBack),
      ),
    );

    // 600 - 800ms: checkmark draws
    _checkDrawAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.60, 0.85, curve: Curves.easeOut),
      ),
    );

    // 750 - 850ms: text appears
    _textFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.75, 1.0, curve: Curves.easeOut),
      ),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _triggerScan() {
    if (_isCheckedIn) return;
    HapticFeedback.lightImpact();
    setState(() {
      _isCheckedIn = true;
      final now = DateTime.now();
      final minute = now.minute.toString().padLeft(2, '0');
      final hour = now.hour > 12 ? (now.hour - 12) : (now.hour == 0 ? 12 : now.hour);
      final ampm = now.hour >= 12 ? 'PM' : 'AM';
      _checkInTime = '$hour:$minute $ampm';
    });
    _animController.forward();
  }

  void _resetScan() {
    HapticFeedback.lightImpact();
    _animController.reverse().then((_) {
      if (mounted) {
        setState(() => _isCheckedIn = false);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.text),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Check In',
          style: AppTypography.heading.copyWith(
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 16,
          ),
          child: Column(
            children: [
              const SizedBox(height: 12),
              Text(
                'Scan QR at gym entrance',
                style: AppTypography.body.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 15,
                ),
              ),
              const SizedBox(height: 28),

              // The Main QR / Success Animated Card
              RepsiCard(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                child: SizedBox(
                  width: double.infinity,
                  height: 310,
                  child: AnimatedBuilder(
                    animation: _animController,
                    builder: (context, _) {
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          // 1. Initial State: QR Code with subtle border
                          if (_qrFadeAnim.value > 0.01)
                            Opacity(
                              opacity: _qrFadeAnim.value,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: AppColors.border, width: 1.5),
                                    ),
                                    child: _CustomQrPainterWidget(
                                      size: 180,
                                      scanProgress: _scanLineAnim.value,
                                    ),
                                  ),
                                  const SizedBox(height: 18),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(
                                        Icons.access_time_rounded,
                                        size: 15,
                                        color: AppColors.textSecondary,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        'Valid for 04:59',
                                        style: AppTypography.caption.copyWith(
                                          color: AppColors.textSecondary,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),

                          // 2. Animated Success State
                          if (_circleExpandAnim.value > 0.01)
                            Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                // Expanding green circle with animated checkmark
                                Transform.scale(
                                  scale: _circleExpandAnim.value,
                                  child: Container(
                                    width: 88,
                                    height: 88,
                                    decoration: const BoxDecoration(
                                      color: AppColors.primary,
                                      shape: BoxShape.circle,
                                      boxShadow: [
                                        BoxShadow(
                                          color: Color(0x3318B968),
                                          blurRadius: 20,
                                          offset: Offset(0, 8),
                                        ),
                                      ],
                                    ),
                                    child: CustomPaint(
                                      painter: _AnimatedCheckmarkPainter(
                                        progress: _checkDrawAnim.value,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 24),
                                // "You're checked in"
                                Opacity(
                                  opacity: _textFadeAnim.value,
                                  child: Column(
                                    children: [
                                      Text(
                                        "You're checked in",
                                        style: AppTypography.heading.copyWith(
                                          fontSize: 22,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.text,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: AppColors.primarySoft,
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                        child: Text(
                                          _checkInTime,
                                          style: AppTypography.caption.copyWith(
                                            color: AppColors.primaryDark,
                                            fontWeight: FontWeight.w700,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                        ],
                      );
                    },
                  ),
                ),
              ),

              const Spacer(),

              // Action buttons
              if (!_isCheckedIn)
                RepsiButton(
                  text: 'Simulate Scan',
                  leadingIcon: const Icon(Icons.qr_code_scanner_rounded, size: 20),
                  onPressed: _triggerScan,
                  isFullWidth: true,
                  size: RepsiButtonSize.large,
                )
              else
                Column(
                  children: [
                    RepsiButton(
                      text: 'Done',
                      onPressed: () => context.pop(),
                      isFullWidth: true,
                      size: RepsiButtonSize.large,
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: _resetScan,
                      child: Text(
                        'Scan Again',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}

/// Custom painter for checkmark draw animation
class _AnimatedCheckmarkPainter extends CustomPainter {
  final double progress;

  _AnimatedCheckmarkPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0) return;

    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 4.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();
    final p1 = Offset(size.width * 0.28, size.height * 0.52);
    final p2 = Offset(size.width * 0.45, size.height * 0.68);
    final p3 = Offset(size.width * 0.72, size.height * 0.36);

    path.moveTo(p1.dx, p1.dy);

    if (progress < 0.45) {
      final subProgress = progress / 0.45;
      final currentX = p1.dx + (p2.dx - p1.dx) * subProgress;
      final currentY = p1.dy + (p2.dy - p1.dy) * subProgress;
      path.lineTo(currentX, currentY);
    } else {
      path.lineTo(p2.dx, p2.dy);
      final subProgress = (progress - 0.45) / 0.55;
      final currentX = p2.dx + (p3.dx - p2.dx) * subProgress;
      final currentY = p2.dy + (p3.dy - p2.dy) * subProgress;
      path.lineTo(currentX, currentY);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _AnimatedCheckmarkPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

/// Clean QR code mock drawing with scanner line
class _CustomQrPainterWidget extends StatelessWidget {
  final double size;
  final double scanProgress;

  const _CustomQrPainterWidget({
    required this.size,
    required this.scanProgress,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: _QrGridPainter(),
          ),
          if (scanProgress > 0 && scanProgress < 1.0)
            Positioned(
              top: scanProgress * size,
              left: 0,
              right: 0,
              child: Container(
                height: 3,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.5),
                      blurRadius: 8,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _QrGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.text
      ..style = PaintingStyle.fill;

    // Corner Finder Patterns
    void drawFinder(double x, double y) {
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(x, y, 42, 42), const Radius.circular(8)),
        paint,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(x + 7, y + 7, 28, 28), const Radius.circular(5)),
        Paint()..color = Colors.white,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(x + 13, y + 13, 16, 16), const Radius.circular(3)),
        paint,
      );
    }

    drawFinder(6, 6);
    drawFinder(size.width - 48, 6);
    drawFinder(6, size.height - 48);

    // Decorative clean QR data blocks
    final blockPaint = Paint()..color = AppColors.text;
    final dotPositions = [
      const Offset(60, 18), const Offset(74, 18), const Offset(88, 18), const Offset(102, 18),
      const Offset(60, 32), const Offset(88, 32), const Offset(116, 32),
      const Offset(18, 60), const Offset(32, 60), const Offset(60, 60), const Offset(74, 60), const Offset(102, 60),
      const Offset(60, 88), const Offset(88, 88), const Offset(116, 88), const Offset(130, 88), const Offset(144, 88),
      const Offset(32, 102), const Offset(74, 102), const Offset(102, 102), const Offset(130, 102),
      const Offset(60, 116), const Offset(88, 116), const Offset(116, 116),
      const Offset(60, 144), const Offset(74, 144), const Offset(102, 144), const Offset(130, 144),
    ];

    for (final pos in dotPositions) {
      if (pos.dx < size.width && pos.dy < size.height) {
        canvas.drawRRect(
          RRect.fromRectAndRadius(Rect.fromLTWH(pos.dx, pos.dy, 9, 9), const Radius.circular(2)),
          blockPaint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
