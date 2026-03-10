# Google Analytics & AdSense Setup Guide

Complete guide for setting up analytics and monetization for 1click Games.

---

## 📊 Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Start measuring" or sign in
3. Click "Admin" (gear icon) in bottom left
4. Click "Create Property"
5. Enter property details:
   - **Property name:** 1click Games
   - **Reporting time zone:** Your timezone
   - **Currency:** USD (or your local currency)
6. Click "Next"
7. Answer business questions (optional, for tailored recommendations)
8. Click "Create"

### Step 2: Set Up Data Stream

1. Choose "Web" as platform
2. Enter website details:
   - **Website URL:** https://1click.live
   - **Stream name:** 1click.live
3. Enable "Enhanced measurement" (recommended)
4. Click "Create stream"

### Step 3: Get Tracking ID

1. After creating the stream, you'll see "Measurement ID"
2. Copy the ID (looks like `G-XXXXXXXXXX`)
3. Open `index.html` in your code editor
4. Find `G-XXXXXXXXXX` (appears twice)
5. Replace both with your actual Measurement ID

Example:
```html
<!-- BEFORE -->
gtag('config', 'G-XXXXXXXXXX');

<!-- AFTER -->
gtag('config', 'G-A1B2C3D4E5');
```

### Step 4: Verify Installation

1. Deploy the updated code
2. Wait 24-48 hours for data to appear
3. Go to GA4 → Reports → Realtime
4. You should see active users when you visit the site

### Step 5: Set Up Key Events (Optional)

Add custom events to track game engagement:

```javascript
// Track game clicks
gtag('event', 'game_click', {
  'game_name': 'ludo',
  'device': 'mobile'
});

// Track game starts
gtag('event', 'game_start', {
  'game_name': 'chess',
  'mode': 'ai'
});
```

---

## 💰 Google AdSense Setup

### Step 1: Apply for AdSense

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Click "Get started"
3. Sign in with Google account
4. Enter website URL: `https://1click.live`
5. Enter email address
6. Accept terms and conditions
7. Click "Start using AdSense"

### Step 2: Complete Application

1. Fill in payment details:
   - Name and address
   - Phone number
   - Tax information (if required)
2. Connect your site:
   - Add AdSense code to your site (already done in index.html)
   - The code is: `ca-pub-XXXXXXXXXXXXXXXX`
3. Wait for review (1-2 weeks)

### Step 3: Get Publisher ID

After approval:
1. Go to AdSense Dashboard
2. Click "Account" → "Settings"
3. Copy your **Publisher ID** (looks like `pub-1234567890123456`)
4. Open `index.html`
5. Find `ca-pub-XXXXXXXXXXXXXXXX` (appears 3 times)
6. Replace with your actual Publisher ID

Example:
```html
<!-- BEFORE -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"

<!-- AFTER -->
data-ad-client="ca-pub-1234567890123456"
```

### Step 4: Create Ad Units

1. In AdSense, go to "Ads" → "Overview"
2. Click "Create ad unit"
3. Choose "Display ads"
4. Configure first ad (Top Banner):
   - **Name:** 1click Top Banner
   - **Size:** Responsive (recommended)
5. Click "Create"
6. Copy the `data-ad-slot` value
7. Replace `data-ad-slot="XXXXXXXXXX"` in top banner ad
8. Repeat for second ad (Bottom Banner)

### Step 5: Configure Ads

In `index.html`, update both ad units:

```html
<!-- Top Banner -->
<div class="ad-container ad-banner-top" id="adBannerTop">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1234567890123456"
         data-ad-slot="1234567890"
         data-ad-format="horizontal"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>

<!-- Bottom Banner -->
<div class="ad-container ad-banner-bottom" id="adBannerBottom">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1234567890123456"
         data-ad-slot="0987654321"
         data-ad-format="horizontal"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
```

### Step 6: Wait for Approval

1. AdSense will review your site (1-2 weeks)
2. Ensure your site has:
   - Original content
   - Good navigation
   - No prohibited content
   - Privacy policy page
3. You'll receive email when approved

---

## 📈 Revenue Optimization Tips

### Ad Placement Best Practices

1. **Above the fold:** Top banner visible without scrolling
2. **Content break:** Bottom banner after game cards
3. **Mobile optimization:** Ads resize automatically
4. **Don't overdo it:** 2-3 ads per page max for good UX

### Expected Revenue

| Daily Visitors | Monthly Revenue (Estimate) |
|----------------|---------------------------|
| 1,000 | $50 - $150 |
| 5,000 | $200 - $600 |
| 10,000 | $500 - $1,500 |
| 50,000 | $2,500 - $7,500 |

*Note: Revenue varies by niche, geography, and user engagement*

### Improve Revenue

1. **Increase traffic:**
   - SEO optimization
   - Social media sharing
   - Game-related keywords

2. **Improve engagement:**
   - Add more games
   - Reduce load times
   - Better user experience

3. **A/B testing:**
   - Try different ad positions
   - Test different ad sizes
   - Monitor CTR (Click-Through Rate)

---

## 🔒 Privacy Policy

**Required for AdSense!**

Create a `privacy.html` page with:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Privacy Policy - 1click Games</title>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p>Last updated: March 2026</p>
    
    <h2>Google AdSense</h2>
    <p>We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits.</p>
    
    <h2>Google Analytics</h2>
    <p>We use Google Analytics to understand how visitors use our website. This uses cookies to track usage.</p>
    
    <h2>Cookies</h2>
    <p>You can disable cookies through your browser settings.</p>
    
    <h2>Contact</h2>
    <p>Email: contact@1click.live</p>
</body>
</html>
```

Link to it from footer in `index.html`.

---

## 🚨 Troubleshooting

### Analytics Not Working

- [ ] Check if `G-XXXXXXXXXX` is replaced correctly
- [ ] Verify in Realtime report
- [ ] Check browser console for errors
- [ ] Ensure no ad blockers are active

### Ads Not Showing

- [ ] Check if AdSense approved your site
- [ ] Verify `ca-pub-XXXXXXXXXXXXXXXX` is correct
- [ ] Check ad slot IDs match
- [ ] Wait 24 hours after code placement
- [ ] Disable ad blocker for testing

### Low Revenue

- [ ] Increase website traffic
- [ ] Improve ad viewability
- [ ] Try different ad formats
- [ ] Focus on high-paying niches (US, UK traffic)

---

## 📞 Support

- **Google Analytics Help:** https://support.google.com/analytics
- **Google AdSense Help:** https://support.google.com/adsense
- **1click Issues:** https://github.com/Raman21676/1click/issues

---

**Last Updated:** March 10, 2026  
**Setup Status:** Ready for deployment ✅
