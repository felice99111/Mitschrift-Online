/* eslint-env browser */

/* EVENT CONFIG
 *
 *
 * Konfigurationsdatei für alle Eventnamen
 * 
 */

const EventConfig = {
  //Event, wenn eine neue Mitschrift angelegt werden soll
  EVENT_ADD_NEW_NOTE: "newNoteAdded",
  //Event, wenn ein neuer Teilnehmer an einer Mitschrift arbeitet
  EVENT_ADD_NEW_EDITOR: "newEditorAdded",
  //Event, wenn in einer Mitschrift der "Zurück zur Startseite" Button geklickt wurde
  EVENT_BACK_TO_START_SCREEN: "backToStartScreen",
  //Event, wenn der Inhalt einer Mitschrift geändert wurde
  EVENT_CONTENT_CHANGED: "contentChanged",
  //Event, wenn eine Mitschrift über den Socket.io Server empfangen wurde
  EVENT_CONTENT_RECEIVED: "contentReceived",
  //Event, wenn ein User in der EditNoteView eine Taste gedrückt oder Markups verwendet hat
  EVENT_EDIT_NOTE_DATA_CHANGED: "editNoteDataChanged",
  //Event, wenn die Editierungen einer Mitschrift über den Socket.io Server empfangen wurden
  EVENT_EDIT_NOTE_DATA_RECEIVED: "editNoteDataReceived",
  //Event, wenn eine Mitschrift angeklickt wurde
  EVENT_NOTE_CLICKED: "noteClicked",
  //Event, wenn Socket.io die Daten einer neuen Mitschrift gesendet hat
  EVENT_NOTE_CREATED: "noteCreated",
};

Object.freeze(EventConfig);

export default EventConfig;