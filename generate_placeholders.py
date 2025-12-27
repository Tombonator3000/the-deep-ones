#!/usr/bin/env python3
"""Generate placeholder PNG files for The Deep Ones"""

from PIL import Image, ImageDraw, ImageFont
import os

# Color palettes from GFX-ASSET-LIST.md
PALETTES = {
    'dawn': {
        'sky': [(42, 32, 64), (74, 58, 96), (138, 96, 128), (212, 160, 144), (240, 208, 160)],
        'water': [(58, 80, 96), (42, 64, 80), (26, 48, 64), (10, 32, 48)],
    },
    'day': {
        'sky': [(64, 96, 160), (96, 144, 192), (144, 192, 224), (176, 224, 240), (208, 240, 255)],
        'water': [(64, 128, 160), (48, 112, 160), (32, 96, 160), (16, 80, 160)],
    },
    'dusk': {
        'sky': [(26, 21, 48), (58, 37, 69), (106, 64, 96), (176, 96, 112), (224, 160, 112), (240, 192, 128)],
        'water': [(74, 80, 112), (58, 64, 96), (42, 48, 80), (26, 32, 64)],
    },
    'night': {
        'sky': [(10, 10, 21), (16, 16, 32), (21, 21, 48), (26, 26, 64)],
        'water': [(21, 37, 53), (16, 32, 48), (10, 21, 37), (5, 16, 26)],
    }
}

