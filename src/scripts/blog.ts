/** Blog pages: sources cited inside an article open in a new tab.
 * (Click tracking on [data-track] is site-wide, in src/components/ConsentBanner.astro.) */
document.querySelectorAll<HTMLAnchorElement>(".prose a[href^='http']").forEach((a) => {
  a.target = "_blank";
  a.rel = "noopener";
});
