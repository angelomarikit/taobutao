# Novum Gallery — Framer design inventory

Source of truth for the TAO BUTAO reproduction. Values below were read from the live Framer project **Novum Gallery (copy)** (`5uTsDF0jVqfqdhYMeNP9`, branch `main`) on 10 November 2026. Nothing in this file is a visual guess.

Current canvas scope when inspected: Home page `augiA20Il`.

UI implementation has not started.

## What can be reproduced directly

- Page list, paths, and breakpoint frame sizes
- Section stack structure, padding, gap, alignment, fills, and absolute image layers on Home
- Color tokens and text-style presets, including each preset’s own breakpoint sizes
- Static copy on Home, About, Gallery, Journal, 404, navigation, footer, and newsletter
- CMS field schemas and the five Gallery items and two Journal items
- Component instance props for Gallery Image, Artwork Container, Journal cards, Visit Button, team cards, newsletter, and the three external effects
- Home, About, Gallery, artwork detail, journal, journal detail, and 404 phone/tablet overrides that the tree actually stores

## What is unverified

- Image `object-fit` and `object-position`. Image fills are asset references only. Framer did not expose a fit or focal-point property. Do not assume `cover` until a screenshot crop is checked per image.
- Video playback flags other than the controls that were returned (`controls: false`, `volume: 25`, source type Upload). Autoplay, loop, and muted were not present on the node.
- Source code of the external components **Unrolling Image** (`1TY0trftRyHHXOvNaZRG`), **Video** (`lRDHiNWNVWmE0lqtoVHP`), and **Smooth Scroll** (`Yppqt3Cs3Y8TZqvASnXl`). Parameters are known. The implementation is not in the project (`codeFileCount: 0`).
- Hover visual deltas for Button, Visit Button, Gallery Image, Artwork Container, Journal card, and Team card. Hover variants exist and have transitions, but the only hover property change the tree exposed is Footer Link opacity `0.5` → `1`.
- Whether a page with `layoutTemplate: null` is formally bound to the project default. The Home desktop screenshot includes the default Navigation and Footer, so Home does render template `NHg9q5Qeu` in practice.
- Full team biographies. The API truncated them. Elena Voss’s portrait control was not returned on that instance.
- Font files. Families are Anton, Inter Display, and Inter. Anton is referenced as `FS;Anton-regular` (Fontshare). Inter Display is `FR;InterDisplay*`. License to self-host was not verified.
- Asset bytes. References were read. Files were not downloaded into this workspace.
- Published-site URL. Inspection used the project canvas, not a live public deployment.

## Site

- Project title: Novum Gallery (copy)
- SEO title: Novum Gallery
- SEO description: Discover cutting-edge contemporary art at Novum Gallery, where creativity and innovation shine.
- Social image: `MT4YasLRwr8u1ROiIAe2ahAcAc.png` (original `Novum Social preview.png`, 1200×630)
- Favicon: `IcV0kL0jPDbrn8hahchdFrHWnmg.png` (`Logo-1.png`, 7340×6879)
- Favicon dark: `j3pD1tCePvtfzLlmMYseNdlm2fs.png` (`Logo.png`, 7340×6879)
- `metadata.reducedMotion`: `true`
- No shaders are used on the site.
- Page transition on layout-template breakpoints: `flowEffect` tween, ease `[0.16, 1, 0.3, 1]`, duration `0.65s`, delay `0s`. Set on the template breakpoint, not on page sections.
- Breakpoint effect rule in this project: only `flowEffect` and `pageEffects` are allowed on page breakpoints.

## Breakpoints

Page frames, not Tailwind defaults:

| Name | Width | Height |
| --- | --- | --- |
| Desktop | `1440px` | `auto` (404 is `1080px`) |
| Tablet | `810px` | `auto` (404 is `1080px`) |
| Phone | `390px` | `auto` (404 is `1080px`) |

Text-style presets have a separate breakpoint map. Do not collapse those into the page widths. See Typography.

Desktop horizontal page padding is `40px`. Tablet and phone overrides generally change that to `20px`. There is no `max-width` on the page frame. Inner content wrappers use `maxWidth: 1800px` where noted. Navigation component desktop variant is `1200px` wide, but the template instance is `width: 100%`, `position: fixed`, `right: 0`, `zIndex: 8`.

## Pages

There is no Artists index, no Exhibitions index, and no Contact page. Contact is a `mailto:` link. Events and team are static sections, not CMS collections.

| Page | Path | Layout template | Notes |
| --- | --- | --- | --- |
| Home | `/` | null in the page node; screenshot shows default template | Primary desktop `WQLkyLRf1` |
| About | `/about` | White background template `sJCsFybcL` | |
| Gallery | `/gallery` | null in the page node | Five fixed CMS slots, not one list |
| Gallery detail | `/gallery/:WwJ0Ih52t` | Default template `NHg9q5Qeu` | CMS detail. SEO title is still `{{Title}} - My Framer Site` |
| Journal | `/journal` | White background template | |
| Journal detail | `/journal/:dfv3yy94g` | White background template | SEO title is still `{{Title}} - My Framer Site` |
| 404 | `/404` | Default template | `noIndex` and `noIndexSite` are true |

Default template `NHg9q5Qeu` (“Template”): vertical stack, white fill, overflow clip. Children: Navigation (fixed), page placeholder, Footer.

White template `sJCsFybcL`: same structure. Navigation instance is `width: 1200px`, fixed, `top/right/left: 0`, `zIndex: 1`. Its own fill was not set on the template frame in the dump.

## Color tokens

Dark values were not set on these tokens.

