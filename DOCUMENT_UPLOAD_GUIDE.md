# Document and Presentation Publication Guide

1. Obtain the latest official version and confirm owner, confidentiality, copyright and supervisor approval.
2. Convert a viewable copy to PDF where appropriate. Label original PPTX downloads accurately.
3. Rename using lowercase ASCII and hyphens, for example `project-proposal-v1.pdf`.
4. Compress while preserving legibility and confirm applicable size limits.
5. Place approved files in `assets/documents/` or `assets/presentations/`.
6. Update the matching JSON manifest with exact version, type, measured size, date and relative paths.
7. Set `status` to `available` and `approved` to `true` only after review.
8. Run a local server and test View and Download for that exact file.
9. Commit, deploy, and test the published URL in a private/incognito browser.
10. Record version/date and archive superseded files privately when traceability matters.

Example paths: `"viewUrl": "./assets/documents/project-proposal-v1.pdf"` and the same value for `downloadUrl`.

Do not publish confidential or unlicensed material. Static browser uploads are intentionally unsupported.
