import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/animations/repsi_stagger.dart';
import '../../../../shared/widgets/repsi_button.dart';
import '../../../../shared/widgets/repsi_card.dart';

class ProgressDashboardView extends StatefulWidget {
  const ProgressDashboardView({super.key});

  @override
  State<ProgressDashboardView> createState() => _ProgressDashboardViewState();
}

class _ProgressDashboardViewState extends State<ProgressDashboardView> {
  int _selectedMetricTab = 0;
  final List<String> _metricTabs = ['Weight', 'Measurements', 'Attendance', 'PRs'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'My Progress',
          style: AppTypography.heading.copyWith(
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pageHorizontalPadding,
            vertical: 12,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Metric Segmented Tab Bar
              RepsiStaggerItem(
                index: 0,
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  padding: const EdgeInsets.all(3),
                  child: Row(
                    children: List.generate(_metricTabs.length, (index) {
                      final isSelected = _selectedMetricTab == index;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () {
                            HapticFeedback.selectionClick();
                            setState(() => _selectedMetricTab = index);
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.primarySoft : Colors.transparent,
                              borderRadius: BorderRadius.circular(9),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              _metricTabs[index],
                              style: AppTypography.caption.copyWith(
                                color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 2. Weight & BMI Overview Cards
              RepsiStaggerItem(
                index: 1,
                child: Row(
                  children: [
                    Expanded(
                      flex: 3,
                      child: RepsiCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Weight',
                              style: AppTypography.caption.copyWith(
                                fontSize: 13,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.baseline,
                              textBaseline: TextBaseline.alphabetic,
                              children: [
                                Text(
                                  '78.4 kg',
                                  style: AppTypography.display.copyWith(
                                    fontSize: 24,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.text,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Icon(Icons.arrow_downward_rounded, size: 16, color: AppColors.primary),
                                Text(
                                  '3.7 kg',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.primaryDark,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'From 82.1 kg (Started Aug 2025)',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 2,
                      child: RepsiCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'BMI',
                              style: AppTypography.caption.copyWith(
                                fontSize: 13,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '24.8',
                              style: AppTypography.display.copyWith(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: AppColors.primaryDark,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Calculated (178 cm)',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Non-judgmental BMI Context Note
              RepsiStaggerItem(
                index: 2,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceSubtle,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, size: 14, color: AppColors.textSecondary),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'BMI is an epidemiological estimate based on height & weight. Strength and body composition are your primary health indicators.',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 3. Tab Specific Chart or Information
              if (_selectedMetricTab == 0) _buildWeightChart(),
              if (_selectedMetricTab == 1) _buildMeasurementsSection(),
              if (_selectedMetricTab == 2) _buildAttendanceSection(),
              if (_selectedMetricTab == 3) _buildPersonalRecordsSection(),

              const SizedBox(height: 20),

              // Log New Measurement Button
              RepsiStaggerItem(
                index: 5,
                child: RepsiButton(
                  text: 'Log Weight & Body Metrics',
                  leadingIcon: const Icon(Icons.add_rounded, size: 20),
                  onPressed: () {
                    _showLogMetricModal();
                  },
                  isFullWidth: true,
                  size: RepsiButtonSize.large,
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWeightChart() {
    return RepsiCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Weight Trajectory',
                style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              Text(
                'Last 60 Days',
                style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 160,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineTouchData: const LineTouchData(enabled: true),
                minY: 77,
                maxY: 83,
                lineBarsData: [
                  LineChartBarData(
                    spots: const [
                      FlSpot(0, 82.1),
                      FlSpot(1, 81.4),
                      FlSpot(2, 80.8),
                      FlSpot(3, 79.9),
                      FlSpot(4, 79.2),
                      FlSpot(5, 78.4),
                    ],
                    isCurved: true,
                    curveSmoothness: 0.35,
                    color: AppColors.primary,
                    barWidth: 3,
                    isStrokeCapRound: true,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          AppColors.primary.withValues(alpha: 0.25),
                          AppColors.primary.withValues(alpha: 0.0),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMeasurementsSection() {
    return RepsiCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Body Measurements',
            style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          Row(
            children: const [
              Expanded(child: _MeasurementTile(label: 'Chest', value: '102 cm', change: '+2 cm')),
              SizedBox(width: 8),
              Expanded(child: _MeasurementTile(label: 'Waist', value: '84 cm', change: '-4 cm')),
              SizedBox(width: 8),
              Expanded(child: _MeasurementTile(label: 'Arms', value: '35 cm', change: '+1.5 cm')),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: const [
              Expanded(child: _MeasurementTile(label: 'Thighs', value: '58 cm', change: '+1 cm')),
              SizedBox(width: 8),
              Expanded(child: _MeasurementTile(label: 'Shoulders', value: '116 cm', change: '+3 cm')),
              SizedBox(width: 8),
              Expanded(child: _MeasurementTile(label: 'Body Fat %', value: '16.8%', change: '-2.4%')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAttendanceSection() {
    return RepsiCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Attendance & Frequency',
            style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildAttendanceMetric('18 / 20', 'Sessions Completed'),
              _buildAttendanceMetric('90%', 'Monthly Consistency'),
              _buildAttendanceMetric('4.2', 'Avg workouts / week'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAttendanceMetric(String val, String lbl) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.primaryDark)),
        const SizedBox(height: 2),
        Text(lbl, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _buildPersonalRecordsSection() {
    final prs = [
      {'lift': 'Barbell Bench Press', 'weight': '75 kg × 6 reps', 'date': 'Today'},
      {'lift': 'Barbell Deadlift', 'weight': '125 kg × 3 reps', 'date': 'Last week'},
      {'lift': 'Barbell Back Squat', 'weight': '100 kg × 5 reps', 'date': '2 weeks ago'},
      {'lift': 'Overhead Press', 'weight': '45 kg × 8 reps', 'date': 'Aug 2025'},
    ];

    return RepsiCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Personal Records (PRs)',
            style: AppTypography.headingSmall.copyWith(fontSize: 15, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          ...prs.map((p) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(p['lift']!, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        Text(p['date']!, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                      ],
                    ),
                    Text(p['weight']!, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.primaryDark, fontSize: 13)),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  void _showLogMetricModal() {
    final wCtrl = TextEditingController(text: '78.4');
    final cCtrl = TextEditingController(text: '102');
    final waistCtrl = TextEditingController(text: '84');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Log Measurements',
                  style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: wCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Body Weight (kg)'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: cCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Chest (cm)'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: waistCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Waist (cm)'),
                ),
                const SizedBox(height: 18),
                RepsiButton(
                  text: 'Save Progress',
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Measurements recorded!'), backgroundColor: AppColors.primary),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _MeasurementTile extends StatelessWidget {
  final String label;
  final String value;
  final String change;

  const _MeasurementTile({required this.label, required this.value, required this.change});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surfaceSubtle,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.text)),
          const SizedBox(height: 2),
          Text(change, style: const TextStyle(fontSize: 10, color: AppColors.primaryDark, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
