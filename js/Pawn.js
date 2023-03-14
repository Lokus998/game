class Pawn extends Phaser.GameObjects.Image
{
    
    pawn_type; //1 = p1, 2 = p2
    
    location = "base";
    being_sent_back_to_base = false;
    eaten_override = false;
    base_x;  base_y; //base_x/y are assigned based on constructor assigned x,y (GameplayScene)
    
    selected = false;
    selection_circle;
        SELECTION_CIRCLE_X_OFF_SET = -1.75;   SELECTION_CIRCLE_Y_OFF_SET = 25;   
        SC_ROTATION_SPEED = 6.5; //[CUSTOMIZABLE] rotation speed of selection circle

    primary_circle;
    PRIMARY_CIRCLE_X_OFF_SET=-1;   PRIMARY_CIRCLE_Y_OFF_SET = 24;   PRIMARY_CIRCLE_BASE_SCALE=0.81;   PRIMARY_CIRCLE_MAX_SCALE=0.90;

    //Starting pos & index X & Y on field, safe zone vertical movement dir ( [p1, p2] )
    FIELD_START_X = [319, 407];  FIELD_START_Y = [760, 228];   BOARD_START_IND = [0, 26]; SAFE_ZONE_Y_DIR = [-1, 1];

    board_position = 0;   board_pos_safe_zone;   safe_zone_pos = 555;

    MOVEMENT_SPEED = 6; //[CUSTOMIZABLE]
    segment_amount_moved; //Segment covered progress
    SEGMENT_MOVE_DIST = 44.8; //1 square on field
    segments_covered_in_move; //# segments covered progress
    segment_scaling_dir; //+1 bigger, then -1 smaller
    BASE_SCALE = 0.75;  SEGMENT_MAX_SCALE = 0.9;  SCALE_ANIM_INC = 0.16; //0.025;
    additional_scale_anim_done = true;  asa_initial_scale;

    //more pawns at one spot:
    mpaos_prev_x = 555;  mpaos_prev_y = 555;

    i;

    debug_text;
    
    constructor(scene, x, y, p)
    {
        super(scene, x, y, 'spritesheet', (p == 1) ? 'token1' : 'token2');
        
        this.pawn_type = p;
        
        this.primary_circle = this.scene.add.image(this.x + this.PRIMARY_CIRCLE_X_OFF_SET,this.y + this.PRIMARY_CIRCLE_Y_OFF_SET, 'new_pawn_circle');
        this.primary_circle.setScale(this.PRIMARY_CIRCLE_BASE_SCALE);
        
        this.selection_circle = this.scene.add.image(this.x + this.SELECTION_CIRCLE_X_OFF_SET, this.y + this.SELECTION_CIRCLE_Y_OFF_SET, 'spritesheet', 'dashedCircle');
        this.selection_circle.setScale(0.4);
        this.selection_circle.visible = false;
        
        this.base_x = x;
        this.base_y = y;
        
        if (p == 1)
        {
            this.board_pos_safe_zone = this.scene.board_layout.length - 2;
        }//2/22
        else if (p == 2)
        {
            this.board_pos_safe_zone = 24; //222222222222222222
        }
        
        this.setScale(this.BASE_SCALE);
        this.setOrigin(0.5, 0.5);
        
        this.scene.add.existing(this);
        
        //Click event:
        this.setInteractive();
        this.on('pointerdown', function()
        {
            this.clicked(false, true);
        }, this);
        
        this.debug_text = this.scene.add.text(this.x, this.y, "XD", { fontSize: '33px', fill: '#333333' });
        this.debug_text.setVisible(false);
    }

    clicked(override = false, direct_click = false)
    {
        if (direct_click && this.scene.timer_since_dice_press > 0)
        {
            return;
        }
        if (this.selection_circle.visible || override)
        {
            if (!override && this.scene.player_turn == 1)
            {
                //console.log(this.scene.pawns[this.scene.player_turn - 1].indexOf(this,0));
                if (this.scene.move_timer > 0)
                {
                    Client.sendClick(555,this.scene.pawns[this.scene.player_turn - 1].indexOf(this,0),UserData.id);
                }
                else
                {
                    Client.sendClick(this.scene.dice.landed_on,this.scene.pawns[this.scene.player_turn - 1].indexOf(this,0), UserData.id, 4);
                }
            }

            if (!override && direct_click && this.scene.player_turn != 1) // && this.pawn_type != 1
            {
                //console.log("huh");
                return;
            }
            //else if (!override && this.scene.player_turn != 1)
            {
               // return;
            }
            //console.log(this.scene.pawns[this.player_turn - 1].indexOf(this));
            if (this.location == "base")
            {
                this.put_on_start_pos();
                this.scene.commence_move(true);
            }
            else if (this.location == "field")
            {
                this.selected = true;
                
                var a = this.scene.get_pawns_on_square(this.board_position, this.safe_zone_pos);
                if (a[this.pawn_type - 1].length == 1)
                {
                    this.scene.board_layout[this.board_position][this.pawn_type - 1] = false;
                }
                
                this.segments_covered_in_move = 0; this.segment_amount_moved = 0; this.segment_scaling_dir = 1;
                this.scene.play_sound('jump');
                if (this.scale < this.BASE_SCALE)
                {
                    this.setScale(this.BASE_SCALE);  this.primary_circle.setScale(this.PRIMARY_CIRCLE_BASE_SCALE);
                    this.x = this.mpaos_prev_x;  this.y = this.mpaos_prev_y;
                }
                this.more_pawns_upon_landing(true);
                this.scene.commence_move();

            }
        }
    }

    put_on_start_pos()
    {//222222222222222
        this.location = "field";
        
        this.x = this.FIELD_START_X[this.pawn_type - 1];   this.y = this.FIELD_START_Y[this.pawn_type - 1];
        this.mpaos_prev_x = this.x;   this.mpaos_prev_y = this.y;
        this.primary_circle_position_update();
        
        this.board_position = this.BOARD_START_IND[this.pawn_type - 1];
        this.scene.board_layout[this.board_position][this.pawn_type - 1] = true;
        
        this.debug_text.text = this.board_position;
        this.debug_text.x = this.x;
        this.debug_text.y = this.y;
        
        this.scene.play_sound('safe');
        
        this.more_pawns_upon_landing();
    }

    selection_circle_availableize()
    {
        this.eaten_override = false;
        this.selection_circle.visible = true;
        this.selection_circle.x = this.x + this.SELECTION_CIRCLE_X_OFF_SET;
        this.selection_circle.y = this.y + this.SELECTION_CIRCLE_Y_OFF_SET;
    }

    update()
    {
        if (this.selection_circle.visible)
        {
            this.selection_circle.angle += this.SC_ROTATION_SPEED;
        }
        else
        {
            //If got selected for move
            if (this.selected) 
            {
                this.selected_for_move_update();
            }
            else
            {
                if (this.being_sent_back_to_base)
                {
                    this.being_sent_back_to_base_update();
                }
            }
        }
        
        if (!this.additional_scale_anim_done)
        {
            this.segment_movement(0);
        }
    }

    being_sent_back_to_base_update()
    {
        if (this.board_position != this.BOARD_START_IND[this.pawn_type - 1])
        {
            //1 grid segment coverage
            if (this.segment_amount_moved < this.SEGMENT_MOVE_DIST)
            {
                this.segment_movement(-1);
            }
            else
            //Next grid segment
            {
                this.setScale(this.BASE_SCALE);  this.primary_circle.setScale(this.PRIMARY_CIRCLE_BASE_SCALE);
                this.segment_scaling_dir = 1;  this.segment_amount_moved = 0;
                this.board_position--;
                //PMWE:
                if (this.board_position < 0)
                {
                    this.board_position = this.scene.board_layout.length - 1;
                }
            }
        }
        else
        {
            this.x = this.base_x;   this.y = this.base_y;
            this.mpaos_prev_x = this.x;   this.mpaos_prev_y = this.y;
            this.primary_circle_position_update();
            this.location = "base";
            this.being_sent_back_to_base = false;
            this.debug_text.x = this.x;   this.debug_text.y = this.y;
            this.scene.wrap_up_move(true);
        }
    }

    selected_for_move_update()
    {
        //Total squares covered going up to dice roll num
        if (this.segments_covered_in_move < this.scene.dice.landed_on) 
        {
            //1 grid segment coverage
            if (this.segment_amount_moved < this.SEGMENT_MOVE_DIST)
            {
                this.segment_movement();
            }
            else
            //Next grid segment
            {
                this.setScale(this.BASE_SCALE);
                this.primary_circle.setScale(this.PRIMARY_CIRCLE_BASE_SCALE);
                this.segment_scaling_dir = 1;   this.segment_amount_moved = 0;   this.segments_covered_in_move++;

                var at_safe_zone;
                //Determining whether in safe zone
                //
                    if (this.pawn_type == 1)
                    {
                        at_safe_zone = !(this.board_position < this.board_pos_safe_zone);
                    }
                    else
                    {
                        if (this.board_position < this.BOARD_START_IND[2 - 1])
                        {
                            at_safe_zone = !(this.board_position < this.board_pos_safe_zone);
                        }
                    }
                //

                if (!at_safe_zone)
                {
                    this.board_position++;
                    this.scene.scores[this.scene.player_turn - 1]++;

                    //PMWE:
                    if (this.board_position > this.scene.board_layout.length - 1)
                    {
                        this.board_position = this.board_position - this.scene.board_layout.length;
                    }
                    
                    this.x = this.scene.board_squares_pawn_positions[this.board_position][0];
                    this.y = this.scene.board_squares_pawn_positions[this.board_position][1];
                    this.primary_circle_position_update();

                    this.debug_text.text = this.board_position;
                }
                else
                {
                    if (this.safe_zone_pos == 555)
                    {
                        this.safe_zone_pos = 0;
                        this.scene.play_sound('safe');
                    }
                    else
                    {
                        this.safe_zone_pos++;
                        this.scene.scores[this.scene.player_turn - 1]++;
                    }
                    if (this.scene.game_mode == 2)
                    {
                        if (this.safe_zone_pos < 5)
                        {
                            if (this.segments_covered_in_move >= this.scene.dice.landed_on)
                            {
                                this.segments_covered_in_move--;
                            }
                        }    
                    }
                    if (this.safe_zone_pos == 5)
                    {
                        this.scene.play_sound('finish');
                        this.scene.check_win();
                    }
                }

                //Movement Hop Start Sound effect:
                if (this.segments_covered_in_move < this.scene.dice.landed_on)
                {
                    this.scene.play_sound('jump');
                }
            }
        }
        else
        {
            this.selected = false;
            this.additional_scale_anim_done = false;  this.segment_amount_moved = 0;
            
            var eaten = false;
            //Eating other p pawns:
            if (!this.scene.is_safe_zone(this.board_position) && this.safe_zone_pos == 555)
            {
                if ((this.scene.board_layout[this.board_position][0] == true || this.scene.board_layout[this.board_position][1] == true) 
                     && this.scene.board_layout[this.board_position][this.pawn_type - 1] == false)
                {
                    var other_p_ind = (this.pawn_type == 1) ? 1 : 0;

                    for (this.i = 0; this.i < 4; this.i++)
                    {
                        if (this.scene.pawns[other_p_ind][this.i].safe_zone_pos == 555)
                        {
                            if (this.scene.pawns[other_p_ind][this.i].board_position == this.board_position)
                            {
                                this.scene.play_sound('kick');
                                this.scene.pawns[other_p_ind][this.i].sent_to_base();
                                eaten = true;
                                this.scene.board_layout[this.board_position][other_p_ind] = false;
                                break;
                            }
                        }
                    }
                }
            }
            else
            {
                this.scene.play_sound('safe');
            }
            
            if (this.safe_zone_pos == 555)
            {
                this.scene.board_layout[this.board_position][this.pawn_type - 1] = true;
            }
            
            this.mpaos_prev_x = this.x;  this.mpaos_prev_y = this.y;
            
            this.eaten_override = eaten;
        }//222222222222222222
    }

    segment_movement(movement_multiplier = 1)
    {
        var inc;
        if (movement_multiplier != 0)
        {
            inc = this.MOVEMENT_SPEED * ((movement_multiplier == 1) ? 1 : 2.5);
            if (this.scene.game_mode == 2 && this.safe_zone_pos < 5)
            {
                inc *= 3;
            }
        }
        else
        {
            inc = 4;
        }
        inc = Math.min(this.SEGMENT_MOVE_DIST - this.segment_amount_moved, inc);
        
        var xdir = 0;  var ydir = 0;
        if (movement_multiplier != 0)
        {
            if (this.board_position == this.board_pos_safe_zone && movement_multiplier == 1)
            {
                ydir = this.SAFE_ZONE_Y_DIR[this.pawn_type - 1];
            }
            else
            {
                var av = (movement_multiplier == 1) ? this.scene.board_directions[this.board_position] : this.scene.board_directions_rev[this.board_position];
                switch (av)
                {
                    case "up":        ydir = -1;              break;
                    case "up-left":   ydir = -1; xdir = -1;   break;
                    case "up-right":  ydir = -1; xdir = 1;    break;   //multiplier = 2;  
                    case "left":      xdir = -1;              break;
                    case "right":     xdir = 1;               break;
                    case "down":      ydir = 1;               break;
                    case "down-left": ydir = 1;  xdir = -1;   break;
                    case "down-right":ydir = 1;  xdir = 1;    break;
                }
            }
        }

        this.x += inc * xdir;   this.y += inc * ydir;
        this.primary_circle_position_update();

        this.debug_text.x = this.x;   this.debug_text.y = this.y;
            
        if (!this.additional_scale_anim_done)
        {
            if (this.segment_amount_moved >= this.SEGMENT_MOVE_DIST)
            {
                this.additional_scale_anim_done = true;
                if (!this.eaten_override)
                {
                    this.more_pawns_upon_landing();
                    this.scene.wrap_up_move();
                }
                return;
            }
        }
        
        if (!(this.scene.game_mode == 2 && this.safe_zone_pos < 5))
        {
            if (this.segment_scaling_dir == 1)
            {
                this.setScale(Math.min(this.scale + this.SCALE_ANIM_INC, this.SEGMENT_MAX_SCALE));
                this.primary_circle.setScale(Math.min(this.primary_circle.scale + this.SCALE_ANIM_INC / 1.5, this.PRIMARY_CIRCLE_MAX_SCALE));
                if (this.segment_amount_moved >= this.SEGMENT_MOVE_DIST / 2)
                {
                    this.segment_scaling_dir = -1;
                }
            }
            else
            {
                this.setScale(Math.max(this.scale - 0.15, this.BASE_SCALE));
                this.primary_circle.setScale(Math.max(this.primary_circle.scale - 0.09, this.PRIMARY_CIRCLE_BASE_SCALE));
            }
        }

        this.segment_amount_moved += inc;
    }

    sent_to_base()
    {
        this.being_sent_back_to_base = true;
        this.segment_amount_moved = 0;
    }

    more_pawns_upon_landing(override = false, override2 = false)
    {
        var pawns = this.scene.get_pawns_on_square(this.board_position, this.safe_zone_pos);
        var ref_x = this.x;   var ref_y = this.y;       
        var j;
        var pawns_merged = [];
        for (this.i = 0; this.i < pawns.length; this.i++)
        {
            for (j = 0; j < pawns[this.i].length; j++)
            {
                pawns_merged.push(pawns[this.i][j]);
            }
        }
        pawns = [[],[]];
        for (this.i = 0; this.i < pawns_merged.length; this.i++)
        {
            var ind = (this.i <= 3) ? 0 : 1;
            pawns[ind].push(pawns_merged[this.i]);
        }
        
        if (override)
        {
            for (j = 0; j < 2; j++)
            {
                var br = false;
                for (this.i = 0; this.i < pawns[j].length; this.i++)
                {
                    if (pawns[j][this.i] == this)
                    {
                        pawns[j].splice(this.i, 1);
                        br = true;
                        break;
                    }
                }
                if (br) { break; }
            }
        }
        
        var j;
        if ((pawns[0].length + pawns[1].length) > 1)
        { 
            for (j = 0; j < 2; j++)
            {
                for (this.i = 0; this.i < pawns[j].length; this.i++)
                {
                    switch (pawns[j].length)
                    {
                        case 1: pawns[j][this.i].x = ref_x; break;
                        case 2: pawns[j][this.i].x = ref_x - 7 + this.i * (7 * 2); break;
                        case 3: pawns[j][this.i].x = ref_x - 11 + this.i * 11 ; break;
                        case 4: pawns[j][this.i].x = ref_x - 5 + this.i * 5; break;
                    }
                    
                    
                    var addition = ( (pawns[1].length == 0) ? 0 : 10 );          
                    pawns[j][this.i].y = ref_y + (addition * ((j == 0) ? -1 : 1) );
                    
                    var scaling_subtraction;
                    switch (pawns_merged.length)
                    {
                        case 1:
                            scaling_subtraction = 0;
                            break;
                        case 2:
                            scaling_subtraction = 0.1;
                            break;
                        case 3:
                            scaling_subtraction = 0.2;
                            break;
                        default:
                            scaling_subtraction = 0.255;
                    }
                    
                    pawns[j][this.i].setScale(this.BASE_SCALE - scaling_subtraction);
                    //pawns[j][this.i].setScale(  this.BASE_SCALE - ( (pawns[j].length - 1) * 0.1 )  );
                    
                    pawns[j][this.i].primary_circle_position_update();
                }
            }
        }
        else
        {
            if (!override2)
            {
                for (j = 0; j < 2; j++)
                {
                    if (pawns[j].length == 1 && (pawns[0].length == 0 || pawns[1].length == 0))
                    {
                        pawns[j][0].setScale(this.BASE_SCALE);
                        pawns[j][0].x = pawns[j][0].mpaos_prev_x;    pawns[j][0].y = pawns[j][0].mpaos_prev_y;
                        pawns[j][0].primary_circle_position_update();
                    }
                }
            }
        }
    }

    primary_circle_position_update()
    {
        this.primary_circle.x = this.x + this.PRIMARY_CIRCLE_X_OFF_SET;   this.primary_circle.y = this.y + this.PRIMARY_CIRCLE_Y_OFF_SET;
        this.primary_circle.setScale(this.scaleX == this.BASE_SCALE ? this.PRIMARY_CIRCLE_BASE_SCALE : this.PRIMARY_CIRCLE_BASE_SCALE / (this.BASE_SCALE / this.scaleX));
    }

}



