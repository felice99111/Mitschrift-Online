/* eslint-env node */

const io = require("socket.io")();

class NoteSocket {

  start(port) {
    io.origins("*:*");
    io.serveClient(false);
    io.attach(port);
    io.on("connection", function(socket) {
      socket.on("new note created", function(data) {
        socket.broadcast.emit("new note created", data);
      });
      socket.on("edit note data changed", function(data) {
        socket.broadcast.emit("edit note data changed", data);
      });
      socket.on("content changed", function(data) {
        socket.broadcast.emit("content changed", data);
      });
    });
  }

}

module.exports = NoteSocket;