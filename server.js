//Socket stuff set-up
//
    var express = require('express');
    var app = express();
    var server = require('http').Server(app);
    var io = require('socket.io').listen(server);

    app.use('/css',express.static(__dirname + '/css'));
    app.use('/js',express.static(__dirname + '/js'));
    app.use('/assets',express.static(__dirname + '/assets'));

    app.get('/',function(req,res)
    {
        res.sendFile(__dirname+'/index.html');
    });

    var port = process.env.PORT || 80;
//

//server variables
//
    server.players = [];  //{user_data_id, user_data_opponent_id, match_status}
//


//Server start
//
    server.listen(port, () => 
    {
        console.log(`App now listening on port ${port}`);
    });
//

io.on('connection',function(socket)
{
    socket.on('newplayer', function(user_data_id_tramsmitted)
    {
        socket.player =
        {
            user_data_id: user_data_id_tramsmitted
        };
        //socket.emit('allplayers', getAllPlayers());
        console.log("New player with UDID: " + user_data_id_tramsmitted);
        socket.broadcast.emit('newplayer', socket.player);

        socket.on('disconnect',function()
        {
            console.log("socket on disconnect UDID: " + user_data_id_tramsmitted);
            io.emit('on_disconnect', socket.player.user_data_id);
            
            var deduct_i = false;
            var i_deducted = false;
            var one_of_2_ps_checked = false;
            
            console.log("emit on disconnect: " + socket.player.user_data_id);
            
            for (var i = 0; i < server.players.length; i++)
            {
                if (server.players[i].user_data_opponent_id == socket.player.user_data_id)
                {
                    console.log("Changing match status of pid: " + server.players[i].user_data_id + " to a_player_disconnected");
                    server.players[i].match_status = "a_player_disconnected";
                    break;
                }
            }
            for (var i = 0; i < server.players.length; i++)
            {
                if (server.players[i].user_data_id == socket.player.user_data_id)
                {
                    console.log("server.players removing pid: " + socket.player.user_data_id);
                    server.players.splice(i, 1);
                    break;
                }
            }
            console.log("Server players count: " + server.players.length);
        });
    });
    
    socket.on('click',function(data)
    {
        console.log("Socket on click");
        console.log('Dice: ' + data.x + ', Pawn index: ' + data.y + '  (pid: ' + data.user_data_id + ')  z: ' + data.z);
        console.log("receive_click emit");
        io.emit('receive_click', data);
    });

    socket.on('test', function(data) //(user_data_id, user_data_opponent_id, match_status)
    {
        server.players.push(data);
        console.log("  user data ID: " + data.user_data_id);
        console.log("  opponent user data ID: " + data.user_data_opponent_id);
        console.log("Server players count:" + server.players.length);
        console.log("Check start...");
        if (data.user_data_id != null && data.user_data_opponent_id != null) //Only proceed if user data and opponent data are not null
        {
            //Check if match already running also
            if (server.players.length > 1) //Only check if at least 2 players on server
            {
                for (var i = 0; i < server.players.length; i++)
                {
                    if (server.players[i].user_data_id != null && server.players[i].user_data_opponent_id != null
                       && data.user_data_id != null && data.user_data_opponent_id != null)
                    {
                        if (server.players[i].user_data_id == data.user_data_opponent_id) //Pair up
                        {
                            if (server.players[i].match_status != "a_player_disconnected")
                            {
                                console.log("Ready to start Match");
                                
                                var starting_player = Math.random() < 0.5 ? data.user_data_id : server.players[i].user_data_id;
                                var going_second_player = (starting_player == data.user_data_id) ? server.players[i].user_data_id : data.user_data_id;
                                console.log("Starting player socket ID: " + starting_player);
                                
                                data.match_status = "in_progress";
                                server.players[i].match_status = "in_progress";
                                
                                io.emit('ready_to_start', starting_player, going_second_player);
                                break;
                            }
                            else
                            {
                                console.log("Match rejoined by: " + data.user_data_id);
                                
                                io.emit('other_p_rejoined_send_layout_to_server_request', server.players[i].user_data_id);
                                
                                server.players[i].match_status = "in_progress";
                                data.match_status = "in_progress";
                            }
                        }
                    }
                }
            }
        }
    });
    
    socket.on('layout_receival', function(receiver_id, layout_data)
    {
        console.log("Transmitting layout receival to: " + receiver_id);
        io.emit('receive_layout', receiver_id, layout_data);
    });
    
    socket.on('resestS',function()
    {
        console.log("Reset server data");
        server.players = [];
    });
});

function getAllPlayers()
{
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID)
    {
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}
