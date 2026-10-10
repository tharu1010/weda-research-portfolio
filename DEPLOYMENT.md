# Vercel Deployment (Recommended)

1. In Vercel, choose **Add New → Project** and import `tharu1010/weda-research-portfolio`.
2. Select **Other** as the framework preset. This is a buildless static HTML/CSS/JavaScript site with a Node serverless function.
3. Leave the build command empty and use the repository root (`.`) as the output/root directory.
4. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and optionally `CONTACT_FROM_EMAIL` under Project Settings → Environment Variables. Never add secret values to Git.
5. Deploy and verify all seven routes, `/api/contact`, assets, documents, mobile navigation and the custom 404 page.
6. The generated `*.vercel.app` URL uses HTTPS automatically. Connect a custom domain later only with explicit approval.

The contact endpoint validates required values and a honeypot before calling the mail provider. For higher-volume public deployment, add a durable rate-limit service and CAPTCHA. Until the Resend variables and sending identity are configured, delivery intentionally returns an error instead of simulating success.

# GitHub Pages Deployment (Static fallback)

1. Commit approved source and public assets, then push `main` to the separate `weda-research-portfolio` repository.
2. Open GitHub **Settings -> Pages**.
3. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. Enable HTTPS and verify `https://tharu1010.github.io/weda-research-portfolio/` after GitHub reports success.
5. Test all seven pages, every real View/Download action, and confirm pending cards are not clickable.

All site paths are relative for the GitHub Pages project subpath.

## Verification

Test Chrome and one additional browser; widths 320, 375, 768, 1024 and 1440; keyboard navigation; focus; mobile menu; reduced motion; console/network errors; private/incognito file access; sitemap, robots, favicon and 404 page.

## Rollback

Identify the last known-good commit, create a new revert commit, push it to `main`, and verify the Pages redeployment. Avoid destructive history rewriting.

GitHub Pages is not yet confirmed as the official course-web destination. Confirm the university's 20 MB rule, JavaScript/external hosting acceptance and final submission route.

## Persistent backend setup (Supabase)

1. Create a Supabase project owned by the research team and run `supabase/schema.sql` in the SQL editor.
2. Create administrator users in Authentication. Insert their user UUIDs into `public.profiles` with `is_admin = true`; never put passwords in this repository.
3. Copy `js/config.example.js` to `js/config.js` and set the project URL and public anon key. These values are public by design; row-level security is the authorization boundary.
4. Deploy a `contact` Edge Function that validates the form, rejects the honeypot field, enforces per-IP rate limits, verifies Turnstile, and sends through the approved mail provider. Store destination address, mail API key, and Turnstile secret as function secrets—not frontend variables.
5. Review the storage and database policies with the project supervisor before uploading files. Create signed URLs for private previews; only records marked `is_public` are publicly readable.
6. Visit `admin.html`, authenticate with an approved account, upload a harmless test PDF, verify it from another device, then remove the test asset.

Until steps 1–6 are complete, the contact form reports that delivery is unconfigured and the admin interface cannot authenticate. This is intentional; neither feature simulates success.
