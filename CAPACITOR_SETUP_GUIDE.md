# 🚀 Capacitor Setup Guide für SoStudy

## ✅ Was bereits gemacht wurde:

1. ✅ Capacitor Packages installiert (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`)
2. ✅ `capacitor.config.ts` erstellt mit Zoom-Prevention Settings
3. ✅ NPM Scripts zu `package.json` hinzugefügt
4. ✅ iOS Konfigurationsanleitung erstellt

---

## 📋 SCHRITT-FÜR-SCHRITT ANLEITUNG

### **Schritt 1: Build erstellen**

```bash
npm run build
```

✅ Das erstellt den `/dist` Ordner mit deiner kompilierten App.

---

### **Schritt 2: iOS Projekt hinzufügen**

```bash
npm run cap:add:ios
```

✅ Das erstellt den `/ios` Ordner mit dem nativen Xcode-Projekt.

**Optional:** Android hinzufügen (wenn du auch Android willst):
```bash
npm run cap:add:android
```

---

### **Schritt 3: iOS in Xcode öffnen**

```bash
npm run cap:ios
```

✅ Das öffnet automatisch Xcode mit deinem Projekt.

---

### **Schritt 4: 🔒 ZOOM KOMPLETT DEAKTIVIEREN in Xcode**

#### **4a) AppDelegate.swift anpassen**

1. **Öffne in Xcode:** `ios/App/App/AppDelegate.swift`

2. **Füge GANZ OBEN nach den imports hinzu:**

```swift
import Capacitor
import UIKit
import WebKit

class CustomViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 🔒 DISABLE ALL ZOOM - SoStudy Native App
        if let webView = self.webView {
            // Disable scroll & bounce
            webView.scrollView.isScrollEnabled = false
            webView.scrollView.bounces = false
            webView.scrollView.bouncesZoom = false
            
            // Disable pinch zoom
            webView.scrollView.minimumZoomScale = 1.0
            webView.scrollView.maximumZoomScale = 1.0
            webView.scrollView.pinchGestureRecognizer?.isEnabled = false
            
            // Disable double-tap zoom
            let doubleTapGesture = UITapGestureRecognizer(target: self, action: nil)
            doubleTapGesture.numberOfTapsRequired = 2
            webView.addGestureRecognizer(doubleTapGesture)
        }
    }
}
```

#### **4b) SceneDelegate.swift anpassen**

1. **Öffne in Xcode:** `ios/App/App/SceneDelegate.swift`

2. **Finde die Zeile:**
```swift
rootViewController = CAPBridgeViewController()
```

3. **Ersetze sie mit:**
```swift
rootViewController = CustomViewController()
```

✅ **JETZT IST ZOOM 100% DEAKTIVIERT!** 🎉

---

### **Schritt 5: App-Informationen anpassen**

#### **5a) Info.plist bearbeiten**

1. **Öffne in Xcode:** `ios/App/App/Info.plist`

2. **Stelle sicher, dass folgendes drin ist:**

```xml
<key>CFBundleDisplayName</key>
<string>SoStudy</string>

<key>CFBundleName</key>
<string>SoStudy</string>

<key>UIViewControllerBasedStatusBarAppearance</key>
<true/>
```

#### **5b) Bundle Identifier festlegen**

1. **In Xcode:** Klicke auf **App** (links im Navigator)
2. **General Tab** → **Identity** → **Bundle Identifier**
3. **Setze:** `com.sostudy.app` (oder deine eigene Domain)

---

### **Schritt 6: App Icon & Splash Screen (Optional)**

#### **App Icon:**
1. **Ordner:** `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. **Drag & Drop** dein App Icon in verschiedenen Größen

