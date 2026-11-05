/// Represents a user's saved article bookmark with validated personal notes.
/// Serialized and stored locally on the device using shared_preferences.
class BookmarkNote {
  final String id;
  final String articleId;
  final String articleTitle;
  final String articleUrl;
  final String articleImageUrl;
  final String articleSource;
  final String noteTitle;
  final String personalNotes;
  final String category;
  final int rating; // 1 to 5 stars
  final List<String> tags;
  final DateTime createdAt;
  final DateTime updatedAt;

  const BookmarkNote({
    required this.id,
    required this.articleId,
    required this.articleTitle,
    required this.articleUrl,
    required this.articleImageUrl,
    required this.articleSource,
    required this.noteTitle,
    required this.personalNotes,
    required this.category,
    this.rating = 3,
    this.tags = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  /// Factory constructor to deserialize JSON retrieved from SharedPreferences.
  factory BookmarkNote.fromJson(Map<String, dynamic> json) {
    return BookmarkNote(
      id: json['id'] as String? ?? DateTime.now().millisecondsSinceEpoch.toString(),
      articleId: json['articleId'] as String? ?? '',
      articleTitle: json['articleTitle'] as String? ?? 'Untitled Note',
      articleUrl: json['articleUrl'] as String? ?? '',
      articleImageUrl: json['articleImageUrl'] as String? ?? '',
      articleSource: json['articleSource'] as String? ?? 'News',
      noteTitle: json['noteTitle'] as String? ?? '',
      personalNotes: json['personalNotes'] as String? ?? '',
      category: json['category'] as String? ?? 'General',
      rating: (json['rating'] as num?)?.toInt() ?? 3,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : DateTime.now(),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt'] as String) : DateTime.now(),
    );
  }

  /// Serializes the model into a Map for JSON encoding into SharedPreferences.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'articleId': articleId,
      'articleTitle': articleTitle,
      'articleUrl': articleUrl,
      'articleImageUrl': articleImageUrl,
      'articleSource': articleSource,
      'noteTitle': noteTitle,
      'personalNotes': personalNotes,
      'category': category,
      'rating': rating,
      'tags': tags,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  /// Creates a copy of the bookmark note with updated values.
  BookmarkNote copyWith({
    String? noteTitle,
    String? personalNotes,
    int? rating,
    List<String>? tags,
    DateTime? updatedAt,
  }) {
    return BookmarkNote(
      id: id,
      articleId: articleId,
      articleTitle: articleTitle,
      articleUrl: articleUrl,
      articleImageUrl: articleImageUrl,
      articleSource: articleSource,
      noteTitle: noteTitle ?? this.noteTitle,
      personalNotes: personalNotes ?? this.personalNotes,
      category: category,
      rating: rating ?? this.rating,
      tags: tags ?? this.tags,
      createdAt: createdAt,
      updatedAt: updatedAt ?? DateTime.now(),
    );
  }
}
