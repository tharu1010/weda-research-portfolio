# Weda.lk Academic Research Portfolio

Independent academic research portfolio for Weda.lk. It is separate from the production Weda.lk application and contains no production application or ML inference. Public pages remain static; optional Supabase integration provides administrator authentication, persistent storage and metadata. A Vercel serverless endpoint provides private contact delivery when its environment variables are configured.

## Pages

Home, Project Scope, Milestones, Documents, Presentations, About Us and Contact Us are implemented as seven responsive HTML pages. `admin.html` is a no-index authenticated management surface with upload, visibility, metadata and deletion controls.

## Confirmed architecture

`User request -> C1: 20 providers -> C2: 10 providers -> C4: top 5 providers`

Component 3 is an independent documentation-oriented contribution. The 20/10/5 values are target pipeline outputs supplied by the project team, not published experimental results.

## Local development

No build or dependencies are required. From the repository root, run `python -m http.server 8000`, then open `http://localhost:8000/`. A server is required for the JSON-backed libraries.

## Content maintenance

- Add approved PDFs to `assets/documents/` or `assets/presentations/`.
- Update `data/documents.json` or `data/presentations.json`.
- Keep repository-relative URLs beginning with `./`.
- Set `approved: true` and `status: "available"` only after completing publication review.
- See `DOCUMENT_UPLOAD_GUIDE.md`, `CONTENT_CHECKLIST.md`, and `DEPLOYMENT.md`.

## Current limitations

No approved research PDFs, presentations, team identities, supervisor details, institutional information, milestone dates/marks, citations, datasets, results, project email, production screenshots, live application URL, or backend credentials were supplied. The website labels these items as pending rather than inventing them. Without Supabase configuration the public libraries use their repository manifests, while uploads and message delivery remain disabled. See `DEPLOYMENT.md` for backend activation.

Designed for GitHub Pages from `main` at repository root. Course-web acceptance, its 20 MB limit, JavaScript permission and the official submission destination require university confirmation.

## Vercel deployment

The repository includes `vercel.json` and `api/contact.js`. Import the existing GitHub repository into Vercel, use **Other** as the framework preset, leave Build Command empty, and use `.` as the output/root directory. Configure `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and optionally `CONTACT_FROM_EMAIL` in Vercel Project Settings → Environment Variables, then redeploy. Real secret values belong only in Vercel; `.env` files are ignored.

Without those variables, the contact endpoint returns an honest configuration error. Supabase document administration also remains inactive until the public project configuration and server-side security policies described in `DEPLOYMENT.md` are configured.
