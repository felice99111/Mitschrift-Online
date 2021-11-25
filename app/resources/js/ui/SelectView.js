import View from "./View.js";

/* SELECT VIEW

- kommuniziert mit Eingabe einer neuen Mitschrift - wird eine neue Vorlesung angelegt, wird sie den Select Feldern
  angehängt
- dabei wird die Vorlesung der Mitschrift im oberen Select Feld ausgewählt
- bei der manuellen Auswahl zum Sortieren nach Vorlesung erhält die NoteListView die Benachrichtigung, welche Mitschriften
  angezeigt werden sollen
- passt das Label "Es wurden 2 Vorlesungen im Fach ..." je nach Vorlesung an
*/
const SELECT_TEMPLATE = document.querySelector("#select-template").innerHTML
  .trim();

function createSelectElement(subject) {
  let container = document.createElement("div"),
    template = SELECT_TEMPLATE;
  template = template.replace("{{subject-name}}", subject.name);
  template = template.replace("{{lecture-name}}", subject.lecture);
  container.innerHTML = template;
  return container.firstChild;
}

function onClickSelectList(event) {
  //let description = event.currentTarget.querySelector(".note-description").innerHTML;
  //this.notifyAll(new Event(EventConfig.EVENT_SELECT_XYZ, description));
}

class SelectView extends View {

  setElement(el) {
    super.setElement(el);
  }

  addLectureToList(title) {
    let selEl = createSelectElement(title);
    //auf jeder Mitschrift wird ein Event Listener registriert
    //selEl.addEventListener("click", onClickSelectList.bind(this));
    this.el.appendChild(selEl);
  }

  //beim Start des Tools werden alle Vorlesungen, zu denen Mitschriften existieren, aus der Datenbank ausgelesen und über updateLectureList angezeigt
  updateLectureList() {

  }

}

export default new SelectView();