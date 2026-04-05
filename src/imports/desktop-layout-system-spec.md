🔴 FINAL TASK — Desktop Layout System Completion (Structural, Not Visual Fixes)

This is NOT a screen-level fix.

We are finalizing the Desktop Layout Architecture so that:
	•	All screens start at the same vertical baseline.
	•	All screens follow a defined width policy.
	•	No screen defines its own spacing logic.
	•	Scrollbar always sits at viewport edge.
	•	Large displays no longer make detail screens look tiny.
	•	Sidebar expanded/collapsed does NOT affect internal layout rules.

⸻

1️⃣ LOCK THE DESKTOP ARCHITECTURE

Final hierarchy must be:

Viewport
→ MainLayout (Stage Container, flex-based)
→ Sidebar + ContentColumn
→ DesktopContentWrapper
→ DesktopPageHeader
→ ScreenContent

No screen may insert spacing outside this structure.

⸻

2️⃣ GLOBAL DESKTOP PAGE HEADER (MANDATORY)

Create ONE shared component:

DesktopPageHeader

Responsibilities:
	•	Defines vertical start baseline for ALL screens.
	•	Handles:
	•	Back button (optional)
	•	Title
	•	Subtitle (optional)
	•	Action buttons (optional)
	•	Defines:
	•	fixed top padding
	•	fixed gap between back row and title row
	•	fixed gap between header and first content block

Rules:
	•	Screens must NOT render their own back/title layout.
	•	Screens must NOT use mt-, pt- to position header.
	•	Screens must NOT wrap header in additional containers.
	•	Header must live inside DesktopContentWrapper.

PASS CONDITION:
When scrolling to top:
The top edge of the header is identical (±1px) across:
	•	Klassenarbeiten list
	•	Klassenarbeit detail
	•	To-Do verwalten
	•	My Flashcards
	•	Completed Exams
	•	Profil sub pages

⸻

3️⃣ DESKTOP CONTENT WIDTH POLICY (NO MORE RANDOM MAX-W)

We introduce a strict enum-based width policy:

contentWidth:
	•	“standard”
	•	“wide”
	•	“full”

Mapping inside DesktopContentWrapper ONLY:

standard → maxWidth = 1200px
wide → maxWidth = 1440px or 1600px (define explicitly)
full → no max width limit

Screens may ONLY declare policy.
They may NOT define max-w classes.

Remove:
	•	all max-w-* inside screens
	•	all mx-auto inside screens
	•	all px wrappers that affect outer content width

⸻

4️⃣ AUTO-ASSIGN WIDTH POLICY BY SCREEN TYPE

Do NOT manually fix individual screens.

Instead apply logic:

Detail / Entity Pages (have back button + entity header):
→ contentWidth = “wide”

Dashboard / Overview Pages:
→ contentWidth = “standard”

Data-heavy / Management Screens:
→ contentWidth = “full” (if necessary)

Implement this rule at router or layout-level if possible.

No hardcoded per-screen tweaks.

⸻

5️⃣ REMOVE ALL SCREEN-LEVEL SPACING OFFSETS

Search entire project for:

mt-
pt-
max-w
mx-auto
margin-left
margin-right
padding-left
padding-right

Remove any usage that affects outer page framing.

Spacing is only allowed:
	•	inside cards
	•	inside internal components

Never at screen root level.

⸻

6️⃣ SCROLL RULE (STRICT)

Scrolling must occur at root layout level.

Confirm which element scrolls:
html, body, #root, or layout container.

Rules:
	•	No margin-right on scroll container
	•	No padding-right on scroll container
	•	Scrollbar must sit flush at viewport edge
	•	No nested scroll containers for main page content

If a screen currently scrolls inside its own container → remove that.

⸻

7️⃣ LARGE SCREEN BEHAVIOR

On viewport width ≥ 1600px:
	•	Detail pages must expand according to “wide” policy.
	•	They must NOT remain visually tiny islands.
	•	Content must remain centered.
	•	Sidebar collapse must NOT change content width policy.
	•	Only available viewport width changes outer space.

⸻

8️⃣ DEBUG OVERLAY (MEASURABLE ENFORCEMENT)

Extend Debug Overlay to show:

headerTopY
firstContentTopY
contentWidthPolicy
resolvedMaxWidth
wrapperLeft
wrapperRight
distanceSidebarToContent
distanceContentToViewportRight

PASS if:
	•	headerTopY equal across screens (±1px)
	•	firstContentTopY equal across screens (±1px)
	•	contentWidthPolicy correct per screen type
	•	Scrollbar flush at viewport edge

⸻

9️⃣ ACCEPTANCE CRITERIA (NON-NEGOTIABLE)

For Desktop:
	•	All screens share identical header baseline.
	•	No screen defines its own outer spacing.
	•	No screen defines its own max width.
	•	Large displays no longer make detail screens look undersized.
	•	Sidebar expanded/collapsed does not change structural layout.
	•	Scrollbar remains at viewport edge.

If any screen requires per-screen margin fix → architecture is wrong.

⸻

🔴 IMPORTANT

Do NOT:
	•	Add mt adjustments to individual screens.
	•	Add custom max-width to Klassenarbeit or similar.
	•	Patch visual differences manually.
	•	Use margin-right hacks.

This is a structural system correction.

Deliver:
	•	Updated layout files
	•	Updated DesktopPageHeader
	•	Updated DesktopContentWrapper
	•	Debug overlay verification screenshots