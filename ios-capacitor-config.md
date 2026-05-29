# iOS Capacitor Konfiguration - Zoom Prevention

## Nach `npm run cap:add:ios` musst du folgende Änderungen in Xcode machen:

### 1. WebView Zoom komplett deaktivieren

Öffne: `ios/App/App/AppDelegate.swift`

Füge nach der Zeile `import Capacitor` folgendes hinzu:

```swift
import WebKit

class CustomViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Disable all zoom functionality
        if let webView = self.webView {
            webView.scrollView.isScrollEnabled = false
            webView.scrollView.bounces = false
            webView.scrollView.bouncesZoom = false
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

### 2. Info.plist Anpassungen

Öffne: `ios/App/App/Info.plist`

Füge hinzu (falls nicht vorhanden):

```xml
<key>UIViewControllerBasedStatusBarAppearance</key>
<true/>
<key>UIStatusBarStyle</key>
<string>UIStatusBarStyleDefault</string>
```

### 3. SceneDelegate.swift anpassen

Öffne: `ios/App/App/SceneDelegate.swift`

Ändere die Zeile:
```swift
rootViewController = CAPBridgeViewController()
```

Zu:
```swift
rootViewController = CustomViewController()
```

## App Icons & Splash Screen

1. App Icon: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Füge dein App Icon dort ein (verschiedene Größen)

2. Splash Screen: `ios/App/App/Assets.xcassets/Splash.imageset/`
   - Füge dein Splash Screen Bild dort ein

## Build & Deploy

1. In Xcode: Product → Archive
2. Distribute App → App Store Connect
3. Upload für TestFlight / App Store Review
