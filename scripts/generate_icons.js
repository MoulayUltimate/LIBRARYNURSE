const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const INPUT_IMAGE = "/Users/user/.gemini/antigravity/brain/01a573c0-6aa2-4200-89a3-c3b664c7becc/uploaded_image_1769362641273.png";
const PUBLIC_DIR = "/Users/user/.gemini/antigravity/playground/infinite-oort/nurslibrary/public";
const PADDING_FACTOR = 0.1; // 10% padding - Balancing zoom out and visibility

async function generate() {
    try {
        console.log(`Reading image from ${INPUT_IMAGE}`);
        const image = await Jimp.read(INPUT_IMAGE);

        const sizes = [
            { name: "favicon-16x16.png", size: 16 },
            { name: "favicon-32x32.png", size: 32 },
            { name: "apple-icon.png", size: 180 },
            { name: "icon-192x192.png", size: 192 },
            { name: "icon-512x512.png", size: 512 },
        ];

        for (const { name, size } of sizes) {
            // Create a blank transparent canvas
            const canvas = new Jimp({ width: size, height: size, color: 0x00000000 });

            // Clone and resize the source image
            const logoSize = Math.floor(size * (1 - PADDING_FACTOR * 2));
            const logo = image.clone();
            logo.resize({ w: logoSize, h: logoSize });

            // Center the logo
            const offset = Math.floor((size - logoSize) / 2);
            canvas.composite(logo, offset, offset);

            const outputPath = path.join(PUBLIC_DIR, name);
            await canvas.write(outputPath);
            console.log(`Generated ${name}`);

            // For favicon.ico, manually copy the 32x32 PNG file
            if (name === "favicon-32x32.png") {
                const icoPath = path.join(PUBLIC_DIR, "favicon.ico");
                // Copy file instead of using Jimp to write which fails on .ico
                fs.copyFileSync(outputPath, icoPath);
                console.log(`Generated favicon.ico (copy of 32x32)`);
            }
        }
        console.log("All icons generated successfully!");
    } catch (error) {
        console.error("Error generating icons:", error);
        process.exit(1);
    }
}

generate();