| Token id | Name | Light |
| --- | --- | --- |
| `29e384f4-6214-47d9-99cd-6867bfc300f5` | Blue | `rgb(18, 2, 231)` |
| `d3bba2dd-82b5-485b-a122-fa9af70f2511` | Blue 70 | `rgba(18, 2, 231, 0.7)` |
| `07289967-0b17-48e4-93a5-e5210f5f78b9` | Grey | `rgb(236, 236, 236)` |
| `1da199f1-65c2-4134-9c69-bea75ce72526` | Grey 70 | `rgba(236, 236, 236, 0.7)` |
| `6ce74eab-f14e-44ac-aa11-394c1e2c975e` | White | `rgb(255, 255, 255)` |
| `237f1f12-fc6e-45df-b468-5ec4bb4571cb` | Gray | `rgb(100, 100, 100)` |
| `9b5d3a08-0d8a-4044-9d0c-1415b48c277f` | Black | `rgb(0, 0, 0)` |
| `748b00bf-2277-4ba8-8602-171553d296f7` | White 90% | `rgb(242, 242, 242)` |
| `810b5972-d5bd-4b02-a8c0-3755bbd4dcc5` | White 80% | `rgb(145, 145, 145)` |
| `11097a86-85f6-4d31-835b-60bfc950a4ad` | Black 90% | `rgb(13, 13, 13)` |
| `9f8f4aa3-9adf-42bd-80ff-1adac41fd377` | Black 80% | `rgb(102, 102, 102)` |
| `9c8ece05-dc08-488b-bf3b-f2d187786870` | Black 95 | `rgb(13, 13, 13)` |
| `50c5193f-187f-451e-9c13-75bfc52432d2` | White 90% (duplicate name) | `rgb(242, 242, 242)` |
| `0ce24e88-6c12-4388-b6e7-fb8e61177477` | Black (duplicate name) | `rgb(26, 26, 26)` |
| `4eeb2a49-1202-4712-81f8-6a07399cae1e` | White (duplicate name) | `rgb(255, 255, 255)` |

Raw colors also used outside tokens:

- Hero overlay `rgba(0, 0, 0, 0.5)`
- Gallery hero overlay `rgba(0, 0, 0, 0.8)`
- Page black sections `rgba(0, 0, 0, 1)`
- Empty CMS state `rgba(204, 204, 204, 0.2)`, radius `20px`, text `rgb(153, 153, 153)`
- Newsletter input focus border `1px solid rgba(0, 153, 255, 1)`
- Placeholder `rgba(153, 153, 153, 1)`

Dividers are `1px` tall, token Gray or White 80%, `opacity: 0.5`.

Border radius on layout frames is `0px` unless noted. Buttons use large pill radii (`406px` on the main Button). Menu and close buttons are `44px` circles (`radius: 100px`).

No box shadows were returned on the inspected sections.

## Typography

All heading presets use **Anton**, weight 400, `fontStyle: normal`, `textTransform: uppercase`. OpenType features on every preset: `blwf`, `cv03`, `cv04`, `cv09`, `cv11` = on.

Body presets use **Inter Display**. Paragraph spacing on the node is a number; breakpoint maps store it as px.

| Preset | Id | Tag | Weight | Desktop | Medium | Small |
| --- | --- | --- | --- | --- | --- | --- |
| Heading 1 | `OrdqRjc0c` | h1 | 400 | min 1200 / 150px / tracking -0.03em / line 150px | min 810 / 80px / -0.03em / 100px | min 0 / 50px / -0.03em / 60px |
| Heading 2 | `rUKP965sS` | h2 | 400 | min 1200 / 80px / -0.02em / 1.1em | min 810 / 64px / -0.04em / 1em | min 0 / 40px / -0.04em / 1em |
| Heading 3 | `VEkRcovV0` | h3 | 400 | min 1440 / 64px / -0.01em / 120% | min 1200 / 48px / -0.01em / 120% | min 0 / 36px / -0.01em / 120% |
| Heading 4 | `JtCYooiuG` | h4 | 400 | min 1440 / 40px / -0.02em / 1.4em | min 1200 / 32px / -0.02em / 1.4em | min 0 / 26px / -0.02em / 1.4em |
| Heading 5 | `joGfz3pyG` | h5 | 400 | min 0 / 24px / -0.04em / 1.4em | same | same |
| Body S | `NiHgD4ei5` | — | 600 | min 1200 / 30px / -0.04em / 30px / paragraph 20px | min 810 / 28px / -0.04em / 28px | min 0 / 24px / -0.04em / 24px / paragraph 0 |
| Body M 2 | `VENWQa34r` | — | 600 | min 1200 / 20px / -0.02em / 140% | min 810 / 20px / -0.02em / 140% | min 0 / 18px / -0.02em / 140% / paragraph 0 |
| Body M 3 | `r2qQu7xPy` | — | 500 | min 1200 / 20px / -0.02em / 150% | min 810 / 20px / -0.02em / 140% | min 0 / 18px / -0.04em / 140% / paragraph 0 |
| Body M 4 | `bRUwoqPDH` | — | 400 | min 1200 / 20px / -0.04em / 150% | min 810 / 20px / -0.02em / 140% | min 0 / 18px / -0.02em / 140% / paragraph 0 |
| Body M 5 | `ucXhGBiic` | — | 500 | min 1200 / 16px / -0.02em / 150% | min 810 / 16px / -0.02em / 150% | min 0 / 16px / -0.02em / 150% / paragraph 0 |
| Body M 5 (label) | `oMmYVswuG` | — | 500 | min 0 / 13px / 0.08em / 1em / uppercase | same | same |
| Body M 6 | `YVWCzsHuW` | — | 400 | min 1200 / 14px / -0.02em / 150% | min 810 / 14px / -0.04em / 150% | min 0 / 14px / -0.02em / 150% / paragraph 0 |

