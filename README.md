# Hands Across Borders

## Deploying to Vercel

1. Import this repository into Vercel.
2. Vercel will use the settings in `vercel.json` to run `npm run build` and publish `dist`.
3. Add the site's existing custom domain in the Vercel project settings.
4. Update the domain's DNS records to the values Vercel provides. Keep the Netlify site active until Vercel confirms the domain is configured correctly.

If the domain shows Netlify's "Site not found" page after the migration, the
request is still reaching Netlify. In the domain's DNS provider, remove the old
Netlify `A`, `AAAA`, and `CNAME` records and add the exact records shown by
Vercel under **Project Settings > Domains**. Also remove the custom domain from
the old Netlify site after Vercel has verified it. DNS changes can take time to
propagate, so test the generated `*.vercel.app` URL first.

The Vercel configuration enables clean URLs for every generated HTML page, so
both `/hands/mission.html` and `/hands/mission` resolve correctly (and likewise
for Gallery, Our Hands, and Contact Us).

For local development, run `npm install` followed by `npm run dev`.
