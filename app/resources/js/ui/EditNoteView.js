/* eslint-env browser */
/* global EasyMDE */

//Alle Codemirror Funktionen stammen aus https://codemirror.net/doc/manual.html bzw. https://github.com/Ionaru/easy-markdown-editor

/* EDIT NOTE VIEW
 *
 * - repräsentiert eine art neues "Fenster" (im gleichen Tab), indem User Mitschriften betrachten oder editieren können
 * - bedient sich der EasyMDE API (Markdown Editor), um Texte zu editieren
 * - sorgt für die korrekte Darstellung von Eingaben eines Users, damit diese bei allen anderen Usern, die die Mitschrift
 *   aktuell betrachten, korrekt dargestellt werden
 * - sorgt für die justierung des Cursors
 */

import View from "./View.js";
import Config from "./ViewConfig.js";
import { Event } from "../utils/Observable.js";
import EventConfig from "../utils/EventConfig.js";

function initHeader() {
  this.header = this.el.querySelector("#header-edit-note");
  this.header.description = this.header.querySelector(
    "#header-label-description");
  this.header.lecture = this.header.querySelector("#header-label-lecture");
  this.header.subject = this.header.querySelector("#header-label-subject");
  this.header.editors = this.header.querySelector("#header-label-editors");
}

function setHeader(note) {
  this.header.description.innerHTML = note.description;
  this.header.lecture.innerHTML = note.lecture;
  this.header.subject.innerHTML = note.subject;
}

function initListeners() {
  this.backButton = this.el.querySelector("#header-back-button");
  this.backButton.addEventListener("click", onClickBackButton.bind(this));
  this.el.addEventListener("keydown", onKeyDown.bind(this));
  this.el.addEventListener("paste", onPasteText.bind(this));
  this.el.addEventListener("mousedown", onMouseDown.bind(this));
  this.el.addEventListener("mouseup", onMouseUp.bind(this));
  this.el.addEventListener("click", updateCursorPosition.bind(this));
}

//onDataChanged ist dann wichtig, wenn zwei oder mehr User gleichzeitig editieren, sprich die zuletzt gedrückte
//Taste und Cursor Position benötigt wird, um den Content beim anderen User korrekt zu setzen (siehe getDataByKey).
function onDataChanged(content, markdown) {
  this.notifyAll(new Event(EventConfig.EVENT_EDIT_NOTE_DATA_CHANGED, {
    note: this.note,
    position: this.charPosition,
    content: content,
    selection: this.selection,
    markdown: markdown,
  }));
  //Wurde eine Selection gesendet, wird diese wieder aufgehoben. Es sei denn, es handelt sich um eine Markdown Formattierung.
  //Das Ziel ist, die Selection so lange zu "senden", bis ein anderes Event (z.B. Tastendruck) eintritt. Denn bei dem User,
  //der die Selection formatiert, hebt sich die Selection genauso wenig auf.
  if (this.selection && !markdown) {
    this.selection = undefined;
  }
}

//onContentChanged ist dann wichtig, wenn der Inhalt einer Mitschrift beim anderen User gesetzt werden soll, wenn dieser
//gerade nicht editiert. onContentChanged und onDataReceived kann nicht zu einem Event verbunden werden, weil onContentChanged
//von easymde bzw. codemirror aufgerufen wird und dies etwas verzögert geschieht als das Event eines Tastendrucks bei onDataChanged.

//this.received ist notwendig, damit das Event nur dann geschieht, wenn man selbst den Inhalt verändert hat. Sprich, der Inhalt
//nicht "von außen gesetzt" bzw. "empfangen wurde".
function onContentChanged() {
  if (!this.received) {
    this.note.content = this.easymde.value();
    this.notifyAll(new Event(EventConfig.EVENT_CONTENT_CHANGED, this.note));
  }
}

