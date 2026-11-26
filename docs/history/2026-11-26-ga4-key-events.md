# 2026-11-26: Google Analytics key events

Session record from the cloud session "Tadam US site: wave 1 articles". It follows `2026-11-25-google-analytics.md`.

## What happened
- **The 10:00 reminder:** the "Google Analytics 4 to tadamevents.com" session had set a one-off scheduled task, "Tadam: mark GA4 key events", for 26 Nov at 10:00 Israel time. It fired and opened a new session with a push notification. Tanya couldn't find it, so its steps were given to her here.
- **`cta_create_click` ("Create yours" clicks):** Tanya marked it as a key event in GA4 (Admin → Data display → Events, star).
- **`launch_list_submit` (Coming soon signups):** not in the events list yet, because nobody had signed up since GA4 went live on 25 Nov.
  - Tanya signed up once on /create.
  - GA4 Realtime showed `launch_list_submit` (and `form_start`), so the site sends the event correctly.
  - It can take up to 24 hours to appear under Admin → Events → Recent events, where it gets its star.
- **The three default events** in the list (`close_convert_lead`, `purchase`, `qualify_lead`) are added by Google itself. The site doesn't send them ("No stream data detected"), so they can stay.
- **"Create event"** is not the way to add a missing event: it builds a new event from other events.

## Reminder
- A Google Calendar event on Tanya's calendar: "Tadam: star launch_list_submit in Google Analytics", Fri 27 Nov 2026, 10:00 Israel time, with a pop-up. A calendar event was used instead of a scheduled session because she found that easier to see.

## Open (Tanya)
- Star `launch_list_submit` once it appears (27 Nov).
- Check in GA4 Admin: data retention 14 months, Search Console linked, Ilan added.
- Delete her test signup from the Coming soon list.
- One "Page Not Found" view showed in Realtime on 26 Nov, probably a mistyped address. If 404 views keep appearing, look for a broken link.