def create_gradient(width, height, colors, horizontal=False):
    """Create a gradient image from colors"""
    img = Image.new('RGBA', (width, height))
    draw = ImageDraw.Draw(img)

    if len(colors) < 2:
        colors = [colors[0], colors[0]]

    n_colors = len(colors)
    if horizontal:
        step = width / (n_colors - 1) if n_colors > 1 else width
        for x in range(width):
            ratio = x / width
            idx = int(ratio * (n_colors - 1))
            idx = min(idx, n_colors - 2)
            local_ratio = (ratio * (n_colors - 1)) - idx
            r = int(colors[idx][0] * (1 - local_ratio) + colors[idx + 1][0] * local_ratio)
            g = int(colors[idx][1] * (1 - local_ratio) + colors[idx + 1][1] * local_ratio)
            b = int(colors[idx][2] * (1 - local_ratio) + colors[idx + 1][2] * local_ratio)
            draw.line([(x, 0), (x, height)], fill=(r, g, b, 255))
    else:
        for y in range(height):
            ratio = y / height
            idx = int(ratio * (n_colors - 1))
            idx = min(idx, n_colors - 2)
            local_ratio = (ratio * (n_colors - 1)) - idx
            r = int(colors[idx][0] * (1 - local_ratio) + colors[idx + 1][0] * local_ratio)
            g = int(colors[idx][1] * (1 - local_ratio) + colors[idx + 1][1] * local_ratio)
            b = int(colors[idx][2] * (1 - local_ratio) + colors[idx + 1][2] * local_ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    return img

def create_placeholder(width, height, color, label="", alpha=255):
    """Create a simple placeholder with optional label"""
    img = Image.new('RGBA', (width, height), (*color, alpha))
    if label:
        draw = ImageDraw.Draw(img)
        # Draw a simple border
        draw.rectangle([(0, 0), (width-1, height-1)], outline=(255, 255, 255, 100))
        # Try to add text
        try:
            # Center the label
            text_x = width // 2
            text_y = height // 2
            draw.text((text_x, text_y), label[:10], fill=(255, 255, 255, 180), anchor="mm")
        except:
            pass
    return img

def create_stars(width, height):
    """Create a starfield image"""
    import random
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    random.seed(42)  # Consistent stars
    for _ in range(100):
        x = random.randint(0, width-1)
        y = random.randint(0, height-1)
        brightness = random.randint(150, 255)
        size = random.choice([1, 1, 1, 2])
        if size == 1:
            draw.point((x, y), fill=(brightness, brightness, brightness, brightness))
        else:
            draw.ellipse([(x-1, y-1), (x+1, y+1)], fill=(brightness, brightness, brightness, brightness))
    return img

def create_sun(size, color):
    """Create a sun with glow"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = size // 2
    radius = size // 3

    # Outer glow
    for i in range(radius, 0, -2):
        alpha = int(100 * (i / radius))
        draw.ellipse([
            (center - radius - (radius - i), center - radius - (radius - i)),
            (center + radius + (radius - i), center + radius + (radius - i))
        ], fill=(*color, alpha))

    # Core
    draw.ellipse([
        (center - radius, center - radius),
        (center + radius, center + radius)
    ], fill=(*color, 255))

    return img

def create_moon(size):
    """Create a moon"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = size // 2
    radius = size // 2 - 4

    # Moon body
    draw.ellipse([
        (center - radius, center - radius),
        (center + radius, center + radius)
    ], fill=(220, 220, 200, 255))

    # Craters
    import random
    random.seed(1)
    for _ in range(5):
        cx = center + random.randint(-radius//2, radius//2)
        cy = center + random.randint(-radius//2, radius//2)
        cr = random.randint(2, 5)
        draw.ellipse([(cx-cr, cy-cr), (cx+cr, cy+cr)], fill=(180, 180, 170, 255))

    return img

def create_clouds(width, height, color):
    """Create simple clouds"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    import random
    random.seed(3)
    for i in range(4):
        x = random.randint(0, width - 60)
        y = random.randint(10, height - 30)
        # Cloud puffs
        for _ in range(5):
            cx = x + random.randint(0, 50)
            cy = y + random.randint(0, 15)
            rx = random.randint(15, 30)
            ry = random.randint(8, 15)
            alpha = random.randint(150, 200)
            draw.ellipse([(cx-rx, cy-ry), (cx+rx, cy+ry)], fill=(*color, alpha))

    return img

def create_mountains(width, height, color, detail_level=1):
    """Create mountain silhouette"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    import random
    random.seed(7 + detail_level)

    points = [(0, height)]
    num_peaks = 5 + detail_level * 2
    for i in range(num_peaks + 1):
        x = int(i * width / num_peaks)
        y = random.randint(10, height - 20) if i % 2 == 1 else random.randint(height//2, height - 10)
        points.append((x, y))
    points.append((width, height))

    draw.polygon(points, fill=(*color, 255))
    return img

def create_trees(width, height, color):
    """Create tree silhouettes"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    import random
    random.seed(11)

    for i in range(20):
        x = random.randint(0, width)
        tree_height = random.randint(40, height - 10)
        tree_width = random.randint(10, 25)

        # Triangle tree (pine)
        points = [
            (x, height - tree_height),
            (x - tree_width, height),
            (x + tree_width, height)
        ]
        draw.polygon(points, fill=(*color, 255))

    return img

def create_lighthouse(width, height):
    """Create a simple lighthouse"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Base
    base_width = width // 2
    base_height = int(height * 0.8)
    bx = width // 2 - base_width // 2

    # Tower
    draw.polygon([
        (bx + 5, height),
        (bx + base_width - 5, height),
        (bx + base_width - 15, height - base_height),
        (bx + 15, height - base_height)
    ], fill=(200, 200, 190, 255))

    # Stripes
    stripe_height = base_height // 6
    for i in range(3):
        y = height - (i * 2 + 1) * stripe_height
        draw.rectangle([
            (bx + 10, y - stripe_height),
            (bx + base_width - 10, y)
        ], fill=(180, 60, 60, 255))

    # Light room
    light_y = height - base_height - 15
    draw.rectangle([
        (bx + 10, light_y),
        (bx + base_width - 10, light_y + 20)
    ], fill=(255, 255, 200, 255))

    return img

def create_water_surface(width, height):
    """Create animated water surface"""
    # Simple wave pattern
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    import math
    for x in range(width):
        wave_y = int(height / 2 + math.sin(x * 0.05) * 5)
        # Light top
        draw.line([(x, wave_y - 3), (x, wave_y)], fill=(180, 220, 255, 200))
        # Dark body
        draw.line([(x, wave_y), (x, height)], fill=(60, 100, 140, 150))

    return img

def create_seaweed(width, height):
    """Create seaweed"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    import math
    import random
    random.seed(13)

    for i in range(15):
        x = random.randint(0, width)
        h = random.randint(height // 2, height - 10)
        color = (random.randint(20, 60), random.randint(80, 120), random.randint(40, 80))

        # Draw wavy stem
        points = []
        for y in range(height, height - h, -3):
            wave = math.sin((y + i) * 0.1) * 5
            points.append((x + wave, y))

        if len(points) > 1:
            draw.line(points, fill=(*color, 200), width=3)

    return img

def create_fish_placeholder(width, height, color, name):
    """Create a fish placeholder"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Fish body
    body_width = int(width * 0.7)
    body_height = int(height * 0.6)
    cx, cy = width // 2, height // 2

    # Body ellipse
    draw.ellipse([
        (cx - body_width // 2, cy - body_height // 2),
        (cx + body_width // 2, cy + body_height // 2)
    ], fill=(*color, 255))

    # Tail
    tail_points = [
        (cx + body_width // 2 - 5, cy),
        (cx + body_width // 2 + 15, cy - body_height // 2),
        (cx + body_width // 2 + 15, cy + body_height // 2)
    ]
    draw.polygon(tail_points, fill=(*color, 200))

    # Eye
    eye_x = cx - body_width // 4
    eye_r = max(2, body_height // 6)
    draw.ellipse([
        (eye_x - eye_r, cy - eye_r),
        (eye_x + eye_r, cy + eye_r)
    ], fill=(255, 255, 255, 255))
    draw.ellipse([
        (eye_x - eye_r // 2, cy - eye_r // 2),
        (eye_x + eye_r // 2, cy + eye_r // 2)
    ], fill=(0, 0, 0, 255))

    return img

def create_ui_element(width, height, color, border=True):
    """Create UI placeholder"""
    img = Image.new('RGBA', (width, height), (*color, 200))
    draw = ImageDraw.Draw(img)
    if border:
        draw.rectangle([(0, 0), (width-1, height-1)], outline=(255, 255, 255, 255), width=2)
        draw.rectangle([(2, 2), (width-3, height-3)], outline=(100, 100, 100, 255))
    return img

# Asset definitions based on GFX-ASSET-LIST.md
ASSETS = {
    # Dawn backgrounds
    'backgrounds/dawn/sky.png': ('gradient', 1000, 280, 'dawn', 'sky'),
    'backgrounds/dawn/stars.png': ('stars', 1000, 200, None, None),
    'backgrounds/dawn/sun.png': ('sun', 100, 100, (255, 180, 100), None),

    # Day backgrounds
    'backgrounds/day/sky.png': ('gradient', 1000, 280, 'day', 'sky'),
    'backgrounds/day/clouds-far.png': ('clouds', 500, 60, (255, 255, 255), None),
    'backgrounds/day/clouds-near.png': ('clouds', 400, 80, (255, 255, 255), None),
    'backgrounds/day/sun.png': ('sun', 80, 80, (255, 240, 100), None),

    # Dusk backgrounds (sky.png already exists)
    'backgrounds/dusk/stars.png': ('stars', 1000, 200, None, None),
    'backgrounds/dusk/clouds.png': ('clouds', 500, 70, (180, 140, 120), None),
    'backgrounds/dusk/sun.png': ('sun', 120, 120, (220, 100, 60), None),
    'backgrounds/dusk/moon.png': ('moon', 60, 60, None, None),

    # Night backgrounds
    'backgrounds/night/sky.png': ('gradient', 1000, 280, 'night', 'sky'),
    'backgrounds/night/stars.png': ('stars', 1000, 200, None, None),
    'backgrounds/night/moon.png': ('moon', 70, 70, None, None),
    'backgrounds/night/clouds.png': ('clouds', 500, 60, (30, 30, 50), None),

    # Land backgrounds
    'backgrounds/land/mountains-far.png': ('mountains', 500, 100, (26, 21, 37), 1),
    'backgrounds/land/mountains-mid.png': ('mountains', 500, 80, (42, 32, 53), 2),
    'backgrounds/land/mountains-near.png': ('mountains', 500, 60, (58, 48, 69), 3),
    'backgrounds/land/trees-far.png': ('trees', 400, 100, (26, 37, 32)),
    'backgrounds/land/trees-near.png': ('trees', 400, 120, (37, 53, 42)),
    'backgrounds/land/lighthouse.png': ('lighthouse', 80, 120, None),
    'backgrounds/land/reeds.png': ('placeholder', 200, 50, (60, 80, 40), 'reeds'),

    # Water backgrounds
    'backgrounds/water/surface.png': ('water', 2000, 30, None, None),
    'backgrounds/water/reflection.png': ('placeholder', 500, 100, (80, 120, 150), 'reflect'),

    # Underwater backgrounds (gradient.png already exists)
    'backgrounds/underwater/lightrays.png': ('placeholder', 1000, 300, (200, 220, 255), 'rays'),
    'backgrounds/underwater/rocks-far.png': ('placeholder', 500, 80, (40, 50, 60), 'rocks'),
    'backgrounds/underwater/rocks-mid.png': ('placeholder', 500, 100, (50, 60, 70), 'rocks'),
    'backgrounds/underwater/seaweed-far.png': ('seaweed', 1200, 150, None, None),
    'backgrounds/underwater/seaweed-near.png': ('seaweed', 1200, 180, None, None),
    'backgrounds/underwater/particles.png': ('placeholder', 800, 300, (180, 200, 220), 'parts'),
    'backgrounds/underwater/shadows.png': ('placeholder', 600, 100, (10, 15, 25), 'shadow'),

    # Boat sprites (some already exist)
    'sprites/boat/lantern.png': ('placeholder', 64, 24, (255, 200, 100), 'lantrn'),
    'sprites/boat/rod.png': ('placeholder', 64, 64, (139, 90, 43), 'rod'),

    # Fish - Mid
    'sprites/fish/mid/glass-squid.png': ('fish', 240, 32, (150, 180, 200), 'squid'),
    'sprites/fish/mid/bone-angler.png': ('fish', 176, 28, (200, 190, 180), 'angler'),
    'sprites/fish/mid/mimic.png': ('fish', 192, 24, (120, 140, 100), 'mimic'),
    'sprites/fish/mid/prophet-fish.png': ('fish', 144, 24, (100, 80, 160), 'propht'),

    # Fish - Deep
    'sprites/fish/deep/congregation.png': ('fish', 224, 32, (100, 80, 80), 'congr'),
    'sprites/fish/deep/listener.png': ('fish', 208, 28, (80, 70, 90), 'listen'),
    'sprites/fish/deep/drowned-friend.png': ('fish', 192, 36, (70, 80, 70), 'drownd'),
    'sprites/fish/deep/memory-leech.png': ('fish', 160, 20, (100, 50, 80), 'leech'),

    # Fish - Abyss
    'sprites/fish/abyss/dagon-fingerling.png': ('fish', 256, 40, (40, 60, 50), 'dagon'),
    'sprites/fish/abyss/dreaming-one.png': ('fish', 288, 48, (30, 40, 50), 'dream'),
    'sprites/fish/abyss/hydra-tear.png': ('fish', 480, 56, (50, 30, 60), 'hydra'),
    'sprites/fish/abyss/unnamed.png': ('fish', 384, 64, (20, 20, 30), '???'),

    # UI
    'sprites/ui/catch-popup.png': ('ui', 350, 160, (60, 50, 40)),
    'sprites/ui/journal-bg.png': ('ui', 300, 400, (80, 70, 50)),
    'sprites/ui/sanity-bar.png': ('ui', 120, 20, (40, 60, 50)),
    'sprites/ui/depth-meter.png': ('ui', 30, 300, (30, 40, 60)),
    'sprites/ui/coin.png': ('placeholder', 16, 16, (255, 200, 50), 'coin'),

    # Effects
    'sprites/effects/bubbles.png': ('placeholder', 64, 16, (180, 220, 255), 'bubbl'),
    'sprites/effects/splash.png': ('placeholder', 48, 24, (200, 230, 255), 'splsh'),
    'sprites/effects/glow.png': ('placeholder', 32, 32, (150, 255, 180), 'glow'),
    'sprites/effects/tentacle.png': ('placeholder', 80, 200, (60, 40, 80), 'tntcl'),
}

def main():
    base_path = '/home/user/the-deep-ones'
    created = 0
    skipped = 0

    for path, spec in ASSETS.items():
        full_path = os.path.join(base_path, path)

        # Skip if already exists
        if os.path.exists(full_path):
            print(f"SKIP: {path}")
            skipped += 1
            continue

        asset_type = spec[0]
        width, height = spec[1], spec[2]
        param1 = spec[3] if len(spec) > 3 else None
        param2 = spec[4] if len(spec) > 4 else None

        if asset_type == 'gradient':
            colors = PALETTES[param1][param2]
            img = create_gradient(width, height, colors)
        elif asset_type == 'stars':
            img = create_stars(width, height)
        elif asset_type == 'sun':
            img = create_sun(width, param1)
        elif asset_type == 'moon':
            img = create_moon(width)
        elif asset_type == 'clouds':
            img = create_clouds(width, height, param1)
        elif asset_type == 'mountains':
            img = create_mountains(width, height, param1, param2 if param2 else 1)
        elif asset_type == 'trees':
            img = create_trees(width, height, param1)
        elif asset_type == 'lighthouse':
            img = create_lighthouse(width, height)
        elif asset_type == 'water':
            img = create_water_surface(width, height)
        elif asset_type == 'seaweed':
            img = create_seaweed(width, height)
        elif asset_type == 'fish':
            img = create_fish_placeholder(width, height, param1, param2)
        elif asset_type == 'ui':
            img = create_ui_element(width, height, param1)
        elif asset_type == 'placeholder':
            img = create_placeholder(width, height, param1, param2 if param2 else "", 200)
        else:
            print(f"Unknown type: {asset_type}")
            continue

        # Save
        img.save(full_path, 'PNG')
        print(f"CREATE: {path}")
        created += 1

    print(f"\nDone! Created: {created}, Skipped: {skipped}")

if __name__ == '__main__':
    main()