//onClickEditToolbar ist zuständig zum Abfangen von Clicks auf Formattier Befehle
function onClickEditToolbar(target) {
  //event.target ist nicht immer eindeutig. Gewünscht ist das Button Element. Teilweise wird das Kindelement des Buttons ausgegeben.
  //Deshalb wird immer das Elternelement gesucht - dies ist entweder ein Button - oder das Elternelement des Buttons: DIV
  //Im letzteren Fall soll das eigentliche Element ausgegeben werden.
  //Kurz um: Ziel ist es, immer das Button Element abzufangen.
  let el = target.parentNode,
    markdown;
  if (el.nodeName === "DIV") {
    el = event.target;
  }
  if (el.nodeName !== "BUTTON") {
    return;
  }
  markdown = getMarkdownByElement(el);
  if (markdown) {
    onDataChanged.call(this, markdown, true);
  }
}

function getMarkdownByElement(el) {
  if (el.classList.contains(Config.MARKDOWN_NAME_BOLD)) {
    return Config.MARKDOWN_NAME_BOLD;
  }
  if (el.classList.contains(Config.MARKDOWN_NAME_ITALIC)) {
    return Config.MARKDOWN_NAME_ITALIC;
  }
  if (el.classList.contains(Config.MARKDOWN_NAME_HEADING)) {
    return Config.MARKDOWN_NAME_HEADING;
  }
  if (el.classList.contains(Config.MARKDOWN_NAME_QUOTE)) {
    return Config.MARKDOWN_NAME_QUOTE;
  }
  if (el.classList.contains(Config.MARKDOWN_NAME_UNORDERED_LIST)) {
    return Config.MARKDOWN_NAME_UNORDERED_LIST;
  }
  if (el.classList.contains(Config.MARKDOWN_NAME_LINK)) {
    return Config.MARKDOWN_NAME_LINK;
  }
  if (el.classList.contains(Config.MARKDOWN_NAME_IMAGE)) {
    return Config.MARKDOWN_NAME_IMAGE;
  }
  return undefined;
}

/*function updateLabelEditors() {
    this.header.editors.innerHTML = this.header.editors.innerHTML.split(":")[0] + ": " + this.currentEditors;
}*/

function onClickBackButton() {
  this.isReset = true;
  this.notifyAll(new Event(EventConfig.EVENT_BACK_TO_START_SCREEN));
}

function updateCursorPosition() {
  if (!this.isReset) {
    let cursor = this.easymde.codemirror.getCursor();
    this.charPosition = cursor;
    this.cursorPosition = { line: cursor.line, ch: cursor.ch + 1 };
  }
}

function onKeyDown(event) {
  let key = event.key;
  this.ctrlActive = false;
  //ctrlKey ist wahr, wenn beim Drücken einer Taste STRG gehalten wurde
  if (event.ctrlKey) {
    this.ctrlActive = true;
  }
  this.received = false;
  updateCursorPosition.call(this);
  //Falls der User zwei Mal auf die Taste Caret gedrückt hat, wird als Taste ein dopppeltes Caret gesetzt
  if (key === Config.KEY_DEAD && this.lastKey === Config.KEY_DEAD) {
    key = Config.KEY_DOUBLE_CARET;
  }
  handelKeystrokes.call(this, key);
}

function handelKeystrokes(key) {
  let content = adjustContent.call(this, key),
    markdown = markdownActive.call(this, key);
  adjustSpecialKeyCases.call(this, key, markdown);
  this.lastKey = key;
  this.lastPosition = this.charPosition;
  //Nur, wenn die Taste Backspace, Enter oder ein einzelnes Zeichen gedrückt wurde, soll onContentChanged
  //aufgerufen werden (= keyValid). Ansonsten würde z.B. auch ein Pfeiltastendruck "ARROW_LEFT/..." übergeben werden
  if (keyValid.call(this, key)) {
    onDataChanged.call(this, content);
  }
  //Ist in der Zeile des Tastendrucks ein Markdown aktiv, muss dieses ggf. weitergegeben werden
  if (markdown) {
    onDataChanged.call(this, markdown, true);
  }
}

