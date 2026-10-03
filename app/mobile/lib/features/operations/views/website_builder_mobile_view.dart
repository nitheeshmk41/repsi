import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_spacing.dart';
import '../../../app/theme/app_typography.dart';
import '../../../shared/widgets/repsi_button.dart';
import '../../../shared/widgets/repsi_card.dart';

class WebsiteBuilderMobileView extends ConsumerStatefulWidget {
  const WebsiteBuilderMobileView({super.key});

  @override
  ConsumerState<WebsiteBuilderMobileView> createState() => _WebsiteBuilderMobileViewState();
}

class _WebsiteBuilderMobileViewState extends ConsumerState<WebsiteBuilderMobileView>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final String _subdomain = 'repsifitness';
  final String _siteTitle = 'Repsi Fitness Hub';
  String _selectedTemplate = 'modern-fitness';
  String _themeMode = 'dark';
  Color _selectedPrimaryColor = const Color(0xFF16A34A);

  final List<Map<String, dynamic>> _templates = [
    {
      'id': 'modern-fitness',
      'name': 'Modern Fitness',
      'tagline': 'Dark • High-Energy • Bold',
      'accent': const Color(0xFF16A34A),
      'theme': 'dark',
    },
    {
      'id': 'clean-studio',
      'name': 'Clean Studio',
      'tagline': 'Light • Minimalist • Airy',
      'accent': const Color(0xFF0EA5E9),
      'theme': 'light',
    },
    {
      'id': 'premium-gym',
      'name': 'Premium Gym',
      'tagline': 'Black & Gold • Luxury',
      'accent': const Color(0xFFEAB308),
      'theme': 'dark',
    },
    {
      'id': 'sports-club',
      'name': 'Sports Club',
      'tagline': 'Royal Navy • Athletic',
      'accent': const Color(0xFF2563EB),
      'theme': 'dark',
    },
    {
      'id': 'personal-trainer',
      'name': 'Personal Coaching',
      'tagline': 'Coach-Centric • Violet',
      'accent': const Color(0xFF8B5CF6),
      'theme': 'dark',
    },
    {
      'id': 'womens-fitness',
      'name': "Women's Fitness",
      'tagline': 'Rose & Coral • Lifestyle',
      'accent': const Color(0xFFEC4899),
      'theme': 'light',
    },
  ];

  final List<Color> _brandColors = const [
    Color(0xFF16A34A), // Emerald
    Color(0xFFEAB308), // Midnight Gold
    Color(0xFF2563EB), // Cobalt
    Color(0xFFDC2626), // Crimson
    Color(0xFF0EA5E9), // Sky
    Color(0xFFEC4899), // Rose
  ];

  final List<String> _pages = const [
    'Home',
    'About',
    'Memberships',
    'Trainers',
    'Gallery',
    'Contact',
  ];

  late List<Map<String, dynamic>> _sections;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _sections = [
      {'id': 'hero', 'title': 'Hero Banner', 'subtitle': 'Headline, video/image, CTA buttons', 'enabled': true},
      {'id': 'about', 'title': 'About Facility', 'subtitle': 'Amenities, gym floor specs, vision', 'enabled': true},
      {'id': 'plans', 'title': 'Membership Plans', 'subtitle': 'Pricing packages synced from Repsi DB', 'enabled': true},
      {'id': 'trainers', 'title': 'Trainers & Coaches', 'subtitle': 'Staff profiles, specialties, and bio', 'enabled': true},
      {'id': 'gallery', 'title': 'Gym Floor Gallery', 'subtitle': 'High-resolution equipment and locker photos', 'enabled': true},
      {'id': 'contact', 'title': 'Contact & Location', 'subtitle': 'Hours, Google map pin, WhatsApp hotline', 'enabled': true},
    ];
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _moveSection(int index, int delta) {
    final newIndex = index + delta;
    if (newIndex < 0 || newIndex >= _sections.length) return;
    setState(() {
      final item = _sections.removeAt(index);
      _sections.insert(newIndex, item);
    });
    HapticFeedback.lightImpact();
  }

  void _toggleSection(int index) {
    setState(() {
      _sections[index]['enabled'] = !(_sections[index]['enabled'] as bool);
    });
    HapticFeedback.selectionClick();
  }

  void _publishWebsite() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: const [
            Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
            SizedBox(width: 8),
            Text('Website published live to repsi.app/repsifitness!'),
          ],
        ),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showPreviewSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primarySoft,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text('Mobile Preview', style: TextStyle(color: AppColors.primaryDark, fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 8),
                      Text('repsi.app/$_subdomain', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontFamily: 'monospace')),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Simulated Hero Section
                    Container(
                      height: 180,
                      decoration: BoxDecoration(
                        color: _themeMode == 'dark' ? const Color(0xFF090D14) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _siteTitle,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: _themeMode == 'dark' ? Colors.white : Colors.black,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Transform Your Body. Elevate Your Performance.',
                            style: TextStyle(
                              fontSize: 12,
                              color: _themeMode == 'dark' ? Colors.grey[400] : Colors.grey[700],
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 14),
                          ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _selectedPrimaryColor,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            child: const Text('Book Free Trial', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Active sections representation
                    ..._sections.where((s) => s['enabled'] as bool).map((s) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: _themeMode == 'dark' ? const Color(0xFF131822) : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.check_circle_rounded, color: _selectedPrimaryColor, size: 16),
                            const SizedBox(width: 8),
                            Text(
                              s['title'] as String,
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                                color: _themeMode == 'dark' ? Colors.white : AppColors.text,
                              ),
                            ),
                          ],
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.text),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Website Builder',
          style: AppTypography.heading.copyWith(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.visibility_outlined, color: AppColors.text),
            tooltip: 'Preview Site',
            onPressed: _showPreviewSheet,
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.text),
            tooltip: 'Share Link',
            onPressed: () {
              Clipboard.setData(ClipboardData(text: 'https://repsi.app/$_subdomain'));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Website link copied to clipboard')),
              );
            },
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Top Live Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
              child: RepsiCard(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.primarySoft,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.language_rounded, color: AppColors.primaryDark, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                _siteTitle,
                                style: AppTypography.bodySmall.copyWith(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                  color: AppColors.text,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFECFDF5),
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: const Color(0xFFA7F3D0)),
                                ),
                                child: const Text(
                                  'Published ✓',
                                  style: TextStyle(
                                    color: Color(0xFF059669),
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'repsi.app/$_subdomain',
                            style: AppTypography.caption.copyWith(
                              fontFamily: 'monospace',
                              color: AppColors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.open_in_new_rounded, size: 18, color: AppColors.primaryDark),
                      onPressed: _showPreviewSheet,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Tab Bar
            Container(
              margin: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: TabBar(
                controller: _tabController,
                indicatorSize: TabBarIndicatorSize.tab,
                indicator: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(10),
                ),
                labelColor: AppColors.primaryDark,
                unselectedLabelColor: AppColors.textSecondary,
                labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
                tabs: const [
                  Tab(text: 'Sections'),
                  Tab(text: 'Pages'),
                  Tab(text: 'Design'),
                  Tab(text: 'Media'),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildSectionsTab(),
                  _buildPagesTab(),
                  _buildDesignTab(),
                  _buildMediaTab(),
                ],
              ),
            ),

            // Bottom Publish Action Bar
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: RepsiButton(
                text: 'Publish Changes',
                isFullWidth: true,
                size: RepsiButtonSize.large,
                onPressed: _publishWebsite,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionsTab() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
      itemCount: _sections.length,
      itemBuilder: (context, index) {
        final section = _sections[index];
        final isEnabled = section['enabled'] as bool;

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isEnabled ? AppColors.border : AppColors.border.withValues(alpha: 0.5),
            ),
          ),
          child: Row(
            children: [
              // Reorder Buttons
              Column(
                children: [
                  GestureDetector(
                    onTap: index > 0 ? () => _moveSection(index, -1) : null,
                    child: Icon(
                      Icons.keyboard_arrow_up_rounded,
                      size: 20,
                      color: index > 0 ? AppColors.text : AppColors.textMuted.withValues(alpha: 0.4),
                    ),
                  ),
                  GestureDetector(
                    onTap: index < _sections.length - 1 ? () => _moveSection(index, 1) : null,
                    child: Icon(
                      Icons.keyboard_arrow_down_rounded,
                      size: 20,
                      color: index < _sections.length - 1 ? AppColors.text : AppColors.textMuted.withValues(alpha: 0.4),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 10),

              // Title & Subtitle
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      section['title'] as String,
                      style: AppTypography.bodySmall.copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 13.5,
                        color: isEnabled ? AppColors.text : AppColors.textMuted,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      section['subtitle'] as String,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),

              // Visibility Switch
              Switch(
                value: isEnabled,
                activeThumbColor: AppColors.primary,
                onChanged: (_) => _toggleSection(index),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPagesTab() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
      itemCount: _pages.length,
      itemBuilder: (context, index) {
        final page = _pages[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: ListTile(
            dense: true,
            leading: const Icon(Icons.article_outlined, color: AppColors.primary, size: 20),
            title: Text(
              page,
              style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700, fontSize: 14),
            ),
            subtitle: Text(
              index == 0 ? 'Default Landing Page' : '/${page.toLowerCase()}',
              style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
            ),
            trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Editing $page page settings')),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildDesignTab() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
      children: [
        // Templates Selector
        Text(
          'Templates',
          style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        ..._templates.map((tmpl) {
          final isSelected = _selectedTemplate == tmpl['id'];
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedTemplate = tmpl['id'] as String;
                _selectedPrimaryColor = tmpl['accent'] as Color;
                _themeMode = tmpl['theme'] as String;
              });
              HapticFeedback.selectionClick();
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primarySoft : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? AppColors.primary : AppColors.border,
                  width: isSelected ? 1.5 : 1,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: tmpl['accent'] as Color,
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          tmpl['name'] as String,
                          style: AppTypography.bodySmall.copyWith(
                            fontWeight: FontWeight.w700,
                            fontSize: 13.5,
                            color: AppColors.text,
                          ),
                        ),
                        Text(
                          tmpl['tagline'] as String,
                          style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 20),
                ],
              ),
            ),
          );
        }),
        const SizedBox(height: 16),

        // Brand Accent Color
        Text(
          'Brand Colors',
          style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: _brandColors.map((c) {
            final isColorSelected = _selectedPrimaryColor == c;
            return GestureDetector(
              onTap: () {
                setState(() => _selectedPrimaryColor = c);
                HapticFeedback.selectionClick();
              },
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: c,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isColorSelected ? AppColors.text : Colors.transparent,
                    width: 2.5,
                  ),
                ),
                child: isColorSelected
                    ? const Icon(Icons.check_rounded, color: Colors.white, size: 20)
                    : null,
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 18),

        // Theme Mode Toggle (Light / Dark)
        Text(
          'Theme Mode',
          style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _themeMode = 'dark'),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: _themeMode == 'dark' ? const Color(0xFF0F172A) : Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: _themeMode == 'dark' ? AppColors.primary : AppColors.border),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.dark_mode_rounded, size: 18, color: _themeMode == 'dark' ? Colors.white : AppColors.text),
                      const SizedBox(width: 8),
                      Text('Dark Theme', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: _themeMode == 'dark' ? Colors.white : AppColors.text)),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _themeMode = 'light'),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: _themeMode == 'light' ? AppColors.primarySoft : Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: _themeMode == 'light' ? AppColors.primary : AppColors.border),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.light_mode_rounded, size: 18, color: _themeMode == 'light' ? AppColors.primaryDark : AppColors.text),
                      const SizedBox(width: 8),
                      Text('Light Theme', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: _themeMode == 'light' ? AppColors.primaryDark : AppColors.text)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildMediaTab() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pageHorizontalPadding),
      children: [
        // Gym Logo Section
        Text(
          'Gym Logo',
          style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                ),
                child: const Icon(Icons.fitness_center_rounded, color: AppColors.primaryDark, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Primary Branding Logo',
                      style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700, fontSize: 13),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Square PNG or SVG recommended (512x512px)',
                      style: AppTypography.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Logo uploaded successfully')),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        side: const BorderSide(color: AppColors.border),
                      ),
                      child: const Text('Change Logo', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Hero Cover Image
        Text(
          'Hero Cover Image',
          style: AppTypography.caption.copyWith(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        Container(
          height: 140,
          decoration: BoxDecoration(
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          alignment: Alignment.center,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.add_photo_alternate_outlined, color: Colors.white70, size: 32),
              const SizedBox(height: 6),
              const Text('Change Hero Background Image', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 2),
              const Text('1920x1080px JPG recommended', style: TextStyle(color: Colors.white54, fontSize: 10)),
            ],
          ),
        ),
      ],
    );
  }
}