Default preset colors:

- Heading 1, Heading 4: Black `9b5d3a08…`
- Heading 2: Black 90% `11097a86…`
- Heading 3, Heading 5: White
- Body S, Body M 2, Body M 3, Body M 5 (`ucXhGBiic`), Body M 6: Grey
- Body M 4: Gray
- Label Body M 5 (`oMmYVswuG`): Black

Instances often override `textColor`. Use the instance color, not the preset default, when both exist.

Navigation wordmark `NOVUM` is not a preset. It is Anton, 30px, weight 400, tracking `-0.01em`, line-height `1.1em`, color White, tag `p`. Mobile wordmark uses Heading 3.

## Shared chrome

### Navigation `seeN7ngQb`

Variants: Desktop, Tablet, Mobile, Mobile Open, Desktop Solid, Tablet Solid, Mobile Solid, Solide Open Mobile.

Desktop variant `vI28NQ6tP`: `1200px` wide, padding `20px 40px`, horizontal stack, gap `0`, transparent fill `rgba(255, 255, 255, 0)`.

Three columns, each `width: 1fr`:

- Left links, gap `34px`: Home `/`, About `/about`, Gallery `/gallery`. Preset `oMmYVswuG`, color White.
- Center logo `NOVUM` links to `/`.
- Right links, gap `34px`, distribution end: Journal `/journal` (layer name is “Contact Link”), Contact `mailto:tommydreamchaser@gmail.com`.

Mobile bar is inside the same desktop variant (hidden by variant logic that was not separately measured): menu button `44×44`, padding `10px`, radius `100px`, icon `22×22`; centered logo; `44×44` spacer.

Mobile overlay `wTuet1tm7`: `100% × 100vh`, padding `28px 28px 56px 28px`, gap `56px`, vertical, fill Black, `zIndex: 9`. Overlay links use Heading 2, gap `22px`: Home, About, Gallery (no `link` property was returned), `journal` → `/journal`, `Journal` → `/journal`, Contact. The duplicate Journal labels are in the file as-is.

Template placement: fixed, full width, `zIndex: 8`.

### Footer `AhFEnemzU`

Desktop `gmj0a1pbM`: `1440px`, padding `100px 40px 20px 40px`, gap `10px`, fill Black.

Content is a horizontal stack, gap `201px`, space-between.

- Wordmark: `NOVUM GALLERY`, Heading 2, White.
- Slogan: `Contemporary Art · Quarterly · Since 1998`, Body M 5, White 80%.
- Address: `Bredgade 41, Copenhagen K. Admission free; quiet appreciated.`, Body M 6, White.
- Sections: Home, About, Gallery, Journal, Contact (`mailto:tommydreamchaser@gmail.com`).
- Correspondence: `post@novumgallery.com` and `press@novumgallery.com`. Both `mailto` targets are `mailto:tommydreamchaser@gmail.com`, not those displayed addresses.
- Phone label `+45 33 14 22 08` has no href in its controls.
- Visit: `Tue – Fri, 11 – 18` / `Sat – Sun, 11 – 16` / `Mon, Closed`.
- Rule, then `© MMXXVI · NOVUM GALLERY` and `Designed by Tomiwa Olaide`, Body M 6, White.

Footer Link component `MoJ4bQjE6`: base opacity `0.5`. Hover opacity `1`. Transition tween ease `[0.16, 1, 0.3, 1]`, duration `0.35s`.

### Newsletter `L_nVzwcjd`

Copy:

- `THE CORRESPONDENCE` — Body M 5, White 80%
- `stay connected` — Heading 3
- `Receive updates on exhibitions, events, and new acquisitions.` — Body M 2, White 80%
- `Quarterly · No more than four letters a year` — Body M 5, White 80%

Email input `jxlTizlBT`: name `Email`, type `email`, placeholder `jane@framer.com`, placeholder color `rgba(153, 153, 153, 1)`, font size `14px`, height `40px`, padding `12px`, radius `0`, width `1fr`. Focus border `1px solid rgba(0, 153, 255, 1)`. Submit uses Button 3 with a White color control. Form node type was not returned by `getNodesOfTypes("FormNode")`. Destination (email, sheet, or none) is unverified.

Home instance entrance: onInView, threshold `0.25`, opacity 0, y `20`, tween `[0.16, 1, 0.3, 1]`, `0.8s`.

### Smooth Scroll

External component. Control `intensity: 16`. Position absolute, `zIndex: 1`, on Home, About, Gallery, both details, Journal, and Journal detail. Not on the 404 dump.

## Home `/`

Desktop frame fill `white`. Main `p5zh5qGuz` is a vertical stack, gap `0`, width `1fr`, overflow `clip`.

### Hero `IFYb_kLxf`

- `1fr × 100vh`, fill white, overflow clip, gap `0`.
- Container `rbUvEt_y8`: `1fr × 100vh`, vertical, space-between, padding `200px 40px 20px 40px`. Phone and tablet: padding `200px 20px 20px 20px`.
- Top row: horizontal, space-between, gap `501px`, `zIndex: 4`.
  - Left group gap `378px` (tablet and phone gap `120px`, distribution `start`): `Est. 2000` (white) and description `Discover cutting-edge contemporary art at Novum Gallery, where creativity and innovation shine.` (`maxWidth: 334px`).
  - `London`, white, align right. Phone width changes from `1fr` to `auto`. Phone top row direction becomes vertical.
