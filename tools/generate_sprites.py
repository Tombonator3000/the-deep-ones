#!/usr/bin/env python3
"""
16-bit Pixel Art Sprite Generator for The Deep Ones
Generates authentic retro-style sprites for the game
"""

from PIL import Image, ImageDraw
import os

# Base path for sprites
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 16-bit color palette (inspired by SNES/Genesis palettes)
PALETTE = {
    # Water/Ocean
    'water_light': (100, 149, 237),
    'water_mid': (65, 105, 225),
    'water_dark': (25, 25, 112),
    'water_deep': (10, 10, 50),

    # Wood/Boat
    'wood_light': (205, 133, 63),
    'wood_mid': (139, 90, 43),
    'wood_dark': (101, 67, 33),
    'wood_accent': (160, 82, 45),

    # Flesh/Human
    'skin_light': (255, 218, 185),
    'skin_mid': (222, 184, 135),
    'skin_dark': (205, 133, 63),

    # Clothing
    'cloth_yellow': (255, 215, 0),
    'cloth_orange': (255, 140, 0),
    'cloth_blue': (70, 130, 180),
    'cloth_dark': (47, 79, 79),

    # Fish colors
    'fish_silver': (192, 192, 192),
    'fish_gray': (128, 128, 128),
    'fish_blue': (100, 149, 237),
    'fish_green': (46, 139, 87),
    'fish_purple': (138, 43, 226),
    'fish_red': (178, 34, 34),
    'fish_pale': (230, 230, 250),
    'fish_dark': (47, 79, 79),
    'fish_glow': (173, 216, 230),
    'fish_eldritch': (75, 0, 130),

    # Effects
    'glow_yellow': (255, 255, 150),
    'glow_orange': (255, 200, 100),
    'white': (255, 255, 255),
    'black': (0, 0, 0),
    'transparent': (0, 0, 0, 0),

    # Dog
    'fur_light': (210, 180, 140),
    'fur_dark': (139, 90, 43),
    'nose': (50, 30, 20),
}


