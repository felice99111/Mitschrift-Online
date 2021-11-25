/* eslint-env browser */
/* global io */

/* NOTE CLIENT
 *
 * - dient dem Austausch von Daten zwischen allen Usern, die das Tool zeitgleich nutzen
 * - überträgt Daten einer neu erstellen Mitschrift
 * - überträgt Editierungen einer Mitschrift, damit alle Mitschriften bei allen Usern auf dem selben Stand sind
 * - und alle User, die eine Mitschrift aktuell beobachten oder mit editieren Änderungen korrekt angezeigt bekommen
 * 
 */

import Config from "./ClientConfig.js";
import { Event, Observable } from "../utils/Observable.js";
import EventConfig from "../utils/EventConfig.js";

function onNewNoteCreated(data) {
  this.notifyAll(new Event(EventConfig.EVENT_NOTE_CREATED, data));
}

function onEditNoteDataChanged(data) {
  this.notifyAll(new Event(EventConfig.EVENT_EDIT_NOTE_DATA_RECEIVED, data));
}

function onContentChanged(data) {
  this.notifyAll(new Event(EventConfig.EVENT_CONTENT_RECEIVED, data));
}

class NoteClient extends Observable {

  connect() {
    this.socket = io(Config.CLIENT_URL);
    this.socket.on("new note created", onNewNoteCreated.bind(this));
    this.socket.on("edit note data changed", onEditNoteDataChanged.bind(
    this));
    this.socket.on("content changed", onContentChanged.bind(this));
  }

  sendNewNote(description, lecture, subject) {
    this.socket.emit("new note created", {
      description: description,
      lecture: lecture,
      subject: subject,
      fromServer: true,
    });
  }

  sendEditNoteData(data) {
    this.socket.emit("edit note data changed", data);
  }

  sendContent(data) {
    this.socket.emit("content changed", {
      note: data,
      fromServer: true,
    });
  }

}

export default new NoteClient();