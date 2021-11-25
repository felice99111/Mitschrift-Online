import Observable from "../utils/Observable.js";
import Config from "./DataConfig.js";

/* Editoren Tracker

- trackt, wie viele Teilnehmer bereits an einer Mitschrift arbeiten 
- sperrt Mitschrift bei zu vielen Teilnehmern
- legt Rollen fest? 
- TODO: eigentlich alles, habe da gerade nur kurz was reingeschmissen und noch gar nicht geschaut was da Sinn macht
*/

class Tracker extends Observable {

  constructor() {
    super();
    this.editors = 0;
    this.completed = false;
    this.maxeditors = Config.MAX_EDITORS;
  }
  /*
      edit() {
          if (this.completed === true) {
              throw new Error("Diese Mitschrift ist bereits abgeschlossen.");
          }
          else if (this.editors >= this.maxeditors) {
              throw new Error("An dieser Mitschrift arbeiten bereits zu viele Teilnehmer.");
              this.completed = true; 
          }
          this.completed = false;
          this.onTick();
      }
  */
  /*
      NewEditor() {
          if(this.editors <= 1) {
              console.log("An der Mitschrift arbeitet bereits " + this.editors + " Teilnehmer");
          }
          else {
              console.log("An der Mitschrift arbeiten bereits " + this.editors + " Teilnehmer"); 
          }
          this.editors += 1;
          let tickEvent = new Event("newEditorAdded", this.editors);
          this.notifyAll(tickEvent);

          this.onTick();
        }
        */

}

export default new Tracker();