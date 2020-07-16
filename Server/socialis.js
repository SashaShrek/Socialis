const websocket = require("ws");

const reg = require("./reg.js");
const data_user = require("./changep.js");
const search = require("./search.js");
const msgs = require("./senderMsgs.js");
const loadermsgs = require("./loaderMsgs.js");
const loaderdlgs = require("./loaderDlgs.js");
const loaderprfl = require("./loaderPrflus.js");
const worldnews = require("./worldnews.js");

console.log(">>>Сервер запущен и ожидает...");

var USERS = {
    usersId : [],
    countID : []
}

const socket = new websocket.Server({port: 2000});
socket.on("error", error => console.log(`Ошибка соединения: ${error}`));
socket.on("connection", function(sock){
    console.log(">>>Пользователь подключился");
    
    sock.on("message", function(message){
        console.log(`>>>Тип данных: ${typeof message}`);
        if(typeof message == "string"){
            console.log(`>>>Пришло: ${message}`);
            let data = JSON.parse(Buffer.from(message, "base64").toString());
            switch(data.type){
                case "firstconn":
                    USERS.usersId.push(sock);
                    sock.id = data.id;
                    USERS.countID.push(sock.id);
                    console.log(`>>>ID пользователя: ${sock.id}`);
                    console.log(`>>>Кол-во подключений за всё время = ${USERS.usersId.length}`);
                    console.log("====================================================");

                    console.log("===>>>firstconn");
                    loadermsgs.messages(data, sock, USERS);
                    console.log("=========================================");
                break;
                case "getdlgs":
                    USERS.usersId.push(sock);
                    sock.id = data.id;
                    USERS.countID.push(sock.id);
                    console.log(`>>>ID пользователя: ${sock.id}`);
                    console.log(`>>>Кол-во подключений за всё время = ${USERS.usersId.length}`);
                    console.log("====================================================");
                    console.log("===>>>getdlgs");
                    loaderdlgs.dialogs(data, sock);
                    console.log("=========================================");
                break;
                case "input":
                    console.log("===>>>input");
                    reg.input(data, sock);
                    console.log("=========================================");
                break;
                case "register":
                    console.log("===>>>register");
                    reg.register(data, sock);
                    console.log("=========================================");
                break;
                case "newdata":
                    console.log("===>>>newdata");
                    data_user.newdata(data, sock);
                    console.log("=========================================");
                break;
                case "getdata":
                    console.log("===>>>getdata");
                    data_user.getdata(data, sock);
                    console.log("=========================================");
                break;
                case "searchUser":
                    console.log("===>>>searchUser");
                    search.searchUser(data, sock);
                    console.log("=========================================");
                break;
                case "messageText":
                    console.log("===>>>messageText");
                    msgs.type_text(data, sock, USERS);
                    console.log("=========================================");
                break;
                case "profileus":
                    console.log("===>>>profileus");
                    loaderprfl.load_profus(data, sock);
                    console.log("=========================================");
                break;
                case "worldnews":
                    console.log("===>>>worldnews");
                    worldnews.weather(data, sock);
                    console.log("=========================================");
                break;
                case "getNewW":
                    console.log("===>>>getNewW");
                    worldnews.NewWeather(data, sock);
                    console.log("=========================================");
                break;
            }
        }else if(typeof message == "object"){
            console.log(">>>!!!Медиа запрос!!!");
            let dec = message.indexOf(43);
            console.log(`>>>dec_index = ${dec}`);
            let basedata = message.toString('utf-8', 0, dec);
            let file = message.slice(dec + 1, message.length);
            let data = JSON.parse(basedata);
            switch(data.type){
                case "upimage":
                    data_user.newimage(data, sock, file);
                break;
            }
        }
    });
    sock.on("close", function(){
        delete USERS.usersId[USERS.countID.indexOf(sock.id)];
        delete USERS.countID[USERS.countID.indexOf(sock.id)];
        console.log(">>>Пользователь отключился");
    });
});