/* eslint-env browser */

import NoteListView from "./ui/NoteListView.js";
import NewNoteView from "./ui/NewNoteView.js";
import EventConfig from "./utils/EventConfig.js";
import NoteList from "./data/NoteList.js";
import EditNoteView from "./ui/EditNoteView.js";
import NoteClient from "./client/NoteClient.js";

function init() {
    initUI();
    initClient();
}

function initUI() {
    let noteListEl = document.querySelector("#note-list"),
    newNoteEl = document.querySelector("#new-note-container"),
    editNoteViewEl = document.querySelector("#edit-note-screen");
    NoteListView.setElement(noteListEl);
    NewNoteView.setElement(newNoteEl);
    EditNoteView.setElement(editNoteViewEl);
    NoteListView.addEventListener(EventConfig.EVENT_NOTE_CLICKED, onClickNote);
    NewNoteView.addEventListener(EventConfig.EVENT_ADD_NEW_NOTE, onAddNewNote);
    EditNoteView.addEventListener(EventConfig.EVENT_BACK_TO_START_SCREEN, onBackToStartScreen);
    EditNoteView.addEventListener(EventConfig.EVENT_EDIT_NOTE_DATA_CHANGED, onEditNoteDataChanged);
    EditNoteView.addEventListener(EventConfig.EVENT_CONTENT_CHANGED, onContentChanged);
}

function initClient() {
    NoteClient.connect();
    NoteClient.addEventListener(EventConfig.EVENT_NOTE_CREATED, onAddNewNote);
    NoteClient.addEventListener(EventConfig.EVENT_EDIT_NOTE_DATA_RECEIVED, onEditNoteDataReceived);
    NoteClient.addEventListener(EventConfig.EVENT_CONTENT_RECEIVED, onContentChanged);
}

function onClickNote(event) {
    if(event.data) {
        let note = NoteList.getNoteFromDescription(event.data);
        EditNoteView.open(note);
        EditNoteView.show();
    }
}

function onAddNewNote(event) {
    let description = event.data.description,
    lecture = event.data.lecture,
    subject = event.data.subject,
    newNote = NoteList.addNote(description, lecture, subject);
    NoteListView.addNoteToList(newNote);
    //onAddNewNote wird aufgerufen, wenn der User selbst eine Mitschrift angelegt hat oder
    //wenn diese über den Socket.io Server empfangen wurde. Im letzteren Fall erhält data
    //nicht nur description, lecture und subject, sondern auch einen boolean "fromServer".
    //Nur, wenn die Daten nicht vom Server kommen, sollen diese weitergeschickt werden.
    //Im Umkehrschluss - nur, wenn ich selbst eine Mitschrift angelegt habe (und diese
    //Methode aufgerufen wurde), sollen die Daten versendet werden. Habe ich die Daten bereits
    //vom Server erhalten, brauche ich diese nicht nochmal zu versenden.
    if(!event.data.fromServer) {
        NoteClient.sendNewNote(description, lecture, subject);
    }
}

function onBackToStartScreen() {
    EditNoteView.close();
    EditNoteView.hide();
}

function onEditNoteDataChanged(event) {
    let data = event.data;
    NoteClient.sendEditNoteData(data);
}

//hier sollten Daten gespeichert werden
function onContentChanged(event) {
    let note;
    //fromServer hat die gleiche Funktion wie bei onAddNewNote
    if(event.data.fromServer) {
        note = event.data.note;
    } else {
        note = event.data;
        NoteClient.sendContent(note);  
    }
    NoteList.updateNote(note.description, note.content);
}

function onEditNoteDataReceived(event) {
    let receivedNote = event.data.note,
    openedNote = EditNoteView.getOpenedNote(),
    content = event.data.content,
    position = event.data.position,
    selection = event.data.selection,
    markdown = event.data.markdown;
    //nur, wenn eine Mitschrift aktuell im Editor geöffnet ist(openedNote nicht undefined ist) und die geöffnete
    //Mitschrift identisch mit der es empfangenen Inhalts ist, wird der Inhalt der EditNoteView angepasst.
    if(openedNote) {
        if(receivedNote.description === openedNote.description && receivedNote.lecture === openedNote.lecture) {
            EditNoteView.updateContent(content, position, selection, markdown);
        }
    }
}

init();