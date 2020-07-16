const mClient = require("mongodb").MongoClient;
const fs = require("fs");

module.exports = {
    newdata: function(data, sock){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});
        mongoClient.connect(function(err, client){
            let coll = client.db("socialis").collection("users");
            if(err){
                console.log(`Ошибка: ${err}`);
                let answer_f = {
                    text: "Возникла ошибка! Повторите позже",
                    type: "newdata"
                }
                sock.send(JSON.stringify(answer_f));
                client.close();
            }
            if(data.upabout != "nil" && data.uppass == "nil"){
                coll.update({login: data.name}, {$set:{"about": data.upabout}}, function(err1, r){
                    if(err1){
                        console.log(`Ошибка: ${err1}`);
                        let answer_f1 = {
                            text: "Возникла ошибка! Повторите позже",
                            type: "newdata"
                        }
                        sock.send(JSON.stringify(answer_f1));
                        client.close();
                    }
                    console.log(">>>Данные пользователя успешно обновлены");
                    let answer_t = {
                        text: "true_",
                        type: "newdata"
                    }
                    sock.send(JSON.stringify(answer_t));
                    client.close();
                });
            }else if(data.upabout == "nil" && data.uppass != "nil"){
                coll.update({login: data.name}, {$set:{"password": data.uppass}}, function(err2, r){
                    if(err2){
                        console.log(`Ошибка: ${err2}`);
                        let answer_f2 = {
                            text: "Возникла ошибка! Повторите позже",
                            type: "newdata"
                        }
                        sock.send(JSON.stringify(answer_f2));
                        client.close();
                    }
                    console.log(">>>Данные пользователя успешно обновлены");
                    let answer_t2 = {
                        text: "true_",
                        type: "newdata"
                    }
                    sock.send(JSON.stringify(answer_t2));
                    client.close();
                });
            }else if(data.upabout != "nil" && data.uppass != "nil"){
                coll.update({login: data.name}, {$set:{"about": data.upabout, "password": data.uppass}}, function(err3, r){
                    if(err3){
                        console.log(`Ошибка: ${err3}`);
                        let answer_f3 = {
                            text: "Возникла ошибка! Повторите позже",
                            type: "newdata"
                        }
                        sock.send(JSON.stringify(answer_f3));
                        client.close();
                    }
                    console.log(">>>Данные пользователя успешно обновлены");
                    let answer_t3 = {
                        text: "true_",
                        type: "newdata"
                    }
                    sock.send(JSON.stringify(answer_t3));
                    client.close();
                });
            }
        });
    },
    getdata: function(data, sock){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});
        mongoClient.connect(function(err, client){
            let coll = client.db("socialis").collection("users");
            if(err){
                console.log(`Ошибка: ${err}`);
                let answer_f = {
                    text: "Возникла ошибка! Повторите позже",
                    type: "getdata"
                }
                sock.send(JSON.stringify(answer_f));
                client.close();
            }
            coll.find().toArray(function(err1, res){
                let about = "";
                let image = "";
                for(let i = 0; i < res.length; i++){
                    if(res[i].login == data.name){
                        about = res[i].about;
                        image = res[i].Image;
                        break;
                    }
                }
                if(err1){
                    console.log(`Ошибка: ${err1}`);
                    let answer_f1 = {
                        text: "Подписи нет",
                        type: "getdata"
                    }
                    sock.send(JSON.stringify(answer_f1));
                    client.close();
                }
                let answer_t = {
                    text: about,
                    Image: image,
                    type: "getdata"
                }
                console.log(">>>Данные успешно получены");
                sock.send(JSON.stringify(answer_t));
                client.close();
            });
        });
    },
    newimage:function(data, sock, file){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});
        mongoClient.connect(function(err, client){
            let coll = client.db("socialis").collection("users");
            if(err){
                console.log(`Ошибка: ${err}`);
                let answer_f = {
                    text: "Возникла ошибка! Повторите позже",
                    type: "upimage"
                }
                sock.send(JSON.stringify(answer_f));
                client.close();
            }
            coll.update({login:data.name}, {$set:{"Image":"http://188.227.86.17/socialis/" + data.name + ".png"}}, function(err1, r){
                if(err1){
                    let answer_f = {
                        text: "Возникла ошибка! Повторите позже",
                        type: "upimage"
                    }
                    sock.send(JSON.stringify(answer_f));
                    client.close();
                }
                let ex = fs.existsSync("/var/www/html/socialis/" + data.name + ".png");
                if(ex) {
                    fs.writeFile("/var/www/html/socialis/" + data.name + ".png", file, function(){
                        console.log(">>>Файл перезаписан");
                    });
                }else{
                    fs.appendFile("/var/www/html/socialis/" + data.name + ".png", file, function(){
                        console.log(">>>Файл перезаписан");
                    });
                }
                console.log(">>>Аватарка обновлена");
                let answer_t = {
                    text: "http://188.227.86.17/socialis/" + data.name + ".png",
                    type: "upimage"
                }
                sock.send(JSON.stringify(answer_t));
                client.close();
            });
        });
    }
}