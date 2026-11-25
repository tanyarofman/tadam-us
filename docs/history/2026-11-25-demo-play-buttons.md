# Demo play-button refinement, November 25, 2026

Ilan requested slightly smaller play buttons, moved a little left and down.
The circular image overlays are now 42px instead of 48px, with a 17px play icon.
Their right offset is 26px (previously 18px) and bottom offset is 12px (previously
18px), moving each circle's center 5px left and 9px down. The full demo cards remain
the clickable links. The shared style applies to all three cards at every viewport.

Validation: production build and verification of the deployed preview CSS.
Continues PR #54.

## Direction correction, November 25

Ilan clarified that the horizontal adjustment should be right, not left. The final
right inset is 10px (8px less than the original 18px), undoing the prior leftward
shift and moving right. Keep the 42px circle, 17px icon and 12px bottom inset.
