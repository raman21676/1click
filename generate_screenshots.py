#!/usr/bin/env python3
"""
Generate screenshot images for PWA manifest
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_screenshot_wide():
    """Create wide screenshot (1280x720) - desktop/tablet view"""
    width, height = 1280, 720
    img = Image.new('RGB', (width, height), (15, 23, 42))  # Dark slate background
    draw = ImageDraw.Draw(img)
    
    # Background gradient effect
    for y in range(height):
        progress = y / height
        r = int(15 + (30 - 15) * progress)
        g = int(23 + (41 - 23) * progress)
        b = int(42 + (60 - 42) * progress)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Draw "1click Games" title
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 72)
        font_medium = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 32)
        font_small = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 24)
    except:
        font_large = ImageFont.load_default()
        font_medium = font_large
        font_small = font_large
    
    # Title
    title = "1click Games"
    bbox = draw.textbbox((0, 0), title, font=font_large)
    title_width = bbox[2] - bbox[0]
    draw.text(((width - title_width) // 2, 80), title, font=font_large, fill=(20, 184, 166))
    
    # Subtitle
    subtitle = "Play 9+ Free Mini Games Instantly"
    bbox2 = draw.textbbox((0, 0), subtitle, font=font_medium)
    sub_width = bbox2[2] - bbox2[0]
    draw.text(((width - sub_width) // 2, 170), subtitle, font=font_medium, fill=(148, 163, 184))
    
    # Draw game cards grid (3x3)
    games = ["🎲 Ludo", "♟️ Chess", "🐍 Snake & Ladder", "🐅 Baagchal", 
             "🎯 Carrom", "🔢 Sudoku", "🐍 Snake", "❌ Tic-Tac-Toe", "🍾 Truth or Dare"]
    
    card_width = 300
    card_height = 120
    gap = 30
    start_x = (width - (3 * card_width + 2 * gap)) // 2
    start_y = 250
    
    for i, game in enumerate(games):
        row = i // 3
        col = i % 3
        x = start_x + col * (card_width + gap)
        y = start_y + row * (card_height + gap)
        
        # Card background
        draw.rounded_rectangle([x, y, x + card_width, y + card_height], 
                               radius=16, fill=(30, 41, 59), outline=(51, 65, 85), width=2)
        
        # Card text
        bbox = draw.textbbox((0, 0), game, font=font_small)
        text_width = bbox[2] - bbox[0]
        draw.text((x + (card_width - text_width) // 2, y + 45), game, font=font_small, fill=(241, 245, 249))
    
    return img

def create_screenshot_narrow():
    """Create narrow screenshot (750x1334) - mobile view"""
    width, height = 750, 1334
    img = Image.new('RGB', (width, height), (15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # Background gradient
    for y in range(height):
        progress = y / height
        r = int(15 + (20 - 15) * progress)
        g = int(23 + (30 - 23) * progress)
        b = int(42 + (50 - 42) * progress)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 56)
        font_medium = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 28)
        font_small = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 22)
    except:
        font_large = ImageFont.load_default()
        font_medium = font_large
        font_small = font_large
    
    # Title
    title = "1click"
    bbox = draw.textbbox((0, 0), title, font=font_large)
    title_width = bbox[2] - bbox[0]
    draw.text(((width - title_width) // 2, 120), title, font=font_large, fill=(20, 184, 166))
    
    # Subtitle
    subtitle = "Free Mini Games"
    bbox2 = draw.textbbox((0, 0), subtitle, font=font_medium)
    sub_width = bbox2[2] - bbox2[0]
    draw.text(((width - sub_width) // 2, 190), subtitle, font=font_medium, fill=(148, 163, 184))
    
    # Game cards - vertical layout
    games = ["🎲 Ludo", "♟️ Chess", "🐍 Snake & Ladder", "🐅 Baagchal", 
             "🎯 Carrom", "🔢 Sudoku", "🐍 Snake", "❌ Tic-Tac-Toe"]
    
    card_width = 600
    card_height = 100
    gap = 20
    start_x = (width - card_width) // 2
    start_y = 300
    
    for i, game in enumerate(games):
        y = start_y + i * (card_height + gap)
        
        # Card background
        draw.rounded_rectangle([start_x, y, start_x + card_width, y + card_height], 
                               radius=12, fill=(30, 41, 59), outline=(51, 65, 85), width=2)
        
        # Card text
        bbox = draw.textbbox((0, 0), game, font=font_small)
        text_width = bbox[2] - bbox[0]
        draw.text((start_x + (card_width - text_width) // 2, y + 35), game, font=font_small, fill=(241, 245, 249))
    
    # Bottom text
    footer = "No download required • Play instantly"
    bbox3 = draw.textbbox((0, 0), footer, font=font_small)
    footer_width = bbox3[2] - bbox3[0]
    draw.text(((width - footer_width) // 2, height - 100), footer, font=font_small, fill=(100, 116, 139))
    
    return img

def create_game_icons():
    """Create simple icons for game shortcuts"""
    games = {
        'ludo': ('🎲', (229, 57, 53)),      # Red
        'chess': ('♟️', (97, 97, 97)),      # Gray
        'snake-ladder': ('🐍', (67, 160, 71)),  # Green
    }
    
    output_dir = "src/games"
    
    for game_name, (emoji, color) in games.items():
        size = 192
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Background
        padding = 8
        draw.rounded_rectangle([padding, padding, size - padding, size - padding],
                               radius=24, fill=color)
        
        # Try to draw emoji or fallback to letter
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", 100)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 80)
            except:
                font = ImageFont.load_default()
        
        # Get text bounds
        bbox = draw.textbbox((0, 0), emoji, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - 10
        
        draw.text((x, y), emoji, font=font)
        
        # Save to game directory
        game_dir = os.path.join(output_dir, game_name)
        os.makedirs(game_dir, exist_ok=True)
        filepath = os.path.join(game_dir, 'icon.png')
        img.save(filepath, 'PNG')
        print(f"✅ Created {game_name}/icon.png")

def main():
    output_dir = "src/assets/images"
    os.makedirs(output_dir, exist_ok=True)
    
    print("📸 Generating screenshot images...")
    print("-" * 40)
    
    # Wide screenshot
    screenshot_wide = create_screenshot_wide()
    wide_path = os.path.join(output_dir, 'screenshot-wide.png')
    screenshot_wide.save(wide_path, 'PNG')
    print(f"✅ Created screenshot-wide.png (1280x720)")
    
    # Narrow screenshot
    screenshot_narrow = create_screenshot_narrow()
    narrow_path = os.path.join(output_dir, 'screenshot-narrow.png')
    screenshot_narrow.save(narrow_path, 'PNG')
    print(f"✅ Created screenshot-narrow.png (750x1334)")
    
    print("-" * 40)
    print("🎮 Generating game shortcut icons...")
    print("-" * 40)
    
    create_game_icons()
    
    print("-" * 40)
    print("🎉 All images generated successfully!")

if __name__ == "__main__":
    main()
