Learning Progress & Profiles
Endpoints for querying learning progress, performance profiles, and forecasts.
GET
/v1/curriculum/learning-progress/:userId
Auth
Retrieves detailed learning progress with curriculum coverage.
200 Success
{
"success": true,
"userId": "user
123"
_
,
"overallProgress": 65,
"subjects": {
"Mathematik": {
"progress": 70,
"curriculumProgress": {
"coveragePercent": 45,
"status": "developing"
,
"needsAttention": ["Quadratische Gleichungen"],
"upcoming": ["Trigonometrie"]
},
"topics": {
"Algebra
_
Gleichungen": {
"averageScore": 72,
"attempts": 28,
"trend": "improving"
}
}
}
}
}
GET
/v1/curriculum/profile-overview/:userId
Auth
Retrieves a compact dashboard overview with top 10 weaknesses.
200 Success
{
"success": true,
"userId": "user
123"
_
"topWeaknesses": [
{
,
"topic": "Quadratische Gleichungen"
,
"score": 45,
"severity": "hoch"
,
"recommendation": "Taeglich 20-30 Min ueben"
}
],
"topStrengths": [...],
"criticalActions": [...],
"dataQuality": { ... }
}
GET
/v1/curriculum/profile-prognosis/:userId
Auth
KI
Retrieves a detailed forecast analysis with risks and trends.
200 Success
{
"success": true,
"weaknesses": {
"totalCount": 8,
"criticalCount": 2,
"items": [...]
},
"strengths": {
"totalCount": 5,
"items": [...]
},
"futureRisks": {
"totalCount": 3,
"criticalCount": 1,
"items": [
{
"topic": "Trigonometrie"
,
"risk": "high"
,
"reason": "Basiert auf schwachen Algebra-Kenntnissen"
}
]
},
"overallSummary": {
"urgentActions": 2,
"trend": "improving"
}
}
GET
/v1/curriculum/unified-performance/:userId
Auth
KI
Retrieves the unified performance profile with data from all sources.
ℹ Data Sources
Combines data from flashcards, exam simulations, homework
analyses, and chat interactions.
200 Success
{
"success": true,
"userId": "user
123"
_
,
"profile": { ... },
"recentActivities": {
"submissions": [...],
"flashcardSessions": [...],
"examResults": [...]
},
"crossSourceAnalysis": {
"consistentWeaknesses": [...],
"consistentStrengths": [...],
"learningStyle": "Ausgewogener Lernstil"
},
"summary": {
"totalActivities": 45,
"averagePerformance": 72,
"strongestSubject": "Deutsch"
,
"weakestSubject": "Mathematik"
,
"trend": "improving"
}
}
GET
/v1/curriculum/learning-profile/:userId
Auth
Legacy endpoint for the learning profile with weaknesses and
recommendations.
200 Success
{
"success": true,
"userId": "user
123"
_
,
"learningProfile": {
"initialized": true,
"weaknesses": {
"mathematik
_
algebra": {
"score": 45,
"frequency": 12
}
},
"strengths": {
"deutsch
_grammatik": {
"score": 88,
"frequency": 8
}
},
"totalSessions": 35,
"averageAccuracy": 72
}
}