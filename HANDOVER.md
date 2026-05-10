# KFC Atlas UI — Boilerplate Handover Prompt

Use this prompt when applying the `boilerplate.html` design system to any new prototype file in this folder.

---

## Handover Prompt

You are applying the KFC Helium Design System (v.Chicken) to an HTML prototype file. The design system is already set up in `boilerplate.html` — your job is to port its exact structure, tokens, fonts, and components into the target file.

---

### 1. Font Setup

#### Google Fonts fallback (CDN — use when local TTF files are unavailable)

The display typography is equivalent to **Barlow Condensed, Italic, weight 900** on Google Fonts. Add this to `<head>` before your `<style>` block:

```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,900&display=swap" rel="stylesheet">
```

Then reference it in your CSS as `'Barlow Condensed'`.

#### Local TTF files (preferred — already bundled in this project)

Copy these four `@font-face` declarations into the `<head>` of the target file. All font files live in `fonts/` (no subdirectory):

```css
@font-face {
  font-family: "Kentucky Fried Sans";
  src: url("fonts/KentuckyFriedSans-Regular.ttf") format("truetype");
  font-weight: 400; font-style: normal;
}
@font-face {
  font-family: "Kentucky Fried Sans";
  src: url("fonts/KentuckyFriedSans-Semibold.ttf") format("truetype");
  font-weight: 600; font-style: normal;
}
@font-face {
  font-family: "Kentucky Fried Serif";
  src: url("fonts/KentuckyFriedSerif-ExtraboldItalic.ttf") format("truetype");
  font-weight: 700 800; font-style: italic;
}
@font-face {
  font-family: "Kentucky Fried Serif";
  src: url("fonts/KentuckyFriedSerif-BlackItalic.ttf") format("truetype");
  font-weight: 900; font-style: italic;
}
```

**Font usage rules:**
- Kentucky Fried Serif is italic-only. Set `font-style: italic` on `body` so every element inherits it.
- Use weight `900` (BlackItalic) for headlines, CTAs, and nav labels.
- Use weight `700–800` (ExtraboldItalic) for body copy and secondary text.
- Kentucky Fried Sans (400 / 600) is available for non-italic UI elements if needed.
- **White text** on dark/red/black backgrounds. **Dark text `#231815`** on white/light backgrounds.
- If the local TTF files are unavailable, swap `"Kentucky Fried Serif"` for `"Barlow Condensed"` in `--font-display` and `--font-body` — visual output is equivalent.

---

### 2. Design Tokens

Add to `:root` in `<style>`:

```css
:root {
  --bg:        #080808;
  --panel:     #121212;
  --panel-2:   #1b1b1b;
  --panel-3:   #252525;
  --line:      rgba(255, 255, 255, 0.08);
  --text:      #fff8f1;
  --muted:     rgba(255, 248, 241, 0.60);
  --red:       #e4002b;
  --red-soft:  rgba(228, 0, 43, 0.18);
  --gold:      #ffbf5b;
  --green:     #52d890;
  --shadow:    0 30px 80px rgba(0, 0, 0, 0.55);
  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 16px;
  --radius-sm: 12px;
  --font-display: "Kentucky Fried Serif", Georgia, serif;
  --font-body:    "Kentucky Fried Serif", Georgia, serif;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

---

### 3. Phone Shell Structure

The complete HTML skeleton. Do not alter z-index layering or class names:

```html
<div class="stage">
  <div class="phone-wrap">
    <div class="phone">
      <div class="ambient"></div>

      <!-- Status Bar — always dark text (sits over white OCB) -->
      <div class="status-bar">
        <span>9:41</span>
        <span>5G ▰▰▰ 🔋</span>
      </div>

      <div class="viewport">

        <!-- Order Context Bar — white background, dark text -->
        <div class="ocb">
          <button class="ocb-btn">
            Pick Up: KFC Elizabeth Street Melbourne
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="ocb-sep"></span>
          <button class="ocb-btn">
            10:00AM
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- ══ SCREEN CONTENT GOES HERE ══ -->
        <main class="content" id="content">
          <!-- your screen content -->
        </main>

        <!-- Bottom Nav — always black, white/red icons -->
        <div class="bottom-nav-wrap">
          <button class="start-order-btn">START ORDER</button>
          <nav class="bottom-nav">
            <button class="nav-btn active" data-tab="home"><!-- Home icon + label --></button>
            <button class="nav-btn" data-tab="menu"><!-- Menu icon + label --></button>
            <button class="nav-btn" data-tab="cart"><!-- Cart icon + label --></button>
            <button class="nav-btn" data-tab="rewards"><!-- Rewards icon + label --></button>
            <button class="nav-btn" data-tab="more"><!-- More icon + label --></button>
          </nav>
        </div>

      </div><!-- /viewport -->
    </div><!-- /phone -->
  </div><!-- /phone-wrap -->
