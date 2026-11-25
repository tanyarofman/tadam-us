# English demo tab titles, November 25, 2026

Ilan reported a brief Hebrew tab title when opening the homepage's demo links.
The Netlify proxies requested Base44's extensionless demo URLs, which serve the
shared Hebrew SPA shell. The game JavaScript subsequently replaces its title,
making the Hebrew text visible until that script loads.

Base44 already publishes route-specific English HTML at each demo's
`/index.html` URL. Updated the Friends, Stranger Things, Simpsons and Tom proxies
to request those files. Public URLs, query strings and the game scripts remain
unchanged; the initial title, language and sharing metadata now come from the
English demo document. No changes to the shared game application are needed.

Validation: inspect the initial HTML and asset references for all four upstream
documents, then verify the same metadata and query-string/trailing-slash behavior
on the Netlify deploy preview. Continues PR #54; production follows its merge.
