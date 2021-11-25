import Config from "./DataConfig.js";

/* NOTE
 *
 * - repräsentiert eine Mitschrift aus Name, Datum, Vorlesung, Fach, aktuelle Editoren, Status und Inhalt
 * - TODO: muss ich hier überhaupt die Anzahl an Editoren speichern?
 */

function getDateString() {
  let date = new Date();
  return date.getDate() + ". " + Config.MONTHS_BY_INDEX[date.getMonth()] + " " +
    date.getFullYear();
}

class Note {

  constructor(description, lecture, subject) {
    this.description = description;
    this.date = getDateString();
    this.lecture = lecture;
    this.subject = subject;
    this.content = "";
    this.editors = 1;
    this.completed = false;
  }

  updateEditors() {
    this.editors++;
  }

  complete() {
    this.completed = true;
  }

}

export default Note;