# Rollback: Rewards Prototype Changes

## Purpose
Use this rollback if we need to return the prototype to the state before the Rewards / Members Hub work started.

This rollback covers the changes made in this thread to:
- `rna-sneak-peek-prototype.html`
- `prototype-sw.js`
- `.gitignore` only for tracking this rollback file

Do not run these steps if either file has newer unrelated edits that should be preserved.

## Current Change Set
This Rewards build adds:
- Signed-in default prototype state for `Justin P`.
- Rewards bottom-nav landing directly into the Members Hub.
- New-account rewards welcome flow retained only for onboarding/auth.
- Rewards opt-in state, catalog state, reward coupon linkage, and checkout coupon removal/refund handling.
- Members Hub layout aligned to the Figma guardrails: `My Rewards`, `Offers`, boost cards, challenge cards, top picks, education card, and quick links.
- Production-level KFC visual treatment using the existing prototype color system and static product imagery.
- Service worker cache bump so GitHub Pages and local preview pick up the new prototype.

Pre-change baseline commit before this Rewards work:

```text
bae7dbc Sync home carousel pills
```

## Fast Local Rollback Before Commit
If these changes have not been committed yet, run:

```bash
cd "/Users/justinpagalilauan/Desktop/Atlas UI Folder"
git restore -- rna-sneak-peek-prototype.html prototype-sw.js .gitignore
```

Then refresh the in-app browser with a fresh URL:

```text
http://127.0.0.1:4173/rna-sneak-peek-prototype.html?fresh=rollback
```

## Rollback After GitHub Pages Deployment
If the Rewards work has already been committed and deployed, create a revert commit:

```bash
cd "/Users/justinpagalilauan/Desktop/Atlas UI Folder"
git pull --ff-only origin main
git log --oneline --grep="Rewards Members Hub"
git revert <rewards_members_hub_commit_sha>
git push origin main
```

GitHub Pages will redeploy automatically from `main`.

If you want to restore the exact pre-change files from the baseline instead of reverting the whole commit:

```bash
cd "/Users/justinpagalilauan/Desktop/Atlas UI Folder"
git restore --source bae7dbc -- rna-sneak-peek-prototype.html prototype-sw.js .gitignore
git add rna-sneak-peek-prototype.html prototype-sw.js .gitignore
git commit -m "Rollback rewards members hub prototype"
git push origin main
```

## Safer Rollback With Backup
If you want to keep a backup of the current Rewards work before reverting:

```bash
cd "/Users/justinpagalilauan/Desktop/Atlas UI Folder"
git diff -- rna-sneak-peek-prototype.html prototype-sw.js .gitignore ROLLBACK-rewards-prototype-changes.md > rewards-work-backup.patch
git restore -- rna-sneak-peek-prototype.html prototype-sw.js .gitignore ROLLBACK-rewards-prototype-changes.md
```

To re-apply the work later:

```bash
cd "/Users/justinpagalilauan/Desktop/Atlas UI Folder"
git apply rewards-work-backup.patch
```

## What This Reverts
This returns the prototype to the pre-change behavior by removing:
- Rewards opt-in state and welcome flow.
- Rewards catalog and redemption logic.
- Rewards tab routing to the new Rewards screen.
- Checkout coupon fixes added during the Rewards integration work.
- Default signed-in launch state for Justin P.
- Rewards/Members Hub viewport, imagery, and styling changes.
- Service worker cache bumps made to force preview refreshes.
- `.gitignore` exception that tracks this rollback file.

## Expected Original Behavior After Rollback
- Prototype launches as signed out / guest.
- Rewards tab no longer opens the new Rewards experience.
- Auth flow returns to the original sign-in behavior.
- Cart and checkout return to the original coupon implementation.
- `prototype-sw.js` cache name returns to the original tracked version.

## Verification
After rollback, run:

```bash
cd "/Users/justinpagalilauan/Desktop/Atlas UI Folder"
node - <<'NODE'
const fs = require('fs');
const html = fs.readFileSync('rna-sneak-peek-prototype.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(Boolean);
scripts.forEach((script) => new Function(script));
console.log('JS parse ok');
NODE
git diff --check -- rna-sneak-peek-prototype.html prototype-sw.js
```

If the local preview is not running:

```bash
cd "/Users/justinpagalilauan/Desktop/Atlas UI Folder"
python3 -m http.server 4173
```