- Title `tF0Y3gLCU`: text `NOVUM gallery`, tag `h1`, preset Heading 1, color White, `zIndex: 4`. Uppercase comes from the preset, so it paints as NOVUM GALLERY. Entrance: onInView threshold `0.5`, y `40`, opacity 0, tween ease `[0.44, 0, 0.56, 1]`, `0.6s`, delay `0.2s`.
- Image `FIZhn2X4E`: absolute, right `0`, bottom `0`, `1440×354`, `zIndex: 1`, asset `TXF33R4mBXzYVhzKszP4VieJg.png` (1558×1010). Entrance: onInView threshold `0.2`, scale `1.04` → 1, tween `[0.16, 1, 0.3, 1]`, `0.95s`.
- Overlay `a1iuaSXAb`: absolute, all edges `0`, `1440×1029`, `zIndex: 1`, `rgba(0, 0, 0, 0.5)`. Entrance opacity, same ease, `0.75s`, delay `0.12s`.

### About `YZWX9IY_M`

Padding `100px 40px` (phone/tablet `100px 20px`). Fill White. Inner `maxWidth: 1800px`, gap `64px`.

Header is horizontal, space-between, gap `313px`. Phone: vertical, gap `40px`.

- Year `2026`, Gray.
- Title `ABOUT US`, Black.
- Description, `maxWidth: 440px` (tablet/phone `360px`), Gray: `Founded with a commitment to supporting emerging and established artists, the gallery creates meaningful connections between art, culture, and community.`
- Title group entrance: y `40`, ease `[0.44, 0, 0.56, 1]`, `0.6s`, delay `0.2s`, threshold `0.5`.

Highlight row: horizontal, gap `40px`. Phone: vertical.

- Image column gap `176px` (phone `40px`). Artwork image `HTZLaGAn1`: width `100%`, height `660px` (phone `1fr` × `400px`), asset `ZAsBm9VSOolmzziA2MS8Qsw7c34.png` (2400×2400). Entrance scale `1.03`, `0.9s`, delay `0.08s`, ease `[0.16, 1, 0.3, 1]`.
- `COME SEE US`, Black, Heading-colored via instance. Visit Button `122×24`, label `BOOK TICKET`, color Black. Link target was not set on this instance.
- Stats, gap `22px`, entrance y `20`, `0.85s`, delay `0.16s`, stagger `0.08s`:
  - `126` / `UNIQUE ART WORKS`
  - `38` / `FEATURED ARTIST`
  - `24` / `YEARS OF EXCELLENCE`
  - Counts are Heading 4, Black. Labels are Body M 6, Gray.
- Portrait `qtX_cDFcT`: height `721px` (phone `400px`), asset `BEQDpqGK3LvV2C9mgHtT8jFCGE.png` (1808×2400).
- `APRIL - AUGUST 2026` (Body M 2, Black, width `325px`, align right) and `The gallery supports artists by connecting art, culture, and community.` (Body M 4, Gray, align right). Phone footer info alignment changes from `end` to `start`, and that row stacks vertically.

### Works `E0MeHnlZ6`

White, vertical, gap `64px`. Header padding `120px 40px 0 40px` (tablet `100px 20px 0 20px`, phone `100px 20px 0 20px`). Header gap `408px`, space-between.

- `(20)` Body M 5, Gray
- `SELECTED arts` Heading 3, Black
- Description `maxWidth: 440px`, Body M 3, Gray: `A curated selection from recent collections  paintings, sculpture, photography, and installation by represented artists.`

Collection list `dCbfiXQ5V`, collection Gallery, page size `1`, filter Title contains `White Horizon`. The row is horizontal, gap `30px`, wrap enabled. The visible item is Gallery Image at `1fr × 100vh`. List entrance: y `20`, scale `0.98`, `0.9s`, delay `0.08s`, stagger `0.08s`. Image entrance: scale `1.03`, `0.95s`, delay `0.08s`.

Gallery Image controls: image = CMS Hero Image, title = CMS Title, a path string `/gallery`, and a link to `/gallery/:WwJ0Ih52t` with collection item `white-horizon`.

### Image Reveal `ppwOXsS1K`

Fill Black. Container is `position: sticky`, `zIndex: 1`, padding `120px 40px` (tablet `80px 20px`, phone `0 20px`). Gap `80px`.

Three Unrolling Image instances, each desktop `600×70vh`. Tablet height `50vh`. Phone width `1fr` (height override not in the phone diff, so `70vh` still applies unless inherited differently).

| Slot | Alignment | Asset | Scroll start |
| --- | --- | --- | --- |
| 1 | start | `G6tKqB5gbX86WgjncJp4yJ4RpxA.png` 1200×991 | top |
| 2 | center | `04lEEc2xS3BjYEKa0mu2T5jtVOA.jpg` 5760×3639, alt `brown loveseat surrounded by photo frame lot` | center |
| 3 | end | `2WA6Ne0jg6jrsNznhgsMK4c4mik.jpg` 5184×3456, alt `a man and woman standing in a room with a wall of paintings` | top |

Shared controls: `preview: true`, `angle: 45`, `rolls: 8`, `rollRadius: 0.5`, `triggerMode: scroll`, `animationDuration: 1.7`, `animationDelay: 0`, `replay: true`.

### Video `SkvPPAKMt`

Fill Black. Container sticky, `zIndex: 1`. Desktop padding `0`. Tablet padding `80px 20px`. Phone padding `0 20px`.

Video instance `1fr × 100vh`. File `0w3ywkytwRirgimBgimozB5zeg.mp4` (`6026214_People_Person_3840x2160.mp4`). `srcType: Upload`, `backgroundColor: rgba(0,0,0,0)`, `controls: false`, `volume: 25`.

Scroll transform on the video node: trigger `onScrollTarget`, viewport `end`, spring stiffness `340`, damping `100`, mass `1`. Section 0 scale `0.4`. Section 1 target `SkvPPAKMt` scale `1`. Opacity stays `1`.

