#!/usr/bin/env python3
"""
Generate PWA icons for 1click Games
Creates icons in all required sizes from 72x72 to 512x512
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Icon sizes required for PWA
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

# Colors matching 1click theme
BACKGROUND_COLOR = (20, 184, 166)  # Teal #14b8a6
ACCENT_COLOR = (6, 182, 212)       # Cyan #06b6d4
TEXT_COLOR = (255, 255, 255)       # White

def create_icon(size):
    """Create a single icon with the given size"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background (simulated with rounded rectangle)
    padding = size // 16
    corner_radius = size // 8
    
    # Main background - teal color
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=corner_radius,
        fill=BACKGROUND_COLOR
    )
    
    # Add gradient effect with overlay
    for i in range(size // 4):
        alpha = int(30 * (1 - i / (size // 4)))
        draw.rounded_rectangle(
            [padding + i, padding + i, size - padding - i, size // 2],
            radius=max(0, corner_radius - i),
            fill=(255, 255, 255, alpha)
        )
    
    # Draw "1" text
    font_size = int(size * 0.55)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", font_size)
        except:
            font = ImageFont.load_default()
    
    # Get text bounding box for centering
    text = "1"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - size // 20
    
    # Draw shadow
    draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 50))
    # Draw text
    draw.text((x, y), text, font=font, fill=TEXT_COLOR)
    
    # Draw "click" text below for larger icons
    if size >= 144:
        small_font_size = int(size * 0.18)
        try:
            small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", small_font_size)
        except:
            small_font = font
        
        click_text = "click"
        bbox2 = draw.textbbox((0, 0), click_text, font=small_font)
        click_width = bbox2[2] - bbox2[0]
        
        x2 = (size - click_width) // 2
        y2 = y + text_height + size // 30
        
        draw.text((x2, y2), click_text, font=small_font, fill=(255, 255, 255, 230))
    
    return img

def create_simple_icon(size):
    """Create a simplified icon with just '1' - cleaner for small sizes"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions
    padding = max(4, size // 20)
    corner_radius = size // 6
    
    # Draw rounded rectangle background with teal gradient effect
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=corner_radius,
        fill=BACKGROUND_COLOR
    )
    
    # Add highlight at top
    highlight_padding = padding + 2
    draw.rounded_rectangle(
        [highlight_padding, highlight_padding, size - highlight_padding, size // 2 - 2],
        radius=max(1, corner_radius - 2),
        fill=(255, 255, 255, 40)
    )
    
    # Draw "1" - size based on icon size
    font_size = int(size * 0.6)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            font = ImageFont.load_default()
    
    text = "1"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - size // 25
    
    # Shadow for depth
    shadow_offset = max(1, size // 50)
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=(0, 0, 0, 60))
    # Main text
    draw.text((x, y), text, font=font, fill=TEXT_COLOR)
    
    return img

def create_maskable_icon(size):
    """Create maskable icon (safe zone in center 80%)"""
    # Maskable icons need content in safe zone (center 80%)
    img = create_simple_icon(size)
    return img

def main():
    output_dir = "src/assets/images"
    os.makedirs(output_dir, exist_ok=True)
    
    print("🔧 Generating 1click PWA icons...")
    print("-" * 40)
    
    for size in ICON_SIZES:
        # Create regular icon
        icon = create_simple_icon(size)
        filename = f"icon-{size}x{size}.png"
        filepath = os.path.join(output_dir, filename)
        icon.save(filepath, "PNG")
        print(f"✅ Created {filename}")
        
        # Create maskable version for sizes that support it
        if size >= 192:
            maskable = create_maskable_icon(size)
            maskable_filename = f"icon-{size}x{size}-maskable.png"
            maskable_filepath = os.path.join(output_dir, maskable_filename)
            maskable.save(maskable_filepath, "PNG")
            print(f"✅ Created {maskable_filename}")
    
    print("-" * 40)
    print("🎉 All icons generated successfully!")
    print(f"📁 Location: {output_dir}/")
    print(f"📊 Total icons: {len(ICON_SIZES)} regular + {len([s for s in ICON_SIZES if s >= 192])} maskable")

if __name__ == "__main__":
    main()
