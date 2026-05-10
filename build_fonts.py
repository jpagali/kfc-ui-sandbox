"""
Build Kentucky Fried Sans and Kentucky Fried Serif TTF files
by renaming/retweaking existing open-source system fonts.
"""

from fontTools import ttLib
from fontTools.ttLib import TTFont
import copy, os, shutil

OUT = "/sessions/gifted-happy-mayer/mnt/Atlas UI Folder/fonts"
os.makedirs(OUT, exist_ok=True)

# ── Name IDs we care about ──────────────────────────────────────────────────
NAME_FAMILY          = 1
NAME_SUBFAMILY       = 2
NAME_UNIQUE_ID       = 3
NAME_FULL_NAME       = 4
NAME_POSTSCRIPT      = 6
NAME_PREF_FAMILY     = 16   # Typographic family (W3C preferred)
NAME_PREF_SUBFAMILY  = 17   # Typographic subfamily

def set_name(font, nameID, value, platformID=3, platEncID=1, langID=0x0409):
    """Set (or add) a name record for all matching platform entries."""
    nametable = font['name']
    # Remove existing records with this nameID for the given platform
    nametable.removeNames(nameID=nameID, platformID=platformID,
                          platEncID=platEncID, langID=langID)
    nametable.setName(value, nameID, platformID, platEncID, langID)
    # Also set for Mac platform (1, 0, 0)
    nametable.removeNames(nameID=nameID, platformID=1, platEncID=0, langID=0)
    nametable.setName(value, nameID, 1, 0, 0)

def build_font(src_path, family, subfamily, weight_class, is_italic,
               out_filename, postscript_name):
    print(f"  Building {out_filename}...")
    font = TTFont(src_path)

    # ── Name table ────────────────────────────────────────────────────────
    set_name(font, NAME_FAMILY,         family)
    set_name(font, NAME_SUBFAMILY,      subfamily)
    set_name(font, NAME_UNIQUE_ID,      f"{family}-{subfamily.replace(' ','')}")
    set_name(font, NAME_FULL_NAME,      f"{family} {subfamily}")
    set_name(font, NAME_POSTSCRIPT,     postscript_name)
    set_name(font, NAME_PREF_FAMILY,    family)
    set_name(font, NAME_PREF_SUBFAMILY, subfamily)

    # ── OS/2 table ────────────────────────────────────────────────────────
    os2 = font['OS/2']
    os2.usWeightClass = weight_class
    # fsSelection bits: bit 0 = italic, bit 5 = bold, bit 6 = regular
    if is_italic:
        os2.fsSelection |= 0x0001   # set italic
        os2.fsSelection &= ~0x0040  # clear regular
    else:
        os2.fsSelection &= ~0x0001  # clear italic
        if weight_class < 700:
            os2.fsSelection |= 0x0040  # set regular
        else:
            os2.fsSelection &= ~0x0040

    if weight_class >= 700:
        os2.fsSelection |= 0x0020  # set bold
    else:
        os2.fsSelection &= ~0x0020

    # ── head macStyle ─────────────────────────────────────────────────────
    head = font['head']
    if is_italic:
        head.macStyle |= 0x0002
    else:
        head.macStyle &= ~0x0002
    if weight_class >= 700:
        head.macStyle |= 0x0001
    else:
        head.macStyle &= ~0x0001

    # ── post table ────────────────────────────────────────────────────────
    post = font['post']
    if is_italic:
        post.italicAngle = -12.0  # match KFC serif oblique angle

    out_path = os.path.join(OUT, out_filename)
    font.save(out_path)
    size_kb = os.path.getsize(out_path) // 1024
    print(f"    ✓ Saved {out_filename} ({size_kb} KB)")
    return out_path


print("=" * 60)
print("Building Kentucky Fried Sans")
print("=" * 60)

# Regular 400 — base: Lato-Regular
build_font(
    src_path     = "/usr/share/fonts/truetype/lato/Lato-Regular.ttf",
    family       = "Kentucky Fried Sans",
    subfamily    = "Regular",
    weight_class = 400,
    is_italic    = False,
    out_filename = "KentuckyFriedSans-Regular.ttf",
    postscript_name = "KentuckyFriedSans-Regular",
)

# Semibold 600 — base: Lato-Semibold
build_font(
    src_path     = "/usr/share/fonts/truetype/lato/Lato-Semibold.ttf",
    family       = "Kentucky Fried Sans",
    subfamily    = "Semibold",
    weight_class = 600,
    is_italic    = False,
    out_filename = "KentuckyFriedSans-Semibold.ttf",
    postscript_name = "KentuckyFriedSans-Semibold",
)

print()
print("=" * 60)
print("Building Kentucky Fried Serif")
print("=" * 60)

# Extrabold 800 Italic — base: Liberation Serif Bold Italic (closest available heavy serif)
build_font(
    src_path     = "/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf",
    family       = "Kentucky Fried Serif",
    subfamily    = "Extrabold Italic",
    weight_class = 800,
    is_italic    = True,
    out_filename = "KentuckyFriedSerif-ExtraboldItalic.ttf",
    postscript_name = "KentuckyFriedSerif-ExtraboldItalic",
)

# Black 900 Italic — base: Lato-BlackItalic (heavy italic, best available for display weight)
build_font(
    src_path     = "/usr/share/fonts/truetype/lato/Lato-BlackItalic.ttf",
    family       = "Kentucky Fried Serif",
    subfamily    = "Black Italic",
    weight_class = 900,
    is_italic    = True,
    out_filename = "KentuckyFriedSerif-BlackItalic.ttf",
    postscript_name = "KentuckyFriedSerif-BlackItalic",
)

print()
print("All fonts built successfully!")
print(f"Output folder: {OUT}")
print()
print("Files:")
for f in sorted(os.listdir(OUT)):
    if f.endswith('.ttf'):
        size = os.path.getsize(os.path.join(OUT, f)) // 1024
        print(f"  {f}  ({size} KB)")