Spacer under the video: desktop padding bottom `120px` and an inner `100vh` frame. Phone spacer padding becomes `0`.

### Upcoming Events `w8dWmaebb`

Padding `120px 40px` (tablet/phone `100px 20px`). Fill black. Inner `maxWidth: 1800px`, horizontal, gap `135px` (tablet gap `80px`, phone vertical gap `40px`).

Left column `maxWidth: 440px`, gap `40px`:

- `CALENDAR` Body M 6, White 80%
- `UPCOMING EVENTS` Heading 3, White
- Image `1fr × 208px` inside a `240px` column: `QjfUqPJ5WApRqg5xf6vxDxVm4k.jpg` (1080×1920)
- `Detail- Gold Leaf, Plaster` and `Gallery`, Body M 5, White, space-between

Right column `maxWidth: 670px` (tablet/phone `440px`), gap `40px`. Three rows, then a `1px` divider at opacity `0.5`.

| Day | When | Title |
| --- | --- | --- |
| 28 | JUNE 19:00 | ARTIST TALK |
| 12 | JULY 20:00 | Summer Opening Reception |
| 20 | AUGUST 18:00 | Collector Preview |

Each description is `An evening with Ines Mortensen in conversation with the gallery's editor.` Day is Heading 4, White. Time and description are Body M 6, White 80%. Title is Heading 5. Button label `RESERVE`, color White, link `mailto:tommydreamchaser@gmail.com`.

Phone event rows change `layout` from `stack` to `grid`. The grid template (columns, rows) was not on the node. Treat the grid track definition as unverified. Button width becomes `1fr`.

Row entrance: onInView. Exact per-row values were not re-dumped; the flag is present.

### Journal `dRZ1ew9P1`

Padding `120px 40px`, gap `64px` (phone padding `100px 20px`, gap `40px`). Fill white. Inner `maxWidth: 1800px`, gap `64px`.

Header horizontal, space-between, end-aligned, gap `408px`.

- `JOURNAL` Body M 5, Gray
- `PERSPECTIVES` Heading 3, Black
- `Stories, essays, and reflections from artists and curators.` Body M 4, Gray, align right

Cards: horizontal, gap `40px` (tablet gap `20px`). Phone: vertical. Each card slot is `608px` tall on desktop and `auto` on tablet and phone.

Two lists, each page size unset (not returned):

- Title contains `INSIDE THE STUDIO` → Journal Article CARD, image top
- Title contains `MATERIAL` → second card. Variant (image bottom vs top) was not confirmed on the second instance.

Card controls bind Featured Image, Title, Read Time, Excerpt, and link `/journal/:dfv3yy94g` via the slug variable.

Journal card component desktop `YCv6gVVKh`: `670px` wide, vertical, gap `10px`. Variants: Image Top, Image Top hover, Image Bottom, Image Bottom hover, Phone. Hover transition spring `0.4s`, bounce `0.2`. Visual delta unverified.

## About `/about`

Desktop fill is White token. Template is the white-background template.

| Section | Padding | Gap | Fill |
| --- | --- | --- | --- |
| Hero | `160px 40px 40px 40px` | `85px` | white |
| Image | `0` | `40px` | image, height `fit-image` |
| Vision | `120px 40px` | `64px` | Black token |
| Milestone | `120px 40px` | `80px` | black |
| Location | `120px 40px` | `80px` | white |
| Curation | `120px 40px` | `80px` | white |
| Team | `120px 40px` | `64px` | black |
| Video | — | — | instance `1fr × 100vh` |
| Newsletter | — | — | instance |

Hero motto, Heading 3 used as `h1`, Black, `maxWidth: 1130px`: `Championing contemporary artists through thoughtful exhibitions, cultural dialogue and timeless collections.`

Overview, Body M 3, Gray, `maxWidth: 440px` (tablet and phone override `maxWidth` to `670px`): `We invite you to immerse yourself in the essence of a culture that withstands the test of time. Through artistic expression, master artisans bring to life Vietnam’s stories of resilience and beauty.`

Quote, Heading 3, White, `maxWidth: 785px`: `“Art isn’t just what you see, but what you help others see.”`

Vision labels, Body M 3, White 80%: `Our Vision`, `Art Gallery Origin`.

Vision body, Body M 3, White 80%, `maxWidth: 670px`. Full text:

> NOVUM was conceived as more than a gallery. It is a living archive of contemporary thought, a space where the boundaries between artist, artwork, and audience dissolve into something more intimate and more enduring.
> We believe in the slow looking that great art demands. In an age of endless scrolling and instant consumption, we offer something rarer: the chance to stand still before something that refuses to be understood at a glance. Our exhibitions are conversations, not monologues. Our collections are arguments, not inventories.
> Every work we show, every artist we represent, every programme we host is chosen with a single question in mind: does this expand what we think art can be? If the answer is yes, we make room for it.

Milestones, year Heading 4 White, label Body M 5 White 80% align right:

- 2000 Gallery Founded
- 2008 First International Exhibition
- 2016 Permanent Collection Expanded
- 2026 Global Contemporary Programme

Location, Body M 4, Black, `maxWidth: 440px`: `The gallery occupies a former industrial warehouse, transformed by architects into a sequence of luminous white rooms. Natural light enters through sawtooth roof windows, shifting across the walls as the day progresses.`

Facts, Body M 4, Gray. Facts column `maxWidth: 670px` (tablet/phone `440px`):

- Main Gallery `320 m²`
- Project Space `120 m²`
- Reading Room `80 m²`
- Garden `200 m²`

