const mClient = require("mongodb").MongoClient;
const enc = require("./protocol_Enc.js");

module.exports = {
    load_profus:function(data, sock){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});

        mongoClient.connect(function(err, client){
            let coll = client.db("socialis").collection("users");
            if(err){
                console.log(`>>>Ошибка: ${err}`);
                client.close();
            }
            coll.find().toArray(function(er, res){
                let i = 0;
                let n = res.length;
                let nameus = "";
                while(i < n){
                    if(res[i].login == data.login){
                        nameus = res[i].about;
                        break;
                    }
                    i++;
                }
                let answert = {
                    name:nameus,
                    type:"profileus"
                };
                let json = JSON.stringify(answert);
                sock.send(enc.encode(json));
                console.log(">>>Данные пользователя: " + data.login + " отправлены");
                client.close();
            })
        });
    }
}