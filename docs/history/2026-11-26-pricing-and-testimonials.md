# Pricing and testimonial schema, November 26, 2026

Ilan requested changing Basic from $59 to $99 and VIP from $99 to $149.
Updated the shared pricing configuration, which supplies the package cards,
visible FAQ answer, FAQ JSON-LD and Service offers. Package features and the
shared creation link are unchanged. Updated the existing browser expectations.

Tanya also requested testimonial schema that follows Google's rules. Ilan
confirmed that the current quotes are placeholders and asked to wait while he
provides real testimonials. No review markup has been added to the placeholders.

Google's review snippet requirements were checked on November 26, 2026:
- Reviews must reflect genuine experience and match visible content.
- Review rich results require a real numeric rating and a supported reviewed type.
- Self-serving Organization/LocalBusiness reviews are ineligible for review stars.
- Service is the site's current schema type and is not on Google's supported
  review-snippet list. Valid Schema.org markup alone does not guarantee rich results.

Sources:
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies

PR #54 was merged and published on November 25. These are follow-up changes.

Validation: production build passed. Parsed the built HTML and JSON-LD to confirm
Basic $99 / VIP $149 in the visible FAQ, Service offers and FAQ answers, with no
remaining $59 copy or review/rating schema for the placeholder testimonials.
