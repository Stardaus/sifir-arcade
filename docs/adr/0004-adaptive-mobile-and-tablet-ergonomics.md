# 0004 Adaptive Mobile and Tablet Ergonomics

We decided to adopt an Adaptive Ergonomics architecture tailored to screen form factors:
1. **Mobile Phones (Compact Portrait)**: Implement a strict "Zero-Scroll Viewport" constrained within 100dvh. The top header, HUD, question CRT display, and tactile numpad stay anchored in the thumb zone without page jumping or vertical scrolling.
2. **Tablets & Landscape Viewports**: Implement an auto-switching dual-pane "Cockpit Layout", placing visual grouping representations (cargo pods, arrays, skip tracks) on the primary pane and the tactile input console on the complementary pane for comfortable bimanual interaction.

This trade-off rejects long single-column scrollable documents (which disrupt game momentum and rapid arithmetic rhythm on phones) and rigid device locks in favor of fluid, form-factor-conscious ergonomic adaptation.
