# The Cleaning Specialist — website

A fast, static website (HTML, CSS and a little JavaScript) built from the approved homepage concept.
It is designed for **Cloudflare Pages (free plan)**, with the enquiry form delivered to your **IONOS** inbox by **Web3Forms**.

```
the-cleaning-specialist/
├── public/                  ← this folder is the website (deploy this)
│   ├── index.html           ← homepage: hero, services, why us, how it works, areas, contact form
│   ├── privacy.html         ← privacy notice TEMPLATE (highlighted items to confirm)
│   ├── thank-you.html       ← shown after sending the form when JavaScript is off
│   ├── 404.html
│   ├── assets/css/styles.css   ← all styling; colours at the top
│   ├── assets/js/main.js       ← menu, form validation and sending
│   ├── assets/img/             ← images (placeholders, replace with photos)
│   ├── assets/fonts/           ← Inter, self-hosted (no Google tracking)
│   ├── _headers             ← Cloudflare security headers
│   ├── robots.txt, sitemap.xml, favicon.svg
└── tools/
    ├── generate-images.mjs  ← regenerates the placeholder artwork
    └── preview-server.mjs   ← local preview that mimics Cloudflare Pages
```

---

## 1. Before publishing: three things to replace

Search for these across the `public/` folder and replace them. You can do this in the GitHub web editor on an iPad, or send me the details and I'll do it.

| Placeholder | Replace with | Where |
| --- | --- | --- |
| `your-domain.co.uk` | your real domain, e.g. `thecleaningspecialist.co.uk` | index.html, privacy.html, robots.txt, sitemap.xml |
| `hello@your-domain.co.uk` | your IONOS business email address | index.html, privacy.html, thank-you.html, 404.html |
| `YOUR_WEB3FORMS_ACCESS_KEY` | your Web3Forms access key (step 2) | index.html (contact form) |

Also complete every highlighted **[CONFIRM: …]** item in `privacy.html` before going live.

The site assumes `https://www.your-domain.co.uk` (with `www`) as its main address, which matches the DNS method in step 4.

---

## 2. Connect the enquiry form to your IONOS email (Web3Forms)

Static hosting can't send email by itself. Web3Forms receives the form and emails it to you. It's free, and you don't need to create an account.

1. Go to **web3forms.com** and enter your **IONOS business email address** under "Create your Access Key".
2. Open the email Web3Forms sends to that inbox and copy the **access key**.
3. In `public/index.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key. It's safe to have this key in the page; it can only send to your address.
4. Optional but recommended: in the Web3Forms dashboard, restrict submissions to your domain.

How it behaves:
- With JavaScript (almost everyone), the form validates every field, shows "Sending…", and then shows a success or error message on the page.
- Without JavaScript, the browser's own validation runs, the form posts straight to Web3Forms, and visitors land on `/thank-you.html`.
- Until the key is added, the form shows **"This form is not connected yet"** and sends nothing. It never pretends to work.
- A hidden spam trap field filters out simple bots.
- Each email arrives with the subject "New enquiry from The Cleaning Specialist website". **Reply-to** is set to the customer's email, so you can just press Reply.

If the first test lands in spam, mark it "Not spam" in IONOS Webmail and add the sender to your safe senders list.

---

## 3. Publish on Cloudflare Pages (free)

This works fully from an iPad browser.

1. Sign up or log in at **dash.cloudflare.com**.
2. Go to **Workers & Pages → Create → Pages → Connect to Git**, authorise GitHub and choose the repository `Cleaning-business-`.
3. Use these build settings:
   - **Production branch:** the branch holding this site (currently `claude/commercial-cleaning-website-3q2a07`, or `main` once merged)
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `public`
   - **Root directory (advanced):** `the-cleaning-specialist`
4. Click **Save and Deploy**. After a minute you'll get a preview address like `the-cleaning-specialist.pages.dev`. Check the site there before connecting your domain.

Every later change pushed to that branch redeploys automatically.

---

## 4. Connect your IONOS domain without touching email

Your email works through the **MX**, **SPF (TXT)**, **DKIM**, **DMARC** and **autodiscover** records. **Do not edit or delete any of these.** The steps below only change records for the website.

### Recommended: keep DNS at IONOS (lowest risk to email)

**Step A: add the domain in Cloudflare**
1. In your Pages project, open **Custom domains → Set up a custom domain**.
2. Enter `www.your-domain.co.uk` and continue. Cloudflare will show a **CNAME target**, usually `the-cleaning-specialist.pages.dev`.

**Step B: point `www` at Cloudflare (in IONOS)**
1. Log in to IONOS and go to **Domains & SSL**. Click your domain, then **DNS**.
2. Before changing anything, take a **screenshot of all existing records** as a backup.
3. If there is an existing **A** or **AAAA** record for host `www`, delete only that record. It points at IONOS web space, not email. IONOS won't allow a CNAME alongside it.
4. Add a record: **Type** CNAME, **Host name** `www`, **Points to** the target from step A (e.g. `the-cleaning-specialist.pages.dev`), **TTL** 1 hour.
5. Save. Back in Cloudflare, the custom domain changes from "Verifying" to **Active**, with a free SSL certificate. This usually takes 5–30 minutes, and occasionally up to 24 hours.

**Step C: send the bare domain to `www`**

Cloudflare Pages can only serve the bare domain (`your-domain.co.uk`, with no www) if your DNS is hosted at Cloudflare. With DNS at IONOS, forward it instead:
1. In IONOS, open your domain and choose **Redirect / Forwarding** (sometimes called "Use domain → Redirect").
2. Choose **HTTP redirect**, target `https://www.your-domain.co.uk`, type **301 (permanent)**.
3. IONOS may say it will change the domain's **A/AAAA records**. That's fine, because those are web records. Confirm that your **MX records are unchanged** afterwards.
4. Make sure the bare domain has an SSL certificate in IONOS (**Domains & SSL → SSL**). Without one, `https://your-domain.co.uk` will show a warning before redirecting.

