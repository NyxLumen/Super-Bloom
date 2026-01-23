# 🌸 SUPER BLOOM '26

> **"Sweet. Sound. Chaos."**

A high-energy, responsive landing page for a fictional hyper-pop music festival.

This project started as the **Homepage** assignment for **The Odin Project** (Intermediate HTML/CSS), but I decided to push the boundaries. Instead of a standard corporate layout, I built an immersive, brand-focused experience that blends rigid structural CSS with fluid GSAP animations.

**[🔴 LIVE DEMO](ADD_YOUR_VERCEL_LINK_HERE)**

## ⚡ The Mission

The goal was to build a responsive layout from scratch without frameworks (Bootstrap/Tailwind).
The challenge? Making a "chaos-style" design that is actually strictly organized and mobile-perfect under the hood.

## 🛠 Tech Stack

- **Structure:** Semantic HTML5
- **Styling:** CSS3 (Grid for macro layout, Flexbox for components)
- **Architecture:** BEM (Block Element Modifier) Naming Convention
- **Motion:** GSAP (GreenSock) + ScrollTrigger
- **Typography:** Fluid scaling using `clamp()`

## 🚀 Key Features

- **Mobile-First Architecture:** The layout expands from a single-column mobile view to a complex 3-column masonry grid on desktop.
- **Performance:** Zero layout shifts (CLS) despite heavy animation usage.
- **Scroll-Driven Animation:** Marquee text and parallax effects linked to scroll position using GSAP ScrollTrigger.
- **Interactive UI:** Hover states with 3D tilts and blend-mode shifts.

## 📸 Preview

_(Add a screenshot of your site here later)_

## 🧠 Lessons Learned

- Balancing `position: fixed` elements within a flow layout.
- Using `grid-template-columns` with `minmax()` for robust responsiveness.
- Managing the z-index wars when overlapping typography with images.

---

_Created by NyxLumen // 2026_
