import View from "./View.js";
import Config from "./ViewConfig.js";
import EventConfig from "../utils/EventConfig.js";
import { Event } from "../utils/Observable.js";
import NoteList from "../data/NoteList.js";

/* NOTE LIST VIEW
 *
 * - liest Daten zur Erstellung einer neuen Mitschrift aus
 * - kommuniziert mit Note List, um neue Mitschrift auch auf Datenebene anzulegen
 * - sorgt für die Sichtbarkeit des Eingabefelds zum Hinzufügen einer neuen Mitschrift
 * - TODO: Mitschriftenname darf pro Vorlesung nur einmal vergeben werden
 */

function toggleView() {
  this.newNoteFormular.classList.toggle(Config.CSS_HIDDEN_CLASS_NAME);
  this.background.classList.toggle(Config.CSS_HIDDEN_CLASS_NAME);
}

function onAddNote() {
  let description = this.el.querySelector("#input-description").value,
    lecture,
    subject,
    inputLecture = this.el.querySelector("#input-lecture").value,
    selectLecture = this.el.querySelector("#select-lecture"),
    selectSubject = this.el.querySelector("#select-subject");
  //Für den Fall, dass die Vorlesung noch nicht existiert und somit neu eingegeben werden muss,
  //ist das Feld inputLecture leer und die Vorlesung und das Fach ergibt sich aus dem Textinput
  //für die Vorlesung und dem ausgewähltem Fach
  if (inputLecture !== "") {
    lecture = inputLecture;
    subject = selectSubject.options[selectSubject.selectedIndex].innerHTML;
    //Für den Fall, dass die Vorlesung bereits existiert ergibt sich diese aus dem Select Feld
    //für Vorlesungen und dessen Übergruppe (=Studienfach)
  } else {
    lecture = selectLecture.options[selectLecture.selectedIndex].innerHTML;
    subject = selectLecture.options[selectLecture.selectedIndex].parentNode
      .label;
  }
  //Gibt der User keinen Mitschriftnamen ein, wird ein Hinweis eingeblendet, diesen einzutragen.
  //Erst dann kann die Mitschrift angelegt werden.
  if (description === "") {
    showHint.call(this, Config.HINT_NO_DESCRIPTION);
    return;
  }
  if (NoteList.noteExists(description, lecture)) {
    showHint.call(this, Config.HINT_NOTE_EXISTS);
    return;
  }
  this.notifyAll(new Event(EventConfig.EVENT_ADD_NEW_NOTE, {
    description: description,
    lecture: lecture,
    subject: subject,
  }));
  clearAll.call(this);
}

function showHint(hint) {
  let labelHint = this.el.querySelector("#label-hint");
  labelHint.innerHTML = hint;
  labelHint.classList.remove(Config.CSS_HIDDEN_CLASS_NAME);
}

function clearAll() {
  toggleView.call(this);
  this.el.querySelector("#input-description").value = "";
  this.el.querySelector("#input-lecture").value = "";
  this.el.querySelector("#label-hint").classList.add(Config
    .CSS_HIDDEN_CLASS_NAME);
}

class NewNoteView extends View {

  setElement(el) {
    super.setElement(el);
    //newNoteFormular ist die Anzeige, um eine neue Mitschrift anzulegen
    this.newNoteFormular = this.el.querySelector("#new-note-formular");
    this.newNoteButton = this.el.querySelector("#new-note-button");
    this.addNoteButton = this.el.querySelector("#add-button");
    this.cancelNoteButton = this.el.querySelector("#cancel-button");
    this.background = this.el.querySelector("#background");
    this.newNoteButton.addEventListener("click", toggleView.bind(
      this));
    this.addNoteButton.addEventListener("click", onAddNote.bind(this));
    this.cancelNoteButton.addEventListener("click", clearAll.bind(this));
  }

}

export default new NewNoteView();