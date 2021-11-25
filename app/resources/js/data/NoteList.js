import Observable from "../utils/Observable.js";
import Note from "./Note.js";

/* NOTE LIST 
 *
 * - verwaltet alle Mitschriften und kommuniziert mit Views für die Inhalte
 *
 */

class NoteList extends Observable {

  constructor() {
    super();
    this.notes = [];
  }

  addNote(description, lecture, subject) {
    let newNote = new Note(description, lecture, subject);
    this.notes.push(newNote);
    return newNote;
  }

  updateNote(description, content) {
    for (let i = 0; i < this.notes.length; i++) {
      if (description === this.notes[i].description) {
        this.notes[i].content = content;
      }
    }
  }

  getNoteFromDescription(description) {
    for (let i = 0; i < this.notes.length; i++) {
      let currentNote = this.notes[i];
      if (currentNote.description === description) {
        return currentNote;
      }
    }
    return null;
  }

  noteExists(description, lecture) {
    for (let i = 0; i < this.notes.length; i++) {
      let currentNote = this.notes[i];
      if (currentNote.description === description && currentNote.lecture ===
        lecture) {
        return true;
      }
    }
    return false;
  }

}

export default new NoteList();