//Um die Übertragung von Inhalten bzw. Zeichen korrekt durchzuführen, müssen viele Einzelfälle betrachtet werden
//und z.B. selections ausgewählt oder charPositions so gesetzt werden, damit der Inhalt am Ende bei allen 
//aktuell betrachtenden Usern korrekt angezeigt wird und somit ein kollaboratives Editieren möglich ist.
function adjustSpecialKeyCases(key, markdown) {
  adjustKeyCTRLCases.call(this, key);
  adjustKeyEnterCases.call(this, key, markdown);
  adjustDeleteCases.call(this, key); //sowohl für Backspace, als auch für Delete
  adjustOtherCases.call(this, key);
}

function adjustKeyCTRLCases(key) {
  //Für den Fall, dass der gesamte Text ausgewählt wurde (STRG+A gedrückt wurde), so wird der Bereich manuell von
  //Zeile und Zeichen 0 bis Zeile und Zeichen "unendlich" ausgewählt
  if (key.toLowerCase() === Config.KEY_A && this.ctrlActive) {
    this.selection = {
      from: { line: 0, ch: 0 },
      to: { line: Config.NUM_INFINITE, ch: Config.NUM_INFINITE },
    };
  }
  //Für den Fall, dass STRG+X gedrückt wurde und kein expliziter Bereich ausgewählt wurde, soll die ganze Zeile gelöscht werden.
  if (this.ctrlActive && key === Config.KEY_X && !this.selection) {
    this.selection = getWholeLine.call(this);
  }
  //Falls der User STRG+A gedrückt hält, während er Backspace oder Delete drückt, soll der gesamte Text gelöscht werden.
  //Das bedeutet, dass ctrlActive auf false gesetzt wird, damit onDataChanged von handleKeystrokes aufgerufen werden kann.
  if (this.ctrlActive && this.lastKey === Config.KEY_A && (key === Config
      .KEY_DELETE || key === Config.KEY_BACKSPACE)) {
    this.ctrlActive = false;
  }
}

function getWholeLine() {
  return {
    from: { line: this.charPosition.line, ch: 0 },
    to: { line: this.charPosition.line, ch: Config.NUM_INFINITE },
  };
}

function adjustKeyEnterCases(key, markdown) {
  let lineContent = this.easymde.codemirror.getLine(this.charPosition.line);
  if (this.charPosition && key === Config.KEY_ENTER) {
    //Falls der User innerhalb einer Zeile, die leer ist, Enter drückt, so soll unterhalb
    //(=charPosition) eine neue Zeile eingefügt werden.
    //Würde die charPosition selbst modifiziert und keine selection ausgewählt werden, so würde
    //der Wert von lastChar falsch gesetzt.
    if (lineContent === "") {
      this.selection = {
        from: { line: this.charPosition.line, ch: 0 },
        to: { line: this.charPosition.line, ch: 0 },
      };
    }
    //Falls der User innerhalb einer Zeile, die nicht leer ist, Enter drückt, so soll innerhalb
    //der Zeile (=lastPosition) eine neue Zeile eingefügt werden
    if (lineContent !== "") {
      this.selection = {
        from: this.lastPosition,
        to: this.lastPosition,
      };
      //Ist in der Zeile, wo Enter gedrückt wurde, aktuell markdown quote oder unordered-list aktiv, muss
      //ein anderer Bereich ausgewählt werden, damit die Markdown Formatierung in der nächsten Zeile korrekt
      //eingefügt werden kann.
      if (markdown) {
        this.selection = {
          from: this.charPosition,
          to: this.charPosition,
        };
      }
    }
  }
}

