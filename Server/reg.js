const mClient = require("mongodb").MongoClient;

module.exports = {
    input: function(data, sock){
            const url = "mongodb://localhost:27017/";
            const mongoClient = new mClient(url, { useNewUrlParser: true });
            mongoClient.connect(function(err, client){
                let db = client.db("socialis");
                var coll = 0;
                coll = db.collection("users");
                coll.find().toArray(function(err, res){
                    if(err) {
                        let answer_user_f = {
                            ans: "Возникла ошибка! Попробуйте позже",
                            type: "input"
                        }
                        sock.send(JSON.stringify(answer_user_f));
                        console.log(`Ошибка: ${err}`);
                        client.close();
                    }
                    for(let i = 0; i < res.length; i++){
                        if(res[i].login == data.name && res[i].password == data.pass){
                            console.log(">>>Успешный вход");
                            let answer_user_t = {
                                ans: "true_",
                                id:res[i].ID,
                                type: "input"
                            }
                            sock.send(JSON.stringify(answer_user_t));
                            break;
                        }else if(i == res.length - 1){
                            console.log(">>>Отказ");
                            let answer_user_t = {
                                ans: "Неверный логин или пароль",
                                type: "input"
                            }
                            sock.send(JSON.stringify(answer_user_t));
                        }
                    }
                    client.close();
                }) 
            });
    },
    register: function(data, sock){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, { useNewUrlParser: true });
        mongoClient.connect(function(err, client){
            let db = client.db("socialis");
            var coll = 0;
            coll = db.collection("users");
            coll.find({login: data.name}).toArray(function(err, res){
                if(err) {
                    let answer_user_f = {
                        ans: "Возникла ошибка! Попробуйте позже",
                        type: "register"
                    }
                    sock.send(JSON.stringify(answer_user_f));
                    console.log(`Ошибка: ${err}`);
                    client.close();
                }
                if(res.length != 0){
                    let answer_user_f1 = {
                        ans: "Профиль существует",
                        type: "register"
                    }
                    sock.send(JSON.stringify(answer_user_f1));
                    console.log(">>>Профиль существует");
                    client.close();
                }else{
                    let iduser = function(max){
                        return Math.random(Math.random() * Math.floor(max));
                    }
                    let id = iduser(5000);
                    coll.insert({login: data.name, password: data.pass, ID:id}, function(er, r){
                        if(er){
                            let answer_user_f2 = {
                                ans: "Возникла ошибка! Попробуйте позже",
                                type: "register"
                            }
                            sock.send(JSON.stringify(answer_user_f2));
                            console.log(`Ошибка: ${er}`);
                            client.close();
                        }
                        console.log(">>>Успешная регистрация");
                        let answer_user_t = {
                            ans: "true_",
                            ID:id,
                            type: "register"
                        }
                        sock.send(JSON.stringify(answer_user_t));
                    })
                }
                client.close();
            }) 
        });
    }
}