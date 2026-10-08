# GitHub Pages Deployment

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