function adjustDeleteCases(key) {
  //Möchte der User eine leere Zeile löschen, sodass sich die Anzahl an Zeilen reduziert (lineDeleted), wird für die Tasten
  //Backspace und Delete ein passender Bereich ausgewählt, um das Löschen der Zeile bei allen Usern korrekt anzuzeigen.
  if (this.lastPosition && this.charPosition && lineDeleted.call(this) && !this
    .selection) {
    if (key === Config.KEY_BACKSPACE) {
      this.selection = {
        from: this.lastPosition,
        to: this.charPosition,
      };
    }
    if (key === Config.KEY_DELETE) {
      this.selection = {
        from: this.charPosition,
        to: { line: this.charPosition.line + 1, ch: 0 },
      };
    }
  }
  if (key === Config.KEY_BACKSPACE || key === Config.KEY_DELETE) {
    if (!this.selection) {
      //Das Löschen eines einzelnen Buchstaben erfolgt durch die aktuelle Position des Cursors + 1 Zeichen.
      //Dies ist allerdings nur dann der Fall, wenn kein Bereich ausgewählt wurde, der gelöscht werden soll.
      this.selection = {
        from: this.charPosition,
        to: { line: this.charPosition.line, ch: this.charPosition.ch + 1 },
      };
    }
  }
}

function adjustOtherCases(key) {
  //Ist ein Bereich selektiert und der User drückt eine der Pfeiltasten, so wird der selektierte Bereich aufgehoben
  if (this.selection && (key === Config.KEY_ARROWDOWN || key === Config
      .KEY_ARROWUP || key === Config.KEY_ARROWLEFT || key === Config
      .KEY_ARROWRIGHT)) {
    this.selection = undefined;
  }
}

function lineDeleted() {
  let currentNumLines = this.easymde.codemirror.lineCount(),
    lineDeleted = false;
  if (currentNumLines < this.numLines) {
    lineDeleted = true;
  }
  this.numLines = currentNumLines;
  return lineDeleted;
}

function adjustContent(key) {
  if (key === Config.KEY_BACKSPACE || key === Config.KEY_DELETE || (this
      .ctrlActive && key.toLowerCase() === Config.KEY_X)) {
    return "";
  }
  if (key === Config.KEY_ENTER) {
    return Config.STRING_NEW_LINE;
  }
  return key;
}

function keyValid(key) {
  return ((key === Config.KEY_BACKSPACE) || (key === Config.KEY_CARET) || (
        key === Config.KEY_DELETE) ||
      (key === Config.KEY_DOUBLE_CARET) || (key === Config.KEY_ENTER) || (key
        .length === 1)) &&
    (!this.ctrlActive || (this.ctrlActive && key.toLowerCase() === Config
      .KEY_X));
}

//markdownActive ist dafür zuständig, um zu überprüfen, ob gerade Enter gedrückt wurde und die Markdown Formatierung
//somit in die nächste Zeile genommen werden soll. Das betrifft allerdings nur die Formatierungen quote und unordered-list.
function markdownActive(key) {
  if (key === Config.KEY_ENTER) {
    if (this.el.querySelector(".quote").classList.contains("active")) {
      return Config.MARKDOWN_NAME_QUOTE;
    }
    if (this.el.querySelector(".unordered-list").classList.contains("active")) {
      return Config.MARKDOWN_NAME_UNORDERED_LIST;
    }
  }
  return undefined;
}

//werden mehrere Zeichen ausgewählt, um diese zu löschen oder durch ein anderes Zeichen zu ersetzen, wird überprüft,
//um welchen Bereich es sich handelt. Dafür wird die Mausposition beim Drücken des Zeigers (onMouseDown) und beim
//loslassen des Zeigers (onMouseUp) gespeichert.
function onMouseDown(event) {
  if (toolbarClicked(event.target)) {
    return;
  }
  updateCursorPosition.call(this);
  //wird eine neuer Bereich ausgewählt (= erneut ins Textfeld gedrückt), wird die gespeicherte Selektion aufgehoben
  this.selection = undefined;
  this.charSelectionFrom = this.charPosition;
}

