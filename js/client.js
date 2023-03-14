//030317

var Client = {};
Client.socket = io.connect();


//Start up
//
    //Joining on server
    Client.askNewPlayer = function()
    {
        console.log("newplayer emit");
        Client.socket.emit('newplayer', UserData.id);
    };

    //Send socket id to server, adding new p on server then
    Client.sendTest = function(user_data_id, user_data_opponent_id, match_status = "waiting_to_start")
    {
        console.log("Player info sending to server");
        Client.socket.emit('test',{user_data_id:user_data_id, user_data_opponent_id:user_data_opponent_id, match_status:match_status});
    };
//

//Messaging moves
//
    Client.sendClick = function(x,y,user_data_id,z = 555)
    {
      Client.socket.emit('click',{x:x,y:y,user_data_id:user_data_id,z:z});
    };

    Client.socket.on('receive_click',function(data)
    {
        console.log('Dice: '+data.x+', Pawn index: '+data.y+'  (pid: ' + data.user_data_id + ')');
        GameplayScene.message_move(data.x, data.y, data.user_data_id, data.z);
    });
//

//Starting stuff
//

    Client.socket.on('ready_to_start', function(starting_player, going_second_player)
    {
        GameplayScene.ready_start(starting_player, going_second_player); 
    });

    //Layout requested from active player, when other p rejoins
    Client.socket.on('other_p_rejoined_send_layout_to_server_request', function(player_who_has_layout_user_data_id)
    {
        GameplayScene.get_layout(player_who_has_layout_user_data_id);
    });

    Client.send_layout = function(receiver_id, layout_data)
    {
        Client.socket.emit('layout_receival', receiver_id, layout_data);
    };

    Client.socket.on('receive_layout', function(receiver_id, layout_data)  
    {
        GameplayScene.receive_layout(receiver_id, layout_data);
    });

//

Client.socket.on('newplayer',function(data)
{
    console.log("Socket on newplayer: " + data.id_num);
    GameplayScene.addNewPlayer(data.id_num);
});


Client.refreshServer = function(id)
{
    Client.socket.emit('resestS');
};

Client.socket.on('allplayers',function(data)
{
    //for(var i = 0; i < data.length; i++){
        //GameplayScene.addNewPlayer(data[i].id);
        //GameplayScene.addNewPlayer(data[i].id);
    //}
});

Client.socket.on('on_disconnect',function(id) //id of disconnected p
{
    GameplayScene.other_p_on_disconnect(id);
});

//other_p_on_reconnect
