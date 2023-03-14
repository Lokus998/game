class BackgroundContainer extends Phaser.GameObjects.Container 
{
    
    pocket_blue;
    pocket_green;
    opacity_anim_dir = -1;
    OA_MIN_A = 0.75;
    OA_SPEED = 0.003;
    
    constructor (scene)
    {
        super(scene);
        
        var i;
        var j;
        
        var bg = scene.add.image(0x0, 0x0, 'bg_0')['setOrigin'](0x0);
        
        var bottom_bar = scene.add.image(0, 1101, 'spritesheet', 'bottomBar');
        bottom_bar.setOrigin(0, 0);
        bottom_bar.setScale(0.7);
        
        //White Rec *7CC 17 *26 *1114
        //
            var rec_red = this.scene.add.rectangle(160, 318, 268, 269, 0xffffff);
            this.add(rec_red);
        
            var rec_green = this.scene.add.rectangle(564, 318, 268, 268, 0xffffff);
            this.add(rec_green);
        
            var rec_yellow = this.scene.add.rectangle(564, 720, 268, 268, 0xffffff);
            this.add(rec_yellow);
        
            var rec_blue = this.scene.add.rectangle(160, 720, 268, 268, 0xffffff);
            this.add(rec_blue);
        //
        
        //Board
        //
            //Red
            //
                var pocket_red = scene.add.image(160, 720 - 403, 'spritesheet', 'pocket4');
                pocket_red.setScale(0.7);
                //pocket_red.alpha = 0.7;
                this.add(pocket_red);

                var path_red = scene.add.image(160 + 33, 720 - 403 + 202, 'spritesheet', (scene.game_mode == 2) ? 'path4_0_kb_ludo' : 'path4_0_kb_ludo_classic');
                path_red.setScale(0.7);
                path_red.angle = 90;
                this.add(path_red);
            //

            //Green
            //
                this.pocket_green = scene.add.image(160 + 403, 720 - 403, 'spritesheet', 'pocket2');
                this.pocket_green.setScale(0.7);
                this.add(this.pocket_green);

                var path_green = scene.add.image(160 + 403 - 202, 720 - 403 + 34, 'spritesheet', (scene.game_mode == 2) ? 'path2_0_kb_ludo' : 'path2_0_kb_ludo_classic');
                path_green.angle = -180;
                path_green.setScale(0.7);
                this.add(path_green);
            //

            //Blue
            //
                this.pocket_blue = scene.add.image(160, 720, 'spritesheet', 'pocket1');
                this.pocket_blue.setScale(0.7);
                this.add(this.pocket_blue);

                var path_blue = scene.add.image(160 + 202, 720 - 34, 'spritesheet', (scene.game_mode == 2) ? 'path1_0_kb_ludo' : 'path1_0_kb_ludo_classic');
                path_blue.setScale(0.7);
                this.add(path_blue);
            //

            //Yellow
            //
                var pocket_yellow = scene.add.image(160 + 403, 720, 'spritesheet', 'pocket3');
                pocket_yellow.setScale(0.7);
                this.add(pocket_yellow);

                var path_yellow = scene.add.image(160 + 403 - 33, 720 - 201, 'spritesheet', (scene.game_mode == 2) ? 'path3_0_kb_ludo' : 'path3_0_kb_ludo_classic');
    
                path_yellow.setScale(0.7);
                path_yellow.angle = -90;
                this.add(path_yellow);
        
                //game_mode
            //

        
            //Circles
            //
                for (i = 0; i < 2; i++)
                {
                    for (j = 0; j < 2; j++)
                    {
                        var circle_red = scene.add.image((160 - 40) + 80 * i, (720 - 403) - 40 + 80 * j, 'spritesheet', 'pocketCircle4');
                        circle_red.setScale(0.7);
                        this.add(circle_red);

                        var circle_green = scene.add.image((160 + 403) - 40 + 80 * i, (720 - 403) - 40 + 80 * j, 'spritesheet', 'pocketCircle2');
                        circle_green.setScale(0.7);
                        this.add(circle_green);

                        var circle_yellow = scene.add.image((160 + 403) - 40 + 80 * i, 720 - 40 + 80 * j, 'spritesheet', 'pocketCircle3');
                        circle_yellow.setScale(0.7);
                        this.add(circle_yellow);

                        var circle_blue = scene.add.image(160 - 40 + 80 * i, 720 - 40 + 80 * j, 'spritesheet', 'pocketCircle1');
                        circle_blue.setScale(0.7);
                        this.add(circle_blue);
                    }
                }
            //
        //
        
        var stars = [];
        for (i = 0; i < 4; i++)
        {
            var xpos = (i == 0) ? 406 : 
                      ((i == 1) ? 137 : ((i == 2) ? 315 : 586 ) ) ;
            var ypos = (i == 0) ? 740 : 
                      ((i == 1) ? 563 : ((i == 2) ? 294 : 473 ) ) ;
            var star = scene.add.image(xpos, ypos, 'spritesheet', 'blackStar');
            this.add(star);
        }
        
        var top_txt_bg = scene.add.image(365, 15, 'spritesheet', 'dotsBar');
        this.add(top_txt_bg);
        
        var p1_pic_frame = scene.add.image(99, 1010, 'spritesheet', 'profilePicBox');
        p1_pic_frame.setScale(0.75);
        this.add(p1_pic_frame);
        var p2_pic_frame = scene.add.image(619, 1010, 'spritesheet', 'profilePicBox');
        p2_pic_frame.setScale(0.75);
        this.add(p2_pic_frame);
        
        var p1_user_info_box = scene.add.image(200, 1175, 'spritesheet', 'userInfoBox');
        this.add(p1_user_info_box);
        p1_user_info_box.setScale(0.65);
        var p2_user_info_box = scene.add.image(520, 1175, 'spritesheet', 'userInfoBox');
        this.add(p2_user_info_box);
        p2_user_info_box.setScale(0.65);
        
        var p1_dots_bar = scene.add.image(65, 1210, 'spritesheet', 'dotsBar');
        this.add(p1_dots_bar);
        p1_dots_bar.setScale(0.7, 0.65);
        var p2_dots_bar = scene.add.image(656, 1210, 'spritesheet', 'dotsBar');
        this.add(p2_dots_bar);
        p2_dots_bar.setScale(0.7, 0.65);
        
        var p1_pawn = scene.add.image(63, 1151, 'spritesheet', 'token1');
        p1_pawn.setScale(0.75);
        this.add(p1_pawn);
        
        var p1_pawn = scene.add.image(63 + 592, 1151, 'spritesheet', 'token2');
        p1_pawn.setScale(0.75);
        this.add(p1_pawn);
        
        
        
        this.scene.add.existing(this);
    }
    
    update()
    {
        var pocket;
        if (this.scene.player_turn == 1)
        {
            pocket = this.pocket_blue;
        }
        else
        {
            pocket = this.pocket_green;
        }
        
        if (this.opacity_anim_dir == -1)
        {
            if (pocket.alpha > this.OA_MIN_A)
            {
                pocket.alpha -= this.OA_SPEED;
            }
            else
            {
                this.opacity_anim_dir = 1;
            }
        }
        else
        {
            if (pocket.alpha < 1)
            {
                pocket.alpha += this.OA_SPEED;
            }
            else
            {
                this.opacity_anim_dir = -1;
            }
        }
    }
    
    switch_alpha_turns()
    {
        if (this.scene.player_turn == 1)
        {
            this.pocket_green.alpha = 1;
        }
        else
        {
            this.pocket_blue.alpha = 1;
        }   
    }
    
}