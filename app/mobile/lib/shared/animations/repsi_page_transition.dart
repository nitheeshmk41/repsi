import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'repsi_motion.dart';

/// Repsi Custom Page Transition
/// Fade 0 -> 1 and subtle slide Offset(0.04, 0) -> Offset.zero
/// Duration: 400ms, Curve: easeOutCubic
CustomTransitionPage<T> buildRepsiPageTransition<T>({
  required BuildContext context,
  required GoRouterState state,
  required Widget child,
}) {
  return CustomTransitionPage<T>(
    key: state.pageKey,
    child: child,
    transitionDuration: RepsiMotion.page,
    reverseTransitionDuration: RepsiMotion.page,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curvedAnimation = CurvedAnimation(
        parent: animation,
        curve: RepsiMotion.easeOut,
      );

      final slideAnimation = Tween<Offset>(
        begin: const Offset(0.04, 0.0),
        end: Offset.zero,
      ).animate(curvedAnimation);

      final fadeAnimation = Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(curvedAnimation);

      return SlideTransition(
        position: slideAnimation,
        child: FadeTransition(
          opacity: fadeAnimation,
          child: child,
        ),
      );
    },
  );
}

/// Standalone PageRoute for Navigator.push
class RepsiPageRoute<T> extends PageRouteBuilder<T> {
  final Widget page;

  RepsiPageRoute({required this.page, super.settings})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => page,
          transitionDuration: RepsiMotion.page,
          reverseTransitionDuration: RepsiMotion.page,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            final curvedAnimation = CurvedAnimation(
              parent: animation,
              curve: RepsiMotion.easeOut,
            );

            return SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0.04, 0.0),
                end: Offset.zero,
              ).animate(curvedAnimation),
              child: FadeTransition(
                opacity: Tween<double>(begin: 0.0, end: 1.0).animate(curvedAnimation),
                child: child,
              ),
            );
          },
        );
}
