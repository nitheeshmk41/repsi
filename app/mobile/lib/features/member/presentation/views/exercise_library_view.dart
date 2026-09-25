import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/models/workout_models.dart';
import '../../data/member_repository.dart';

class ExerciseLibraryView extends ConsumerStatefulWidget {
  const ExerciseLibraryView({super.key});

  @override
  ConsumerState<ExerciseLibraryView> createState() => _ExerciseLibraryViewState();
}

class _ExerciseLibraryViewState extends ConsumerState<ExerciseLibraryView> {
  String _searchQuery = '';
  MuscleGroup? _selectedGroup;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final libraryAsync = ref.watch(exerciseLibraryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Exercise Library'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: const InputDecoration(
                hintText: 'Search exercises by name...',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                ChoiceChip(
                  label: const Text('All'),
                  selected: _selectedGroup == null,
                  onSelected: (_) => setState(() => _selectedGroup = null),
                ),
                const SizedBox(width: 8),
                ...MuscleGroup.values.map(
                  (group) => Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(group.name.toUpperCase()),
                      selected: _selectedGroup == group,
                      onSelected: (_) => setState(() => _selectedGroup = group),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: libraryAsync.when(
              data: (exercises) {
                final filtered = exercises.where((ex) {
                  final matchesSearch = ex.name.toLowerCase().contains(_searchQuery.toLowerCase());
                  final matchesGroup = _selectedGroup == null || ex.muscleGroup == _selectedGroup;
                  return matchesSearch && matchesGroup;
                }).toList();

                if (filtered.isEmpty) {
                  return const Center(child: Text('No exercises found matching filters.'));
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = filtered[index];
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: theme.primaryColor.withValues(alpha: 0.1),
                          child: Icon(Icons.fitness_center, color: theme.primaryColor),
                        ),
                        title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(
                          '${item.muscleGroup.name.toUpperCase()} · ${item.equipment.name}',
                          style: const TextStyle(fontSize: 12),
                        ),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                            ),
                            builder: (_) => Padding(
                              padding: const EdgeInsets.all(24.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.name,
                                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(item.description, style: const TextStyle(color: Colors.grey)),
                                  const Divider(height: 24),
                                  const Text('Instructions', style: TextStyle(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 6),
                                  Text(item.instructions),
                                  const SizedBox(height: 20),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, __) => Text('Error: $err'),
            ),
          ),
        ],
      ),
    );
  }
}
