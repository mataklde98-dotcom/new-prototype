**Redesign: Merge "Meine KI-Credits" and "Verdiente Gratis-Credits" into one visually optimized section**

**Screen:** Profil → Mein Tarif

---

**Problem:**
Currently there are two separate sections: "Meine KI-Credits" and "Verdiente Gratis-Credits". They have significant content overlap – both mention Referral credits and Activity credits. Additionally, both are visually poorly executed: "Meine KI-Credits" is an unstructured wall of text with no visual hierarchy, and "Verdiente Gratis-Credits" shows two categories as tiny compressed text lines that are easily overlooked.

**Solution:** Merge both sections into ONE single section called "Meine KI-Credits". The separate section "Verdiente Gratis-Credits" must be COMPLETELY REMOVED. All information will be displayed in one visually optimized, dashboard-style section.

---

**New section: "Meine KI-Credits" – Layout from top to bottom:**

---

**Part 1: Total Number (Hero Element)**

- The total number of available credits is displayed large and prominently (e.g. "743" in large font with "Credits verfügbar" next to it)
- This is the first thing the user sees – big number, instantly scannable
- Below it a progress bar showing how many plan credits have been used this month (e.g. "257 / 500 Plan-Credits verbraucht")
- The progress bar must be visually prominent – not buried between text like it currently is

---

**Part 2: Credit Breakdown as three separate Mini-Cards**

Directly below the hero element, display three visually separated mini-cards side by side in a horizontal row. NO text list, NO bullet points – three standalone visual blocks.

**Mini-Card 1: Plan Credits**
- Unique icon (e.g. crown icon matching the plan)
- Unique color (e.g. blue or the existing green accent color)
- Large number: "243"
- Label below: "Plan übrig"

**Mini-Card 2: Referral Credits**
- Unique icon (e.g. gift icon or people icon)
- Unique color (e.g. orange or gold – matching the referral theme)
- Large number: "300"
- Label below: "Durch Einladungen"

**Mini-Card 3: Activity Credits**
- Unique icon (e.g. star icon or lightning icon)
- Unique color (e.g. purple or a third accent color)
- Large number: "200"
- Label below: "Durch Aufgaben"

All three mini-cards must be equal in size, have the same layout structure, and only differ in icon, color, and content. Each card must be instantly scannable – the user sees immediately which number comes from which source.

---

**Part 3: Detailed Breakdown of Free Credits**

Below the three mini-cards, add a collapsible section or a subtle detail block that shows WHEN the free credits were earned:

- "Referral-Credits: 300 Credits · seit Oktober 2025"
- "Aktivitäts-Credits: 200 Credits · seit November 2025"

This section is secondary – small, subtle, not prominent. The important information (the numbers) is already visible in the mini-cards above. This is only for the time period as additional context.

---

**Part 4: Info Notice**

A small info text with an info icon at the bottom of the section:
"Deine kostenlosen Credits (Referral + Aktivitäten) verfallen nicht und bleiben erhalten. Bei deiner nächsten Zahlung kommen deine monatlichen Plan-Credits oben drauf."

---

**Summary of the new "Meine KI-Credits" structure:**

```
┌─────────────────────────────────────────┐
│  ⚡ Meine KI-Credits                    │
│                                         │
│        743 Credits verfügbar            │  ← Hero: large number
│  ████████░░░░░ 257/500 used             │  ← Progress bar
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  👑 243  │ │  🎁 300  │ │  ⚡ 200  │   │  ← Three mini-cards
│  │  Plan   │ │ Referral │ │Activity │   │     side by side
│  │  left   │ │ earned  │ │ earned  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  Referral: 300 · since Oct 2025         │  ← Detail timeline
│  Activities: 200 · since Nov 2025       │     (subtle, secondary)
│                                         │
│  ℹ️ Free credits don't expire...         │  ← Info notice
└─────────────────────────────────────────┘
```

---

**What gets removed:**
- The entire separate section "Verdiente Gratis-Credits" – COMPLETELY REMOVE, it no longer exists as its own section
- The old text-list style in "Meine KI-Credits" (Plan-Credits: 243 übrig, Referral-Credits: 300 etc.) – replaced by the mini-cards

**What stays unchanged:**
- All other sections in "Mein Tarif" (Mein Plan, Freunde einladen, Abo Status, Nachhilfe-Tarif) remain as they are

---

**Design guidelines:**
- The three mini-cards MUST have distinct colors so the user can differentiate them at a glance
- Each mini-card has a subtle background tint matching its icon color (subtle, not bold)
- The numbers inside the mini-cards must be large enough to be instantly readable
- Mobile-first: The three mini-cards must fit side by side, use compact text if needed
- Consistent with the existing dark theme design system
- All labels and text content must remain in German as shown above

---