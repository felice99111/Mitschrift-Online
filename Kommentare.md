## Erreichter Zustand

Mitschrift Online Docs lässt im aktuellen Stand folgendes zu:

1. Mitschriften können angelegt werden
2. Angelegte Mitschriften werden im Startscreen angezeigt und können anhand eines Klicks editiert werden
3. Beim jeweiligen Klick öffnet sich der Editier-Screen.

folgende kollaborative Funktionen funktionieren nur, wenn alle Teilnehmer das Tool gestartet haben, bevor eine Mitschrift angelegt wurde. (Warum siehe `nicht implementierte Funktionen`)

4. Legt ein User eine Mitschrift an, erscheint diese bei allen anderen (aktuell das Tool benutzenden) Usern.
5. Editiert ein User eine Mitschrift, während andere User die Mitschrift nicht im Editier-Modus betrachten, werden die Inhalte bei allen aktualisiert. Das bedeutet, dass jeder User beim öffnen des Editier-Screens auf dem aktuellsten Stand ist.
6. Betrachten oder editieren mehrere User eine Mitschrift, so werden die jeweiligen Editierungen bei allen Usern angezeigt bzw. haben die Möglichkeit gleichzeitig Änderungen am Dokument vorzunehmen.

## nicht implementierte Funktionen (siehe Features)

1. Nutzername anlegen und speichern
2. Kennzeichnung der individuellen Beiträge
3. Teilnehmer tracken
4. Daten speichern
5. Selektieren von Mitschriften (nicht in Features genannt)

Die Funktionen konnten aus zeitgründen nicht (vollständig) implementiert werden. Miriam Tyroller hat mit Ihnen, Herr Bazo, darüber gesprochen.

## Arbeitsaufteilung

Implementierungen von Felix Kreitmeier:
1. Struktur (HTML) und Design (CSS) der gesamten Anwendung.
2. Screen und Funktionalität zum Anlegen einer neuen Mitschrift (bzw. Auslesen der Daten des Users und speichern (nicht in Datenbank) auf Datenebene).
3. Anzeige der angelegten Mitschriften.
4. Einbindung des Editors
5. Kommunikation über Socket.io.
5.1. Jedem Nutzer (der das Tool gestartet hat) wird eine neu angelegte Mitschrift angezeigt.
5.2. Mehrere Nutzer können zeitgleich an einer Mitschrift editieren (zeitaufwändigste Funktion siehe EditNoteView).

Implementierungen von Miriam Tyroller:
1. Funktionen der Datenbank
2. Ansätze der SelectView
3. Ansätze des Trackers zur Kontrolle der Anzahl an User pro Mitschrift