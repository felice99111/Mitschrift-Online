# Mitschrift Online

## Features

| Feature | Beschreibung | Priorität | Geschätzter Aufwand | Betroffene Schichten |
|---------|--------------|-----------|--------------------|---------------------|
| **Startscreen View** | Zentrales UI-Element des Tools. Nutzer können Vorlesung mit individuellen Dokument- und Vorlesungsnamen anlegen. Die erstellte Mitschrift erscheint in einer Tabelle. | hoch (kritisch) | 1 Tag | UI, HTML, CSS, Javascript |
| **Mitschrift editieren** | Nutzer können die erstellte Mitschrift editieren. Bei Klick auf eine Mitschrift aus der Tabelle, wird der User zum Editor weitergeleitet. | hoch (kritisch) | 1 Tag | UI, HTML, CSS, Javascript |
| **Mitschrift kollaborativ bearbeiten** | Mehrere Nutzer können eine einzelne Mitschrift gemeinsam editieren. Jeder Beitrag (textbasiert) eines Users wird bei jedem anderen Teilnehmer der Mitschrift angezeigt. | hoch (kritisch) | 3 Tage | UI, Server-Client, Javascript |
| **Nutzername anlegen und speichern** | Nutzern wird beim initialen Start des Tools ein zufällig generierter Nutzername zugewiesen. Das Profil aus Nutzernamen wird benötigt, um die Beiträge einer Mitschrift zu identifizieren und die Rolle innerhalb einer Mitschrift (Betrachter oder Editor) zuzuteilen. Das Profil wird dauerhaft gespeichert | mittel (kritisch) | 0.5 Tag | UI, Datenbank, Javascript |
| **Kennzeichnung der individuellen Beiträge** | Jedem Dokumentteilnehmer (in der Rolle Editor) wird eine der acht verfügbaren Farbe zugeteilt, die seine Beiträge eindeutig identifiziert. Die Kennzeichnung der Beiträge unterschiedlicher User wird nachdem der Status auf *abgeschlossen* geändert wurde entfernt und vereinheitlicht. | mittel (kritisch) | 0.5 Tag | UI, Datenbank, Javascript |
| **Teilnehmer tracken** | Der Tracker ermittelt, wie viele User bereits eine Mitschrift aufgerufen haben und teilt die Rolle (Editor/Betrachter) zu. Eine Mitschrift kann von insgesamt acht Leuten bearbeitet werden. Die ersten acht Teilnehmer erhalten die Rolle Editor, alle weiteren Betrachter. Nachdem eine Mitschrift abgeschlossen wurde, wird *jeder* Teilnehmer zum Betrachter. | mittel (kritisch) | 0.5 Tag | UI, Datenbank, Javascript |
| **Daten speichern** | Beim Start des Tools wird dem Nutzer sein Profil zu gewiesen, falls er es bereits angelegt hat. Alle angelegten Mitschriften werden mit ihrem Inhalt aktualisiert. | hoch (kritisch) | 2 Tage | UI, Datenbank, Server, Javascript |