/*
    {
        var pawns = this.scene.get_pawns_on_square(this.board_position);
        console.log("Num of pawns on same square: " + (pawns[0].length + pawns[1].length));
        var has_middle = (pawns.length % 2 == 0);
        if ((pawns[0].length + pawns[1].length) > 1)
        {
            var j;
            for (j = 0; j < 2; j++)
            {
                for (this.i = 0; this.i < pawns[j].length; this.i++)
                {
                    if (has_middle)
                    {
                        if ((this.i + 1) == pawns[j].length / 2 || pawns[j].length == 1)
                        {
                            //pawns[j][this.i].x = this.x;
                            pawns[j][this.i].mpaos_x_off_set = 0;
                        }
                        else
                        {
                            if (this.i < pawns[j].length / 2)
                            {
                                //pawns[j][this.i].x = this.x - 20 / pawns[j].length;
                                pawns[j][this.i].mpaos_x_off_set = - 20 / pawns[j].length;
                            }
                            else
                            {
                                pawns[j][this.i].mpaos_x_off_set = 20 / pawns[j].length;
                            }
                        }
                    }
                    else
                    {
                        if (this.i < pawns[j].length / 2)
                        {
                            //pawns[j][this.i].x = this.x - 20 / pawns[j].length;
                            pawns[j][this.i].mpaos_x_off_set = - 20 / pawns[j].length;
                        }
                        else
                        {
                            pawns[j][this.i].mpaos_x_off_set = 20 / pawns[j].length;
                        }
                    }
                    pawns[j][this.i].x = this.x + pawns[j][this.i].mpaos_x_off_set;
                    pawns[j][this.i].setScale(  this.BASE_SCALE - ( (pawns.length - 1) * 0.1 )  );
                }
            }
        }
*/