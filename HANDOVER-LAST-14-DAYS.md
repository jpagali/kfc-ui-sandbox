# Atlas UI Folder — 14-Day Handover Prompt

Last updated: 2026-04-19

## Context

This workspace does not currently expose Git history, so this handover is reconstructed from file modification dates, nearby backup files, and the current contents of the prototypes.

Files changed within the last 14 days:

- `search-screen.html` — modified 2026-04-16 17:08
- `ProductImages Done.html` — modified 2026-04-17 14:01
- `rna-sneak-peek-prototype.html` — modified 2026-04-18 09:11

Use the following prompt when continuing work on this folder from another machine or another model.

---

## Handover Prompt

You are continuing work in `/Users/justinpagalilauan/Desktop/Atlas UI Folder`.

This is a prototype-heavy KFC / Atlas UI workspace built mostly as standalone HTML files rather than a tracked app repo. There is no accessible `.git` history in the current folder, so treat the file timestamps and backup variants as the source of truth for recent work.

### What changed in the last 14 days

1. On April 16, 2026, a standalone menu search prototype was created/refined in `search-screen.html`.
   Focus:
   - Clean native-feeling mobile search shell
   - White UI, light frame, minimal chrome
   - Dedicated search nav, active input state, helper copy, and suggestion rows
   - Kentucky Fried Sans styling in a flatter, app-like visual language

2. On April 17, 2026, `ProductImages Done.html` was saved as a major RNA prototype checkpoint.
   Treat this as a snapshot milestone, not necessarily a separate product-images-only tool.
   It appears to preserve an earlier version of the broader RNA experience before the next day’s menu IA/search refactor.
   Focus areas visible in this checkpoint:
   - Full phone-shell prototype structure
   - Auth, home, rewards, pickup, delivery, menu, PDP, checkout, and post-order flows
   - Existing KFC typography and visual system
   - Menu/category architecture that was later replaced or reorganized

3. On April 18, 2026, `rna-sneak-peek-prototype.html` was substantially updated from the prior checkpoint and from the older `rna-sneak-peek-prototype.pending-postorder-pending-integration.html`.
   The most important changes appear to be:
   - Font pipeline moved toward WOFF/WOFF2 assets and added `font-display: swap`
   - Added `Kentucky Fried Stripes`
   - Added safer top offset handling with `--status-safe-offset`
   - Improved scrolling/performance behavior on screens/cards
   - Reworked menu architecture:
     - introduced a new `menu-landing` screen
     - introduced an overlay-style `menu-search` screen
     - changed menu screen spacing/chrome behavior
     - connected search results to PDP opening
   - Refined typography weights across headings and UI labels
   - Kept the larger RNA prototype intact while layering in the new landing/search flow

### Important working assumptions

- `rna-sneak-peek-prototype.html` is the current primary prototype.
- `ProductImages Done.html` is a recent checkpoint worth preserving for comparison.
- `rna-sneak-peek-prototype.pending-postorder-pending-integration.html` is an older backup that helps explain what changed before April 18.
- `search-screen.html` is a focused exploration that likely informed the integrated menu-search work in the main RNA prototype.

### What to do next

When continuing this project:

1. Treat `rna-sneak-peek-prototype.html` as the source file to evolve unless explicitly asked to branch from a checkpoint.
2. Preserve `ProductImages Done.html` and the `.pending-...` backup as historical snapshots.
3. If editing menu discovery flows, keep the current architecture consistent:
   - `menu-landing` for top-level category entry
   - `menu-search` for dedicated search overlay
   - PDP should still open correctly from search results
4. Keep the KFC visual language:
   - strong hero typography
   - white content surfaces
   - red CTA emphasis
   - Kentucky Fried brand fonts where assets are available
5. Before large edits, compare against both:
   - `ProductImages Done.html`
   - `rna-sneak-peek-prototype.pending-postorder-pending-integration.html`
   so we do not accidentally remove flow coverage that already exists in the main prototype.

### If you need a quick summary of recent evolution

- April 16: standalone search concept
- April 17: broad RNA checkpoint save
- April 18: main prototype refactor integrating stronger menu landing + search behavior and font/runtime cleanup

### Constraints

- This workspace behaves like a design sandbox, not a compiled app
- Most files are standalone HTML prototypes
- Prefer preserving working snapshots over destructive cleanup
- If you create new major variants, save them as explicit sibling files instead of overwriting checkpoints blindly

---

## Migration Notes For Moving From Old Mac To New Mac

- Copy the entire folder, not just the newest HTML file. The backups and font assets matter.
- Preserve this exact folder structure, especially `fonts/`, because the prototypes reference local font files by relative path.
- Verify these files after transfer:
  - `rna-sneak-peek-prototype.html`
  - `ProductImages Done.html`
  - `search-screen.html`
  - `HANDOVER.md`
  - `HANDOVER-LAST-14-DAYS.md`
  - `fonts/`
- If fonts fail on the new Mac, check whether the folder names changed. Some files reference flat `fonts/...ttf` paths and others reference nested `fonts/Kentucky Fried Sans/WOFF/...` paths.
- If you want a safer long-term setup, put this workspace in a real Git repo on the new Mac so future handovers come from commit history instead of file timestamps.
- Before retiring the old Mac, make one cold archive too:
  - zip the whole folder
  - store it in iCloud Drive, Dropbox, or an external SSD
  - keep the original folder untouched until you confirm the new machine opens the prototypes correctly