Curation statement, Heading 3, Black: `Every exhibition is an act of care`

Curation body, Body M 4, Gray:

> Our curatorial practice begins with deep research and ends with precise installation. Between those two points lies months of conversation, studio visits, and the careful negotiation of how a work wants to be seen.
> We do not chase trends. We follow artists who have something urgent to say and the discipline to say it well. Our role is to create the conditions in which their work can speak most clearly.
> The gallery programme alternates between solo presentations that offer immersive encounters with a single artist, and thematic group exhibitions that draw unexpected connections across generations and geographies.

Team title: `meet the team`, Heading 3, White. Phone team row stacks vertically.

Team card component `ikPrvcpIu` is `440px` wide, vertical, gap `20px`. Instances are `width: 1fr`.

| Role | Name | Image |
| --- | --- | --- |
| Director | elena voss | not returned on this instance |
| Chief Curator | Marcus Chen | `FWgVurewiA2wfFD3Cqp6Bx3vok.png` 440×250 |
| Exhibition Manager | Sofia Laurent | `x878SZiIPC94zdNoNn7xU8oCRo0.png` 440×250 |

Bios were truncated by the API. Do not invent the missing sentences. Hover spring `0.4s`, bounce `0.2`. Visual delta unverified.

About video is a second Video instance. Its file and scroll props were not dumped separately from the Home video. Treat them as unverified until that node is read.

Phone stacks Overview, Vision content, Milestones, and Curation. Tablet keeps those rows horizontal and only reduces gap and padding. See the measured diffs below.

## Gallery `/gallery`

Hero `1fr × 80vh`, padding `120px 40px`, fill white. Phone/tablet padding `100px 20px`.

- Absolute image `1440×832`: `BukJzi24F5Uz2uvWiGRyoanMs.png`
- Absolute overlay `1440×801`, `rgba(0, 0, 0, 0.8)`
- Copy column `maxWidth: 700px`, gap `20px`
  - `GALLERY`, Heading 2, White, center, tag `h1`
  - Same Vietnam overview sentence as About, Body M 3, `rgb(242, 242, 242)`, center

Arts section padding `120px 40px` (phone/tablet `100px 20px`), gap `40px`. Background image `RX8EkDN2AseOlCLQAA7NcHIvQ.png` (`Portrait Image Background.png`, 4320×7092).

The layout is not one collection grid. It is five lists, page size 1, Title `contains`:

1. `Material memory` — left of a row, gap `120px` (phone gap `40px`, vertical)
2. `Timeless Motion` — right of that row
3. `White Horizon` — centered column, `maxWidth: 670px`
4. `Botanical Echo` — left of the next row, gap `120px` (phone stacks)
5. `Silent Reverie` — right of that row

Rows 1, 2, 4, and 5 use Gallery Image. The center slot uses Artwork Container. Empty states exist on each list.

Artwork Container `Ppn2F6LdV` variants: Portrait `669px` wide, Landscape, Wide, plus hovers and Phone. Portrait gap `10px`. Center instance is variant `wDoe8raF9` (Wide) on the detail page; the index center instance’s variant was not re-read. Hover spring `0.4s`, bounce `0.2`. Visual delta unverified.

## Gallery detail `/gallery/:slug`

| Section | Padding | Gap | Fill |
| --- | --- | --- | --- |
| Hero | `120px 40px` (phone `120px 20px`) | `97px` | black |
| Artist | `120px 40px` (phone `100px 20px`) | `64px` | Black token |
| Large view | `120px 40px` (phone `100px 20px`) | `97px` | white |
| Next | `120px 40px` (phone `100px 20px`; phone also gap `40px` and vertical) | `80px` | black |

Hero is Artwork Container variant Wide, `maxWidth: 800px` (phone `700px`). Bindings: Hero Image, Title, Medium & Dimensions. Title color White. Secondary color White 80%.

Static labels: `Biography`, `Accolades` (Heading 4, White), `Detailed View` (Heading 3, Black), `Next Artwork` (Heading 3, White).

CMS bindings: Artist Name, Artist Age, Biography, Accolades, Detailed Description. Contact button label `CONTACT ARTIST`, color White. Buy button label `BUY ART`, color Black. Their link controls were not set in the dumped controls (Contact Artist Link exists on the CMS item but was not bound on the button in the keys returned). Next button label `View Artwork`, White, link `/gallery/:WwJ0Ih52t` via `nextItemId` slug.

Phone stacks Artist Details and the large-view text row.

## Journal `/journal`

Hero `1fr × 50vh`. Inner container padding `120px 40px` (phone `100px 20px`).

- `Journal`, Heading 2
- `Go behind the canvas with The Canvas Journal. Explore our latest curatorial insights, in-depth artist profiles, and behind-the-scenes exhibitions.` Body M 4, Gray, center

List `ZT37WO3wr` has no title filter and no page size in the dump. It repeats Journal Article CARD. Padding on the list frame: `40px 40px 120px 40px` (phone `40px 20px 100px 20px`), gap `40px`.

## Journal detail `/journal/:slug`

| Region | Desktop padding | Phone padding |
| --- | --- | --- |
| Hero | `120px 40px` | `100px 20px` |
| Title and excerpt container | `120px 40px 40px 40px` | `100px 20px 20px 20px` |
| Content | `40px 40px 120px 40px` | `20px 20px 100px 20px` |
| Next journal | `120px 40px`, gap `64px` | `100px 20px` |

Bindings: Title (`maxWidth: 700px`, phone `560px`), Role, Author, Read Time, Hero Heading, Excerpt, Content (rich text). A featured image frame exists (`Image` section). Its asset binding was not in the text-binding pass and still needs a node read before implementation.