function onMouseUp(event) {
  if (toolbarClicked(event.target)) {
    onClickEditToolbar.call(this, event.target);
    return;
  }
  updateCursorPosition.call(this);
  let charSelectionFrom = this.charSelectionFrom,
    charSelectionTo = this.charPosition,
    charSelection = this.easymde.codemirror.getSelection();
  this.lastPosition = this.charPosition;
  if (charSelection !== "") {
    this.selection = {
      from: charSelectionFrom,
      to: charSelectionTo,
    };
  }
  checkForMultipleClicks.call(this);
}

function toolbarClicked(target) {
  return target.classList.contains("editor-toolbar") || target.nodeName ===
    "I" || target.nodeName === "BUTTON";
}

//checkForMultipleClicks überprüft, ob doppelt oder dreifach geklickt  und somit ein Bereich des Textes ausgewählt wurde.
function checkForMultipleClicks() {
  let selection = this.easymde.codemirror.getSelection();
  //this.selections werden immer zugewiesen - die this.selection ist "ungültig", wenn die Position from und to identisch sind.
  if ((this.selection && this.selection.to !== this.selection.from) ||
    selection === "") {
    return;
  }
  //Fälle Doppelklick:
  //1. Klick ist in einem Bereich von Leerzeichen erfolgt.
  if (selection[0] === " ") {
    this.selection = getSelectionOfChars.call(this, true);
  } else {
    //2. Klick ist innerhalb von Zeichen (bzw. nicht Leerzeichen) erfolgt. 
    this.selection = getSelectionOfChars.call(this);
  }
  //Fall Dreifachklick: ganze Zeile ausgewählt
  if (selection === this.easymde.codemirror.getLine(this.charPosition.line)) {
    this.selection = getWholeLine.call(this);
  }
  //console.log(this.easymde.codemirror.getSelection())
}

function getSelectionOfChars(isSpaceChar) {
  let line = this.charPosition.line,
    lineContent = this.easymde.codemirror.getLine(line),
    selectionChFrom = this.charPosition
    .ch, //this.charPosition.ch ist der erste Buchstabe der nach dem Bereich von Leerzeichen folgt.
    selectionChTo = selectionChFrom,
    i = selectionChFrom - 1;
  if (isSpaceChar) {
    //bei einer Auswahl von Leerzeichen wird solange runter gezählt, bis kein Leerzeichen mehr kommt.
    while (lineContent[i] === " ") {
      selectionChTo--;
      i--;
    }
  } else {
    //Bei einer Auswahl von "Text" wird solagne runter gezählt, bis ein Leerzeichen kommt.
    while (lineContent[i] !== " ") {
      selectionChTo--;
      i--;
    }
  }
  return {
    from: { line: line, ch: selectionChFrom },
    to: { line: line, ch: selectionChTo },
  };
}

//Möchte der User einen kopierten Text einfügen, wird der Text in der Zwischenablage über clipboardData.getData 
//aufgerufen. onDataChanged wird direkt in der Funktion aufgerufen.
//Zeile 324 und 325 kopiert aus https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand
function onPasteText(event) {
  event.preventDefault();
  let content = (event.originalEvent || event).clipboardData.getData(
    "text/plain");
  onDataChanged.call(this, content);
}

function markText(markdown, selection, position) {
  let positionFrom = { line: position.line, ch: position.ch + 1 },
    positionTo = positionFrom,
    className;
  if (selection) {
    positionFrom = selection.from;
    positionTo = selection.to;
  }
  console.log(position)
  this.easymde.codemirror.setSelection(positionFrom, positionTo);
  className = "." + markdown;
  this.el.querySelector(className).click();
}

function removeSpace(position) {
  let line = position.line + 1,
    lineContent = this.easymde.codemirror.getLine(line),
    space = 0;
  if (lineContent && lineContent[0] === " ") {
    for (let i = 0; i < lineContent.length; i++) {
      if (lineContent[i] === " ") {
        space++;
      } else {
        break;
      }
    }
  }
  this.easymde.codemirror.replaceRange("", { line: line, ch: 0 }, { line: line,
    ch: space });
}

