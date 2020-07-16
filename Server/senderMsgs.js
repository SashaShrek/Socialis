const mClient = require("mongodb").MongoClient;
const enc = require("./protocol_Enc.js");

module.exports = {
    type_text:function(data, sock, users){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});
        mongoClient.connect(function(err ,client){
            let coll = client.db("socialis").collection("users");
            if(err){
                console.log(`>>>Ошибка: ${err}`);
                client.close();
            }
            coll.find().toArray(function(er, res){
                let log = "";
                let id = 0;
                for(let i = 0; i < res.length; i++){
                    if(res[i].login == data.to){
                        id = res[i].ID;
                        break;
                    }
                }


                for(let i = 0;i < res.length; i++){
                    if(res[i].ID == data.from) {
                        log = res[i].login;
                        break;
                    }
                }
                console.log(">>>>>>>>>>>>>>>>>>>>" + log);


                console.log(`>>>to ${id}`);
                var i = 0;
                while(i < users.countID.length){
                    console.log(users.countID[i]);
                    if(users.countID[i] == id) break;
                    i++;
                }
                var read = false;
                console.log(users.countID)
                if(i == users.countID.length){
                    console.log(">>>Пользователь не онлайн");
                }else{
                    let msg = {
                        text:data.message,
                        filter:log,/////////
                        type:"justmsg"
                    }
                    users.usersId[i].send(enc.encode(JSON.stringify(msg)));
                    console.log(">>>Сообщение отправлено");
                    //read = true;
                }

                coll = client.db("socialis").collection("messages");
                coll.find().toArray(function(er1, res1){

                    function upDate_dt(a, i){
                        let arrayNmbr = res1[i].struct;
                        arrayNmbr.push(a);
                        console.log(">>>Структура обновлёна");
                        let arrayMsg = res1[i].msg;
                        arrayMsg.push(data.message);
                        console.log(">>>Сообщения обновлены");

                        coll.updateOne({ from: res1[i].from, to: res1[i].to }, { $set: { isread: read, struct: arrayNmbr, msg:arrayMsg } }, function (e, r) {
                            if (e) {
                                console.log(`>>>Ошибка при обновлении данных: ${e}`);
                                client.close();
                            }
                            console.log(">>>Сообщения сохранены");
                            client.close();
                        });
                    };
                    
                    if(res1.length == 0){
                        let nmbr = [];
                            nmbr.push(0);
                            let msgs = [];
                            msgs.push(data.message);
                            coll.insertOne({from:data.from, to:id, isread:read, struct:nmbr, msg:msgs}, function(e1, r1){
                                if(e1){
                                    console.log(`>>>Возникла ошибка записи (insert): ${e1}`);
                                    client.close();
                                }
                                console.log(">>>Запись создана, сообщения сохранены");
                                client.close();
                            });
                    }
                    i = 0;
                    while(i < res1.length){
                        if(res1[i].from == data.from && res1[i].to == id){
                            upDate_dt(0, i);
                        }else if(res1[i].from == id && res1[i].to == data.from){
                            upDate_dt(1, i);
                        }else if(i == res1.length - 1){
                            let nmbr = [];
                            nmbr.push(0);
                            let msgs = [];
                            msgs.push(data.message);
                            coll.insertOne({from:data.from, to:id, isread:read, struct:nmbr, msg:msgs}, function(e1, r1){
                                if(e1){
                                    console.log(`>>>Возникла ошибка записи (insert): ${e1}`);
                                    client.close();
                                }
                                console.log(">>>Запись создана, сообщения сохранены");
                                client.close();
                            });
                        }
                        i++;
                    }
                });
            });
        });
    }
}