Static: `JOURNAL` Body M 5 Gray, `next journal` Heading 3 Black. Next card binds the next item’s image, title, read time, excerpt, and slug.

## 404 `/404`

Frame height `1080px`. Hero `100vh`, padding `120px 40px`.

- `This Room Doesn't Exist.` Heading 2, White, center, tag reported as Gallery Title
- Body, Body M 3, `rgb(242, 242, 242)`, center: `The artwork you're looking for isn't on display here. It may have been moved to another collection, archived, or perhaps it never belonged to this exhibition. Return to the gallery and continue your exploration.`

The hero’s image and overlay were not expanded. Phone changes the main stack from horizontal to vertical and content padding to `40px 0`.

## CMS

### Gallery `WwJ0Ih52t`

Fields: Title, Slug, Medium & Dimensions, Hero Image, Artist Image, Artist Name, Artist Age, Contact Artist Link, Biography, Accolades, Detailed Image, Detailed Description.

All five items use artist **Alfredo Maresca**, age `28 Years`, contact `mailto:tommydreamchaser@gmail.com`, and the same artist portrait `z5PZm9VbKtE9S4JUG8eCitRbyrA.png` (1600×2400, `Joyful Artist at Work.png`).

| Slug | Title | Medium | Hero / detail file |
| --- | --- | --- | --- |
| `material-memory` | Material Memory | Lime Plaster, Gold Leaf & Natural Pigments · 150 × 180 cm | `nTWJBzwgpVE4YEMCHZReluGb1bs.png` 1402×1122 |
| `timeless-motion` | Timeless Motion | Mixed Media on Wood · 140 × 100 cm | `k5bGDuw2oO923TfAbFBpRKYVDVM.png` 1122×1402 |
| `white-horizon` | White Horizon | Mixed Media on Canvas · 100 × 120 cm | `TGkBjOUAgx5ity0SFtEGGty240Y.png` 1122×1402 |
| `botanical-echo` | Botanical Echo | Oil & Gold Leaf on Canvas · 80 × 80 cm | `wKiHP9A61XSWNwy902MdZRn8s.png` 1122×1402 |
| `silent-reverie` | Silent Reverie | Mixed Media on Wood · 120 × 160 cm | `MF8XF1YVRliPGuqKy3nufjqvQ4.png` 1086×1448 |

There is no price, currency, availability, or year field. Long biographies for Silent Reverie were truncated in the API (`…`). Re-read that item before publishing the full paragraph.

### Journal `dfv3yy94g`

Fields: Title, Slug, Category (enum), Author, Role, Published (date), Read Time, Excerpt, Hero Heading, Featured Image, Content (rich text).

Categories: `Studio Notes` (`H5G81ikbA`), `Curatorial Essay` (`yLk89Uk79`).

| Slug | Title | Category | Author | Role | Published | Read time |
| --- | --- | --- | --- | --- | --- | --- |
| `inside-the-studio-on-slowness-as-a-method` | Inside the Studio: On Slowness as a Method | Studio Notes | Editorial Team | NOVUM Journal | 2026-04-18 | 7 min read |
| `material-memory-silence-the-language-behind-the-collection` | Material, Memory & Silence: The Language Behind the Collection | Curatorial Essay | Sophia Andersen | Chief Curator | 2026-05-02 | 9 min read |

Excerpts and hero headings were read in full. Rich-text bodies were truncated. Featured images:

- Studio: `CpHBSQTyMpjzDUu3ulSTpfNxkk.jpg`, alt `A quiet contemporary artist studio with unfinished paintings, pigments, brushes, and morning light.`
- Essay: `922EjkZBSekwtJlAHf5d4ORI.jpg`, alt `A quiet contemporary art gallery with paintings mounted on white walls and soft natural daylight.`

Home journal filters use `contains` on `INSIDE THE STUDIO` and `MATERIAL`. Those strings do not match the title casing exactly (`Inside the Studio`, `Material, Memory`). Whether Framer’s contains filter is case-insensitive was not tested. The Home screenshot does show two journal cards, so both lists resolved to an item in the canvas.

## Motion already measured

| Place | Trigger | Values |
| --- | --- | --- |
| Page template | flow | tween `[0.16, 1, 0.3, 1]`, `0.65s` |
| Hero title | in view 0.5 | y 40, opacity 0, ease `[0.44, 0, 0.56, 1]`, `0.6s`, delay `0.2s` |
| Hero image | in view 0.2 | scale 1.04, ease `[0.16, 1, 0.3, 1]`, `0.95s` |
| Hero overlay | in view 0.2 | opacity 0, same ease, `0.75s`, delay `0.12s` |
| About image | in view 0.25 | scale 1.03, `0.9s`, delay `0.08s` |
| About stats | in view 0.25 | y 20, `0.85s`, delay `0.16s`, stagger `0.08s` |
| Works list | in view 0.2 | y 20, scale 0.98, `0.9s`, delay `0.08s`, stagger `0.08s` |
| Gallery image | in view 0.2 | scale 1.03, `0.95s`, delay `0.08s` |
| Newsletter | in view 0.25 | y 20, `0.8s`, stagger `0.08s` |
| Unrolling images | scroll | duration `1.7`, replay, angle 45, 8 rolls, radius 0.5 |
| Home video | scroll target | spring 340 / 100 / 1, scale 0.4 → 1 |
| Footer link hover | hover | opacity 0.5 → 1, tween `0.35s` |
| Button and Visit hover | hover | tween `0.35s`, visual delta unverified |
| Artwork, journal, team hover | hover | spring `0.4s`, bounce `0.2`, visual delta unverified |
| Smooth scroll | always | intensity 16 |

