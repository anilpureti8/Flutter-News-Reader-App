import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../services/news_provider.dart';
import '../models/bookmark_note.dart';
import '../models/article.dart';
import 'note_form_screen.dart';
import 'article_detail_screen.dart';

/// Screen 4: Saved Bookmarks & Personal Notes List Screen
/// Displays all notes saved to SharedPreferences with deletion, tag filtering, and editing.
class SavedBookmarksScreen extends StatefulWidget {
  const SavedBookmarksScreen({super.key});

  @override
  State<SavedBookmarksScreen> createState() => _SavedBookmarksScreenState();
}

class _SavedBookmarksScreenState extends State<SavedBookmarksScreen> {
  String _selectedFilterTag = 'All';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<NewsProvider>();
    final bookmarks = provider.bookmarks;

    // Collect all unique tags across saved notes
    final Set<String> allTags = {'All'};
    for (final b in bookmarks) {
      allTags.addAll(b.tags);
    }

    final filteredList = _selectedFilterTag == 'All'
        ? bookmarks
        : bookmarks.where((b) => b.tags.contains(_selectedFilterTag)).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Bookmarks & Notes'),
      ),
      body: bookmarks.isEmpty
          ? _buildEmptyState(context)
          : Column(
              children: [
                // Tag Filter Row (if tags exist)
                if (allTags.length > 1) ...[
                  SizedBox(
                    height: 44,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      children: allTags.map((tag) {
                        final isSelected = tag == _selectedFilterTag;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            label: Text(tag),
                            selected: isSelected,
                            onSelected: (_) {
                              setState(() => _selectedFilterTag = tag);
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const Divider(height: 1),
                ],

                // Bookmarks List
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: filteredList.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = filteredList[index];
                      return _buildBookmarkCard(context, item, provider, theme);
                    },
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildBookmarkCard(
    BuildContext context,
    BookmarkNote note,
    NewsProvider provider,
    ThemeData theme,
  ) {
    final updatedDate = DateFormat('MMM d, yyyy · h:mm a').format(note.updatedAt);

    return Dismissible(
      key: Key(note.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.symmetric(horizontal: 24),
        decoration: BoxDecoration(
          color: theme.colorScheme.error,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.delete_outline_rounded, color: Colors.white, size: 28),
      ),
      confirmDismiss: (direction) async {
        return await showDialog<bool>(
              context: context,
              builder: (ctx) => AlertDialog(
                title: const Text('Delete Bookmark?'),
                content: Text('Are you sure you want to remove notes for "${note.articleTitle}"?'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx, false),
                    child: const Text('Cancel'),
                  ),
                  FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: theme.colorScheme.error),
                    onPressed: () => Navigator.pop(ctx, true),
                    child: const Text('Delete'),
                  ),
                ],
              ),
            ) ??
            false;
      },
      onDismissed: (_) {
        provider.deleteBookmark(note.id);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Bookmark deleted from device.')),
        );
      },
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: theme.colorScheme.outlineVariant.withValues(alpha: 0.6),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar: Associated article source & star rating
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    note.articleSource.toUpperCase(),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  Row(
                    children: List.generate(
                      5,
                      (i) => Icon(
                        i < note.rating ? Icons.star_rounded : Icons.star_border_rounded,
                        size: 16,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Note Headline
              Text(
                note.noteTitle,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 6),

              // Personal notes text
              Text(
                note.personalNotes,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                  height: 1.4,
                ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),

              // Original Article Title Reference
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.link_rounded, size: 16, color: theme.colorScheme.onSurfaceVariant),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        note.articleTitle,
                        style: theme.textTheme.labelSmall?.copyWith(
                          fontStyle: FontStyle.italic,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Tags & Date Footer
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (note.tags.isNotEmpty)
                    Expanded(
                      child: Wrap(
                        spacing: 4,
                        children: note.tags.map((t) {
                          return Chip(
                            label: Text(t, style: const TextStyle(fontSize: 10)),
                            padding: EdgeInsets.zero,
                            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          );
                        }).toList(),
                      ),
                    )
                  else
                    const SizedBox.shrink(),
                  Text(
                    updatedDate,
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: theme.colorScheme.outline,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Action buttons: Edit Note or View Full Article
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton.icon(
                    onPressed: () {
                      final article = Article(
                        id: note.articleId,
                        title: note.articleTitle,
                        description: note.noteTitle,
                        content: note.personalNotes,
                        url: note.articleUrl,
                        imageUrl: note.articleImageUrl,
                        sourceName: note.articleSource,
                        author: note.articleSource,
                        publishedAt: note.createdAt,
                        category: note.category,
                      );
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ArticleDetailScreen(article: article),
                        ),
                      );
                    },
                    icon: const Icon(Icons.article_outlined, size: 16),
                    label: const Text('Read Story'),
                  ),
                  const SizedBox(width: 8),
                  FilledButton.tonalIcon(
                    onPressed: () {
                      final article = Article(
                        id: note.articleId,
                        title: note.articleTitle,
                        description: note.noteTitle,
                        content: note.personalNotes,
                        url: note.articleUrl,
                        imageUrl: note.articleImageUrl,
                        sourceName: note.articleSource,
                        author: note.articleSource,
                        publishedAt: note.createdAt,
                        category: note.category,
                      );
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => NoteFormScreen(
                            article: article,
                            existingNote: note,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.edit_rounded, size: 16),
                    label: const Text('Edit Note'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.colorScheme.primaryContainer.withValues(alpha: 0.5),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.bookmark_add_outlined,
                size: 48,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'No Saved Bookmarks Yet',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Bookmark interesting stories and jot down your personal notes. They will be saved right on your device.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.explore_rounded, size: 18),
              label: const Text('Browse Headlines'),
            ),
          ],
        ),
      ),
    );
  }
}
