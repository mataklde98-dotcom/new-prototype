# SoStudy — Registration & Auth Flow Diagrams

> **Visual companion** to [`REGISTRATION_AUTH_FLOW.md`](./REGISTRATION_AUTH_FLOW.md). That file is
> the textual spec (data model, storage, services, step-by-step); **this file is the picture**.
> Node and message labels use the real `Step` / `Phase` names and service-method names from the
> source, so every box maps straight to code. Section refs like *(§7)* point into the main spec.
>
> **How to view.** These are [Mermaid](https://mermaid.js.org/) diagrams. They render automatically
> on GitHub, in VS Code (with a Mermaid/Markdown-Preview-Mermaid extension), Obsidian, and most
> Markdown viewers. If yours doesn't render them, paste any block into <https://mermaid.live> to
> view or export PNG/SVG.

---

## Contents

- [Legend](#legend)
- [0. Master map — all entry paths](#0-master-map--all-entry-paths)
- [1. App entry & auth gate](#1-app-entry--auth-gate)
- [2. Student registration — flowchart](#2-student-registration--flowchart)
- [3. Student registration — sequence](#3-student-registration--sequence)
- [4. Parent registration — flowchart](#4-parent-registration--flowchart)
- [5. Parent registration — sequence](#5-parent-registration--sequence)
- [6. Phone / SMS-OTP — state machine](#6-phone--sms-otp--state-machine)
- [7. Add a child — modes A / B / C](#7-add-a-child--modes-a--b--c)
- [8. Login — three methods](#8-login--three-methods)
- [9. Anmelde-Code login — sequence](#9-anmelde-code-login--sequence)
- [10. Invite: child accepts email invite](#10-invite-child-accepts-email-invite)
- [11. Invite: parent accepts student invite](#11-invite-parent-accepts-student-invite)

---

## Legend

```mermaid
flowchart LR
  A([terminal / start-end]) --- B[screen / step]
  B --- C{decision / branch}
  C --- D[["service / mock call"]]
```

- **([rounded])** — entry/exit of a flow.
- **[rectangle]** — a screen, step (`Step`), or phase (`Phase`).
- **{diamond}** — a decision/branch (role, validation, status).
- **[[double rectangle]]** — a service or mock call (the backend seam).
- Solid arrow `-->` = primary path. Dotted `-.->` = secondary/return link.

---

## 0. Master map — all entry paths

The big picture: every way a user can reach the app, collapsed into one chart.

```mermaid
flowchart TD
  Start([App start]) --> Auth{Logged in?}

  Auth -- no --> Entry{How did they arrive?}
  Entry -- "default" --> SOnb[Student onboarding]
  Entry -- "picks Elternteil" --> POnb[Parent onboarding]
  Entry -- "has account" --> Login[Login]
  Entry -- "?invite= link" --> CInv[Child accepts invite]
  Entry -- "?parentinvite= link" --> PInv[Parent accepts invite]

  SOnb --> Gate[First-login gates]
  POnb --> Routed
  Login --> Gate
  CInv --> Gate
  PInv --> Routed

  Auth -- yes --> Gate
  Gate --> Routed{role?}
  Routed -- parent --> PDash([ParentDashboard])
  Routed -- student --> App([Student app])
```

---

## 1. App entry & auth gate

*(§6 — `App.tsx`, `AuthWrapper.tsx`)*

```mermaid
flowchart TD
  Start([App start]) --> Check{isLoggedIn?<br/>userData valid?}
  Check -- no --> URL{Deep link in URL?}
  URL -- "?invite=" --> AInvite[AcceptInviteFlow<br/>child accepts email invite]
  URL -- "?parentinvite=" --> APInvite[AcceptParentInviteFlow<br/>parent accepts student invite]
  URL -- none --> View{authView}
  View -- "onboarding (default)" --> SOnb[Student OnboardingFlow]
  View -- login --> Login[LoginScreen]
  SOnb -- "role = Elternteil" --> POnb[ParentOnboardingFlow]
  Login -. register .-> SOnb

  Check -- yes --> Gate1{student &amp;<br/>no Spitzname?}
  Gate1 -- yes --> Nick[NicknameClaimGate]
  Gate1 -- no --> Gate2{child &amp;<br/>no school data?}
  Gate2 -- yes --> School[SchoolDataClaimGate]
  Gate2 -- no --> Role{role}
  Role -- parent --> PDash[ParentDashboard]
  Role -- student --> App[Student app / AppContent]

  AInvite --> Gate1
  APInvite --> Role
  SOnb --> Gate1
  POnb --> Role
```

---

## 2. Student registration — flowchart

*(§7 — `onboarding/OnboardingFlow.tsx`)*

```mermaid
flowchart TD
  L[landing] --> R{role}
  R -- "Elternteil" --> P[➜ Parent flow]
  R -- "Schüler:in" --> M[mascotIntro]
  M --> N["nickname<br/>(Spitzname, ≥2 chars)"]
  N --> B[bundesland] --> S[schoolType] --> G["grade<br/>(mandatory)"] --> K[kiConsent]
  K --> A{authChoice}
  A -- Apple --> Reg
  A -- Google --> Reg
  A -- "Login-Code" --> Reg
  Reg[["identityService.registerStudent()<br/>→ identity + Anmelde-Code + session"]] --> CD["codeDisplay<br/>show Anmelde-Code (backup)"]
  CD --> Done([onComplete → app])
```

---

## 3. Student registration — sequence

Who calls what, in order. Note: a student **always** gets an Anmelde-Code, even via Apple/Google.

```mermaid
sequenceDiagram
  actor U as Student
  participant OF as OnboardingFlow
  participant IS as identityService
  participant IM as identity.mock
  participant LCM as loginCodes.mock
  participant LS as localStorage

  U->>OF: walk steps (role … kiConsent)
  U->>OF: pick auth method (Apple / Google / Login-Code)
  OF->>IS: registerStudent(draft + authMethod)
  IS->>IM: generateAnmeldeCode()
  IS->>IM: upsert identity + persistIdentities()
  IS->>LS: write sostudy_identity, userData, isLoggedIn, isNewRegistration
  IS->>LCM: recordLoginCode(code, userId)
  IS-->>OF: SoStudyIdentity
  OF->>U: codeDisplay (shows Anmelde-Code)
  U->>OF: "Weiter zum Dashboard"
  OF-->>U: onComplete(userData) → app
```

---

## 4. Parent registration — flowchart

*(§8 — `parent/ParentOnboardingFlow.tsx`)*

```mermaid
flowchart TD
  W[welcome] --> RN["realName<br/>(Klarname, ≥2 chars)"]
  RN --> PH["phone: enter<br/>country code + number"]
  PH -->|sendCode| OTP["verify: 6-digit SMS code<br/>otpService (mock)"]
  OTP -->|verified| AU{auth}
  AU -- Apple --> Reg
  AU -- Google --> Reg
  AU -- "E-Mail" --> EF["emailForm<br/>email + password ≥8"]
  EF --> Reg
  Reg[["identityService.registerParent()<br/>→ parent identity + Familienkonto (owner) + session"]] --> AC[addChild → AddChildFlow]
  AC --> FIN([done → Eltern-Bereich])
```

---

## 5. Parent registration — sequence

Parent registration creates **two** records (identity **and** family) and runs the phone OTP first.

```mermaid
sequenceDiagram
  actor P as Parent
  participant POF as ParentOnboardingFlow
  participant OTP as otpService
  participant IS as identityService
  participant FM as family.mock
  participant LS as localStorage
  participant ACF as AddChildFlow

  P->>POF: enter realName (Klarname)
  P->>POF: enter phone number
  POF->>OTP: requestCode(fullPhone)
  OTP-->>POF: ok + demoCode (shown in UI)
  P->>POF: enter 6-digit code
  POF->>OTP: verifyCode(fullPhone, code)
  OTP-->>POF: ok
  P->>POF: pick auth (Apple / Google / E-Mail)
  POF->>IS: registerParent(draft + authMethod)
  IS->>FM: create Familienkonto (owner) + persistFamilies()
  IS->>LS: write sostudy_identity, userData, isLoggedIn
  IS-->>POF: { identity, family }
  POF->>ACF: addChild(familyId)
  ACF-->>POF: done / skipped
  POF-->>P: done → Eltern-Bereich
```

---

## 6. Phone / SMS-OTP — state machine

*(§8.1 — `hooks/usePhoneOtp.ts` + `services/otpService.ts`)*

```mermaid
stateDiagram-v2
  [*] --> enter
  enter --> verify: sendCode() — requestCode ok (60s resend timer)
  verify --> verified: verifyCode ok
  verify --> verify: wrong code (retry, attempts < 3)
  verify --> enter: too_many (≥3) or expired / no_code
  enter --> enter: changeNumber()
  verified --> [*]: onVerified(fullPhone)
```

> OTP rules: 6-digit code, 10-minute TTL, 3 attempts. In the prototype the code is shown in a
> "Demo — dein SMS-Code" box (no real SMS); `requestCode` always succeeds.

---

## 7. Add a child — modes A / B / C

*(§9 — `parent/AddChildFlow.tsx` + `familyService`)*

```mermaid
flowchart TD
  Mode{Pick mode}
  Mode -- "A: new child" --> A1["name + (optional<br/>Bundesland / Schulform / Klasse)"]
  A1 --> A2[["familyService.addChildNew()"]] --> AR["result: show child's Anmelde-Code<br/>child claims Spitzname + skipped school data on first login"]
  Mode -- "B: existing by code" --> B1[enter child's Anmelde-Code]
  B1 --> B2[["familyService.linkChildByCode()"]] --> BR["result: linked<br/>errors: not_found / is_parent / already_linked"]
  Mode -- "C: email invite" --> C1[child name + email]
  C1 --> C2[["familyService.inviteChildByEmail()"]] --> CR["result: pending child + invite token<br/>→ child opens ?invite= (diagram 10)"]
```

---

## 8. Login — three methods

*(§10 — `LoginScreen.tsx`)*

```mermaid
flowchart TD
  LV{Login method}
  LV -- "Apple / Google" --> SOC["handleSocialAuth<br/>establishSession(student demo)"]
  LV -- "Anmelde-Code" --> CODE["loginWithAnmeldeCode<br/>→ loginCodeService.login(code)"]
  LV -- "E-Mail + password" --> EM["mock user map check<br/>(pw 12345678)"]
  EM --> ENS["identityService.ensureIdentity()<br/>derive canonical identity"]
  SOC --> OK([onLoginSuccess → auth gate, diagram 1])
  CODE --> OK
  ENS --> OK
```

---

## 9. Anmelde-Code login — sequence

Server-side-style validation with self-healing (works even if the code store lost the entry).

```mermaid
sequenceDiagram
  actor S as Student
  participant LSc as LoginScreen
  participant IS as identityService
  participant LCS as loginCodeService
  participant LCM as loginCodes.mock
  participant IM as identity.mock

  S->>LSc: enter Anmelde-Code (uppercased)
  LSc->>IS: loginWithAnmeldeCode(code)
  IS->>LCS: login(code)
  LCS->>LCM: findActiveLoginCode(code)
  alt active code found
    LCM-->>LCS: record (userUuid)
    LCS->>LCM: touchLoginCode (lastUsedAt)
  else self-heal from identity
    LCS->>IM: findIdentityByAnmeldeCode(code)
    LCS->>LCM: recordLoginCode(code, userId)
  end
  LCS-->>IS: userUuid (or null)
  IS->>IM: findIdentityById(userUuid)
  IS-->>LSc: SoStudyIdentity (session set) or null
  LSc-->>S: onLoginSuccess / "Ungültiger Anmelde-Code"
```

---

## 10. Invite: child accepts email invite

*(§12.1 — `?invite=` → `onboarding/AcceptInviteFlow.tsx`, mode C)*

```mermaid
sequenceDiagram
  actor C as Child (via email link)
  participant AIF as AcceptInviteFlow
  participant FS as familyService
  participant IS as identityService

  C->>AIF: open ?invite=token
  AIF->>FS: getPendingInviteByToken(token)
  FS-->>AIF: { family, child } (parent name, child real name)
  C->>AIF: pick auth (Apple / Google)
  AIF->>FS: acceptInviteWithAuth(token, authMethod)
  FS->>IS: establishSession(new child identity, isNew)
  FS-->>AIF: { ok, family, child } — child now logged in
  AIF-->>C: → NicknameClaimGate (claim Spitzname)
```

---

## 11. Invite: parent accepts student invite

*(§12.2 — `?parentinvite=` → `onboarding/AcceptParentInviteFlow.tsx`, Pfad 4)*

A self-registered student (<18, no family) invites a parent; accepting **creates the parent +
family and links the student with tutoring consent in one step**.

```mermaid
sequenceDiagram
  actor P as Parent (via magic link)
  participant APF as AcceptParentInviteFlow
  participant PIS as parentInviteService
  participant IS as identityService
  participant FS as familyService

  P->>APF: open ?parentinvite=token
  APF->>PIS: getByToken(token)
  PIS-->>APF: ParentInvite (pending)
  P->>APF: parent name, child name, phone + OTP, auth
  APF->>PIS: accept(token, {childRealName, parentRealName, parentPhone, authMethod})
  PIS->>IS: registerParent(...)
  IS-->>PIS: { family } (parent session set)
  PIS->>FS: linkChildById(familyId, studentUserId, {tutoringConsent: true})
  PIS->>PIS: invite.status = 'accepted'
  PIS-->>APF: { ok, family }
  APF-->>P: done → ParentDashboard
```

---

*Diagrams generated from the SoStudy prototype source; accurate as of the current `main` branch.
For field-level detail, storage keys, full method signatures, and the backend-migration mapping,
see [`REGISTRATION_AUTH_FLOW.md`](./REGISTRATION_AUTH_FLOW.md).*
