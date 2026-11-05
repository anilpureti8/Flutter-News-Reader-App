import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/news_provider.dart';
import 'screens/article_list_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Instantiate and initialize the central NewsProvider
  final newsProvider = NewsProvider();
  await newsProvider.init();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<NewsProvider>.value(value: newsProvider),
      ],
      child: const NewsReaderApp(),
    ),
  );
}

/// Root Application Widget configured with Material 3 and single seedColor theming.
/// Strictly enforces no hardcoded colors outside the theme.
class NewsReaderApp extends StatelessWidget {
  const NewsReaderApp({super.key});

  // Single seedColor governing the entire light and dark color schemes
  static const Color primarySeedColor = Color(0xFF1E40AF); // Deep Indigo/Cobalt

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'News Reader',
      debugShowCheckedModeBanner: false,

      // Light Theme with Material 3 and seedColor
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primarySeedColor,
          brightness: Brightness.light,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
          scrolledUnderElevation: 2,
        ),
        cardTheme: const CardTheme(
          elevation: 0,
        ),
      ),

      // Dark Theme with Material 3 and matching seedColor
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primarySeedColor,
          brightness: Brightness.dark,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
          scrolledUnderElevation: 2,
        ),
        cardTheme: const CardTheme(
          elevation: 0,
        ),
      ),
      themeMode: ThemeMode.system,

      // Initial Route
      home: const ArticleListScreen(),
    );
  }
}
