from PIL import Image
import os

def process_icon(input_path, output_dir, padding_percent=0.2):
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # Calculate new size with padding
        width, height = img.size
        new_dimension = max(width, height)
        padded_size = int(new_dimension * (1 + padding_percent * 2))
        
        # Create a blank square canvas (transparent)
        new_img = Image.new("RGBA", (padded_size, padded_size), (0, 0, 0, 0))
        
        # Center the original image
        x_offset = (padded_size - width) // 2
        y_offset = (padded_size - height) // 2
        new_img.paste(img, (x_offset, y_offset), img)
        
        # Define sizes
        sizes = {
            "favicon-16x16.png": (16, 16),
            "favicon-32x32.png": (32, 32),
            "apple-icon.png": (180, 180),
            "icon-192x192.png": (192, 192),
            "icon-512x512.png": (512, 512)
        }
        
        # Generate PNGs
        ico_images = []
        for filename, size in sizes.items():
            resized = new_img.resize(size, Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, filename)
            resized.save(output_path)
            print(f"Generated {filename}")
            
            if size[0] <= 32:
                ico_images.append(resized)

        # Generate ICO
        if ico_images:
            ico_path = os.path.join(output_dir, "favicon.ico")
            # ICO format expects sizes in descending order or specific way, but PIL handles list
            # We specifically want 32x32 and 16x16 in the ICO
            ico_images[0].save(ico_path, format='ICO', sizes=[(32,32), (16,16)])
            print("Generated favicon.ico")
            
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    input_image = "/Users/user/.gemini/antigravity/brain/01a573c0-6aa2-4200-89a3-c3b664c7becc/uploaded_image_1769362641273.png"
    public_dir = "/Users/user/.gemini/antigravity/playground/infinite-oort/nurslibrary/public"
    process_icon(input_image, public_dir)
