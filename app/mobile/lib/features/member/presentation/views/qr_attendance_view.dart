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
  int _modeIndex = 0; // 0 = Scan Gym QR (Camera), 1 = Show My Pass
  late AnimationController _animController;
  late Animation<double> _scanLineAnim;

  bool _isFlashOn = false;
  bool _isFrontCamera = false;

  bool _isCheckedIn = false;
  String _checkInTime = '';

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _scanLineAnim = Tween<double>(begin: 0.05, end: 0.95).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _triggerCheckIn() {
    HapticFeedback.heavyImpact();
    setState(() {
      _isCheckedIn = true;
      final now = DateTime.now();
      final minute = now.minute.toString().padLeft(2, '0');
      final hour = now.hour > 12 ? (now.hour - 12) : (now.hour == 0 ? 12 : now.hour);
      final ampm = now.hour >= 12 ? 'PM' : 'AM';
      _checkInTime = '$hour:$minute $ampm';
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
          'Repsi QR Station',
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
            vertical: 12,
          ),
          child: Column(
            children: [
              // Mode Switcher: Scan Gym QR vs Show My Pass
              Container(
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                padding: const EdgeInsets.all(3),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          HapticFeedback.selectionClick();
                          setState(() {
                            _modeIndex = 0;
                            _isCheckedIn = false;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: _modeIndex == 0 ? AppColors.primarySoft : Colors.transparent,
                            borderRadius: BorderRadius.circular(9),
                          ),
                          alignment: Alignment.center,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.camera_alt_outlined,
                                size: 16,
                                color: _modeIndex == 0 ? AppColors.primaryDark : AppColors.textSecondary,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Scan Gym QR',
                                style: AppTypography.caption.copyWith(
                                  color: _modeIndex == 0 ? AppColors.primaryDark : AppColors.textSecondary,
                                  fontWeight: _modeIndex == 0 ? FontWeight.w700 : FontWeight.w500,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          HapticFeedback.selectionClick();
                          setState(() {
                            _modeIndex = 1;
                            _isCheckedIn = false;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: _modeIndex == 1 ? AppColors.primarySoft : Colors.transparent,
                            borderRadius: BorderRadius.circular(9),
                          ),
                          alignment: Alignment.center,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.qr_code_2_rounded,
                                size: 16,
                                color: _modeIndex == 1 ? AppColors.primaryDark : AppColors.textSecondary,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Show My Pass',
                                style: AppTypography.caption.copyWith(
                                  color: _modeIndex == 1 ? AppColors.primaryDark : AppColors.textSecondary,
                                  fontWeight: _modeIndex == 1 ? FontWeight.w700 : FontWeight.w500,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Viewfinder / Pass Container
              Expanded(
                child: _isCheckedIn
                    ? _buildSuccessView()
                    : (_modeIndex == 0 ? _buildCameraScanView() : _buildMyPassView()),
              ),

              const SizedBox(height: 16),

              // Action Trigger Button
              if (!_isCheckedIn)
                RepsiButton(
                  text: _modeIndex == 0 ? 'Simulate Scan Gym QR' : 'Simulate Scanner Read',
                  leadingIcon: const Icon(Icons.qr_code_scanner_rounded, size: 20),
                  onPressed: _triggerCheckIn,
                  isFullWidth: true,
                  size: RepsiButtonSize.large,
                )
              else
                RepsiButton(
                  text: 'Back to Home',
                  onPressed: () => context.pop(),
                  isFullWidth: true,
                  size: RepsiButtonSize.large,
                ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCameraScanView() {
    return Column(
      children: [
        Expanded(
          child: RepsiCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Scan Repsi QR',
                            style: AppTypography.headingSmall.copyWith(fontSize: 16, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Point camera at the QR code at turnstile or hub',
                            style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: Icon(
                            _isFlashOn ? Icons.flash_on_rounded : Icons.flash_off_rounded,
                            color: _isFlashOn ? Colors.amber : AppColors.textSecondary,
                            size: 20,
                          ),
                          onPressed: () => setState(() => _isFlashOn = !_isFlashOn),
                        ),
                        IconButton(
                          icon: Icon(
                            Icons.cameraswitch_rounded,
                            color: _isFrontCamera ? AppColors.primary : AppColors.textSecondary,
                            size: 20,
                          ),
                          onPressed: () => setState(() => _isFrontCamera = !_isFrontCamera),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Viewfinder Box
                GestureDetector(
                  onTap: _triggerCheckIn,
                  child: Container(
                    width: 210,
                    height: 210,
                    decoration: BoxDecoration(
                      color: const Color(0xFF101714),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: _isFlashOn ? Colors.amber.withValues(alpha: 0.8) : AppColors.primary.withValues(alpha: 0.4),
                        width: 2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.15),
                          blurRadius: 16,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Flashlight illumination overlay
                        Positioned.fill(
                          child: Opacity(
                            opacity: _isFlashOn ? 0.3 : 0.08,
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(18),
                                gradient: RadialGradient(
                                  colors: [
                                    _isFlashOn ? Colors.amber : AppColors.primary,
                                    Colors.transparent,
                                  ],
                                  radius: 1.1,
                                ),
                              ),
                            ),
                          ),
                        ),

                        // Viewfinder Corners
                        ..._buildViewfinderCorners(),

                        // Animated Laser
                        AnimatedBuilder(
                          animation: _animController,
                          builder: (ctx, _) {
                            return Positioned(
                              top: 210 * _scanLineAnim.value,
                              left: 16,
                              right: 16,
                              child: Container(
                                height: 3,
                                decoration: BoxDecoration(
                                  color: AppColors.primary,
                                  borderRadius: BorderRadius.circular(2),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.primary.withValues(alpha: 0.9),
                                      blurRadius: 8,
                                      spreadRadius: 1.5,
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),

                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.qr_code_scanner_rounded, size: 48, color: Colors.white38),
                            SizedBox(height: 8),
                            Text(
                              'Align QR inside frame',
                              style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w500),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Tap frame to scan',
                              style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Section 21 Feature List: "Scan to: ✓ Check in, ✓ Join class, ✓ Start PT, ✓ Access gym"
        RepsiCard(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Scan to:',
                style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, color: AppColors.text),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _checkFeatureItem('Check in'),
                  _checkFeatureItem('Join class'),
                  _checkFeatureItem('Start PT'),
                  _checkFeatureItem('Access gym'),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _checkFeatureItem(String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 14),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.text),
        ),
      ],
    );
  }

  List<Widget> _buildViewfinderCorners() {
    const double size = 18;
    const double border = 3.5;
    const color = AppColors.primary;

    return [
      Positioned(
        top: 10,
        left: 10,
        child: Container(
          width: size,
          height: size,
          decoration: const BoxDecoration(
            border: Border(
              top: BorderSide(color: color, width: border),
              left: BorderSide(color: color, width: border),
            ),
          ),
        ),
      ),
      Positioned(
        top: 10,
        right: 10,
        child: Container(
          width: size,
          height: size,
          decoration: const BoxDecoration(
            border: Border(
              top: BorderSide(color: color, width: border),
              right: BorderSide(color: color, width: border),
            ),
          ),
        ),
      ),
      Positioned(
        bottom: 10,
        left: 10,
        child: Container(
          width: size,
          height: size,
          decoration: const BoxDecoration(
            border: Border(
              bottom: BorderSide(color: color, width: border),
              left: BorderSide(color: color, width: border),
            ),
          ),
        ),
      ),
      Positioned(
        bottom: 10,
        right: 10,
        child: Container(
          width: size,
          height: size,
          decoration: const BoxDecoration(
            border: Border(
              bottom: BorderSide(color: color, width: border),
              right: BorderSide(color: color, width: border),
            ),
          ),
        ),
      ),
    ];
  }

  Widget _buildMyPassView() {
    return RepsiCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'MEMBER PASS · INDIRANAGAR',
              style: TextStyle(color: AppColors.primaryDark, fontSize: 11, fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Rahul Sharma',
            style: AppTypography.headingSmall.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 2),
          Text(
            'Gold Membership · #REP-9482',
            style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12),
          ),
          const SizedBox(height: 20),

          // QR Box
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border, width: 1.5),
            ),
            child: const _CustomQrPainterWidget(size: 160),
          ),
          const SizedBox(height: 14),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.refresh_rounded, size: 14, color: AppColors.textSecondary),
              SizedBox(width: 4),
              Text(
                'Auto-refreshes in 4:59 for security',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessView() {
    return RepsiCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.primary, width: 2),
            ),
            child: const Icon(Icons.check_rounded, color: AppColors.primaryDark, size: 40),
          ),
          const SizedBox(height: 18),
          Text(
            "You're Checked In!",
            style: AppTypography.heading.copyWith(fontSize: 22, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 6),
          Text(
            'Turnstile unlocked. Have a fantastic session!',
            textAlign: TextAlign.center,
            style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 13),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              'Indiranagar Hub · $_checkInTime',
              style: const TextStyle(color: AppColors.primaryDark, fontWeight: FontWeight.w700, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}

class _CustomQrPainterWidget extends StatelessWidget {
  final double size;
  const _CustomQrPainterWidget({required this.size});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        size: Size(size, size),
        painter: _QrGridPainter(),
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

    void drawFinder(double x, double y) {
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(x, y, 38, 38), const Radius.circular(8)),
        paint,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(x + 6, y + 6, 26, 26), const Radius.circular(5)),
        Paint()..color = Colors.white,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(x + 11, y + 11, 16, 16), const Radius.circular(3)),
        paint,
      );
    }

    drawFinder(4, 4);
    drawFinder(size.width - 42, 4);
    drawFinder(4, size.height - 42);

    final dotPositions = [
      const Offset(50, 16), const Offset(64, 16), const Offset(78, 16), const Offset(92, 16),
      const Offset(50, 30), const Offset(78, 30), const Offset(106, 30),
      const Offset(16, 50), const Offset(30, 50), const Offset(50, 50), const Offset(64, 50), const Offset(92, 50),
      const Offset(50, 78), const Offset(78, 78), const Offset(106, 78), const Offset(120, 78),
      const Offset(30, 92), const Offset(64, 92), const Offset(92, 92), const Offset(120, 92),
      const Offset(50, 106), const Offset(78, 106), const Offset(106, 106),
      const Offset(50, 134), const Offset(64, 134), const Offset(92, 134), const Offset(120, 134),
    ];

    for (final pos in dotPositions) {
      if (pos.dx < size.width && pos.dy < size.height) {
        canvas.drawRRect(
          RRect.fromRectAndRadius(Rect.fromLTWH(pos.dx, pos.dy, 8, 8), const Radius.circular(2)),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
