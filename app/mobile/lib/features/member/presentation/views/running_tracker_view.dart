import 'dart:async';
import 'package:flutter/material.dart';

class RunningTrackerView extends StatefulWidget {
  const RunningTrackerView({super.key});

  @override
  State<RunningTrackerView> createState() => _RunningTrackerViewState();
}

class _RunningTrackerViewState extends State<RunningTrackerView> {
  bool _isRunning = false;
  int _secondsElapsed = 0;
  double _distanceKm = 0.0;
  Timer? _timer;

  void _toggleRun() {
    if (_isRunning) {
      _timer?.cancel();
      setState(() => _isRunning = false);
    } else {
      setState(() => _isRunning = true);
      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (mounted) {
          setState(() {
            _secondsElapsed++;
            _distanceKm += 0.003; // Simulate GPS movement pace (~5 min/km)
          });
        }
      });
    }
  }

  String _formatDuration(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  double get _currentPace {
    if (_distanceKm == 0) return 0.0;
    return (_secondsElapsed / 60) / _distanceKm;
  }

  int get _caloriesEstimate => (_distanceKm * 65).toInt();

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Outdoor Running GPS'),
      ),
      body: Column(
        children: [
          // Live Run Metrics Header Container
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [theme.primaryColor, Colors.blue.shade900],
              ),
            ),
            child: Column(
              children: [
                const Text(
                  'DISTANCE',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                  ),
                ),
                Text(
                  _distanceKm.toStringAsFixed(2),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 54,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Text(
                  'KILOMETERS',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildRunMetric('TIME', _formatDuration(_secondsElapsed)),
                    _buildRunMetric(
                      'PACE',
                      '${_currentPace.toStringAsFixed(2)} /km',
                    ),
                    _buildRunMetric('CALORIES', '$_caloriesEstimate kcal'),
                  ],
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isRunning ? Colors.amber : Colors.green,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  onPressed: _toggleRun,
                  icon: Icon(_isRunning ? Icons.pause : Icons.play_arrow_rounded),
                  label: Text(
                    _isRunning ? 'PAUSE RUN' : 'START RUNNING',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),

          // Map Placeholder / Recent Runs
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Container(
                  height: 140,
                  decoration: BoxDecoration(
                    color: Colors.grey.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.withValues(alpha: 0.3)),
                  ),
                  child: const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.map_rounded, size: 36, color: Colors.grey),
                        SizedBox(height: 8),
                        Text(
                          'Live GPS Route Map View',
                          style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'RECENT RUN HISTORY',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.1,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 10),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Colors.green,
                    child: Icon(Icons.directions_run, color: Colors.white),
                  ),
                  title: const Text(
                    '5.42 km · Morning Run',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: const Text('Time: 32:18 · Avg Pace: 5:57 /km'),
                  trailing: const Text('Yesterday', style: TextStyle(color: Colors.grey, fontSize: 12)),
                ),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Colors.green,
                    child: Icon(Icons.directions_run, color: Colors.white),
                  ),
                  title: const Text(
                    '3.10 km · Interval Jog',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: const Text('Time: 18:40 · Avg Pace: 6:01 /km'),
                  trailing: const Text('3 days ago', style: TextStyle(color: Colors.grey, fontSize: 12)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRunMetric(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 10),
        ),
      ],
    );
  }
}
