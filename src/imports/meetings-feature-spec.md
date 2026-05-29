Ziel: Baue einen vollständigen “Meetings”-Bereich mit internem Meeting-System (eigener Video-Call). Nutzer (Schüler & Tutor) sehen Upcoming / Live / Past, können beitreten, haben eine Lobby, der Tutor kann das Meeting starten, und nach Ende gibt es Meeting-Details und “Past”-Einträge. Alles mit Datum-Filter, Fach, Tutor, Einzel/Gruppe, Status-Logik, Responsive.

⸻

1) Datenmodell (API-ready, aber erstmal Mock möglich)

Meeting
	•	id: string
	•	subjectId: string
	•	subjectName: string (Mathe, Englisch, …)
	•	lessonType: "1on1" | "group"
	•	tutor: { id: string, name: string, avatarUrl?: string }
	•	students: { id: string, name: string, avatarUrl?: string }[] (bei 1on1 = 1 Student, bei group mehrere)
	•	topicTitle?: string (z.B. “Quadratische Gleichungen”)
	•	startAt: ISO string (Europe/Berlin)
	•	endAt: ISO string
	•	status: "scheduled" | "live" | "ended" | "cancelled"
	•	joinPolicy: { joinEarlyMinutes: number, requiresTutorStart: boolean }
	•	Default: joinEarlyMinutes = 10
	•	Default: requiresTutorStart = true
	•	room: { roomId: string, roomKey?: string } (für internes System)
	•	links: { joinUrl: string } (interner deep link, z.B. /meetings/:id/join)
	•	createdAt, updatedAt

Presence / Live-State (optional)
	•	liveState: { isTutorPresent: boolean, participantsOnline: number, startedAt?: ISO, endedAt?: ISO }

⸻

2) Status-Logik (lückenlos, klar)

Definiere UI-Status aus Daten:
	•	LIVE: status === "live" ODER (server flag liveState.startedAt gesetzt & endedAt nicht gesetzt)
	•	UPCOMING: status === "scheduled" & startAt > now
	•	JOINABLE: Upcoming & now >= startAt - joinEarlyMinutes
ABER wenn requiresTutorStart=true dann:
	•	Schüler sieht “Waiting for tutor” bis Tutor gestartet hat
	•	PAST: endAt < now oder status === "ended"
	•	CANCELLED: status === "cancelled"

⸻

3) Meetings Screen Aufbau

Erstelle Screen Meetings mit:

A) Tabs (sticky)
	•	Upcoming
	•	Live / Join
	•	Past

B) Filterleiste (unter Tabs)

Suche: “Fach, Tutor, Thema…”
Date Range Picker:
	•	Presets: Heute, Diese Woche, Nächste Woche, Dieser Monat, Custom
	•	Past zusätzlich: Letzte 7 Tage, Letzte 30 Tage
Fach Multi-Select
Typ: Alle / Einzel / Gruppe
Tutor Filter (optional)
Sortierung:
	•	Upcoming: Startzeit ↑
	•	Past: Startzeit ↓
	•	Live: Startzeit ↑

Filter zeigen Chips + “Reset Filters”.

⸻

4) MeetingCard (Liste)

Jede Karte zeigt:
	•	Status Badge (LIVE / UPCOMING / ENDED / CANCELLED)
	•	Titel: subjectName + optional topicTitle
	•	Tutor Name + Avatar
	•	Typ: Einzel/Gruppe
	•	Zeit: Datum + Start–Ende (Europe/Berlin)
	•	Bei Gruppe: “Teilnehmer: X”
	•	Action Buttons (rechts):
	•	Live: Join now
	•	Upcoming:
	•	Wenn noch zu früh: Details
	•	Wenn joinable:
	•	Tutor: Start meeting
	•	Schüler: Join / Waiting room
	•	Past: View summary
	•	Cancelled: disabled

⸻

5) Meeting Details Screen

Bei Klick auf Karte:

Header: Titel + Badge
Zeitblock: Countdown (Upcoming), Start–Ende, Zeitzone
Tutor Block
Teilnehmerliste (Group)
Join Block:
	•	Wenn Upcoming & joinable:
	•	Schüler: “Enter waiting room”
	•	Tutor: “Start meeting”
	•	Wenn requiresTutorStart=true und Tutor nicht present:
	•	Schüler sieht deutlich: “Waiting for tutor to start”
	•	Copy Buttons: RoomId / optional Code
Materialien (placeholder)
Past Summary (nur Past):
	•	Attendance, Notes (placeholder), “Book again” optional

⸻

6) WICHTIG: Lobby / Waiting Room (internes System)

Erstelle einen Screen Meeting Lobby (vor dem eigentlichen Call):

Elemente:
	•	Camera Preview
	•	Microphone Toggle
	•	Speaker Test
	•	Device Selector (Mic / Cam / Output)
	•	Name anzeigen (read-only)
	•	Connection indicator (“Good / Medium / Poor”)
	•	Regeln & Hinweise (Short text)
	•	Buttons:
	•	Join meeting (wenn allowed)
	•	Back
	•	Wenn Tutor noch nicht gestartet:
	•	Schüler Lobby zeigt “Waiting for tutor…”
	•	Button “Join meeting” disabled
	•	Optional: “Notify tutor” button (send ping)

Tutor Lobby:
	•	Button: Start meeting
	•	Sobald Start gedrückt:
	•	status wechselt zu live (oder local optimistic state)
	•	alle Wartenden dürfen rein

⸻

7) Live Meeting Room UI (internes System)

Erstelle Screen Meeting Room:

Layout:
	•	Top Bar: Meeting Title + Timer + Connection
	•	Main: Video Grid (Responsive)
	•	1on1: split 2 tiles
	•	group: grid auto-fit, active-speaker optional
	•	Right Panel (toggle):
	•	Participants
	•	Chat
	•	Notes (Tutor only)
	•	Bottom Controls:
	•	Mic on/off
	•	Camera on/off
	•	Screen share (Tutor optional)
	•	Raise hand (Student)
	•	End meeting (Tutor) / Leave (Student)
	•	Settings

End Meeting Flow:
	•	Tutor klickt “End meeting” → Confirm Modal
	•	Danach Redirect zu “Meeting Summary”

⸻

8) Past Meetings: Summary + Filters

Past Tab Liste mit:
	•	Datum-Range Filter
	•	Suchfilter
	•	Sort
	•	Jede Karte: Status ENDED, Dauer, Teilnehmer, Fach, Tutor
	•	Detail: Summary placeholders:
	•	“Topics covered”
	•	“Homework”
	•	“Tutor feedback”
	•	“Student rating”
	•	“Attendance”

⸻

9) Qualitäts-Features
	•	Loading Skeletons
	•	Empty States je Tab + Reset CTA
	•	Error State + Retry
	•	Pagination oder Infinite Scroll für Past
	•	Konsistente Datumsformatierung: “Tue, 4 Mar 2026 · 18:00–19:00”
	•	Mobile:
	•	Filter als Bottom Sheet
	•	Tabs sticky
	•	Meeting Cards stacked
	•	Lobby & Room full-screen

⸻

10) Komponentenliste (wiederverwendbar)
	•	MeetingsTabs
	•	MeetingsFiltersBar
	•	MeetingCard
	•	MeetingDetailsPanel
	•	MeetingLobby
	•	MeetingRoom
	•	ParticipantsPanel
	•	MeetingChatPanel
	•	MeetingSummary
