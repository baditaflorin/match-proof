# Architecture

Live site:

https://baditaflorin.github.io/match-proof/

Repository:

https://github.com/baditaflorin/match-proof

## Context

```mermaid
C4Context
  title Match Proof Context
  Person(attendeeA, "Attendee A", "Owns a browser profile")
  Person(attendeeB, "Attendee B", "Owns a browser profile")
  System_Boundary(pages, "GitHub Pages") {
    System(staticApp, "Match Proof static app", "HTML, CSS, JS, service worker")
  }
  Rel(attendeeA, staticApp, "Loads")
  Rel(attendeeB, staticApp, "Loads")
  Rel(attendeeA, attendeeB, "Exchanges WebRTC offer/answer and encrypted data channel messages")
```

## Container

```mermaid
flowchart LR
  subgraph GP["GitHub Pages"]
    SA["Static Vite app in docs/"]
  end
  subgraph A["Browser A"]
    UIA["React UI"]
    DBA["IndexedDB"]
    WA["Comlink crypto worker"]
    RTCA["WebRTC data channel"]
  end
  subgraph B["Browser B"]
    UIB["React UI"]
    DBB["IndexedDB"]
    WB["Comlink crypto worker"]
    RTCB["WebRTC data channel"]
  end
  SA --> UIA
  SA --> UIB
  UIA <--> DBA
  UIB <--> DBB
  UIA <--> WA
  UIB <--> WB
  RTCA <--> RTCB
  UIA <--> RTCA
  UIB <--> RTCB
```

## Privacy Boundary

GitHub Pages only serves static assets. Attribute data, matching transcripts, and local inference remain in each browser unless the user explicitly exchanges a peer session envelope.
