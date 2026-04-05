TASK — Fix “Chat Desktop” Layout (Height + Width + Scrollbar) — Global structural, no per-screen hacks

Context: Visual centering is improved, but Chat Desktop (“Nachrichten”) exposes new alignment problems: card height mismatch vs sidebar, wasted horizontal space, and scrollbar not at viewport edge.

A) Reproduce

Route: Chats → Nachrichten (Desktop)
Compare with any other standard screen (e.g. Profil) for baseline framing.

B) Problems to solve (must be measurable)

1) Height consistency / “Stage framing”
	•	The Chat screen must respect the same top/bottom framing as the sidebar card.
	•	If the left sidebar uses a “card” container with inset (top/bottom padding and rounded corners), the chat content region must align to the same vertical bounds.
	•	No “infinite tall” looking panel when the sidebar is visually framed.

Acceptance:
Chat outer container top/bottom edges line up with the sidebar card’s top/bottom edges (same y positions) OR the entire layout uses one shared outer “stage container” for both.

2) Remove wasted horizontal space
	•	The two-panel layout must use available width inside DesktopContentWrapper.
	•	No fixed widths that leave a big empty column on the right.
	•	Left list panel can remain fixed (e.g. 320–360px), but the right panel must be flex-1 and truly expand.
	•	Placeholder (“Wähle einen Chat”) must be centered inside the right panel, not inside a smaller fixed box.

Acceptance:
Within wrapperWidth, sum of panels + gaps ~= wrapperWidth (no unexplained leftover space).

3) Scrollbar must be at true viewport right edge
	•	Do NOT apply margin-right or “frame” spacing to the scroll container (html/body/root scrolling element).
	•	The scrollbar must remain flush with the viewport.
	•	Any framing/padding must be applied inside the content area, not by moving the scroll root.

Acceptance:
Browser scrollbar is at the viewport edge in all screens and in both sidebar states.

C) Debug overlay (reuse your Ctrl+Shift+D)

Extend overlay to show:
	•	scrollContainer element (which node is scrolling)
	•	computed padding-right, margin-right of that element
	•	widths: leftPanel, rightPanel, gap, wrapperWidth
	•	vertical bounds: sidebarCardTop/Bottom vs contentTop/Bottom

D) Likely root causes to check (pick exact one(s), cite file+line)
	•	ChatScreenDesktop uses fixed widths / max-w on panels
	•	Nested container inside DesktopContentWrapper adds extra padding/width constraints
	•	MainLayout applies marginRight/paddingRight to root scroll container (causes scrollbar inset)
	•	Sidebar uses absolute positioning with left-3 while content uses different framing model

E) Structural Fix Requirements
	•	Keep DesktopContentWrapper as the only horizontal authority
	•	Ensure MainLayout defines one consistent “stage container” for sidebar + content (same top/bottom framing)
	•	Ensure scroll root stays viewport-aligned (no scrollbar inset)

Deliverables
	•	2 screenshots of Chats/Nachrichten with debug overlay:
	1.	Sidebar expanded
	2.	Sidebar collapsed
	•	Measured numbers: wrapperLeft/right, wrapperWidth, leftPanelWidth, rightPanelWidth, gap, scrollContainer padding/margins
	•	Root cause: exact file + line(s)
	•	Minimal structural fix: list of changed files

⸻

Warum ich “marginRight: 12px” kritisch sehe (damit du’s einordnest)

Wenn der Scroll-Container (oder ein Root-Wrapper der scrollt) margin-right: 12px bekommt, dann ist es normal, dass die Scrollbar 12px nach innen rutscht.
Zentrierung “gefühlt” besser, aber UX sieht’s sofort: “Warum ist die Scrollbar nicht am Rand?”

Besseres Pattern (typisch sauber):
	•	Scrollbar bleibt auf html/body bzw. Root ohne margin
	•	Innen drin: ein Stage-Container mit px-3 / gap / max-width
	•	Sidebar nicht mit left-3 “physisch verschieben”, sondern Layout-Padding am gemeinsamen Container regeln (so bleibt alles symmetrisch, ohne die Scrollbar zu verschieben).