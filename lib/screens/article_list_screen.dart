import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/news_provider.dart';
import '../models/article.dart';
import '../widgets/article_card.dart';
import '../widgets/category_selector.dart';
import '../widgets/state_views.dart';
import 'article_detail_screen.dart';
import 'saved_bookmarks_screen.dart';
import 'note_form_screen.dart';

/// Screen 1: Article List Screen
/// Implements category filtering and strictly handles the 4 mandatory UI states:
/// 1. Loading Indicator
/// 2. Error message with a "Retry" button
/// 3. Empty message
/// 4. Data list
class ArticleListScreen extends StatefulWidget {
  const ArticleListScreen({super.key});

  @override
  State<ArticleListScreen> createState() => _ArticleListScreenState();
}

class _ArticleListScreenState extends State<ArticleListScreen> {
  bool _isSearchOpen = false;
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<NewsProvider>();

    return Scaffold(
      appBar: AppBar(
        title: _isSearchOpen
            ? TextField(
                controller: _searchController,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Search headlines...',
                  border: InputBorder.none,
                  hintStyle: TextStyle(color: theme.colorScheme.onSurfaceVariant),
                ),
                style: theme.textTheme.titleMedium,
                onChanged: (val) => provider.setSearchQuery(val),
              )
            : const Text(
                'News Reader',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
        elevation: 0,
        backgroundColor: theme.colorScheme.surface,
        actions: [
          IconButton(
            icon: Icon(_isSearchOpen ? Icons.close_rounded : Icons.search_rounded),
            tooltip: _isSearchOpen ? 'Close search' : 'Search headlines',
            onPressed: () {
              setState(() {
                if (_isSearchOpen) {
                  _isSearchOpen = false;
                  _searchController.clear();
                  provider.clearSearchQuery();
                } else {
                  _isSearchOpen = true;
                }
              });
            },
          ),
          IconButton(
            icon: Badge(
              isLabelVisible: provider.bookmarkCount > 0,
              label: Text(
                provider.bookmarkCount.toString(),
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
              ),
              child: const Icon(Icons.bookmarks_outlined),
            ),
            tooltip: 'Saved Bookmarks & Notes',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SavedBookmarksScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Refresh Feed',
            onPressed: () => provider.fetchArticles(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Category Filtering Tabs
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: CategorySelector(
              selectedCategory: provider.currentCategory,
              onCategorySelected: (category) {
                if (_isSearchOpen) {
                  setState(() {
                    _isSearchOpen = false;
                    _searchController.clear();
                  });
                }
                provider.setCategory(category);
              },
            ),
          ),
          const Divider(height: 1),

          // Main View State Switcher (The 4 States)
          Expanded(
            child: _buildMainContent(context, provider),
          ),
        ],
      ),
    );
  }

  /// Builds one of the 4 mandatory states based on [NewsViewState]
  Widget _buildMainContent(BuildContext context, NewsProvider provider) {
    switch (provider.viewState) {
      // State 1: Loading Indicator
      case NewsViewState.loading:
        return const LoadingStateView(
          message: 'Fetching the latest breaking stories...',
        );

      // State 2: Error Message with a "Retry" button
      case NewsViewState.error:
        return ErrorStateView(
          errorMessage: provider.errorMessage,
          onRetry: () => provider.retry(),
        );

      // State 3: Empty Message
      case NewsViewState.empty:
        return EmptyStateView(
          title: provider.searchQuery.isNotEmpty
              ? 'No Matching Stories'
              : 'No Articles in This Category',
          message: provider.searchQuery.isNotEmpty
              ? 'No articles found matching "${provider.searchQuery}". Try a different keyword.'
              : 'There are currently no articles in "${provider.currentCategory}". Tap refresh to recheck.',
          actionLabel: provider.searchQuery.isNotEmpty ? 'Clear Search' : 'Reload Feed',
          onAction: () {
            if (provider.searchQuery.isNotEmpty) {
              setState(() {
                _isSearchOpen = false;
                _searchController.clear();
              });
              provider.clearSearchQuery();
            } else {
              provider.fetchArticles();
            }
          },
        );

      // State 4: Data List
      case NewsViewState.data:
        final articles = provider.articles;
        return RefreshIndicator(
          onRefresh: () => provider.fetchArticles(),
          child: ListView.builder(
            padding: const EdgeInsets.only(top: 8, bottom: 24),
            itemCount: articles.length,
            itemBuilder: (context, index) {
              final article = articles[index];
              final isBookmarked = provider.isBookmarked(article.id, article.url);

              return ArticleCard(
                article: article,
                isBookmarked: isBookmarked,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ArticleDetailScreen(article: article),
                    ),
                  );
                },
                onBookmarkTap: () {
                  _openNoteForm(context, article, provider);
                },
              );
            },
          ),
        );
    }
  }

  void _openNoteForm(BuildContext context, Article article, NewsProvider provider) {
    final existingBookmark = provider.getBookmarkForArticle(article.id, article.url);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => NoteFormScreen(
          article: article,
          existingNote: existingBookmark,
        ),
      ),
    );
  }
}
