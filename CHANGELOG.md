# Changelog

## Redesign branch — November 2026

Everything here is on the `redesign` branch. Nothing has been pushed or merged to `main`.

### Look (same style, sharper)

- Fonts and layout are unchanged: Cormorant Garamond, DM Sans, black and white, the diagonal headshot.
- The beige Experience section and grey Skills section are now white, separated by black lines.
- Headings and numbers are one weight heavier. Numbers sit on one baseline ("3.875" no longer dips).
- Small uppercase labels are slightly larger and darker.
- Borders that carry structure (stats, timeline, project grid, tags, outline buttons) are black.
- Winner and Finalist badges are solid black.
- All colours live in one `:root` block at the top of `styles.css`. To try oxblood touches, change `--accent` there.

### Content

- Hero now leads with consulting: new descriptor, subline, and four stats (GPA, consulting clients, Verizon result, delegates chaired). The same four show on desktop and phone.
- About, first paragraph: mentions the three clients and leading four analysts.
- Experience is grouped: Consulting, Work, Leadership, Earlier. Earlier is collapsed until clicked. No entries were removed.
- Skills: Strategy & Consulting is listed first. Microsoft Word removed.
- Contact line now says consulting and strategy internships for Summer 2027.
- Page title is "Grace Wu".

### Navigation

- One menu list instead of two. The last item is "Contact" on both desktop and phone.
- The section you are in is underlined in the nav.
- Phone menu: the icon turns into a close button, Esc closes it, and the page behind does not scroll.

### Phone fixes

- The hero grows to fit its content, so stats are no longer cut off on short phones.
- The "Scroll to explore" line no longer overlaps the stats.
- Buttons and icons are at least 44px tall for tapping.
- Password and email fields no longer make iPhones zoom in.

### Accessibility

- Keyboard focus is always visible.
- Both pop-ups (deck password, email form) keep Tab inside, close on Esc, and return focus to the button that opened them.
- Added a main landmark, a skip link, ordered headings, and labels on icon-only buttons.
- Animations are switched off for people who ask their device for reduced motion.
- The page still shows its content if JavaScript fails to load.

### Speed

- `Verizon_winner.jpg` went from 2.25 MB to about 350 KB and loads only when needed.
- The loader shows for under a second and no longer waits for every image.
- Fonts load from a `<link>` with fewer weights.
- Removed a hidden star animation that ran constantly, and unused CSS.

### Sharing

- Added a description, link-preview tags, and a preview image (`og-image.jpg`) for LinkedIn and messages.
- Added a browser tab icon (`favicon.svg`, `apple-touch-icon.png`) and a canonical URL.

### Not changed

- Deck passwords and the password behaviour. Note: the passwords are stored in `index.html` and the PDFs are public files, so this is not real security.
- The contact form still sends through FormSubmit.
- `Grace_Wu_Resume.pdf` (already identical to the current resume).
- The custom crosshair cursor (now only shown with a mouse, and visible over the photo).

### Open questions

1. Are the three consulting clients FoundersForge, the Experimental Student Robotics Association, and YMCA Piscataway?
2. Is "400+ delegates chaired" the right wording, and is it 4 Assistant Directors?
3. Remove the NHSMUN project card (it should live in Experience only) and the three highlight cards in About?
4. Apply the Experience bullet rewrites and rename "Download CV" to "Download Resume"?
5. Add "30%+ since our call" to the Quanta project card?
6. Keep the decks publicly hosted, or switch to request-by-email?
7. Has the FormSubmit activation email been confirmed? Send one test message to check.