### Alternative: move DNS to Cloudflare (more control, more care needed)

Only choose this if you want the bare domain served directly by Cloudflare.
1. In Cloudflare, go to **Add a site → your domain → Free plan**. Cloudflare scans your existing records.
2. **Compare the scan against your IONOS screenshot record by record.** Add anything missing, especially:
   - **MX** records (for UK IONOS accounts, typically `mx00.ionos.co.uk` and `mx01.ionos.co.uk`, but use what your screenshot shows)
   - **TXT** SPF record (typically `v=spf1 include:_spf-eu.ionos.com ~all`)
   - any DKIM, DMARC (`_dmarc`) and `autodiscover` records
3. Set every mail-related record to **DNS only** (grey cloud).
4. Only then, in IONOS, change the **nameservers** to the two Cloudflare provides. Your email stays with IONOS; only DNS moves.
5. In your Pages project, add both `your-domain.co.uk` and `www.your-domain.co.uk` as custom domains.

### After connecting: check email still works
- Send an email **to** your IONOS address from a personal account, then reply **from** IONOS Webmail.
- Optionally, run a free MX/SPF check on your domain at mxtoolbox.com.

---

## 5. Test the form (desktop and mobile)

Do this on the live `pages.dev` address or your domain, after adding the access key.

- [ ] **Desktop:** submit with nothing filled in. Every required field should show a clear message, and the cursor should jump to the first one.
- [ ] Enter an invalid postcode (e.g. `XYZ`) and check the message. Then enter a valid one (e.g. `M2 3AW`).
- [ ] Complete the form and send it. You should see "Sending…" and then the green thank-you message, and the form should clear.
- [ ] Check your **IONOS inbox**: the subject, all fields, and that **Reply** goes to the address you entered.
- [ ] **iPhone/iPad (Safari):** repeat the test. Check the keyboard types: email keyboard for email, number pad for telephone, and no zoom-in on fields.
- [ ] **Android (Chrome):** repeat the test.
- [ ] Test the menu on mobile: it opens, the links scroll to each section, and it closes.
- [ ] Optional: turn on airplane mode and send. You should see the "could not be sent" message with your email address.

---

## 6. Previewing changes

- **Easiest (iPad):** push the change and open the Cloudflare preview link. Every branch gets its own preview address.
- **On a computer with Node.js:** from `the-cleaning-specialist/`, run `node tools/preview-server.mjs`, then open http://localhost:8788. It applies the same security headers as Cloudflare.
- Any simple static server also works, for example `python3 -m http.server -d public`.

---

## 7. Making changes

- **Colours:** the top of `assets/css/styles.css` (`--evergreen`, `--ivory`, `--champagne`, `--champagne-light`).
- **Text:** edit `public/index.html` directly. Each section is clearly labelled.
- **Hero and service images:** add a photo (e.g. `assets/img/hero.jpg`, ideally 1600px wide and under 300 KB) and change the `src` in `index.html`, keeping the `width`/`height` and updating the `alt` text. Only use photos you have the rights to (your own, commissioned, or licensed stock).
- **Areas list:** the `<!-- SETUP -->` comment in the Areas section of `index.html`.
- **Social preview image:** `assets/img/social-card.jpg` (1200×630).

## Design notes: how the concept was recreated

| Concept element | Implementation |
| --- | --- |
| Rounded deep-evergreen panel framing the page | `.panel`: `#173B32`, radius ~40px on large screens, inset from the screen edge |
| Two-line uppercase wordmark (champagne + white bold) | Text-based logo (crisp, accessible, no image file) |
| Two-bar menu icon (short lower bar) | Recreated in CSS; turns into a close icon when open |
| Hairline divider under the header | 1px ivory line at 24% opacity |
| Champagne uppercase eyebrow, bold white headline, soft ivory body | Inter font, sizes scaled to the concept's proportions |
| Full-width pale champagne button | `#E8D8B7` (sampled from the concept) with evergreen text; full width on phones and tablets |
| Large rounded interior photo | 16:9 rounded image below the button |
| *(Desktop: no concept provided)* | Same elements placed side by side, text left and image right |

**Differences from the concept, and why:**
1. **Hero photograph.** The photo in the concept carries a "centuryply" watermark and belongs to a third party, so it can't legally be used. The site uses an original illustration in the same style (oak-slatted walls and ceiling, timber reception desk, full-height glazing with planting) until you add a licensed photo.
2. **The caption "Illustrative homepage concept — not a live website"** was part of the mockup, not the design, so it is omitted.
3. **Headline capitalisation** follows the concept ("A cleaner workplace. A higher standard."). Changing it to title case is a one-line edit.
4. **No testimonials, accreditations, insurance claims, years of experience or client names** are included, as requested.
