# Survey Interface Preview

A clinical-research grade, centered static web application demonstrating interactive online survey features using plain HTML, CSS, and vanilla JavaScript.

Built with **zero external frameworks, zero build steps, and zero backend services**. It works by opening `index.html` directly in any web browser.

---

## 🌟 Demonstrated Features

1. **Searchable Dropdown (Custom ARIA Combobox)**
   - **Features**: Substring filtering across 40 generic options (`Answer A` through `Answer AN`), **bold match text highlighting**, clear `(x)` button, and a `"⚡ Try Auto-Type Demo"` simulation button that types `"Answer C"` automatically.
   - **Accessibility**: Standard ARIA 1.2 combobox attributes, live screen reader announcements (`aria-live`), and keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`, `Tab`, `Home`, `End`).

2. **Automatic Skip Logic (Live Branching Diagram & Auto-Play Shortcuts)**
   - **Shortcut Auto-Play Buttons**:
     - `"▶ Play as Profession A"` (Auto-runs Q2 → Q3 → Q4 → End with 1-second delays).
     - `"⚡ Play as Profession B (Skips Q3)"` (Auto-runs Q2 → Q4 → End with 1-second delays).
   - **Survey Card Widget**: Progress bar indicator, step counter, radio cards, slide animations, **Back**, **Next**, and **Restart** buttons.
   - **Live Flow Diagram**: Connected nodes (`Q2`, `Q3`, `Q4`, `End`) beneath the survey card that illuminate active branching paths in real-time. Visited nodes display checkmarks (`✓`). Selecting Profession B dims Q3 with a `"Skipped"` tag and lights up the bypass path.

3. **Multiple Short Sittings Visualization**
   - **Row 1 ("One Long Sitting")**: Continuous 30-minute bar with a warm orange/red fatigue gradient (`#38bdf8` → `#ef4444`) and fatigue build-up indicators (`⚡ Fresh Start → ⚡ Fatigue Build-up`).
   - **Row 2 ("Six Short Sittings")**: Six equal 5-minute rounded segments separated by pause gap blocks with calendar day markers (`Day 1` ... `Day 6`).
   - **Interactive Completion Slider**: Range slider (`0` to `6`) allowing visitors to simulate completing sittings, updating live percentage (`0%` to `100%`) and segment fill checkmarks (`✓`).
   - **Replay Animation**: Button to re-trigger segment fill sequence.

---

## 🔒 Privacy & Compliance

- **Zero Data Collection**: No user responses are recorded, stored, or transmitted anywhere.
- **No Local Storage / Cookies**: Operates entirely in transient memory.
- **Placeholder Content Only**: Contains strictly generic labels ("Demo question 1", "Profession A", "Answer A", etc.).

---

## 🚀 How to Run Locally

Open `index.html` directly in your browser, or run a lightweight local static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

---

## 🌐 GitHub Pages Deployment

1. Push all files (`index.html`, `style.css`, `script.js`, `README.md`) to your GitHub repository's `main` branch.
2. In GitHub, open repository **Settings** → **Pages**.
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
4. Click **Save**. The live site will be ready in 1–2 minutes!