def create_boat_sprite():
    """Create a 90x50 fishing boat sprite"""
    img = Image.new('RGBA', (90, 50), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Hull - main body
    hull_points = [(5, 35), (15, 45), (75, 45), (85, 35), (80, 25), (10, 25)]
    draw.polygon(hull_points, fill=PALETTE['wood_mid'])

    # Hull details - planks
    for y in [28, 32, 36, 40]:
        draw.line([(12, y), (78, y)], fill=PALETTE['wood_dark'], width=1)

    # Hull highlight
    draw.line([(15, 26), (75, 26)], fill=PALETTE['wood_light'], width=1)

    # Cabin/shelter
    draw.rectangle([25, 12, 55, 25], fill=PALETTE['wood_dark'])
    draw.rectangle([27, 14, 53, 23], fill=PALETTE['wood_mid'])

    # Cabin roof
    draw.polygon([(23, 12), (40, 5), (57, 12)], fill=PALETTE['wood_dark'])
    draw.line([(23, 12), (40, 5), (57, 12)], fill=PALETTE['wood_light'], width=1)

    # Window
    draw.rectangle([35, 16, 45, 21], fill=PALETTE['water_light'])
    draw.rectangle([36, 17, 44, 20], fill=PALETTE['water_mid'])

    # Mast
    draw.rectangle([62, 5, 64, 25], fill=PALETTE['wood_dark'])

    # Small flag
    draw.polygon([(64, 5), (75, 8), (64, 11)], fill=PALETTE['cloth_orange'])

    # Railing
    draw.line([(10, 24), (23, 24)], fill=PALETTE['wood_light'], width=1)
    draw.line([(57, 24), (80, 24)], fill=PALETTE['wood_light'], width=1)

    # Railing posts
    for x in [12, 18, 60, 70, 78]:
        draw.line([(x, 22), (x, 25)], fill=PALETTE['wood_dark'], width=1)

    return img


def create_fisher_sprite():
    """Create a 32x48 fisherman sprite"""
    img = Image.new('RGBA', (32, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Boots
    draw.rectangle([10, 42, 14, 47], fill=PALETTE['cloth_dark'])
    draw.rectangle([17, 42, 21, 47], fill=PALETTE['cloth_dark'])

    # Legs (overalls)
    draw.rectangle([11, 30, 14, 42], fill=PALETTE['cloth_blue'])
    draw.rectangle([17, 30, 20, 42], fill=PALETTE['cloth_blue'])

    # Body (yellow rain jacket)
    draw.rectangle([9, 18, 22, 32], fill=PALETTE['cloth_yellow'])
    draw.line([(15, 18), (15, 32)], fill=PALETTE['cloth_orange'], width=1)  # buttons

    # Arms
    draw.rectangle([5, 20, 9, 30], fill=PALETTE['cloth_yellow'])
    draw.rectangle([22, 20, 26, 30], fill=PALETTE['cloth_yellow'])

    # Hands
    draw.rectangle([5, 30, 8, 33], fill=PALETTE['skin_mid'])
    draw.rectangle([23, 30, 26, 33], fill=PALETTE['skin_mid'])

    # Head
    draw.ellipse([11, 6, 20, 18], fill=PALETTE['skin_mid'])

    # Rain hat (sou'wester)
    draw.ellipse([8, 3, 23, 10], fill=PALETTE['cloth_yellow'])
    draw.arc([6, 6, 25, 14], 0, 180, fill=PALETTE['cloth_orange'], width=2)

    # Face details
    draw.point((13, 11), fill=PALETTE['black'])  # eye
    draw.point((17, 11), fill=PALETTE['black'])  # eye
    draw.line([(14, 14), (17, 14)], fill=PALETTE['skin_dark'], width=1)  # mouth

    # Beard
    draw.rectangle([12, 15, 19, 18], fill=PALETTE['fur_dark'])

    return img


def create_dog_sprite():
    """Create a 96x20 dog sprite sheet (4 frames of 24x20)"""
    img = Image.new('RGBA', (96, 20), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    for frame in range(4):
        x_offset = frame * 24

        # Body
        draw.ellipse([x_offset + 6, 8, x_offset + 18, 16], fill=PALETTE['fur_light'])

        # Head
        draw.ellipse([x_offset + 14, 5, x_offset + 22, 13], fill=PALETTE['fur_light'])

        # Ears
        draw.polygon([
            (x_offset + 15, 5), (x_offset + 17, 2), (x_offset + 18, 6)
        ], fill=PALETTE['fur_dark'])
        draw.polygon([
            (x_offset + 19, 5), (x_offset + 21, 2), (x_offset + 22, 6)
        ], fill=PALETTE['fur_dark'])

        # Snout
        draw.ellipse([x_offset + 19, 8, x_offset + 23, 12], fill=PALETTE['fur_light'])
        draw.point((x_offset + 21, 9), fill=PALETTE['nose'])  # nose

        # Eye
        draw.point((x_offset + 17, 8), fill=PALETTE['black'])

        # Tail - animated
        tail_y = 6 if frame % 2 == 0 else 8
        draw.polygon([
            (x_offset + 4, 10), (x_offset + 2, tail_y), (x_offset + 6, 10)
        ], fill=PALETTE['fur_dark'])

        # Legs - animated walk cycle
        if frame == 0:
            draw.rectangle([x_offset + 8, 14, x_offset + 10, 19], fill=PALETTE['fur_dark'])
            draw.rectangle([x_offset + 14, 14, x_offset + 16, 19], fill=PALETTE['fur_dark'])
        elif frame == 1:
            draw.rectangle([x_offset + 7, 14, x_offset + 9, 19], fill=PALETTE['fur_dark'])
            draw.rectangle([x_offset + 15, 14, x_offset + 17, 19], fill=PALETTE['fur_dark'])
        elif frame == 2:
            draw.rectangle([x_offset + 9, 14, x_offset + 11, 19], fill=PALETTE['fur_dark'])
            draw.rectangle([x_offset + 13, 14, x_offset + 15, 19], fill=PALETTE['fur_dark'])
        else:
            draw.rectangle([x_offset + 8, 14, x_offset + 10, 19], fill=PALETTE['fur_dark'])
            draw.rectangle([x_offset + 14, 14, x_offset + 16, 19], fill=PALETTE['fur_dark'])

    return img


def create_lantern_sprite():
    """Create a 64x24 lantern sprite sheet (4 frames of 16x24)"""
    img = Image.new('RGBA', (64, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    for frame in range(4):
        x_offset = frame * 16

        # Hook
        draw.line([(x_offset + 8, 0), (x_offset + 8, 4)], fill=PALETTE['black'], width=1)

        # Top cap
        draw.rectangle([x_offset + 5, 4, x_offset + 11, 6], fill=PALETTE['black'])

        # Glass body
        draw.rectangle([x_offset + 4, 6, x_offset + 12, 18], fill=PALETTE['glow_yellow'])

        # Flame glow - varies per frame
        glow_colors = [
            PALETTE['glow_orange'],
            PALETTE['glow_yellow'],
            PALETTE['glow_orange'],
            PALETTE['white']
        ]
        draw.ellipse([x_offset + 6, 8 + (frame % 2), x_offset + 10, 14 + (frame % 2)],
                    fill=glow_colors[frame])

        # Frame lines
        draw.line([(x_offset + 4, 6), (x_offset + 4, 18)], fill=PALETTE['black'], width=1)
        draw.line([(x_offset + 12, 6), (x_offset + 12, 18)], fill=PALETTE['black'], width=1)

        # Bottom
        draw.rectangle([x_offset + 5, 18, x_offset + 11, 20], fill=PALETTE['black'])

        # Handle ring
        draw.arc([x_offset + 6, 20, x_offset + 10, 23], 0, 180, fill=PALETTE['black'], width=1)

    return img


def create_rod_sprite():
    """Create a 64x64 fishing rod sprite"""
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rod handle
    draw.rectangle([0, 58, 8, 63], fill=PALETTE['wood_dark'])
    draw.rectangle([2, 59, 6, 62], fill=PALETTE['wood_light'])

    # Reel
    draw.ellipse([6, 54, 14, 62], fill=PALETTE['fish_gray'])
    draw.ellipse([8, 56, 12, 60], fill=PALETTE['fish_silver'])

    # Rod body - curves up
    for i in range(50):
        x = 8 + i
        y = 58 - i - (i * i) // 100
        thickness = max(1, 4 - i // 15)
        draw.ellipse([x-thickness//2, y-thickness//2, x+thickness//2, y+thickness//2],
                    fill=PALETTE['wood_mid'])

    # Rod tip
    draw.line([(55, 10), (58, 5)], fill=PALETTE['wood_dark'], width=1)

    # Line guides (rings along rod)
    for i, pos in enumerate([(15, 50), (25, 40), (38, 25), (50, 12)]):
        draw.ellipse([pos[0]-1, pos[1]-1, pos[0]+1, pos[1]+1], fill=PALETTE['fish_silver'])

    return img


def create_bobber_sprite():
    """Create a 12x16 bobber/float sprite"""
    img = Image.new('RGBA', (12, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Stick top
    draw.rectangle([5, 0, 6, 4], fill=PALETTE['wood_dark'])

    # Red top half
    draw.ellipse([2, 3, 9, 10], fill=PALETTE['fish_red'])

    # White bottom half
    draw.ellipse([2, 8, 9, 15], fill=PALETTE['white'])

    # Highlight
    draw.point((4, 5), fill=PALETTE['white'])

    return img


def create_fish_sprite(name, width, height, frames, colors):
    """Create a fish sprite sheet with animation frames"""
    img = Image.new('RGBA', (width * frames, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    main_color = colors.get('main', PALETTE['fish_silver'])
    dark_color = colors.get('dark', PALETTE['fish_gray'])
    accent_color = colors.get('accent', PALETTE['fish_blue'])
    eye_color = colors.get('eye', PALETTE['black'])

    for frame in range(frames):
        x_offset = frame * width

        # Body dimensions
        body_left = x_offset + width // 6
        body_right = x_offset + width - width // 4
        body_top = height // 4
        body_bottom = height - height // 4

        # Tail - animated
        tail_wave = (frame % 3 - 1) * 2
        tail_points = [
            (x_offset + 2, height // 2 + tail_wave),
            (body_left, body_top + 2),
            (body_left, body_bottom - 2),
        ]
        draw.polygon(tail_points, fill=dark_color)

        # Main body
        draw.ellipse([body_left, body_top, body_right, body_bottom], fill=main_color)

        # Belly (lighter)
        belly_top = height // 2
        draw.ellipse([body_left + 2, belly_top, body_right - 4, body_bottom - 1],
                    fill=colors.get('belly', PALETTE['fish_pale']))

        # Dorsal fin
        fin_wave = (frame % 2) * 2
        fin_points = [
            (body_left + width // 4, body_top),
            (body_left + width // 3, body_top - height // 4 + fin_wave),
            (body_right - width // 4, body_top),
        ]
        draw.polygon(fin_points, fill=accent_color)

        # Eye
        eye_x = body_right - width // 6
        eye_y = height // 2 - height // 8
        draw.ellipse([eye_x - 2, eye_y - 2, eye_x + 2, eye_y + 2], fill=PALETTE['white'])
        draw.point((eye_x, eye_y), fill=eye_color)

        # Mouth
        draw.arc([body_right - 4, height // 2 - 2, body_right, height // 2 + 2],
                270, 90, fill=dark_color, width=1)

        # Scales pattern (for larger fish)
        if width > 40:
            for sx in range(body_left + 5, body_right - 10, 6):
                for sy in range(body_top + 4, body_bottom - 4, 5):
                    draw.arc([sx, sy, sx + 4, sy + 4], 0, 180, fill=dark_color, width=1)

    return img


def create_eldritch_fish(name, width, height, frames, colors):
    """Create creepy eldritch fish for deep/abyss zones"""
    img = Image.new('RGBA', (width * frames, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    main_color = colors.get('main', PALETTE['fish_eldritch'])
    glow_color = colors.get('glow', PALETTE['fish_glow'])
    dark_color = colors.get('dark', PALETTE['fish_dark'])

    for frame in range(frames):
        x_offset = frame * width
        center_x = x_offset + width // 2
        center_y = height // 2

        # Tentacles/appendages for abyss fish
        if colors.get('tentacles', False):
            for i in range(5):
                angle_offset = (frame * 10 + i * 30) % 360
                t_len = height // 3 + (frame % 2) * 3
                draw.line([
                    (x_offset + width // 4, center_y + height // 4),
                    (x_offset + width // 4 - 5 + i * 3, center_y + t_len)
                ], fill=dark_color, width=2)

        # Main body - more organic/weird shapes
        body_points = []
        for i in range(8):
            angle = i * 45
            wobble = (frame + i) % 3 - 1
            radius_x = width // 3 + wobble
            radius_y = height // 3 + wobble
            import math
            px = center_x + int(radius_x * math.cos(math.radians(angle)))
            py = center_y + int(radius_y * math.sin(math.radians(angle)))
            body_points.append((px, py))
        draw.polygon(body_points, fill=main_color)

        # Bioluminescent glow spots
        for i in range(3):
            glow_x = center_x - width // 6 + i * (width // 6)
            glow_y = center_y + (frame + i) % 3 - 1
            glow_size = 2 + (frame + i) % 2
            draw.ellipse([glow_x - glow_size, glow_y - glow_size,
                         glow_x + glow_size, glow_y + glow_size], fill=glow_color)

        # Multiple eyes (creepy)
        num_eyes = colors.get('eyes', 1)
        for i in range(num_eyes):
            eye_x = center_x + width // 6 + (i % 2) * 4
            eye_y = center_y - height // 6 + (i // 2) * 4
            draw.ellipse([eye_x - 3, eye_y - 3, eye_x + 3, eye_y + 3], fill=PALETTE['white'])
            draw.ellipse([eye_x - 1, eye_y - 1, eye_x + 1, eye_y + 1], fill=PALETTE['fish_red'])

        # Angler light for certain fish
        if colors.get('angler', False):
            lure_x = x_offset + width - 10
            lure_y = height // 4 + (frame % 2) * 2
            draw.line([(center_x + width // 4, center_y - height // 4),
                      (lure_x, lure_y)], fill=dark_color, width=1)
            glow_size = 3 + frame % 2
            draw.ellipse([lure_x - glow_size, lure_y - glow_size,
                         lure_x + glow_size, lure_y + glow_size], fill=glow_color)

    return img


# Fish definitions
FISH_DEFS = {
    # Surface fish
    'harbor-cod': {
        'path': 'sprites/fish/surface/harbor-cod.png',
        'size': (32, 16), 'frames': 4,
        'colors': {'main': PALETTE['fish_gray'], 'dark': PALETTE['fish_dark'],
                  'accent': PALETTE['fish_silver'], 'belly': PALETTE['fish_pale']}
    },
    'pale-flounder': {
        'path': 'sprites/fish/surface/pale-flounder.png',
        'size': (36, 20), 'frames': 4,
        'colors': {'main': PALETTE['fish_pale'], 'dark': PALETTE['fish_gray'],
                  'accent': PALETTE['skin_mid'], 'belly': PALETTE['white']}
    },
    'whisper-eel': {
        'path': 'sprites/fish/surface/whisper-eel.png',
        'size': (48, 12), 'frames': 6,
        'colors': {'main': PALETTE['fish_dark'], 'dark': PALETTE['black'],
                  'accent': PALETTE['fish_blue'], 'belly': PALETTE['fish_gray']}
    },
    'midnight-perch': {
        'path': 'sprites/fish/surface/midnight-perch.png',
        'size': (28, 18), 'frames': 4,
        'colors': {'main': PALETTE['water_dark'], 'dark': PALETTE['black'],
                  'accent': PALETTE['fish_purple'], 'belly': PALETTE['water_mid']}
    },

    # Mid fish
    'glass-squid': {
        'path': 'sprites/fish/mid/glass-squid.png',
        'size': (40, 32), 'frames': 6,
        'colors': {'main': (200, 200, 255, 180), 'dark': PALETTE['fish_blue'],
                  'accent': PALETTE['fish_glow'], 'belly': (230, 230, 255, 150)},
        'eldritch': True, 'tentacles': True
    },
    'bone-angler': {
        'path': 'sprites/fish/mid/bone-angler.png',
        'size': (44, 28), 'frames': 4,
        'colors': {'main': PALETTE['fish_pale'], 'dark': PALETTE['fish_gray'],
                  'accent': PALETTE['fish_glow'], 'angler': True},
        'eldritch': True
    },
    'mimic': {
        'path': 'sprites/fish/mid/mimic.png',
        'size': (48, 24), 'frames': 4,
        'colors': {'main': PALETTE['wood_mid'], 'dark': PALETTE['wood_dark'],
                  'accent': PALETTE['fish_red'], 'belly': PALETTE['wood_light'], 'eyes': 3},
        'eldritch': True
    },
    'prophet-fish': {
        'path': 'sprites/fish/mid/prophet-fish.png',
        'size': (36, 24), 'frames': 6,
        'colors': {'main': PALETTE['fish_purple'], 'dark': PALETTE['fish_eldritch'],
                  'accent': PALETTE['fish_glow'], 'belly': PALETTE['fish_pale'], 'eyes': 2},
        'eldritch': True
    },

    # Deep fish
    'congregation': {
        'path': 'sprites/fish/deep/congregation.png',
        'size': (56, 32), 'frames': 4,
        'colors': {'main': PALETTE['fish_dark'], 'dark': PALETTE['black'],
                  'glow': PALETTE['fish_glow'], 'eyes': 5, 'tentacles': True},
        'eldritch': True
    },
    'listener': {
        'path': 'sprites/fish/deep/listener.png',
        'size': (52, 28), 'frames': 4,
        'colors': {'main': PALETTE['fish_eldritch'], 'dark': PALETTE['black'],
                  'glow': (255, 200, 200), 'eyes': 1},
        'eldritch': True
    },
    'drowned-friend': {
        'path': 'sprites/fish/deep/drowned-friend.png',
        'size': (48, 36), 'frames': 4,
        'colors': {'main': PALETTE['skin_dark'], 'dark': PALETTE['fish_dark'],
                  'glow': PALETTE['fish_pale'], 'eyes': 2, 'tentacles': True},
        'eldritch': True
    },
    'memory-leech': {
        'path': 'sprites/fish/deep/memory-leech.png',
        'size': (40, 20), 'frames': 6,
        'colors': {'main': PALETTE['fish_red'], 'dark': (100, 0, 0),
                  'glow': PALETTE['fish_glow'], 'eyes': 4},
        'eldritch': True
    },

    # Abyss fish
    'dagon-fingerling': {
        'path': 'sprites/fish/abyss/dagon-fingerling.png',
        'size': (64, 40), 'frames': 4,
        'colors': {'main': PALETTE['fish_eldritch'], 'dark': PALETTE['black'],
                  'glow': (100, 255, 100), 'eyes': 3, 'tentacles': True},
        'eldritch': True
    },
    'dreaming-one': {
        'path': 'sprites/fish/abyss/dreaming-one.png',
        'size': (72, 48), 'frames': 4,
        'colors': {'main': (50, 0, 80), 'dark': PALETTE['black'],
                  'glow': PALETTE['fish_purple'], 'eyes': 1, 'tentacles': True},
        'eldritch': True
    },
    'hydra-tear': {
        'path': 'sprites/fish/abyss/hydra-tear.png',
        'size': (80, 56), 'frames': 6,
        'colors': {'main': PALETTE['water_deep'], 'dark': PALETTE['black'],
                  'glow': (200, 255, 255), 'eyes': 6, 'tentacles': True},
        'eldritch': True
    },
    'unnamed': {
        'path': 'sprites/fish/abyss/unnamed.png',
        'size': (96, 64), 'frames': 4,
        'colors': {'main': PALETTE['black'], 'dark': (10, 0, 10),
                  'glow': (255, 100, 100), 'eyes': 7, 'tentacles': True, 'angler': True},
        'eldritch': True
    },
}


def main():
    print("Generating 16-bit pixel art sprites for The Deep Ones...")

    # Create boat sprites
    print("Creating boat sprite...")
    boat = create_boat_sprite()
    boat.save(os.path.join(BASE_PATH, 'sprites/boat/boat.png'))

    print("Creating fisher sprite...")
    fisher = create_fisher_sprite()
    fisher.save(os.path.join(BASE_PATH, 'sprites/boat/fisher.png'))

    print("Creating dog sprite...")
    dog = create_dog_sprite()
    dog.save(os.path.join(BASE_PATH, 'sprites/boat/dog.png'))

    print("Creating lantern sprite...")
    lantern = create_lantern_sprite()
    lantern.save(os.path.join(BASE_PATH, 'sprites/boat/lantern.png'))

    print("Creating rod sprite...")
    rod = create_rod_sprite()
    rod.save(os.path.join(BASE_PATH, 'sprites/boat/rod.png'))

    print("Creating bobber sprite...")
    bobber = create_bobber_sprite()
    bobber.save(os.path.join(BASE_PATH, 'sprites/boat/bobber.png'))

    # Create fish sprites
    print("\nCreating fish sprites...")
    for name, fish_def in FISH_DEFS.items():
        print(f"  Creating {name}...")
        width, height = fish_def['size']
        frames = fish_def['frames']
        colors = fish_def['colors']

        if fish_def.get('eldritch', False):
            img = create_eldritch_fish(name, width, height, frames, colors)
        else:
            img = create_fish_sprite(name, width, height, frames, colors)

        img.save(os.path.join(BASE_PATH, fish_def['path']))

    print("\nAll sprites generated successfully!")
    print(f"Sprites saved to: {BASE_PATH}/sprites/")


if __name__ == '__main__':
    main()
