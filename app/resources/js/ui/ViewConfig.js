/* eslint-env browser */

const Config = {
  //Klassenname, um ein Element (un)sichtbar zu machen
  CSS_HIDDEN_CLASS_NAME: "hidden",
  //Hinweis, wenn beim Anlegen einer Mitschrift keine Beschreibung angegeben wurde
  HINT_NO_DESCRIPTION: "Bitte Mitschriftname eingeben",
  //Hinweis, wenn bereits eine Mitschrift mit gleicher Beschreibung in gleicher Vorlesung existiert
  HINT_NOTE_EXISTS: "Zu dieser Vorlesung existiert bereits eine Mitschrift mit diesem Namen.",
  //Tastennamen
  KEY_A: "a",
  KEY_ARROWDOWN: "ArrowDown",
  KEY_ARROWLEFT: "ArrowLeft",
  KEY_ARROWRIGHT: "ArrowRight",
  KEY_ARROWUP: "ArrowUp",
  KEY_BACKSPACE: "Backspace",
  KEY_CARET: "^",
  KEY_CONTROL: "Control",
  KEY_DEAD: "Dead",
  KEY_DELETE: "Delete",
  KEY_DOUBLE_CARET: "^^",
  KEY_ENTER: "Enter",
  KEY_PASTE: "v",
  KEY_X: "x",
  //Markdown Formattierungsnamen
  MARKDOWN_NAME_BOLD: "bold",
  MARKDOWN_NAME_ITALIC: "italic",
  MARKDOWN_NAME_HEADING: "heading",
  MARKDOWN_NAME_QUOTE: "quote",
  MARKDOWN_NAME_UNORDERED_LIST: "unordered-list",
  MARKDOWN_NAME_LINK: "link",
  MARKDOWN_NAME_IMAGE: "image",
  //Maximal zulässige Anzahl an Editoren
  MAX_EDITORS: 8,
  //Zahl repräsentiert "unendlich" großen wert
  NUM_INFINITE: 99999999999999999999999,
  //String, um newline im Text darzustellen
  STRING_NEW_LINE: "\n",
};

Object.freeze(Config);

export default Config;