</div><!-- /stage -->
```

---

### 4. Nav Button Inner Structure

Each `<button class="nav-btn">` must contain this exact inner markup:

```html
<button class="nav-btn" data-tab="[tab-name]">
  <span class="nav-btn-inner">
    <span class="nav-btn-icon">
      <!-- SVG icon — use fill="currentColor" or stroke="currentColor" -->
    </span>
    <span class="nav-btn-label">[Label]</span>
  </span>
</button>
```

Active state: add class `active` to the current tab's button. Color is controlled by CSS `color` inheritance — `fill="currentColor"` in the SVG picks it up automatically.

---

### 5. Colour Rules by Zone

| Zone | Background | Text / Icons |
|---|---|---|
| Status bar | transparent (over OCB) | `#231815` dark |
| Order Context Bar (OCB) | `#ffffff` white | `#231815` dark, weight 900 |
| Content area | `#ffffff` white | `#231815` dark |
| START ORDER button | `var(--red)` `#e4002b` | `#ffffff` white, weight 900 |
| Bottom nav | `#000000` black | inactive: `rgba(255,255,255,0.50)` / active: `var(--red)` |

---

### 6. Critical Font Rules

- **Never** set font-weight below 700 for Kentucky Fried Serif — only 700–800 and 900 are loaded.
- **Always** pair `font-style: italic` with any Kentucky Fried Serif declaration (the font is italic-only).
- Set `font-style: italic` on `body` so it propagates everywhere without repetition.
- The `--font-display` and `--font-body` tokens both point to Kentucky Fried Serif — use `var(--font-display)` for display/CTA text and `var(--font-body)` for body/label text.

---

### 7. SVG Icons (Figma source)

All nav icons come from Figma file `OjYQiMuOwg1oy9yMhtRuyE`, node `3397-67662`.

To add a new icon: right-click the individual icon node in Figma → Copy/Paste as → Copy as SVG. This gives coordinates normalised to the node's own bounding box (origin 0,0). Do NOT extract from a parent group — that produces absolute canvas coordinates which render off-screen.

Use `fill="currentColor"` (or `stroke="currentColor"`) on all icon paths so CSS `color` controls active/inactive theming.

---

### 8. Tab Switching Script

Add this before `</body>`:

```html
<script>
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
</script>
```

---

### 9. Checklist When Applying to a New File

- [ ] Four `@font-face` declarations copied, paths start with `fonts/` (no subdirectory)
- [ ] `:root` design tokens in place
- [ ] `body` has `font-family: var(--font-body); font-style: italic`
- [ ] Phone shell HTML structure matches section 3
- [ ] Status bar text is dark (`rgba(35,24,21,0.86)`)
- [ ] OCB has white background, dark text, weight 900 Serif italic
- [ ] Content area has `background: #ffffff; color: #231815`
- [ ] START ORDER: red bg, white text, weight 900
- [ ] Bottom nav: black bg, icon/label colour via `currentColor`
- [ ] Nav labels: weight 700+, font-style italic
- [ ] Tab-switching script included
