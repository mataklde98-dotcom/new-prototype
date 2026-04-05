TASK — Fix Profile Scrollbar Inset (Desktop)

Goal: Profil muss die gleiche Scrollbar-Regel wie alle anderen Screens erfüllen: Scrollbar flush am Viewport-Rand (kein inset) – ohne per-screen padding hacks.

Problem

Alles ist jetzt konsistent, nur Profil hat noch eine Scrollbar, die nicht ganz rechts am Viewport sitzt.
Das deutet darauf hin, dass im Profil ein nested scroll container existiert, der nicht bis zur Content-Column-Kante reicht oder padding/margin auf dem scrollenden Element hat.

Requirements (Non-Negotiable)
	1.	Scrollbar must be at viewport edge on Profil (Desktop).
	2.	No padding/margin on the scroll container (the element with overflow-y-auto/scroll).
	3.	Any spacing (px-4/6/8, stage framing) must live in inner wrappers, not on the scrolling box.

Steps
	1.	Identify which element scrolls on Profil
	•	Add to DebugOverlay output for Profil:
	•	scrollEl = <tag>#id.class
	•	scrollEl.clientWidth / offsetWidth
	•	scrollEl.getBoundingClientRect().right vs viewportWidth
	•	computed padding-right / margin-right of scrollEl
	•	If scrollEl.right < viewportWidth → scrollbar inset confirmed.
	2.	Fix options (pick the structurally correct one)

Option A (Preferred): Unify Profil with standard DCW scroll
	•	Make DesktopContentWrapper the scrolling element for Profil too (like Home).
	•	Profil content should be normal flow; remove internal overflow-y-auto from Profil screen container.
	•	Keep fillHeight only for layout, not for “child manages scroll”.

Option B: Keep internal scroll, but make it flush
If internal scroll is required:
	•	Ensure the scroll element is the full width of the content column (w-full, min-w-0, flex-1) and not wrapped by an inset container.
	•	Move all horizontal padding/spacing from the scroll element to an inner wrapper:
	•	Scroll element: overflow-y-auto w-full min-w-0 and no px / no mr
	•	Inner content wrapper: px-4/6/8 max-w-* mx-auto

	3.	Verification (must provide numbers)

	•	Profil with sidebar expanded + collapsed:
	•	scrollElRight == viewportWidth (±1px)
	•	computed paddingRight/marginRight on scrollEl == 0
	•	abs(wrapperLeft - wrapperRight) <= 1px

Deliverables
	•	2 screenshots (Profil expanded + collapsed) with debug overlay
	•	Measured values above
	•	Root cause: exact file + line where nested scroll container / inset is introduced
	•	Minimal fix: files changed list

Important

Do NOT add per-screen marginRight/paddingRight to “push scrollbar”.
Fix the scroll container hierarchy so Profil obeys the same global rule.