`prefers-reduced-motion` is enabled at the site metadata level (`reducedMotion: true`). Reproduce that as the Framer setting, and also respect the user’s OS reduced-motion preference without changing the default look for everyone else.

## Responsive diffs

Format is primary → replica. Only stored differences are listed.

### Home tablet `MbJlLWW0s`

- Hero container padding `200px 40px 20px 40px` → `200px 20px 20px 20px`
- Left nav gap `378px` → `120px`, distribution `start`
- Location text width `1fr` → `auto`
- About padding `100px 40px` → `100px 20px`
- About title and description max width `440px` → `360px`
- Works header padding `120px 40px 0 40px` → `100px 20px 0 20px`
- Reveal padding `120px 40px` → `80px 20px`; unrolling images `70vh` → `50vh`
- Video container padding `0` → `80px 20px`
- Events padding `120px 40px` → `100px 20px`; row gap `135px` → `80px`; list max width `670px` → `440px`
- Event rows lose horizontal stack distribution in the replica (direction read back as null). Confirm against a tablet screenshot before coding.
- Reserve buttons `auto` → `1fr`
- Journal padding `120px 40px` → `100px 20px`; card gap `40px` → `20px`; card height `608px` → `auto`

### Home phone `xXjdmJx45`

Includes the tablet padding changes, plus:

- Hero top row horizontal → vertical
- About header horizontal → vertical, gap `313px` → `40px`
- Highlight row horizontal → vertical
- Image column gap `176px` → `40px`
- Artwork image `100% × 660px` → `1fr × 400px`
- Stats gap `64px` → `40px`
- Portrait row horizontal → vertical; image `721px` → `400px`; info alignment `end` → `start`
- Reveal padding → `0 20px`; unrolling width `600px` → `1fr`
- Video container padding → `0 20px`; spacer bottom padding `120px` → `0`
- Events row horizontal → vertical, gap `40px`
- Event containers stack → grid (tracks unverified)
- Journal gap `64px` → `40px`; cards horizontal → vertical

### About

Tablet: hero padding `160px 40px 40px 40px` → `140px 20px 40px 20px`. Mission gap `120` → `80`. Overview gap `250` → `80`. Overview text max width `440` → `670`. Section padding `120px 40px` → `100px 20px`. Milestones gap `370` → `40`. Location facts max width `670` → `440`. Curation gap `80` → `40`. Curation image max width `670` → `555`.

Phone adds vertical stacking on Overview, Vision content, Milestones, Curation, and Team. Mission gap becomes `40`. Overview gap becomes `20`.

### Gallery

Tablet: hero and arts padding `120px 40px` → `100px 20px` only.

Phone: those padding changes, and both artwork rows horizontal → vertical, gap `120px` → `40px`.

### Artwork detail phone

Hero padding → `120px 20px`. Wide artwork max width `800` → `700`. Artist, large view, and next padding → `100px 20px`. Artist details horizontal → vertical, gap `64` → `40`. Large-view text row stacks. Next section stacks, gap `80` → `40`. Next image max width `555` → `670`.

### Journal phone

Hero inner padding `120px 40px` → `100px 20px`. List padding `40px 40px 120px 40px` → `40px 20px 100px 20px`.

### Journal detail phone

Hero `120px 40px` → `100px 20px`. Title max width `700` → `560`. Title block `120px 40px 40px 40px` → `100px 20px 20px 20px`. Content `40px 40px 120px 40px` → `20px 20px 100px 20px`. Next block `120px 40px` → `100px 20px`.

### 404 phone

Main stack horizontal → vertical. Content padding `40px` → `40px 0`.

Tablet diffs for Gallery detail, Journal, Journal detail, and 404 were not extracted. Do not invent them.

## Map to the requested gallery features

| Requested area | Framer page or section | Public layout |
| --- | --- | --- |
| Home | `/` | Reproduce |
| Artworks index | `/gallery` | Reproduce. It is a composed layout of five filtered slots, not a generated grid |
| Artwork detail | `/gallery/:slug` | Reproduce |
| Artists index and profiles | none | Do not invent a page. Artist fields live on the Gallery CMS item and the detail page |
| Exhibitions | none | Events on Home are static. Do not invent an exhibitions page |
| Journal | `/journal` and `/journal/:slug` | Reproduce |
| About | `/about` | Reproduce. Story, vision, place, team |
| Contact | mailto in nav, footer, and event buttons | Do not invent a contact page |
| Enquiry | `RESERVE`, `CONTACT ARTIST`, `BUY ART`, `BOOK TICKET` | Buttons exist. A validated enquiry form does not exist in the design |
| 404 | `/404` | Reproduce |

## Branding that may change later

Only after the layout is reproduced, and only with real TAO BUTAO facts:

- Visible wordmarks `NOVUM` and `NOVUM GALLERY`
- SEO title and description
- Footer slogan, address, hours, emails, phone, copyright
- The `mailto:tommydreamchaser@gmail.com` targets

Do not replace artwork titles, artist names, prices, or history with invented TAO BUTAO facts. The Novum copy and CMS items stay as the reference content until client assets and facts are supplied.

Displayed emails (`post@novumgallery.com`, `press@novumgallery.com`) do not match the mailto target. Preserve that mismatch until the client supplies real addresses. Do not “fix” it during the visual reproduction.

## Still to read before coding those pieces

- About video instance controls
- Journal detail featured-image binding
- Gallery Image, Artwork Container, and Journal card internal text styles and image frames
- Full Silent Reverie biography and both Journal rich-text bodies
- Elena Voss portrait and the uncut team bios
- Tablet overrides for detail, journal, and 404
- Hover variant property diffs beyond footer opacity
- Asset download and object-fit check against screenshots at 1440, 810, and 390
