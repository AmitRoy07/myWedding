# Royal Grace reference reconstruction

React + Vite + GSAP + Lenis. Run `npm install`, then `npm run dev`. Production: `npm run build`, then `npm run preview`.

Lenis smooths wheel and anchor scrolling on the GSAP ticker after the opening finishes. Touch scrolling retains native momentum. Reduced-motion preferences disable smooth scrolling and scroll reveals. Replay resets and destroys the scroller; effect cleanup also handles React Strict Mode. The hero text follows video time every animation frame rather than the less frequent `timeupdate` event. The video itself retains its original frame rate.

Reference: https://www.instagram.com/reel/DdT8PiJIu-E/
Live template: https://zareqia.com/invite/demo?template=royal-grace

The cinematic cover and curtains are a 10.005-second pre-rendered video, not CSS flaps. `public/assets/opening.mp4` retains the public demo watermark. This local prototype uses publicly accessible Zareqia demo media (backgrounds, photos, music). Downloading does not grant redistribution rights; obtain licensed originals before public deployment. Replace files at the same paths. No watermark removal is performed.

Personalized for Amit Roy and Sreya Mandal, 29 January 2027. Names, family details and addresses are configured in `wedding` in `src/App.jsx`. The countdown targets the start of the wedding day in India; the calendar download is an all-day event until a ceremony time is confirmed. Small text and exact text-reveal timing in the filmed reel cannot all be measured reliably; the live demo supplies the layout and assets. Desktop expands the portrait artwork, as the source does.

## Interactions

- Tap the cover to play the cinematic opening; scrolling unlocks on completion.
- iPhone/Safari: the tap button remains enabled before video preload. Playback starts directly from the tap with muted inline video. If playback fails or stalls, use “Open without animation” to access the full invitation with a static backdrop.
- Text reveal follows video time; final frame remains as the hero backdrop.
- Scratch the heart with mouse/touch, or focus the reveal button and press Enter.
- Save the date downloads an ICS file; carousel has automatic and manual controls.
- Music control plays/pauses local audio.
- Reduced motion skips the opening and scroll animations.
- No contact or RSVP form is included.
- Venue: Parinoy The Banquet, Midnapore, with the supplied Google Maps link and an embedded map search. Ceremony time is awaiting confirmation. Family addresses are displayed separately. Unconfirmed sample reception, pre-wedding, transport and accommodation details have been removed.

No account credentials, analytics, purchase flows, or tracking scripts are included.
