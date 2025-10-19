# 🎨 How to Generate Your OG Image

## Quick Method (Screenshot)

1. **Open the template**
   ```bash
   open public/og-image-template.html
   ```
   (Or just double-click the file)

2. **Take a screenshot**
   - Mac: `Cmd + Shift + 4` (then press Space to capture window)
   - Windows: Use Snipping Tool or `Win + Shift + S`
   - Set browser window to exactly 1200x630px if possible

3. **Save the screenshot**
   - Save as `og-image.png`
   - Place it in `/public/og-image.png`

4. **Done!** Your social sharing image is ready.

---

## Professional Method (Using Browser Tools)

### Using Chrome/Edge DevTools:

1. Open `og-image-template.html` in Chrome
2. Press `F12` to open DevTools
3. Press `Ctrl/Cmd + Shift + M` for device mode
4. Set dimensions: **1200 x 630**
5. Press `Ctrl/Cmd + Shift + P`
6. Type "Capture screenshot" and select "Capture screenshot"
7. Save as `og-image.png` in `/public/`

---

## Using Online Tools

### Recommended Tools:

1. **Canva** (Free, Easy)
   - Go to https://www.canva.com/
   - Search for "Open Graph" template
   - Customize with CodeBits branding
   - Download as PNG (1200x630)

2. **Figma** (Professional)
   - Create new frame: 1200x630
   - Design your image
   - Export as PNG

3. **OG Image Generator** (Quick)
   - https://og-image.vercel.app/
   - Enter your text
   - Customize colors
   - Download

---

## Current Setup

✅ Template is ready at: `public/og-image-template.html`
✅ Meta tags point to: `/og-image.png`
✅ Favicon is already created: `/public/favicon.svg`

Just create the image and save it as `/public/og-image.png`!
