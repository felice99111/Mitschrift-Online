import View from "./View.js";
import { Event } from "../utils/Observable.js";
import EventConfig from "../utils/EventConfig.js";

const NOTE_TEMPLATE = document.querySelector("#note-template").innerHTML.trim();

/* NOTE LIST VIEW
 *
 * - beim Erstellen einer neuen Mitschrift wird diese aus dem Template dargestellt
 * - sorgt für die Ausgabe aller Mitschriften einer ausgewählten Vorlesung
 * 
 */

function createNoteElement(note) {
  let container = document.createElement("div"),
    template = NOTE_TEMPLATE;
  template = template.replace("{{description}}", note.description);
  template = template.replace("{{date}}", note.date);
  template = template.replace("{{editors}}", 0);
  template = template.replace("{{lecture}}", note.lecture);
  template = template.replace("{{subject}}", note.subject);
  container.innerHTML = template;
  return container.firstChild;
}

//beim Click auf eine Mitschrift wird ein Event gesendet, um mitzuteilen, um welche Mitschrift es sich handelt
function onClickNoteList(event) {
  let description = event.currentTarget.querySelector(".note-description")
    .innerHTML;
  this.notifyAll(new Event(EventConfig.EVENT_NOTE_CLICKED, description));
}

class NoteListView extends View {

  setElement(el) {
    super.setElement(el);
  }

  addNoteToList(note) {
    let noteEl = createNoteElement(note);
    //auf jeder Mitschrift wird ein Event Listener registriert
    noteEl.addEventListener("click", onClickNoteList.bind(this));
    this.el.appendChild(noteEl);
  }

  //beim Start des Tools werden alle Mitschriften aus der Datenbank ausgelgesen und über updateNoteList angezeigt
  updateNoteList(notes) {
    for (let i = 0; i < notes.length; i++) {
      this.addNoteToList(notes[i]);
    }
  }

}

export default new NoteListView();