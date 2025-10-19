# 📸 Image Setup Guide for CodeBits

## What I've Updated:

✅ **Removed all Lovable branding** from meta tags
✅ **Added proper CodeBits metadata** with descriptions
✅ **Created a simple favicon** (code brackets icon)
✅ **Set up proper social sharing tags**

---

## 🖼️ How to Add Your Custom Images

### 1. **Open Graph Image** (for social sharing)

This is the image that appears when you share your website on social media.

**Requirements:**
- **Size**: 1200x630px (recommended)
- **Format**: PNG or JPG
- **Name**: `og-image.png`
- **Location**: `/public/` folder

**Steps:**
1. Create or design an image (1200x630px)
2. Save it as `og-image.png`
3. Place it in `/public/og-image.png`
4. That's it! The meta tags are already configured.

**Design Tips:**
- Include the CodeBits logo/name
- Add a tagline: "Smart Code Snippet Manager"
- Use the VSCode color scheme (#0e639c, #569cd6)
- Keep text large and readable
- Preview how it looks on different platforms

**Tools to Create OG Image:**
- [Canva](https://www.canva.com/) - Easy drag-and-drop
- [Figma](https://www.figma.com/) - Professional design
- [OG Image Generator](https://og-image.vercel.app/) - Quick templates

---

### 2. **Favicon** (browser tab icon)

I've already created a simple code brackets favicon for you!

**Current Favicon:**
- ✅ Location: `/public/favicon.svg`
- ✅ Design: Blue code brackets `</>`
- ✅ Matches your brand colors

**To Replace with Your Own:**
1. Create a 64x64px icon
2. Save as `favicon.svg` (or `favicon.ico`)
3. Replace `/public/favicon.svg`

---

### 3. **Apple Touch Icon** (iOS home screen)

**Requirements:**
- **Size**: 180x180px
- **Format**: PNG
- **Name**: `apple-touch-icon.png`
- **Location**: `/public/` folder

**Steps:**
1. Create a 180x180px PNG image
2. Save it as `apple-touch-icon.png`
3. Place it in `/public/apple-touch-icon.png`

---

## 🎨 Example Image Layout

Here's a simple template for your OG image:

```
┌────────────────────────────────────────┐
│  1200 x 630px                          │
│                                        │
│      [CodeBits Logo/Icon]              │
│                                        │
│      CodeBits                          │
│      Smart Code Snippet Manager        │
│                                        │
│      🤖 AI-Powered  📱 Mobile  🔍 Search │
│                                        │
└────────────────────────────────────────┘
```

**Colors to use:**
- Background: `#1e1e1e` (dark)
- Primary: `#0e639c` (blue)
- Accent: `#569cd6` (light blue)
- Text: `#d4d4d4` (light gray)

---

## 🧪 Testing Your Images

### Test OG Image:
1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

### Test Favicon:
1. Open your site in a browser
2. Check the tab icon
3. Test on mobile by adding to home screen

---

## 📝 Quick Checklist

- [ ] Create 1200x630px OG image
- [ ] Save as `/public/og-image.png`
- [ ] Verify it appears on social shares
- [ ] (Optional) Replace favicon with custom icon
- [ ] (Optional) Add apple-touch-icon.png
- [ ] Test all images on different platforms

---

## 🚀 Current Meta Tags Setup

Your `index.html` now includes:

✅ Proper page title: "CodeBits - Smart Code Snippet Manager"
✅ SEO description with keywords
✅ Open Graph tags for Facebook/LinkedIn
✅ Twitter Card tags
✅ Favicon references
✅ Apple touch icon support

All Lovable branding has been removed! 🎉

---

## 💡 Need Help?

If you need help creating the OG image, I can provide:
1. An SVG template you can customize
2. Specific design recommendations
3. HTML/CSS code to generate it dynamically

Just let me know! 😊