function adjustCursor(position, content) {
  if (this.cursorPosition) {
    //wird eine Zeile von außen neu hinzugefügt, muss die Cursorposition dementsprechend eine 
    //Zeile nach unten rutschen
    if (this.cursorPosition.line >= position.line && content === Config
      .STRING_NEW_LINE) {
      this.cursorPosition = { line: this.cursorPosition.line + 1, ch: this
          .cursorPosition.ch };
    }
    //wird eine Zeile von außen entfernt, rutscht dei Cursorposition eins nach oben
    if (lineDeleted.call(this) && (this.cursorPosition.line > position.line)) {
      this.cursorPosition = { line: this.cursorPosition.line - 1, ch: this
          .cursorPosition.ch };
    }
    this.easymde.codemirror.setCursor(this.cursorPosition);
  }
}

class EditNoteView extends View {

  setElement(el) {
    super.setElement(el);
    //this.currentEditors = 0;
    initHeader.call(this);
    initListeners.call(this);
  }

  open(note) {
    this.note = note;
    //folgende Variablen sind zur Übertragung von Inhalten notwendig (siehe oben)
    this.isReset = false;
    this.ctrlActive = false;
    this.numLines = 0;
    setHeader.call(this, this.note);
    this.easymde = new EasyMDE({
      //unbind shortcuts
      shortcuts: {
        "toggleBlockquote": null,
        "toggleBold": null,
        "cleanBlock": null,
        "toggleHeadingSmaller": null,
        "toggleItalic": null,
        "drawLink": null,
        "toggleUnorderedList": null,
        "togglePreview": null,
        "toggleCodeBlock": null,
        "drawImage": null,
        "toggleOrderedList": null,
        "toggleHeadingBigger": null,
      },
      spellChecker: false,
      toolbar: ["bold", "italic", "heading", "|", "quote",
        "unordered-list", "|", "link", "image", "|", "preview",
        "side-by-side", "fullscreen", "|", "guide"
      ],
    });
    //setzt den Inhalt einer Mitschrift beim Start
    this.easymde.codemirror.replaceRange(this.note.content, { line: 0,
      ch: 0 }, { line: Config.NUM_INFINITE, ch: Config.NUM_INFINITE });
    this.easymde.codemirror.on("change", onContentChanged.bind(this));
    //CodeMirror stellt den Textbereich da. Mit "click" wird das erste mal "updateCursorPosition" ausgelöst, sodass die ersten
    //Cursor Werte aufgenommen werden
    this.el.querySelector(".CodeMirror").click();
  }

  close() {
    this.easymde.toTextArea();
    this.easymde = null;
  }

  getOpenedNote() {
    if (this
      .isReset) { //isReset ist ein Schutzmechanismus, falls die EditNoteView verändert werden soll, obwohl diese geschlossen wurde
      return false;
    }
    return this.note;
  }

  //updateContent dient zum Setzen fremden Inhalts
  updateContent(content, position, selection, markdown) {
    this.received = true; //Erklärung bei onContentChanged
    let positionFrom = position,
      positionTo = position;
    if (selection) {
      positionFrom = selection.from;
      positionTo = selection.to;
    }
    if (markdown) {
      markText.call(this, content, selection, positionTo);
    } else {
      this.easymde.codemirror.replaceRange(content, positionFrom, positionTo);
    }
    if (content === Config.STRING_NEW_LINE) {
      //Sind beim Drücken von Enter die ersten Buchstaben Lerrzeichen, entfernt die EasyMDE API diese automatisch.
      //Dieses Verhalten muss allerdings bei der Übertragung angepasst werden.
      removeSpace.call(this, positionTo);
    }
    //Mit adjustCursor bleibt der Cursor an der korrekten Position
    adjustCursor.call(this, positionTo, content);
  }

}

export default new EditNoteView();