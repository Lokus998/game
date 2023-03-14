class GameplayScene extends Phaser.Scene
{
    
    //Multiplayer stuff
    //
        //Assigned based on UserData based on start parameters
        //
            game_mode = 1; //1 = classic, 2 = 2nd variation
            player_going_first = 555;
            USER_NAMES_MAX_CHARS_IN_LINE = 10; //Username can be written in 2 lines if longer. This sets how many characters for first line
            p1_user_name = "User1234567891011"; //p username
            p2_user_name = "P2 Username test"; //other p username
            prize_amount = 333; //prize amount, shown on top
        //

        //Variables for Online Stuff(Integrated with Socket io and Node JS Server)
        //
            second_player_dice_num_rolled = 555; //Number which other p rolled
            second_player_pawn_selected = 555;
            static player = [];
            static num_players = 0;
            static this_instance;
            playing_player_socket_id = null;
            get_other_player_layout_timer = 555;
            z = 555;
            wifi_icons = [];
            other_p_is_disconnected = false;
            static send_layout_prompt = false;
            //Used for game_result:
                won;
                match_status;
            timer_since_dice_press = 0;
        //
    //
    
    //Gameplay variables
    //
        player_turn = 1;
        move_status = "roll";
        concluded = false;
        session_done = false;
        scores = [0,0];
        player_has_pressed_dice_at_least_once = [false, false];
    //


    //Board Parameters
    //
    board_directions = ["up","up","up","up","up-left","left","left","left","left","left","up","up","right","right","right","right",
"right", "up-right","up","up","up","up","up", "right", "right","down","down","down","down","down", "down-right","right","right",
"right","right", "right", "down", "down","left","left","left","left","left","down-left","down","down","down","down","down", "left", 
"left","up"];
    board_directions_rev = ["down","down","down","down","down","down-right","right","right","right","right","right","down","down",
"left","left","left","left", "left","down-left","down", "down","down","down","down", "left","left","up","up","up","up", "up",
"up-left","left","left","left","left", "left", "up","up","right","right","right","right","right","up-right","up","up","up","up", "up", "right","right"];
    BOARD_SAFE_ZONES = [0, 13, 26, 39, 8, 21,34, 47];//22222222222//22222222222222]  //22222222222//22222222222222]            
    board_layout = [[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],
    [false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false],[false,false]];
    board_squares_pawn_positions =
    [
      [319, 760],[319, 715],[319, 675],[319, 630],[319, 587],  [272, 540],[226, 540],[183, 540],[138, 540],[93, 540],
      [48, 540],[48, 497],[48, 450],  [92, 450],[138,450],[183,450],[226,450],[272,450],
      [318,402],[318,360],[318, 313],[318, 270],[318, 223],  [318, 180],[361,180],[407,180],
      [407,228],[407,272],[407,313],[407,360],[407,402],  [455,450],[500,450],[543,450],[589,450],[633,450],
      [677,450],[677,497],[677,540],  [633,540],[589,540],[543,540],[500,540],[455,540],
      [408,585],[408,630],[408,677],[408,720],[408,761],  [408,808],[363,808],[318,808]
    ];

    //Objects
    //
        pocket_circles = [];
        dice;
        dice_arrow;
        pawns = [[null,null,null,null], [null,null,null,null]];
        bg_stuff;
        celebratory_fireworks;

        //Connection circles
        //
            connection_circles = [[],[]];
            connection_bars = [5, 5];
        //
    //

    //Session conclude timer
    //
        session_conclude_timer = 3 * 60; //[CUSTOMIZABLE] Starting value denotes timer for concluding session before closing
    //

    //Sound
    //
        audio_enabled = true;
        sound_button;
    //

    //Placeholder for second player move delay:
    //
        timer_other_p_move;
        TOPM_RESET = 15; //[CUSTOMIZABLE] (For testing with offline)
    //
    
    //Move timer
    //
        move_timer;
        MT_RESET = 15 * 60; //[CUSTOMIZABLE] //= 30 * 60 is 30 sec (*60 is because 60 fps)
        movement_timer_anim;
        MTA_X_POS = [100, 100 + 520];
    //

    //Loop vars
    //
        i;j;k;l;
    //

    //Debug
    //
        debug_text;
        debug_square_texts;
        txt_debug_p1_score;
        txt_debug_p2_score;
    //

////////////////////////////////////////////////////////////////333 ... 333 ... 333////////////////////////////////////////////////////////////////////

    constructor()
    {
        super('GS');
    }

    preload()
    {
        GameplayScene.this_instance = this;
        
        this.p1_user_name = UserData.name;
        this.prize_amount = UserData.prize;
        this.p2_user_name = UserData.opponent_name;
        this.game_mode = UserData.game_type;
    }

    //Socket init
    //
        static ready_start(starting_player_id, going_second_player)
        {
            console.log("ready start");
            if (UserData.id == starting_player_id)
            {
                GameplayScene.this_instance.player_going_first = 1;
            }
            else if (UserData.id == going_second_player)
            {
                GameplayScene.this_instance.player_going_first = 2;
            }
            if (GameplayScene.this_instance.player_going_first != 555)
            {
                GameplayScene.this_instance.init_start();
            }
        }

 
        init_received_layout()
        {
            if (this.get_other_player_layout_timer != 555)
            {
                if (this.get_other_player_layout_timer > 0)
                {
                    this.get_other_player_layout_timer--;
                }
                else
                {
                    this.get_other_player_layout_timer = 555;
                    for (this.i = 0; this.i < 2; this.i++)
                    {
                        for (this.j = 0; this.j < 4; this.j++)
                        {
                            var pawn = this.pawns[this.i][this.j];
                            if (pawn.location == "base")
                            {
                                pawn.x = pawn.base_x;  pawn.y = pawn.base_y;
                            }
                            else
                            {
                                pawn.x = this.board_squares_pawn_positions[pawn.board_position][0];
                                pawn.y = this.board_squares_pawn_positions[pawn.board_position][1];
                                if (pawn.safe_zone_pos != 555)
                                {
                                    var mult = (this.i == 0) ? -1 : 1;
                                    pawn.y += (pawn.safe_zone_pos + 1) * pawn.SEGMENT_MOVE_DIST * mult;
                                }
                            }
                            
                            pawn.mpaos_prev_x = pawn.x;   pawn.mpaos_prev_y = pawn.y;
                            pawn.primary_circle_position_update();
                            if (pawn.location != "base")
                            {
                                pawn.more_pawns_upon_landing();
                            }
                        }
                    }
                    
                    for (this.i = 0; this.i < 5; this.i++)
                    {
                        for (this.j = 0; this.j < 2; this.j++)
                        {
                            if (!(this.i < this.connection_bars[this.j]))
                            {
                                this.connection_circles[this.j][this.i].green_frame.visible = false;
                                this.connection_circles[this.j][this.i].red_frame.visible = true;
                            }
                        }
                    }
                }
            }
        }

        static receive_layout(receiver_id, layout_data)
        {
            if (UserData.id == receiver_id)
            {
                GameplayScene.this_instance.scores = [layout_data.receiver_score, layout_data.messager_score];
                for (var i = 0; i < 2; i++)
                {
                    var ref_array = (i == 0) ? layout_data.receiver_pawn_spots : layout_data.messager_pawn_spots;
                    var mult = (i == 0) ? -1 : 1;
                    for (var j = 0; j < 4; j++)
                    {
                        var pawn = GameplayScene.this_instance.pawns[i][j];
                        if (ref_array[j] != 555)
                        {
                            pawn.location = "field";
                            var bpos = ref_array[j] + 26 * mult;
                            var bpos_szp = (i == 1) ? layout_data.messager_pawn_safe_zone_pos[j] : layout_data.receiver_pawn_safe_zone_pos[j];
                            if (bpos >= GameplayScene.this_instance.board_layout.length)
                            {
                                bpos -= GameplayScene.this_instance.board_layout.length;
                            }
                            else if (bpos < 0)
                            {
                                bpos += GameplayScene.this_instance.board_layout.length;
                            }
                            
                            pawn.board_position = bpos;
                            pawn.safe_zone_pos = bpos_szp;
                        }
                        else
                        {
                            //if (pawn.location != "base")
                            {
                                pawn.location = "base";
                            }
                        }
                    }
                }
                GameplayScene.this_instance.move_status = layout_data.move_status;
                GameplayScene.this_instance.dice.landed_on = layout_data.current_dice_roll;
                GameplayScene.this_instance.player_turn = (layout_data.current_player_turn == "messager") ? 2 : 1;
                GameplayScene.this_instance.move_timer = layout_data.turn_player_timer
                GameplayScene.this_instance.connection_bars[0] = layout_data.receiver_connection_circles;
                GameplayScene.this_instance.connection_bars[1] = layout_data.messager_connection_circles;
                GameplayScene.this_instance.get_other_player_layout_timer = 10;
                GameplayScene.this_instance.init_start(true);
            }
        }

        static send_layout()
        {
                var layout_data =
                {
                    messager_pawn_spots: [],
                    messager_pawn_safe_zone_pos: [],
                    messager_score: GameplayScene.this_instance.scores[0],
                    
                    receiver_pawn_spots: [],
                    receiver_pawn_safe_zone_pos: [],
                    receiver_score: GameplayScene.this_instance.scores[1],
                    
                    current_dice_roll: GameplayScene.this_instance.dice.landed_on,
                    current_player_turn: (GameplayScene.this_instance.player_turn == 1) ? "messager" : "receiver",
                    turn_player_timer:  GameplayScene.this_instance.move_timer,
                    move_status: GameplayScene.this_instance.move_status,
                    
                    messager_connection_circles: GameplayScene.this_instance.connection_bars[0],
                    receiver_connection_circles: GameplayScene.this_instance.connection_bars[1]
                };
                
                for (var i = 0; i < 2; i++)
                {
                    var array_refference = (i == 0) ? layout_data.messager_pawn_spots : layout_data.receiver_pawn_spots;
                    var array_reference_szp = (i == 0) ? layout_data.messager_pawn_safe_zone_pos : layout_data.receiver_pawn_safe_zone_pos;
                    for (var j = 0; j < 4; j++)
                    {
                        //location = "base";
                        var pawn = GameplayScene.this_instance.pawns[i][j];
                        array_reference_szp.push(pawn.safe_zone_pos);
                        if (pawn.location == "base")
                        {
                            array_refference.push(555);
                        }
                        else
                        {
                            array_refference.push(pawn.board_position);
                        }
                    }
                }
                
                GameplayScene.this_instance.wifi_icons[1].setFrame(3);
                GameplayScene.this_instance.other_p_is_disconnected = false;
                Client.send_layout(UserData.opponent_id, layout_data);
        }


        static get_layout(user_data_id) //Call when not in midst of move though
        {
            if (UserData.id == user_data_id)
            {
                GameplayScene.send_layout_prompt = true;
            }
        }

        static addNewPlayer(id)//, id2)
        {
            console.log("Add new player static method: " + id);
            //console.log("ID2: " + id2);
            if (GameplayScene.num_players < 2)
            {
                GameplayScene.player[GameplayScene.num_players] = "user" + id;
                GameplayScene.num_players++;
            }
            else
            {
                console.log("Already 2 players");
            }
        }

        socket_id_init()
        {
            //Socket ID getting + Transmision
            //
                if (this.playing_player_socket_id == null)
                {
                    //console.log("This socket id: " + this.game.socket.id);
                    if (this.game.socket.id != null)
                    {
                        this.playing_player_socket_id = this.game.socket.id;
                        Client.sendTest(UserData.id, UserData.opponent_id);
                    }
                }
            //
        }
    //

    //Socket midst
    //
        static other_p_on_disconnect(id_of_other_p)
        {
            console.log("other p on disconnect: " + id_of_other_p);
            if (UserData.opponent_id == id_of_other_p)
            {
                GameplayScene.this_instance.wifi_icons[1].setFrame(0);
                GameplayScene.this_instance.other_p_is_disconnected = true;
            }
        }
    //

    init_start(override)
    {
        GameplayScene.ready_to_start = true;
        this.wifi_icons[1].setFrame(3);
        if (!override)
        {
            this.player_turn = this.player_going_first;
        }
        this.movement_timer_anim = new MovementTimerAnim(this, this.MTA_X_POS[this.player_turn - 1], 1010);
        this.movement_timer_anim.setScale(1.5);
        this.movement_timer_anim.init();
        if (this.player_turn == 2)
        {
            if (!override)
            {
                this.timer_other_p_move = this.TOPM_RESET;
            }
            if (this.dice_arrow != null)
            {
                this.dice_arrow.setVisible(false);
            }
        }
        else 
        {
            if (this.dice_arrow != null)
            {
                this.dice_arrow.setVisible(true);
            }
        }
        this.pocket_circles_visibility();
    }

    create()
    {   
        console.log("Create");
        this.bg_stuff = new BackgroundContainer(this);
        var text_prize = this.add.text( 320, 7, "Prize: " + this.prize_amount, { fontFamily: 'Arial', fontSize: '22px', fill: '#FFFFFF' } );
        this.sound_button = new SoundButton(this, 666, 60);
        this.sound_button.init();
        
        //Pocket Circles, Dice, Dice Arrow
        //
            this.pocket_circles.push(this.add.image(361, 1111, 'spritesheet', 'diceBar1'));
            this.pocket_circles.push(this.add.image(361, 1111, 'spritesheet', 'diceBar2'));
            this.pocket_circles[0].setScale(0.7);   this.pocket_circles[1].setScale(0.7);
            

            this.dice = new Dice(this, 312, 1052);    this.dice.init();

            this.dice_arrow = this.add.image(328, 950, 'spritesheet', 'dice_arrow');
            this.dice_arrow.setOrigin(0);   this.dice_arrow.setScale(0.4);
            this.tweens.add(
            {
                'targets': this.dice_arrow,   'y': this.dice_arrow.y - 50,   'ease': 'Power1',   'duration': 0x15c,
                'yoyo': !0x0,'repeat': -0x1}
            ); //-0x64,
        //
        
        //Pawns
        //
            //2x2 grid placement, for both sets of pawns:
            for (this.i = 0; this.i < 2; this.i++)
            {
                for (this.j = 0; this.j < 2; this.j++)
                {
                    this.pawns[0][this.i + this.j * 2] = new Pawn(this, 121 + 80 * this.i, 655 + 80 * this.j, 1);
                    this.pawns[1][this.i + this.j * 2] = new Pawn(this, 524 + 80 * this.i, 253 + 80 * this.j, 2);
                }
            }
        
            //At start 1 pawn from each player is already out on field:
            this.pawns[0][0].clicked(true); this.pawns[0][1].clicked(true);
            this.pawns[1][0].clicked(true); this.pawns[1][1].clicked(true); 
            this.children.bringToTop(this.pawns[0][0]);  this.children.bringToTop(this.pawns[1][0]);
        //
        
        this.debug_text = this.add.text( 50, 50, "P1}", { fontSize: '33px', fill: '#FFFFFF' } );
        this.dice_debug_init();
        
        var p1_string = this.p1_user_name;
        var p1_string2 = "";
        if (p1_string.length > this.USER_NAMES_MAX_CHARS_IN_LINE)
        {
            p1_string = this.p1_user_name.substring(0, this.USER_NAMES_MAX_CHARS_IN_LINE - 1);
            p1_string2 = this.p1_user_name.substring(this.USER_NAMES_MAX_CHARS_IN_LINE - 1, this.p1_user_name.length);
        }
        var p1_username_text = this.add.text( 135, 1160, p1_string, { fontFamily: 'Arial', fontSize: '20px', fill: '#FFFFFF' } );
        var p1_username_text_line_2 = this.add.text( 135, 1186, p1_string2, { fontFamily: 'Arial', fontSize: '20px', fill: '#FFFFFF' } );
        
        var p2_string = this.p2_user_name;
        var p2_string2 = "";
        if (p2_string.length > this.USER_NAMES_MAX_CHARS_IN_LINE)
        {
            p2_string = this.p2_user_name.substring(0, this.USER_NAMES_MAX_CHARS_IN_LINE - 1);
            p2_string2 = this.p2_user_name.substring(this.USER_NAMES_MAX_CHARS_IN_LINE - 1, this.p2_user_name.length);
        }
        var p2_username_text = this.add.text( 460, 1160, p2_string, { fontFamily: 'Arial', fontSize: '20px', fill: '#FFFFFF' } );
        var p2_username_text_line_2 = this.add.text( 460, 1186, p2_string2, { fontFamily: 'Arial', fontSize: '20px', fill: '#FFFFFF' } );
        
        //Connection circles
        //
            for (this.i = 0; this.i < 2; this.i++)
            {
                for (this.j = 0; this.j < 5; this.j++)
                {
                    var cc = new ConnectionCircle(this, 20 + (this.i * 592) + (this.j * 22), 1210);  //tjos
                    cc.init();
                    this.connection_circles[this.i].push(cc);
                }
            }
        //
        
        //Player Pics
        //
            for (this.i = 0; this.i < 2; this.i++)
            {
                var rect = this.add.rectangle(42 + this.i * 520 - 8, 953 - 9, 131, 131, 0xffffff);
                rect.setOrigin(0, 0);
                var pic = this.add.image(43 + this.i * 519, 953, (this.i == 0) ? 'avatar_p1' : 'avatar_p2');
                pic.setOrigin(0, 0);
                pic.displayWidth = 113;   pic.displayHeight = 113;
            }
        //
        
        //Move Timer
        //
            this.move_timer = this.MT_RESET;
            this.move_timer_text = this.add.text(100, 100, "Move timer: 30", { fontFamily: 'Arial', fontSize: '20px', fill: '#FFFFFF' } ) ;
        //
        
        this.wifi_icons.push(new WifiIcon(this, 200, 1000), new WifiIcon(this, 200 + 300, 1000));
        this.wifi_icons[1].setFrame(1);
        console.log("wfi: " + this.wifi_icons);
        //Debug pawn positions each square
        //
            /*
            for (this.i = 0; this.i < this.board_squares_pawn_positions.length; this.i++)
            {
                var debug_token = this.add.image(this.board_squares_pawn_positions[this.i][0], this.board_squares_pawn_positions[this.i][1], 'spritesheet', 'token1');
                debug_token.alpha = 0.333;
                debug_token.setScale(0.75);
                debug_token.setOrigin(0.5, 0.5);
            }
            */
        //
        
        //Debug scores
        //
            this.txt_debug_p1_score = this.add.text(27, 888, "P1 score: 0  F");
            this.txt_debug_p2_score = this.add.text(30 + 525, 888, "P2 score: 0  F");
        //
        
        console.log("Create done");
    }

    update()
    {  
        this.socket_id_init();
        
        if (!GameplayScene.ready_to_start)
        {
            return;
        }
        
        if (GameplayScene.send_layout_prompt)
        {
            GameplayScene.send_layout_prompt = false;
            GameplayScene.send_layout();
        }
        
        this.init_received_layout();
        
        if (!this.session_done)
        {
            if (!this.concluded)
            {
                if (this.timer_since_dice_press > 0)
                {
                    this.timer_since_dice_press--;
                }
                this.bg_stuff.update();
                if (this.z == 555)
                {
                    this.other_player();
                }
                this.dice.update();
                for (this.i = 0; this.i < 2; this.i++)
                {
                    for (this.j = 0; this.j < 4; this.j++)
                    {
                        this.pawns[this.i][this.j].update();    
                    }
                }
                this.move_timer_update();
                //this.debug_square_texts_update();
            }
            else
            {
                this.concluded_update();
            }
        }
        
        //Debug player scores
        this.txt_debug_p1_score.text = "P1 score: " + this.scores[0] + "  " + (this.player_has_pressed_dice_at_least_once[0] ? "T" : "F");
        this.txt_debug_p2_score.text = "P2 score: " + this.scores[1] + "  " + (this.player_has_pressed_dice_at_least_once[1] ? "T" : "F");
    }

    concluded_update()
    {
        var winning_p_id; 
        if (this.match_status == "Win")
        {
            if (this.won) //own 333
            {
                winning_p_id = UserData.id;
            }
            else
            {
                winning_p_id = UserData.opponent_id;
            }
        }
        
        if (this.won)
        {
            if (this.celebratory_fireworks == null)
            {
                this.celebratory_fireworks = new CelebratoryFireworks(this, 333 + 34, 420);
                this.celebratory_fireworks.init();
        
                var txt_you_won = this.add.text(255, 126, 'You Won',
                            { fontFamily: 'Arial', fontSize: '45px', fill: '#FFFFFF' });
                var img_emoticon = this.add.image(465, 146, 'Emoticon');
                var txt_ms = this.add.text(53, 900, 'Winner',
                            { fontFamily: 'Arial', fontSize: '30px', fill: '#FFED60' });
                var txt_ms2 = this.add.text(576, 900, 'Looser',
                            { fontFamily: 'Arial', fontSize: '30px', fill: '#FFFFFF' });
            }
        }
        else
        {
            if (this.txt_other_p_won == null)
            {
                this.txt_other_p_won = this.add.text(255, 126, 'game over',
                            { fontFamily: 'Arial', fontSize: '45px', fill: '#FFFFFF' });
                var txt_ms = this.add.text(55, 900, 'Looser',
                            { fontFamily: 'Arial', fontSize: '30px', fill: '#FFFFFF' });
                var txt_ms2 = this.add.text(574, 900, 'Winner',
                            { fontFamily: 'Arial', fontSize: '30px', fill: '#FFED60' });
            }
        }
        
        if (this.session_conclude_timer > 0)
        {
            this.session_conclude_timer--;
        }
        else
        {
            this.session_done = true;
            var win_percenter = 100;
            if (this.match_status == "Cancelled")
            {
                /*
                50% Win, if only 3 tokens are out from home or your score is less than 34.
                100% Win, if atlest 4 tokens are out from home or your score is more than 34.
                */
                var num_tokens_out_of_base = 0;
                for (this.i = 0; this.i < this.pawns[0].length; this.i++)
                {
                    if (this.pawns[0].location != "base")
                    {
                        num_tokens_out_of_base++;
                    }
                }
                if (this.scores[0] < 34 || num_tokens_out_of_base <= 3)
                {
                    win_percenter = 50;
                }
                else if (this.scores[0] > 34 || num_tokens_out_of_base >= 4)
                {
                    win_percenter = 100;
                }
            }
            game_result(this.match_status, winning_p_id, win_percenter);
            
            //[ADD CODE FOR CLOSING PHASER CANVAS]
                //Winning player is equal to this.player_turn (If it's 1 that's player, 2 is for other player)
        }
    }

    move_timer_update()
    {
        if (this.move_status == "selection" || this.move_status == "roll")
        {
            if (this.move_timer > 0)
            {
                this.move_timer--;
                this.move_timer_text.text = "Move timer: " + Math.ceil(this.move_timer / 60);
                this.update_movement_timer_anim_frame();
            }
            else
            {
                if (this.player_turn == 1)
                {    
                    this.other_player(true);
                }
            }
            if (this.player_turn != 1)
            {
                //console.log("WF icon frame: " + this.wifi_icons[1].frame);
                if (this.await_other_p_move() || this.z != 555 || (this.other_p_is_disconnected && this.move_timer <= 1))
                {
                    console.log("Other p with override");
                    this.other_player(true);
                    //Aswoswa
                }
            }
        }
    }

    other_player(override = false)
    {
        if (this.player_turn == 2 || override)
        {
            switch (this.move_status)
            {
                case "roll":
                    if (override)
                    {
                        if (this.player_turn == 2)
                        {
                            this.dice.dice_clicked(true, this.second_player_dice_num_rolled);
                            this.timer_other_p_move = this.TOPM_RESET;
                        }
                        else
                        {
                            this.dice.dice_clicked(true,555);
                        }
                    }
                    else
                    {
                        if (this.await_other_p_move())
                        {
                            this.player_has_pressed_dice_at_least_once[this.player_turn - 1] = true;
                            this.dice.dice_clicked(true, this.second_player_dice_num_rolled);
                            //return;
                        }
                    }
                    break;
                case "selection":
                    if (override)
                    {
                        if (this.player_turn == 1)
                        {
                            var available_moves_pawns = [];
                            for (this.i = 0; this.i < 4; this.i++)
                            {
                                if (this.pawns[this.player_turn-1][this.i].selection_circle.visible)
                                {
                                    available_moves_pawns.push(this.pawns[this.player_turn-1][this.i]);
                                }
                            }
                            if (available_moves_pawns.length > 0)
                            {
                                available_moves_pawns[Phaser.Math.Between(0, available_moves_pawns.length - 1)].clicked();
                            }
                        }
                        else
                        {
                            console.log("Asubayah");
                            console.log("this.second_player_pawn_selected: ");
                            console.log(this.second_player_pawn_selected);
                            if (this.second_player_pawn_selected != 555)
                            {
                                this.pawns[1][this.second_player_pawn_selected].clicked();
                            }
                        }
                    }
                    else
                    {
                        if (this.await_other_p_move())
                        {
                            console.log("Thingy this.second_player_pawn_selected: :)");
                            console.log(this.second_player_pawn_selected);
                            console.log(this.pawns[1][this.second_player_pawn_selected]);
                            this.pawns[1][this.second_player_pawn_selected].clicked();
                        }
                    }
                    
                    break;
            }
        }
    }

    static message_move(x, y, p_user_id, z)
    {
        if (p_user_id == UserData.opponent_id)
        {
            if (z != null && z != undefined && GameplayScene.this_instance.z != null && GameplayScene.this_instance.z != undefined)
            {
                GameplayScene.this_instance.z = z;
            }
            console.log("Message move received: " + x + ',' + y + ',' + z + "  by " + p_user_id);
            if (x != 555)
            {
                GameplayScene.this_instance.second_player_dice_num_rolled = x;
            }
            if (y != 555)
            {
                GameplayScene.this_instance.second_player_pawn_selected = y;
            }
            //if (z == 555)
            {
                GameplayScene.this_instance.timer_other_p_move = 0;
            }
        }
    }

    await_other_p_move()
    {
        if (this.timer_other_p_move > 0)
        {
            return false;
        }
        else
        {
            this.timer_other_p_move = this.TOPM_RESET;
            return true;
        }
    }

    dice_roll_done()
    {     
        if (this.player_turn == 1)
        {
            if (this.move_timer > 0 && this.z == 555)
            {
                Client.sendClick(this.dice.landed_on, 555, UserData.id);
            }
        }
        
        var can_make_move = false;
        
        for (this.i = 0; this.i < 4; this.i++)
        {
            var pawn = this.pawns[this.player_turn - 1][this.i];   
            if (pawn.location == "base")
            {
                if (this.dice.landed_on == 6)
                {
                    pawn.selection_circle_availableize();
                    this.children.bringToTop(pawn);
                    can_make_move = true;
                }
            }
            else //with win area spot too
            {
                if (pawn.being_sent_back_to_base)
                {
                    continue;
                }
                
                var pos_with_dice_added = pawn.board_position + this.dice.landed_on;
                var clear = false;
                
                if (pawn.safe_zone_pos == 555)
                {
                    var c = true;
                    if (this.player_turn == 2 && pawn.board_position >= pawn.BOARD_START_IND[1] - 1)
                    {
                        c = false;
                    }
                    if (pos_with_dice_added > pawn.board_pos_safe_zone && c) //Would reach safe zone
                    {
                        clear = true;
                        //pos_with_dice_added = 555;
                    }
                    else
                    {
                        //PMWE if exceeding max board ind:
                        if (pos_with_dice_added > this.board_layout.length - 1)
                        {
                            pos_with_dice_added -= this.board_layout.length - 1 - 1;
                        }

                        //No same colour pawns on spot, unless safe zone to be valid
                        //console.log("is safe zone(" + pos_with_dice_added + ")? " + this.is_safe_zone(pos_with_dice_added)); //(:
                        if (this.is_safe_zone(pos_with_dice_added) || this.board_layout[pos_with_dice_added][this.player_turn - 1] == false) 
                        {
                            clear = true;
                        }
                    }
                }
                else //If in safe zone
                {
                    if (pawn.safe_zone_pos + this.dice.landed_on <= 5)
                    {
                        clear = true;
                    }
                }
                        
                if (clear)
                {
                    pawn.selection_circle_availableize();
                    this.children.bringToTop(pawn);
                    can_make_move = true;
                }
            }
        }
                
        if (can_make_move)
        {
            this.move_status = "selection";
        }
        else
        {
            this.wrap_up_move();
        }
    }

    commence_move(instant = false)
    {
        this.move_status = "commence_move";
        for (this.i = 0; this.i < 4; this.i++)
        {
            this.pawns[this.player_turn - 1][this.i].selection_circle.visible = false;
        }
        if (instant)
        {
            this.wrap_up_move();
        }
    }

    wrap_up_move(go_again_override = false)
    {
        if (this.connection_bars[this.player_turn - 1] >= 0)
        {
            if (this.move_timer <= 0)
            {
                if (this.player_turn == 1 || (this.z != 555) || this.other_p_is_disconnected)
                {
                    if (this.connection_bars[this.player_turn - 1] > 0)
                    {
                        this.connection_circles[this.player_turn - 1][this.connection_bars[this.player_turn - 1] - 1].green_frame.visible = false;
                        this.connection_circles[this.player_turn - 1][this.connection_bars[this.player_turn - 1] - 1].red_frame.visible = true;
                        this.connection_bars[this.player_turn - 1]--;
                        //Client.sendClick(555,555,this.playing_player_socket_id);
                    }
                    else if (this.connection_bars[this.player_turn - 1] == 0)
                    {
                        console.log("disconnected");
                        this.concluded = true;
                        if (!this.player_has_pressed_dice_at_least_once[this.player_turn - 1])
                        {
                            this.won = false;
                            this.match_status = "Cancelled";
                        }
                        else
                        {
                            this.won = (this.player_turn != 1);
                            this.match_status = "Win";
                        }
                        return;
                    }
                }
                //else if (!this.await_other_p_move())
                
            }
        }
        
        this.z = 555;
        
        this.move_status = "roll";
        this.move_timer = this.MT_RESET;
        this.update_movement_timer_anim_frame();
        if (this.move_timer_text != null)
        {
            this.move_timer_text.text = "Move timer: " + Math.ceil(this.move_timer);
        }
        
        //Changing turn, if not 6(Go again)
        if (this.dice.landed_on != 6 && !go_again_override)
        {
            this.player_turn = (this.player_turn == 1) ? 2 : 1;
            
            this.pocket_circles_visibility();
            this.bg_stuff.switch_alpha_turns();
            if (this.movement_timer_anim != null)
            {
                this.movement_timer_anim.x = this.MTA_X_POS[this.player_turn - 1];
            }
            if (this.player_turn == 1)
            {
                this.dice_arrow.setVisible(true);
            }
            else
            {
                this.timer_other_p_move = this.TOPM_RESET;
                this.dice_arrow.setVisible(false);
            }
        }
        else
        {
            if (this.player_turn == 1)
            {
                this.dice_arrow.setVisible(true);
            }
        }
        
        
        if (this.debug_text != null && this.debug_text.setText != null)
        {
            this.debug_text.setText("P" + this.player_turn);
        }
    }

    is_safe_zone(ind)
    {
        for (this.k = 0; this.k < this.BOARD_SAFE_ZONES.length; this.k++)
        {
            if (ind == this.BOARD_SAFE_ZONES[this.k])
            {
                return true;
            }
        }
        return false;
    }

    get_pawns_on_square(ind, safe_zone_pos = 555)
    {
        var a = [[],[]];
        if (safe_zone_pos == 555)
        {
            for (this.k = 0; this.k < 2; this.k++)
            {
                for (this.l = 0; this.l < 4; this.l++)
                {
                    if (this.pawns[this.k][this.l].location == "field" && this.pawns[this.k][this.l].safe_zone_pos == 555)
                    {
                        if (this.pawns[this.k][this.l].board_position == ind)
                        {
                            a[this.k].push(this.pawns[this.k][this.l]);
                        }
                    }
                }
            }
        }
        else
        {
            for (this.l = 0; this.l < 4; this.l++)
            {
                if (this.pawns[this.player_turn-1][this.l].safe_zone_pos == safe_zone_pos)
                {
                    a[this.player_turn-1].push(this.pawns[this.player_turn-1][this.l]);
                }
            }
        }
        return a;
    }

    check_win()
    {
        var won_match_check = true;
        for (this.k = 0; this.k < 4; this.k++)
        {
            if (this.pawns[this.player_turn - 1][this.k].safe_zone_pos != 5)
            {
                won_match_check = false;
                break;
            }
        }
        if (won_match_check)
        {
            this.play_sound("victory");
            this.concluded = true;
            if (this.player_turn == 1)
            {
                this.won = true;
            }
            else
            {
                this.won = false;
            }
            this.match_status = "Win";
            //game_result("Win", this.player_turn);
            console.log((this.player_turn == 1 ? this.p1_user_name : this.p2_user_name) + "wins");
        }
    }

    pocket_circles_visibility()
    {
        this.pocket_circles[0].setVisible(this.player_turn == 1);
        this.pocket_circles[1].setVisible(this.player_turn == 2);
    }

    update_movement_timer_anim_frame()
    {
        if (this.movement_timer_anim != null) //thius
        {
            var percentage_of_move_timer = this.move_timer / (this.MT_RESET / 100);
            var one_percent_of_anim_total_frames = 75 / 100;
            var frame_proportionate_to_percentage_of_mt = Math.round(one_percent_of_anim_total_frames * percentage_of_move_timer);
            var swapped_frame = 75 - frame_proportionate_to_percentage_of_mt;
            this.movement_timer_anim.update_frame(swapped_frame);
        }
    }

    play_sound(snd)
    {
        if (this.audio_enabled)
        {
            this.sound.playAudioSprite('audioSprite', snd);
        }
    }

    dice_debug_init()
    {
        this.input.keyboard.on('keydown-NUMPAD_ZERO', function () {   this.dice.debug_roll = 555; }, this);
        this.input.keyboard.on('keydown-NUMPAD_ONE', function () { this.dice.debug_roll = 1; console.log("Asdsdsdasd");}, this);
        this.input.keyboard.on('keydown-NUMPAD_TWO', function () { this.dice.debug_roll = 2; }, this);
        this.input.keyboard.on('keydown-NUMPAD_THREE', function () { this.dice.debug_roll = 3; }, this);
        this.input.keyboard.on('keydown-NUMPAD_FOUR', function () { this.dice.debug_roll = 4; }, this);
        this.input.keyboard.on('keydown-NUMPAD_FIVE', function () { this.dice.debug_roll = 5; }, this);
        this.input.keyboard.on('keydown-NUMPAD_SIX', function () { this.dice.debug_roll = 6; }, this);
        this.input.keyboard.on('keydown-SPACE', function () { if (this.move_status == "roll") { this.dice.dice_clicked(); } }, this);
        this.input.keyboard.on('keydown-NUMPAD_EIGHT', function () {Client.refreshServer(); console.log("Refresh");}, this);
    }

    /*debug_square_texts_update()
    {
        for (this.i = 0; this.i < this.debug_square_texts.length; this.i++)
        {
            var s = "";
            for (this.j = 0; this.j < 2; this.j++)
            {
                if (this.board_layout[this.i][this.j] == false)
                {
                    s += "0";
                }
                else
                {
                    s += "1";
                }
                if (this.j == 0)
                {
                    s += ",";
                }
            } 
            this.debug_square_texts[this.i].text = s;   
            this.children.bringToTop(this.debug_square_texts[this.i]);
        }
    }*/

}
