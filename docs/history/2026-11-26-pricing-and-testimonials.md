# Pricing and testimonial schema, November 26, 2026

Follow-up: Ilan subsequently supplied ratings, dates and permission. See
`2026-11-26-testimonial-ratings.md` for the final Game review schema, which
supersedes the text-only Service schema described in this earlier record.

Ilan requested changing Basic from $59 to $99 and VIP from $99 to $149.
Updated the shared pricing configuration, which supplies the package cards,
visible FAQ answer, FAQ JSON-LD and Service offers. Package features and the
shared creation link are unchanged. Updated the existing browser expectations.

Tanya also requested testimonial schema that follows Google's rules. Ilan
confirmed that the earlier quotes were placeholders, then supplied customer
testimonials and images for Elizabeth W., Noah H. and Susan O. Replaced all three
cards with the supplied names, verbatim quotes and unchanged WebPs. Removed the
old generated portraits from published assets; their provenance remains in docs.

The existing Service schema now includes text-only Review entries generated from
the same content as the visible cards, with matching author names, portraits and
stable links to each card. No ratings, aggregate score or review dates were
provided, so none are asserted. This describes the content accurately in
Schema.org; it does not qualify the page for Google's review-star rich results.

Google's review snippet requirements were checked on November 26, 2026:
- Reviews must reflect genuine experience and match visible content.
- Review rich results require a real numeric rating and a supported reviewed type.
- Self-serving Organization/LocalBusiness reviews are ineligible for review stars.
- Service is the site's current schema type and is not on Google's supported
  review-snippet list. Valid Schema.org markup alone does not guarantee rich results.

Sources:
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://schema.org/Review
- https://schema.org/review

PR #54 was merged and published on November 25. These are follow-up changes.

Pricing validation: production build passed. Parsed the built HTML and JSON-LD
to confirm Basic $99 / VIP $149 in the visible FAQ, Service offers and FAQ answers,
with no remaining $59 copy. Desktop/mobile pricing navigation tests passed.

Testimonial validation: production build and Astro checks passed (zero errors or
warnings; one pre-existing hint). Parsed the built page to verify that all three
quotes and names exactly match the supplied content and JSON-LD, portrait files
match the attachments byte for byte, card anchors match review URLs, and the
old personas and unsupported ratings/dates are absent.
