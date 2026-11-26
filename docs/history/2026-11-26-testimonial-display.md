# Testimonial display, November 26, 2026

After PR #61 was merged and published, Ilan requested removing the testimonial
dates and moving the existing "5/5 from these 3 customer reviews" subtitle below
the three cards. Keep the wording, individual stars, quotes, portraits and names.

Removed the visible dates and the optional Review.datePublished properties so
the public markup continues to match the cards. Supplied dates remain in the
source content and provenance record. The aggregate summary remains visible,
now below the grid with 24px spacing, and still uses the same ratings as JSON-LD.

Google's review-snippet documentation lists datePublished as recommended rather
than required. It requires the aggregate rating to be visible on the page, but
does not require it to appear above the cards. Moving the summary below the
cards meets that visibility requirement; rich-result display remains Google's
decision.

Validation: production build passes; Astro check has zero errors/warnings and
the existing Person.astro hint. Desktop and mobile homepage browser checks pass.
Built HTML confirms the summary follows all three cards, dates are absent, and
all three individual ratings plus the 5/5 aggregate are retained. Visual review
confirms the date-free cards and summary fit within the paused desktop section.

Google's Rich Results Test on deploy preview #65 detects four valid review-snippet
items and one valid Organization after removing dates. Page fetch succeeds; the
preview's expected X-Robots-Tag: noindex prevents preview indexing.
Result: https://search.google.com/test/rich-results/result?id=gO-2g8lUTp3UbbTr4G709A

This is the requested display follow-up to the production release authorized in
this chat, merged through PR #65 (5268359948317f4fb2ce665aa60dad212eafe609).

Production is **blocked**, not published: Netlify skipped main@5268359 because
the team has exhausted its billing-cycle credits. The currently published main
is 092ebee. Netlify still serves existing sites using operational credits, which
cannot fund production deploys. The connected leibov@gmail.com account has
read-only billing access; a team owner must add credits or upgrade, then retry
the skipped deploy. No billing changes were made. Preview #65 is working and
contains the requested update. This release blocker is recorded alongside the
follow-up demo popup work; production still needs a deploy after credits resume.

Sources checked:
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
