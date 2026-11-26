# Customer ratings and game review schema, November 26, 2026

Ilan supplied genuine 5/5 ratings and dates for Elizabeth W. (November 21), Noah H.
(October 9), and Susan O. (September 14), all in 2026. He confirmed full permission
to publish each quote, first name and last-name initial, and supplied photo.

Added visible stars and dates to the cards. The visible 5/5 summary is explicitly
based on these three reviews. It and aggregateRating are calculated from the same
ratings, while each Review includes reviewRating and datePublished. Original
testimonial quotes and the requested $99/$149 pricing remain unchanged.

Ilan asked how to make the reviews eligible for Google's review-star feature.
The earlier Service classification is replaced with Game, which accurately
describes the personalized Tadam trivia game reviewed here and is explicitly
listed in Google's supported review types. The Game retains the Basic/VIP offers
and links to the Organization as publisher; the Organization itself is not rated.
No claim is made that Google will necessarily display stars.

This supersedes the text-only Service schema limitations in the earlier November
26 record. Continues PR #61, which remains a deploy preview until approved to merge.

Build and Astro checks pass (zero errors/warnings, one pre-existing hint). The
built HTML and JSON-LD were checked for matching rating scales, all three dates,
the calculated 5/5 average and review count, preserved $99/$149 offers, and no
ratings attached to the Organization.

Deployed preview verification: desktop and mobile browser checks passed. The
Google Rich Results Test detected **4 valid review-snippet items** for the Tadam
game (the three reviews and the aggregate rating), plus one valid Organization.
The URL-level indexing restriction was the expected Netlify preview
`X-Robots-Tag: noindex` header; page fetch succeeded. Keep preview noindex intact
and recheck the production URL after publication.

Google test result:
https://search.google.com/test/rich-results/result/r%2Freview-snippet?id=JBMSrlNQY0HW_CW_6Z2bSA

Sources checked:
- https://schema.org/Game
- https://schema.org/AggregateRating
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
