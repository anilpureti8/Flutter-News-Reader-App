import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:news_reader_app/main.dart';
import 'package:news_reader_app/services/news_provider.dart';
import 'package:news_reader_app/screens/article_list_screen.dart';
import 'package:news_reader_app/widgets/state_views.dart';

void main() {
  group('News Reader Widget Tests', () {
    testWidgets('ArticleListScreen displays app bar title and category chips', (WidgetTester tester) async {
      final mockProvider = NewsProvider();

      await tester.pumpWidget(
        ChangeNotifierProvider<NewsProvider>.value(
          value: mockProvider,
          child: const MaterialApp(
            home: ArticleListScreen(),
          ),
        ),
      );

      // Verify that the AppBar title is visible
      expect(find.text('News Reader'), findsOneWidget);

      // Verify category tabs exist
      expect(find.text('General'), findsOneWidget);
      expect(find.text('Technology'), findsOneWidget);
      expect(find.text('Business'), findsOneWidget);
    });

    testWidgets('ArticleListScreen renders LoadingStateView when loading', (WidgetTester tester) async {
      final mockProvider = NewsProvider();
      // Ensure state is loading
      expect(mockProvider.viewState, NewsViewState.loading);

      await tester.pumpWidget(
        ChangeNotifierProvider<NewsProvider>.value(
          value: mockProvider,
          child: const MaterialApp(
            home: ArticleListScreen(),
          ),
        ),
      );

      // Verify CircularProgressIndicator is displayed
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.byType(LoadingStateView), findsOneWidget);
    });

    testWidgets('ErrorStateView displays retry button and responds to tap', (WidgetTester tester) async {
      bool retryTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ErrorStateView(
              errorMessage: 'Network timeout connection failure',
              onRetry: () {
                retryTapped = true;
              },
            ),
          ),
        ),
      );

      // Verify error message and retry button are in the tree
      expect(find.text('Unable to Load News'), findsOneWidget);
      expect(find.text('Network timeout connection failure'), findsOneWidget);
      expect(find.text('Retry'), findsOneWidget);

      // Tap the retry button
      await tester.tap(find.text('Retry'));
      await tester.pump();

      expect(retryTapped, isTrue);
    });
  });
}
