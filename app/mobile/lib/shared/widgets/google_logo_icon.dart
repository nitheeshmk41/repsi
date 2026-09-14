import 'package:flutter/material.dart';
import 'dart:math' as math;

class GoogleLogoIcon extends StatelessWidget {
  final double size;

  const GoogleLogoIcon({
    super.key,
    this.size = 20.0,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _GoogleLogoPainter(),
      ),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double width = size.width;
    final double center = width / 2;
    final double radius = width / 2;
    final double strokeWidth = width * 0.22;
    final double innerRadius = radius - strokeWidth / 2;

    final Paint bluePaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    final Paint greenPaint = Paint()
      ..color = const Color(0xFF34A853)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    final Paint yellowPaint = Paint()
      ..color = const Color(0xFFFBBC05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    final Paint redPaint = Paint()
      ..color = const Color(0xFFEA4335)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    final Rect rect = Rect.fromCircle(
      center: Offset(center, center),
      radius: innerRadius,
    );

    // Red Arc (top)
    canvas.drawArc(rect, -math.pi / 4, -math.pi / 2, false, redPaint);

    // Yellow Arc (left)
    canvas.drawArc(rect, -3 * math.pi / 4, -math.pi / 2, false, yellowPaint);

    // Green Arc (bottom)
    canvas.drawArc(rect, math.pi / 4, math.pi / 2, false, greenPaint);

    // Blue Arc (right)
    canvas.drawArc(rect, -math.pi / 4, math.pi / 2, false, bluePaint);

    // Blue horizontal bar
    final Paint fillBlue = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;

    final Rect barRect = Rect.fromLTRB(
      center,
      center - strokeWidth / 2,
      width - strokeWidth * 0.1,
      center + strokeWidth / 2,
    );
    canvas.drawRect(barRect, fillBlue);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
