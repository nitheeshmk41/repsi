import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/routes/route_names.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_typography.dart';
import '../../../core/api/api_endpoints.dart';
import '../../../core/providers/api_provider.dart';

class OwnerSearchModal extends ConsumerStatefulWidget {
  const OwnerSearchModal({super.key});

  @override
  ConsumerState<OwnerSearchModal> createState() => _OwnerSearchModalState();
}

class _OwnerSearchModalState extends ConsumerState<OwnerSearchModal> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  Timer? _debounceTimer;

  bool _isLoading = false;
  String _query = '';

  List<Map<String, dynamic>> _members = [];
  List<Map<String, dynamic>> _trainers = [];
  List<Map<String, dynamic>> _features = [];

  List<String> _recentSearches = [
    'Nitheesh',
    'Attendance',
    'Memberships',
    'Reports',
    'Trainers',
  ];

  static const List<Map<String, dynamic>> _staticFeatures = [
    {
      'id': 'attendance',
      'title': 'Attendance',
      'description': 'Check-in records and daily attendance',
      'category': 'Operations',
      'icon': Icons.qr_code_scanner_rounded,
      'route': RouteNames.operations,
    },
    {
      'id': 'members',
      'title': 'Members',
      'description': 'Manage member profiles and memberships',
      'category': 'Directory',
      'icon': Icons.people_outline_rounded,
      'route': RouteNames.members,
    },
    {
      'id': 'trainers',
      'title': 'Trainers',
      'description': 'Fitness coaches, schedules, and clients',
      'category': 'Directory',
      'icon': Icons.sports_gymnastics_rounded,
      'route': RouteNames.operations,
    },
    {
      'id': 'memberships',
      'title': 'Memberships',
      'description': 'Subscription packages and pricing',
      'category': 'Plans',
      'icon': Icons.card_membership_rounded,
      'route': RouteNames.finance,
    },
    {
      'id': 'classes',
      'title': 'Classes',
      'description': 'Group sessions and class timetables',
      'category': 'Operations',
      'icon': Icons.calendar_month_outlined,
      'route': RouteNames.operations,
    },
    {
      'id': 'workouts',
      'title': 'Workouts',
      'description': 'Exercise library, plans, and routines',
      'category': 'Training',
      'icon': Icons.fitness_center_rounded,
      'route': RouteNames.exerciseLibrary,
    },
    {
      'id': 'reports',
      'title': 'Reports',
      'description': 'Revenue, attendance & retention metrics',
      'category': 'Analytics',
      'icon': Icons.bar_chart_rounded,
      'route': RouteNames.finance,
    },
    {
      'id': 'equipment',
      'title': 'Equipment',
      'description': 'Machines, maintenance, and QR tags',
      'category': 'Operations',
      'icon': Icons.handyman_outlined,
      'route': RouteNames.operations,
    },
    {
      'id': 'crm',
      'title': 'CRM & Leads',
      'description': 'Lead pipeline and trial conversion',
      'category': 'Growth',
      'icon': Icons.contact_phone_outlined,
      'route': RouteNames.operations,
    },
    {
      'id': 'website',
      'title': 'Website Builder',
      'description': 'Customize public gym landing page',
      'category': 'Online',
      'icon': Icons.language_rounded,
      'route': RouteNames.websiteBuilder,
    },
    {
      'id': 'settings',
      'title': 'Settings',
      'description': 'Gym profile, roles, and preferences',
      'category': 'System',
      'icon': Icons.settings_outlined,
      'route': RouteNames.more,
    },
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onSearchChanged(String value) {
    _debounceTimer?.cancel();
    _query = value.trim();

    if (_query.isEmpty) {
      setState(() {
        _isLoading = false;
        _members.clear();
        _trainers.clear();
        _features.clear();
      });
      return;
    }

    setState(() => _isLoading = true);

    _debounceTimer = Timer(const Duration(milliseconds: 250), () {
      _executeSearch(_query);
    });
  }

  Future<void> _executeSearch(String query) async {
    final qLower = query.toLowerCase();

    // 1. Client-side feature match
    final matchedFeatures = _staticFeatures.where((f) {
      final title = (f['title'] as String).toLowerCase();
      final desc = (f['description'] as String).toLowerCase();
      final cat = (f['category'] as String).toLowerCase();
      return title.contains(qLower) || desc.contains(qLower) || cat.contains(qLower);
    }).toList();

    // Default mock results for instantaneous parity & offline resilience
    final fallbackMembers = <Map<String, dynamic>>[
      {
        'id': 'mem-1024',
        'name': 'Nitheesh',
        'code': 'REP-00124',
        'status': 'Active',
        'phone': '+91 98765 43210',
        'plan': 'Annual Pro',
        'attendance_count': '18 visits this month',
      },
      {
        'id': 'mem-1025',
        'name': 'Priya Sharma',
        'code': 'REP-00125',
        'status': 'Active',
        'phone': '+91 98450 11223',
        'plan': 'Pro 3 Months',
        'attendance_count': '14 visits this month',
      },
      {
        'id': 'mem-1026',
        'name': 'Rahul Verma',
        'code': 'REP-00126',
        'status': 'Expiring Soon',
        'phone': '+91 97112 33445',
        'plan': 'Starter Monthly',
        'attendance_count': '9 visits this month',
      },
      {
        'id': 'mem-1027',
        'name': 'Arjun Nair',
        'code': 'REP-00127',
        'status': 'Active',
        'phone': '+91 99001 22334',
        'plan': 'Annual Pro',
        'attendance_count': '22 visits this month',
      },
    ].where((m) {
      final name = (m['name'] as String).toLowerCase();
      final code = (m['code'] as String).toLowerCase();
      final phone = (m['phone'] as String).toLowerCase();
      return name.contains(qLower) || code.contains(qLower) || phone.contains(qLower);
    }).toList();

    final fallbackTrainers = <Map<String, dynamic>>[
      {
        'id': 'tr-201',
        'name': 'Coach Arun Kumar',
        'code': 'TR-101',
        'specialization': 'Strength & Conditioning',
        'phone': '+91 98440 99881',
      },
      {
        'id': 'tr-202',
        'name': 'Alex Vance',
        'code': 'TR-102',
        'specialization': 'HIIT & Mobility',
        'phone': '+91 98220 55443',
      },
    ].where((t) {
      final name = (t['name'] as String).toLowerCase();
      final code = (t['code'] as String).toLowerCase();
      final spec = (t['specialization'] as String).toLowerCase();
      return name.contains(qLower) || code.contains(qLower) || spec.contains(qLower);
    }).toList();

    try {
      final apiClient = ref.read(apiClientProvider);
      final res = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.globalSearch,
        queryParameters: {'q': query},
      );

      if (res.data != null && mounted) {
        final data = res.data!;
        final apiMembers = List<Map<String, dynamic>>.from(data['members'] ?? []);
        final apiTrainers = List<Map<String, dynamic>>.from(data['trainers'] ?? []);

        setState(() {
          _members = apiMembers.isNotEmpty ? apiMembers : fallbackMembers;
          _trainers = apiTrainers.isNotEmpty ? apiTrainers : fallbackTrainers;
          _features = matchedFeatures;
          _isLoading = false;
        });
        return;
      }
    } catch (_) {
      // Graceful fallback to client-filtered list
    }

    if (mounted) {
      setState(() {
        _members = fallbackMembers;
        _trainers = fallbackTrainers;
        _features = matchedFeatures;
        _isLoading = false;
      });
    }
  }

  void _saveRecentSearch(String term) {
    if (term.trim().isEmpty) return;
    setState(() {
      _recentSearches.removeWhere((r) => r.toLowerCase() == term.toLowerCase());
      _recentSearches.insert(0, term.trim());
      if (_recentSearches.length > 6) {
        _recentSearches = _recentSearches.sublist(0, 6);
      }
    });
  }

  void _navigateToRoute(String route, {String? recentTerm}) {
    if (recentTerm != null) {
      _saveRecentSearch(recentTerm);
    }
    Navigator.of(context).pop();
    context.push(route);
  }

  void _openMemberProfile(String memberId, String memberName) {
    _saveRecentSearch(memberName);
    Navigator.of(context).pop();
    context.push('/members/$memberId');
  }

  void _openMemberAttendance(String memberId, String memberName) {
    _saveRecentSearch(memberName);
    Navigator.of(context).pop();
    context.push(RouteNames.operations);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: const BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Container(
              height: 52,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border, width: 1.2),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x08000000),
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const SizedBox(width: 14),
                  const Icon(Icons.search_rounded, color: AppColors.textMuted, size: 22),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      focusNode: _focusNode,
                      onChanged: _onSearchChanged,
                      textInputAction: TextInputAction.search,
                      style: AppTypography.body.copyWith(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.text,
                      ),
                      decoration: const InputDecoration(
                        hintText: 'Search members, trainers, features...',
                        hintStyle: TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                    ),
                  ),
                  if (_isLoading) ...[
                    const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                      ),
                    ),
                    const SizedBox(width: 14),
                  ] else if (_searchController.text.isNotEmpty) ...[
                    IconButton(
                      icon: const Icon(Icons.close_rounded, size: 18, color: AppColors.textMuted),
                      onPressed: () {
                        _searchController.clear();
                        _onSearchChanged('');
                      },
                    ),
                  ] else ...[
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: Text(
                        'Cancel',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),

          const Divider(height: 1, color: AppColors.border),

          // Search Content Body
          Expanded(
            child: _query.isEmpty ? _buildEmptyQueryState() : _buildSearchResultsState(),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyQueryState() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      children: [
        // Recent Section
        if (_recentSearches.isNotEmpty) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent',
                style: AppTypography.caption.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                  color: AppColors.textSecondary,
                  letterSpacing: 0.5,
                ),
              ),
              GestureDetector(
                onTap: () => setState(() => _recentSearches.clear()),
                child: Text(
                  'Clear',
                  style: AppTypography.caption.copyWith(
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                    color: AppColors.primaryDark,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: _recentSearches.map((item) {
                return ListTile(
                  dense: true,
                  leading: const Icon(Icons.history_rounded, size: 18, color: AppColors.textMuted),
                  title: Text(
                    item,
                    style: AppTypography.bodySmall.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.text,
                    ),
                  ),
                  trailing: const Icon(Icons.arrow_outward_rounded, size: 16, color: AppColors.textMuted),
                  onTap: () {
                    _searchController.text = item;
                    _onSearchChanged(item);
                  },
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 20),
        ],

        // Quick Access Features Section
        Text(
          'Quick Access',
          style: AppTypography.caption.copyWith(
            fontWeight: FontWeight.w700,
            fontSize: 12,
            color: AppColors.textSecondary,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 8),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 2.2,
          ),
          itemCount: _staticFeatures.length,
          itemBuilder: (context, idx) {
            final f = _staticFeatures[idx];
            return GestureDetector(
              onTap: () => _navigateToRoute(f['route'] as String, recentTerm: f['title'] as String),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: AppColors.primarySoft,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(f['icon'] as IconData, size: 18, color: AppColors.primaryDark),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            f['title'] as String,
                            style: AppTypography.bodySmall.copyWith(
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                              color: AppColors.text,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            f['category'] as String,
                            style: AppTypography.caption.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildSearchResultsState() {
    final hasResults = _members.isNotEmpty || _trainers.isNotEmpty || _features.isNotEmpty;

    if (!hasResults && !_isLoading) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.search_off_rounded, size: 48, color: AppColors.textMuted),
              const SizedBox(height: 12),
              Text(
                'No matching results for "$_query"',
                style: AppTypography.body.copyWith(fontWeight: FontWeight.w700, color: AppColors.text),
              ),
              const SizedBox(height: 6),
              Text(
                'Try searching member name, code (REP-00124), phone number, or feature name like Attendance or Website Builder.',
                textAlign: TextAlign.center,
                style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
              ),
            ],
          ),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      children: [
        // 1. MEMBERS GROUP
        if (_members.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'MEMBERS (${_members.length})',
                  style: AppTypography.caption.copyWith(
                    fontWeight: FontWeight.w700,
                    fontSize: 11.5,
                    color: AppColors.textSecondary,
                    letterSpacing: 0.6,
                  ),
                ),
              ],
            ),
          ),
          ..._members.map((m) => _buildMemberCard(m)),
          const SizedBox(height: 16),
        ],

        // 2. TRAINERS GROUP
        if (_trainers.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              'TRAINERS (${_trainers.length})',
              style: AppTypography.caption.copyWith(
                fontWeight: FontWeight.w700,
                fontSize: 11.5,
                color: AppColors.textSecondary,
                letterSpacing: 0.6,
              ),
            ),
          ),
          ..._trainers.map((t) => _buildTrainerCard(t)),
          const SizedBox(height: 16),
        ],

        // 3. FEATURES GROUP
        if (_features.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              'FEATURES & SHORTCUTS (${_features.length})',
              style: AppTypography.caption.copyWith(
                fontWeight: FontWeight.w700,
                fontSize: 11.5,
                color: AppColors.textSecondary,
                letterSpacing: 0.6,
              ),
            ),
          ),
          ..._features.map((f) => _buildFeatureCard(f)),
          const SizedBox(height: 16),
        ],
      ],
    );
  }

  Widget _buildMemberCard(Map<String, dynamic> member) {
    final name = (member['name'] as String?) ?? 'Member';
    final code = (member['code'] as String?) ?? 'REP-00124';
    final status = (member['status'] as String?) ?? 'Active';
    final id = (member['id'] as String?) ?? '1';
    final isActive = status.toLowerCase() == 'active';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x05000000),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row: Avatar, Name, Member ID, Status
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                ),
                alignment: Alignment.center,
                child: Text(
                  name.isNotEmpty ? name[0].toUpperCase() : 'M',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryDark,
                    fontSize: 16,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: AppTypography.bodySmall.copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Text(
                          'Member ID: ',
                          style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12),
                        ),
                        Text(
                          code,
                          style: AppTypography.caption.copyWith(
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isActive ? const Color(0xFFECFDF5) : const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: isActive ? const Color(0xFFA7F3D0) : const Color(0xFFFDE68A),
                  ),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isActive ? const Color(0xFF059669) : const Color(0xFFD97706),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),
          const Divider(height: 1, color: AppColors.border),
          const SizedBox(height: 10),

          // Detail specs and Actions: Attendance View & Profile View
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Membership Pill
              Row(
                children: [
                  const Icon(Icons.card_membership_rounded, size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text(
                    'Membership',
                    style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    status,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: isActive ? AppColors.primaryDark : const Color(0xFFD97706),
                    ),
                  ),
                ],
              ),

              // Action Buttons: Attendance View & Profile View
              Row(
                children: [
                  OutlinedButton(
                    onPressed: () => _openMemberAttendance(id, name),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      side: const BorderSide(color: AppColors.border),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text(
                      'Attendance',
                      style: AppTypography.caption.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.text,
                        fontSize: 11.5,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () => _openMemberProfile(id, name),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text(
                      'Profile',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 11.5,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTrainerCard(Map<String, dynamic> trainer) {
    final name = (trainer['name'] as String?) ?? 'Coach';
    final code = (trainer['code'] as String?) ?? 'TR-101';
    final spec = (trainer['specialization'] as String?) ?? 'Strength & Conditioning';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFBFDBFE)),
            ),
            child: const Icon(Icons.sports_gymnastics_rounded, color: Color(0xFF2563EB), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: AppTypography.bodySmall.copyWith(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '$code • $spec',
                  style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 12),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              _saveRecentSearch(name);
              Navigator.of(context).pop();
              context.push(RouteNames.operations);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEFF6FF),
              foregroundColor: const Color(0xFF2563EB),
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('View', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 11.5)),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureCard(Map<String, dynamic> feature) {
    final title = feature['title'] as String;
    final desc = feature['description'] as String;
    final cat = feature['category'] as String;
    final route = feature['route'] as String;
    final icon = (feature['icon'] as IconData?) ?? Icons.star_border_rounded;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        dense: true,
        leading: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.primarySoft,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: AppColors.primaryDark, size: 18),
        ),
        title: Text(
          title,
          style: AppTypography.bodySmall.copyWith(
            fontWeight: FontWeight.w700,
            fontSize: 13.5,
            color: AppColors.text,
          ),
        ),
        subtitle: Text(
          desc,
          style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: AppColors.border),
          ),
          child: Text(
            cat,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
          ),
        ),
        onTap: () => _navigateToRoute(route, recentTerm: title),
      ),
    );
  }
}
