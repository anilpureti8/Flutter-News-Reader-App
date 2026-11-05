/// News Article Model representing articles from API endpoints.
/// Strict null safety compliant with default fallbacks to prevent crashes.
class Article {
  final String id;
  final String title;
  final String description;
  final String content;
  final String url;
  final String imageUrl;
  final String sourceName;
  final String author;
  final DateTime publishedAt;
  final String category;

  const Article({
    required this.id,
    required this.title,
    required this.description,
    required this.content,
    required this.url,
    required this.imageUrl,
    required this.sourceName,
    required this.author,
    required this.publishedAt,
    this.category = 'general',
  });

  /// Factory constructor to safely parse JSON from public News APIs (NewsAPI, GNews, etc.)
  /// Guaranteed never to throw on missing or null keys.
  factory Article.fromJson(Map<String, dynamic> json, {String defaultCategory = 'general'}) {
    // Safely extract source name
    String source = 'General News';
    if (json['source'] is Map && json['source']['name'] != null) {
      source = json['source']['name'].toString();
    } else if (json['sourceName'] != null) {
      source = json['sourceName'].toString();
    }

    // Safely parse date
    DateTime date;
    try {
      final rawDate = json['publishedAt']?.toString();
      date = rawDate != null ? DateTime.parse(rawDate) : DateTime.now();
    } catch (_) {
      date = DateTime.now();
    }

    // Generate unique ID from URL or title
    final fallbackUrl = json['url']?.toString() ?? '';
    final fallbackTitle = json['title']?.toString() ?? 'Untitled Story';
    final generatedId = fallbackUrl.isNotEmpty
        ? fallbackUrl.hashCode.abs().toString()
        : fallbackTitle.hashCode.abs().toString();

    return Article(
      id: json['id']?.toString() ?? generatedId,
      title: fallbackTitle,
      description: json['description']?.toString() ?? 'No description provided.',
      content: json['content']?.toString() ?? json['description']?.toString() ?? 'Full story content is available via the original source article.',
      url: fallbackUrl,
      imageUrl: json['urlToImage']?.toString() ?? json['imageUrl']?.toString() ?? '',
      sourceName: source,
      author: json['author']?.toString() ?? source,
      publishedAt: date,
      category: json['category']?.toString() ?? defaultCategory,
    );
  }

  /// Converts the Article instance into a JSON-serializable Map.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'content': content,
      'url': url,
      'urlToImage': imageUrl,
      'sourceName': sourceName,
      'author': author,
      'publishedAt': publishedAt.toIso8601String(),
      'category': category,
    };
  }

  /// Estimated reading time in minutes based on word count.
  int get estimatedReadTimeMinutes {
    final totalWords = '${title} ${description} ${content}'.split(RegExp(r'\s+')).length;
    final minutes = (totalWords / 200).ceil();
    return minutes < 1 ? 1 : minutes;
  }
}