**Tipp:** Nutze [appicon.co](https://www.appicon.co/) um automatisch alle Größen zu generieren.

#### **Splash Screen:**
1. **Ordner:** `ios/App/App/Assets.xcassets/Splash.imageset/`
2. **Drag & Drop** dein Splash Screen Bild

---

### **Schritt 7: 📱 Auf echtem iPhone testen**

#### **7a) iPhone per USB verbinden**

1. **iPhone entsperren** und "Diesem Computer vertrauen"
2. **In Xcode oben links:** Gerät auswählen (dein iPhone sollte erscheinen)

#### **7b) Signing & Capabilities**

1. **In Xcode:** App auswählen → **Signing & Capabilities**
2. **Team:** Wähle dein Apple Developer Account
   - **Kein Account?** Nutze deine Apple ID (kostenlos für Tests auf eigenem Gerät)
3. **Automatically manage signing:** Aktivieren

#### **7c) App auf iPhone installieren**

1. **In Xcode:** Klicke auf den **Play-Button** ▶️ (oder Cmd+R)
2. **Beim ersten Mal auf iPhone:**
   - Einstellungen → Allgemein → VPN & Geräteverwaltung
   - Dein Developer-Profil antippen → "Vertrauen"
3. **App öffnen**

✅ **SoStudy läuft jetzt als NATIVE APP auf deinem iPhone - KEIN ZOOM mehr möglich!** 🎉📱

---

### **Schritt 8: 🔄 Änderungen synchronisieren (für spätere Updates)**

**Nach JEDER Änderung in deinem React-Code:**

```bash
npm run build:capacitor
```

✅ Das buildet deine App UND synchronisiert sie mit iOS/Android automatisch!

**Dann in Xcode einfach nochmal auf Play drücken.**

---

## 📦 App Store Deployment (später)

### **Voraussetzungen:**
- **Apple Developer Account:** $99/Jahr ([developer.apple.com](https://developer.apple.com))
- **App Store Connect** Account

### **Deployment Steps:**

1. **In Xcode:** Product → Archive
2. **Organizer öffnet sich** → **Distribute App**
3. **App Store Connect** wählen
4. **Upload**
5. **In App Store Connect:**
   - App-Beschreibung hinzufügen
   - Screenshots hochladen
   - App zur Review einreichen

**Geschätzte Review-Zeit:** 1-3 Tage

---

## 🎯 Zusammenfassung der Vorteile

### **Vorher (PWA):**
- ❌ iOS erlaubt immer etwas Zoom
- ❌ Safari-UI (URL-Leiste, etc.)
- ❌ Keine Push-Notifications
- ❌ "Zum Home hinzufügen" - wirkt nicht professionell

### **Jetzt (Capacitor Native App):**
- ✅ **100% KEIN ZOOM** möglich! 🔒
- ✅ **Echte Native App** (keine Browser-UI)
- ✅ **App Store** Veröffentlichung möglich
- ✅ **Push Notifications** möglich (später)
- ✅ **Professionelles Erscheinungsbild**
- ✅ **Dein Code bleibt 1:1 gleich** (Vite + React + TypeScript)

---

## 🆘 Häufige Probleme & Lösungen

### **Problem: "No provisioning profile found"**
**Lösung:** Signing & Capabilities → Team auswählen

### **Problem: "Command PhaseScriptExecution failed"**
**Lösung:** 
```bash
cd ios/App
pod install
```

### **Problem: Änderungen werden nicht angezeigt**
**Lösung:**
```bash
npm run build:capacitor
# Dann in Xcode: Product → Clean Build Folder (Shift+Cmd+K)
```

### **Problem: App stürzt beim Öffnen ab**
**Lösung:** In Xcode Konsole checken - meistens fehlendes Plugin oder Asset

---

## 📞 Nächste Schritte

1. ✅ **Schritt 1-3** ausführen (Build + iOS hinzufügen + Xcode öffnen)
2. ✅ **Schritt 4** WICHTIG! (Zoom deaktivieren in Xcode)
3. ✅ **Schritt 7** (Auf iPhone testen)
4. 🎉 **Fertig!** Native App ohne Zoom!

**Bei Fragen einfach fragen!** 🚀
