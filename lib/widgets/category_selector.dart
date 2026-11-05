import 'package:flutter/material.dart';

/// Horizontal category selector widget supporting one-tap filtering.
class CategorySelector extends StatelessWidget {
  final String selectedCategory;
  final ValueChanged<String> onCategorySelected;

  static const List<Map<String, String>> categories = [
    {'id': 'general', 'label': 'General'},
    {'id': 'technology', 'label': 'Technology'},
    {'id': 'business', 'label': 'Business'},
    {'id': 'science', 'label': 'Science'},
    {'id': 'health', 'label': 'Health'},
    {'id': 'entertainment', 'label': 'Entertainment'},
  ];

  const CategorySelector({
    super.key,
    required this.selectedCategory,
    required this.onCategorySelected,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SizedBox(
      height: 48,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = categories[index];
          final isSelected = cat['id'] == selectedCategory.toLowerCase();

          return FilterChip(
            selected: isSelected,
            label: Text(cat['label']!),
            labelStyle: TextStyle(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              color: isSelected
                  ? theme.colorScheme.onPrimaryContainer
                  : theme.colorScheme.onSurfaceVariant,
            ),
            selectedColor: theme.colorScheme.primaryContainer,
            backgroundColor: theme.colorScheme.surfaceContainerLow,
            checkmarkColor: theme.colorScheme.onPrimaryContainer,
            showCheckmark: false,
            side: BorderSide(
              color: isSelected
                  ? theme.colorScheme.primary.withValues(alpha: 0.4)
                  : theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
              width: 1,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
            onSelected: (_) => onCategorySelected(cat['id']!),
          );
        },
      ),
    );
  }
}
