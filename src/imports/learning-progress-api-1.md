📊 Lernfortschritt & Profile API

Übersicht

Endpunkte zur Abfrage von Lernfortschritt, Leistungsprofilen und KI-basierten Prognosen.

⸻

1️⃣ Lernfortschritt (Detailansicht)

GET /v1/curriculum/learning-progress/:userId

Auth erforderlich

Ruft detaillierten Lernfortschritt inkl. Lehrplanabdeckung ab.

200 Erfolgreich

{
  "success": true,
  "userId": "user_123",
  "overallProgress": 65,
  "subjects": {
    "Mathematik": {
      "progress": 70,
      "curriculumProgress": {
        "coveragePercent": 45,
        "status": "developing",
        "needsAttention": ["Quadratische Gleichungen"],
        "upcoming": ["Trigonometrie"]
      },
      "topics": {
        "Algebra_Gleichungen": {
          "averageScore": 72,
          "attempts": 28,
          "trend": "improving"
        }
      }
    }
  }
}


⸻

2️⃣ Profil-Übersicht (Dashboard)

GET /v1/curriculum/profile-overview/:userId

Auth erforderlich

Ruft eine kompakte Dashboard-Übersicht mit den Top-Schwächen ab.

200 Erfolgreich

{
  "success": true,
  "userId": "user_123",
  "topWeaknesses": [
    {
      "topic": "Quadratische Gleichungen",
      "score": 45,
      "severity": "hoch",
      "criticalActions": [],
      "recommendation": "Täglich 20–30 Minuten üben"
    }
  ],
  "topStrengths": [],
  "dataQuality": {}
}


⸻

3️⃣ Profil-Prognose (KI)

GET /v1/curriculum/profile-prognosis/:userId

Auth erforderlich – KI Analyse

Ruft eine detaillierte Prognoseanalyse mit Risiken und Trends ab.

200 Erfolgreich

{
  "success": true,
  "weaknesses": {
    "totalCount": 8,
    "criticalCount": 2,
    "items": []
  },
  "strengths": {
    "totalCount": 5,
    "items": []
  },
  "futureRisks": {
    "totalCount": 3,
    "criticalCount": 1,
    "items": [
      {
        "topic": "Trigonometrie",
        "risk": "high",
        "reason": "Basiert auf schwachen Algebra-Kenntnissen"
      }
    ]
  },
  "overallSummary": {
    "urgentActions": 2,
    "trend": "improving"
  }
}


⸻

4️⃣ Unified Performance (Alle Datenquellen kombiniert)

GET /v1/curriculum/unified-performance/:userId

Auth erforderlich – KI Analyse

ℹ Datenquellen:
Karteikarten, Prüfungssimulationen, Hausaufgabenanalysen, Chat-Interaktionen

200 Erfolgreich

{
  "success": true,
  "userId": "user_123",
  "profile": {},
  "recentActivities": {
    "submissions": [],
    "flashcardSessions": [],
    "examResults": []
  },
  "crossSourceAnalysis": {
    "consistentWeaknesses": [],
    "consistentStrengths": [],
    "learningStyle": "Ausgewogener Lernstil"
  },
  "summary": {
    "totalActivities": 45,
    "averagePerformance": 72,
    "strongestSubject": "Deutsch",
    "weakestSubject": "Mathematik",
    "trend": "improving"
  }
}


⸻

5️⃣ Legacy Lernprofil

GET /v1/curriculum/learning-profile/:userId

Auth erforderlich

Legacy-Endpunkt für Schwächen & Empfehlungen.

200 Erfolgreich

{
  "success": true,
  "userId": "user_123",
  "learningProfile": {
    "initialized": true,
    "weaknesses": {
      "mathematik_algebra": {
        "score": 45,
        "frequency": 12
      }
    },
    "strengths": {
      "deutsch_grammatik": {
        "score": 85,
        "frequency": 18
      }
    }
  }
}