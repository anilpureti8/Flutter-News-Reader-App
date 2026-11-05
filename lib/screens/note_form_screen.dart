import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/article.dart';
import '../models/bookmark_note.dart';
import '../services/news_provider.dart';

/// Screen 3: Personal Notes / Bookmarks Form Screen
/// Implements strict Form validation for all input fields before saving to SharedPreferences.
class NoteFormScreen extends StatefulWidget {
  final Article article;
  final BookmarkNote? existingNote;

  const NoteFormScreen({
    super.key,
    required this.article,
    this.existingNote,
  });

  @override
  State<NoteFormScreen> createState() => _NoteFormScreenState();
}

class _NoteFormScreenState extends State<NoteFormScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _titleController;
  late TextEditingController _notesController;
  late TextEditingController _customTagController;
  late int _rating;
  late List<String> _selectedTags;
  bool _isSaving = false;

  final List<String> _suggestedTags = [
    'Research',
    'Fact Check',
    'Work',
    'Follow Up',
    'Inspiring',
    'Read Later',
  ];

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(
      text: widget.existingNote?.noteTitle ?? 'Key insights from "${widget.article.title.split(':').first}"',
    );
    _notesController = TextEditingController(
      text: widget.existingNote?.personalNotes ?? '',
    );
    _customTagController = TextEditingController();
    _rating = widget.existingNote?.rating ?? 3;
    _selectedTags = List<String>.from(widget.existingNote?.tags ?? ['Research']);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _notesController.dispose();
    _customTagController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    // Strict form validation
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please correct the validation errors in the form.'),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
      return;
    }

    setState(() => _isSaving = true);

    final provider = context.read<NewsProvider>();
    final now = DateTime.now();

    final note = BookmarkNote(
      id: widget.existingNote?.id ?? 'note_${now.millisecondsSinceEpoch}',
      articleId: widget.article.id,
      articleTitle: widget.article.title,
      articleUrl: widget.article.url,
      articleImageUrl: widget.article.imageUrl,
      articleSource: widget.article.sourceName,
      noteTitle: _titleController.text.trim(),
      personalNotes: _notesController.text.trim(),
      category: widget.article.category,
      rating: _rating,
      tags: _selectedTags,
      createdAt: widget.existingNote?.createdAt ?? now,
      updatedAt: now,
    );

    final success = await provider.saveBookmark(note);

    if (mounted) {
      setState(() => _isSaving = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              widget.existingNote != null
                  ? 'Personal note updated successfully!'
                  : 'Article and note saved to bookmarks!',
            ),
            behavior: SnackBarBehavior.floating,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Failed to save bookmark. Please try again.'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isEditing = widget.existingNote != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Personal Note' : 'Add Note & Bookmark'),
        actions: [
          IconButton(
            icon: _isSaving
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.check_rounded),
            tooltip: 'Save Note',
            onPressed: _isSaving ? null : _submitForm,
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          children: [
            // Article Context Banner (Read-only summary of the story being annotated)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.6),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.article_outlined, color: theme.colorScheme.primary, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.article.sourceName,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        Text(
                          widget.article.title,
                          style: theme.textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Form Field 1: Note Title (Strict Validation)
            Text(
              'Note Headline / Summary *',
              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(
                hintText: 'e.g. Revolutionary breakthrough in clean tech',
                prefixIcon: const Icon(Icons.title_rounded),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: theme.colorScheme.surfaceContainerLow,
              ),
              textInputAction: TextInputAction.next,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Note headline is required.';
                }
                if (value.trim().length < 3) {
                  return 'Headline must be at least 3 characters long.';
                }
                if (value.trim().length > 120) {
                  return 'Headline cannot exceed 120 characters.';
                }
                return null;
              },
            ),
            const SizedBox(height: 20),

            // Form Field 2: Personal Notes / Insights (Strict Validation)
            Text(
              'Personal Reflection & Insights *',
              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _notesController,
              maxLines: 5,
              decoration: InputDecoration(
                hintText: 'Record key takeaways, questions to investigate, or quotes...',
                alignLabelWithHint: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: theme.colorScheme.surfaceContainerLow,
              ),
              textInputAction: TextInputAction.newline,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please write your personal notes or takeaways.';
                }
                if (value.trim().length < 5) {
                  return 'Personal notes must be at least 5 characters long.';
                }
                if (value.trim().length > 2000) {
                  return 'Notes cannot exceed 2000 characters.';
                }
                return null;
              },
            ),
            const SizedBox(height: 24),

            // Form Field 3: Rating / Priority Selector (1-5 stars)
            Text(
              'Priority / Relevance Rating',
              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: List.generate(5, (index) {
                final starValue = index + 1;
                return IconButton(
                  icon: Icon(
                    starValue <= _rating ? Icons.star_rounded : Icons.star_outline_rounded,
                    color: starValue <= _rating ? theme.colorScheme.primary : theme.colorScheme.outline,
                    size: 32,
                  ),
                  onPressed: () {
                    setState(() => _rating = starValue);
                  },
                );
              }),
            ),
            const SizedBox(height: 20),

            // Form Field 4: Tag Categorization
            Text(
              'Tags & Organization',
              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _suggestedTags.map((tag) {
                final isSelected = _selectedTags.contains(tag);
                return FilterChip(
                  label: Text(tag),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedTags.add(tag);
                      } else {
                        _selectedTags.remove(tag);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 36),

            // Submit Button
            FilledButton.icon(
              onPressed: _isSaving ? null : _submitForm,
              icon: _isSaving
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Icon(Icons.save_rounded),
              label: Text(
                _isSaving
                    ? 'Saving...'
                    : (isEditing ? 'Update Note' : 'Save Note & Bookmark'),
              ),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
