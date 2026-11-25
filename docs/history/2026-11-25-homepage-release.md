# Homepage release, November 25, 2026

Ilan explicitly requested merging PR #54 and publishing all reviewed homepage
changes to the live site. This authorizes the production merge for this PR.

The release includes the Basic/VIP packages, clickable pricing cards, revised
copy and FAQ, header/footer logo, demo and testimonial sections, supplied demo
artwork, spacing and color refinements, section navigation and scroll pauses,
and English HTML for the demo routes to prevent the initial Hebrew tab title.

Before release, the homepage browser suite passed all 16 desktop/mobile checks,
the production build passed, and the latest preview artwork matched the supplied
files byte for byte. All four English demo routes were verified with English
initial titles and metadata, including query-string and trailing-slash variants.

Merging to main triggers Netlify's automatic production deployment. The release
check will verify the published homepage, assets, navigation and demo metadata on
https://tadamevents.com after that deployment completes. The existing `/create`
coming-soon flow remains the shared destination for both packages.
