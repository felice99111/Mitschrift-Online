/* eslint-env node */

const AppServer = require("./lib/AppServer.js"),
  NoteSocket = require("./lib/NoteSocket.js"),
  Config = require("./lib/utils/ServerConfig.js");

var server;

/**
 * Starts webserver to serve files from "/app" folder
 */

function init() {
  initAppServer();
  initNodeSocket();
}

function initAppServer() {
  // Access command line parameters from start command (see package.json)
  let appDirectory = process.argv[2], // folder with client files
    appPort = process.argv[3]; // port to use for serving static files
  server = new AppServer(appDirectory);
  server.start(appPort);
}

function initNodeSocket() {
  let socket = new NoteSocket();
  socket.start(Config.SOCKET_IO_PORT);
}

init();