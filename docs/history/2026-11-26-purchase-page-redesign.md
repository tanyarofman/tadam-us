# Purchase step redesign, November 26, 2026

Tanya asked to improve the last step of /create (review and pay) based on the best checkout pages on Mobbin,
and to make the agreement checkbox shorter but very clear.

## References (Mobbin, web and iOS)

- Order summary box with the total, the pay button and the fine print together: Miro, Perplexity, Sketch.
- Agreement checkbox directly above the pay button: Figma, Telegram, Selfridges.
- Package choice as rows with a radio dot and one line of specs: Claude, Badoo.
- Price inside the button: Plenty of Fish, Superpower.
- Order recap with an Edit link: Figma's review step.
- Trust line under the button with the payment provider and legal links: Copy.ai.

cta.gallery was also checked for the pay button, but its pages list only site names, so it added nothing.

## What changed

- Two columns from 1024px: the game and package choice on the left, a sticky "Your order" box on the right with
  the total, the email, the agreement and its own "Pay $99" button. The bottom bar keeps only "Back" on wide screens.
  On phones everything stacks and the bottom bar's button is the pay button (same label).
- Packages are full-width radio rows: name, price, one line of specs; VIP has a "Your own host" badge and one note.
- The two "includes" checkmarks were removed (the customer just built the game).
- Email label "Send the game to" with the hint "Your game link and receipt go here."
- Agreement (17 words before): "The facts are right, and I'm allowed to use these photos." When no photos are
  attached it reads "The names and facts are right." Unticked on Pay: the row gets a pink outline and
  "Tick the box to continue." Email and agreement errors now show under their own field.
- Trust line: "Secure checkout by Paddle · Terms · Refunds" (links to /terms and /refunds).
- The old ticket CSS (.in-ticket*, old .in-pkg*, .in-includes) was removed.

## Checked

Astro check 0 errors, production build passes. In the browser at 1440x900 and 375x812: package switching updates
the line, total and both buttons; Pay with an empty email and unticked box shows both errors; Edit goes back to the
stories step. The photo version of the agreement text was not tested in the browser (needs a real photo upload).
