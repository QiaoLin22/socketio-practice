const mongodb = require('mongodb').MongoClient
const socketclient = require('socket.io').listen(4000).sockets

mongodb.connect('mongodb://qlin22:Linqiao970613!@chatsimple-shard-00-00.koy2c.mongodb.net:27017,chatsimple-shard-00-01.koy2c.mongodb.net:27017,chatsimple-shard-00-02.koy2c.mongodb.net:27017/chatsimple?ssl=true&replicaSet=atlas-o98rrm-shard-0&authSource=admin&retryWrites=true&w=majority', function(err,db){
    if(err){
        throw err;
    }
    console.log('MongoDB connected...')
    socketclient.on('connection', function(socket){
        let chat = db.collection('chats')
        
        chat.find().limit(12).sort({_id:1})
        .toArray(function(err, res){
            if(err){
                throw err
            }
            socket.emit('output',res)
        })
        socket.on('chat',function(data){
            let name = data.name
            let message = data.message
            let date = data.date
            if(name == '' || message == ''){
                console.log('empty')
            } else {
                chat.insert({name: name, message: message,date:date}, function(){
                    socketclient.emit('output', [data]);
                });
            }
            socket.on('clear', function(){
                chat.remove({}, function(){
                    socket.emit('cleared');
                });
            });
        
        })
        
    })
})
