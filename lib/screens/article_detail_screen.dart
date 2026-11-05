import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/article.dart';
import '../services/news_provider.dart';
import 'note_form_screen.dart';

/// Screen 2: Article Detail Screen
/// Displays the full story information, hero image, source, reading time,
/// and direct actions to read original web version or create/edit personal notes.
class ArticleDetailScreen extends StatelessWidget {
  final Article article;

  const ArticleDetailScreen({
    super.key,
    required this.article,
  });

  Future<void> _launchSourceUrl(BuildContext context) async {
    if (article.url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No external URL provided for this story.')),
      );
      return;
    }
    final uri = Uri.parse(article.url);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Could not open external browser for this article.')),
          );
        }
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to open link: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<NewsProvider>();
    final isBookmarked = provider.isBookmarked(article.id, article.url);
    final existingNote = provider.getBookmarkForArticle(article.id, article.url);
    final formattedDate = DateFormat('EEEE, MMMM d, yyyy · h:mm a').format(article.publishedAt);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Collapsible Material 3 AppBar with Article Image
          SliverAppBar(
            expandedHeight: article.imageUrl.isNotEmpty ? 280 : 120,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: article.imageUrl.isNotEmpty
                  ? Image.network(
                      article.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: theme.colorScheme.surfaceContainerHighest,
                        child: Center(
                          child: Icon(
                            Icons.newspaper_rounded,
                            size: 64,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    )
                  : Container(
                      color: theme.colorScheme.surfaceContainerHighest,
                      child: Center(
                        child: Icon(
                          Icons.newspaper_rounded,
                          size: 64,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
            ),
            actions: [
              IconButton(
                icon: Icon(
                  isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
                  color: isBookmarked ? theme.colorScheme.primary : null,
                ),
                tooltip: isBookmarked ? 'Edit Note' : 'Add Note / Bookmark',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => NoteFormScreen(
                        article: article,
                        existingNote: existingNote,
                      ),
                    ),
                  );
                },
              ),
              IconButton(
                icon: const Icon(Icons.open_in_browser_rounded),
                tooltip: 'Open in Browser',
                onPressed: () => _launchSourceUrl(context),
              ),
            ],
          ),

          // Article Body Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category & Read Time Bar
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primaryContainer,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          article.category.toUpperCase(),
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.6,
                            color: theme.colorScheme.onPrimaryContainer,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '${article.estimatedReadTimeMinutes} min read',
                        style: theme.textTheme.labelMedium?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Article Title
                  Text(
                    article.title,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      height: 1.25,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Source & Date Metadata
                  Text(
                    'Published by ${article.sourceName} · ${article.author}',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    formattedDate,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 20),

                  // Article Description / Lead Paragraph
                  Text(
                    article.description,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                      fontStyle: FontStyle.italic,
                      height: 1.5,
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Full Body Content
                  Text(
                    article.content,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      height: 1.7,
                      letterSpacing: 0.2,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Attached Personal Note Card (if saved)
                  if (existingNote != null) ...[
                    Card(
                      color: theme.colorScheme.secondaryContainer.withValues(alpha: 0.6),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: BorderSide(
                          color: theme.colorScheme.secondary.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.edit_note_rounded,
                                        color: theme.colorScheme.onSecondaryContainer),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Your Personal Note',
                                      style: theme.textTheme.titleSmall?.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: theme.colorScheme.onSecondaryContainer,
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: List.generate(
                                    5,
                                    (i) => Icon(
                                      i < existingNote.rating
                                          ? Icons.star_rounded
                                          : Icons.star_border_rounded,
                                      size: 16,
                                      color: theme.colorScheme.primary,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              existingNote.noteTitle,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              existingNote.personalNotes,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSecondaryContainer,
                              ),
                            ),
                            if (existingNote.tags.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Wrap(
                                spacing: 6,
                                children: existingNote.tags.map((tag) {
                                  return Chip(
                                    label: Text(tag, style: const TextStyle(fontSize: 11)),
                                    padding: EdgeInsets.zero,
                                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                  );
                                }).toList(),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Action Buttons: Open Link & Edit Note
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _launchSourceUrl(context),
                          icon: const Icon(Icons.public_rounded),
                          label: const Text('Read Original'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => NoteFormScreen(
                                  article: article,
                                  existingNote: existingNote,
                                ),
                              ),
                            );
                          },
                          icon: Icon(existingNote != null ? Icons.edit_rounded : Icons.bookmark_add_rounded),
                          label: Text(existingNote != null ? 'Edit Note' : 'Add Note'),
                          style: FilledButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
