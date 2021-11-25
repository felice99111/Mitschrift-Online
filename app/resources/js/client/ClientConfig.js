/* eslint-env browser */

const Config = {
  //Url zum Verbinden mit dem Socket.io Webserver
  //HIER kann die WLAN-IPv4-Adresse (Schreibweise: IPv4:8001) eingetragen werden! 
  CLIENT_URL: "localhost:8001",
  //Url zum Verbinden mit der MongoDB
  DB_URL: "mongodb+srv://MitschriftOnlineAdmin:k0DjOCvGurfjhMuz@cluster0-wwtoj.mongodb.net/test?retryWrites=true&w=majority",
};

Object.freeze(Config);

export default Config;