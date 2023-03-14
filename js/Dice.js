class Dice extends Phaser.GameObjects.Container 
{
    
    //abu
    i;
    dice_imgs = [];
    landed_on = 555;
    timer_roll;
    TIMER_ROLL_RESET = 10;
    not_got_a_six_in = 0; 
    debug_roll = 555;

    land_on = 555;

    GET_SIX_AFTER_X_ROLLS = 10; //Customizable
    
    constructor (scene, x, y, children)
    {
        super(scene, x, y, children);
        scene.add.existing(this);
    }
    
    init()
    {
        //Roll Anim
        //
            this.scene.anims.create(
            {
                key: 'roll',
                frames: this.scene.anims.generateFrameNumbers('anim_dice', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] }),
                frameRate: 40, //[CUSTOMIZABLE] this is for the dice roll animation speed
                repeat: -1
            });

            var dice_anim = this.scene.add.sprite(50, 50, 'anim_dice');
            this.dice_imgs.push(dice_anim);
            this.add(dice_anim);
            dice_anim.visible = false;
        //
        
        
        //Sides images
        //
            for (this.i = 1; this.i <= 6; this.i++)
            {
                var img_dice = this.scene.add.image(50, 58, 'spritesheet', 'dice_' + this.i);// + this.i);
                img_dice.visible = false;
                this.add(img_dice);
                this.dice_imgs.push(img_dice);
            }

            
            this.dice_imgs[1].visible = true;
        
        
            var img_logo = this.scene.add.image(50, 58 - 10, 'logo');
            img_logo.setScale(0.72);
            this.add(img_logo);
        
            var img_dice_idle = this.scene.add.image(50, 58, 'spritesheet', 'dice_idle');
            img_dice_idle.setInteractive();
            this.dice_imgs.push(img_dice_idle);
            img_dice_idle.on('pointerdown', function()
            {
                this.dice_clicked();
            }, this);
            img_dice_idle.alpha = 0.01;
            this.add(img_dice_idle);
        
            this.dice_imgs.push(img_logo);
        //
    }

    dice_clicked(override = false, p2_num_roll = 555)
    {
        if (!override && p2_num_roll == 555 && this.scene.player_turn != 1)
        {
            return;
        }
        if (this.scene.concluded)
        {
            return;
        }
        if (!override && this.scene.player_turn != 1)
        {
            //return;
        }
        if (this.p2_num_roll != 555 && this.scene.player_turn == 2)
        {
            this.land_on = p2_num_roll;
        }
        else
        {
            this.land_on = 555;
        }
        if (this.dice_imgs[8].visible)
        {
            this.dice_imgs[8].visible = false;
            this.dice_imgs[1].visible = false;
        }
        if (this.scene.move_status == "roll")
        {
            if (!this.dice_imgs[0].visible)
            {
                if (this.landed_on == 555)
                {
                    this.dice_imgs[7].alpha = 0.001;
                }
                else
                {
                    this.dice_imgs[this.landed_on].visible = false;
                }
                this.dice_imgs[0].visible = true;
                this.dice_imgs[0].play('roll');
                this.scene.dice_arrow.setVisible(false);
                this.timer_roll = this.TIMER_ROLL_RESET;
                this.scene.play_sound('dice');
                if (!override)
                {
                    this.scene.player_has_pressed_dice_at_least_once[this.scene.player_turn - 1] = true;
                }
            }
        }
        this.scene.timer_since_dice_press = 30;
    }


    update()
    {
        if (this.dice_imgs[0].visible)
        {
            if (this.timer_roll > 0)
            {
                this.timer_roll--;    
            }
            else
            {
                this.dice_imgs[0].visible = false;
                
                if (this.land_on != 555) //p2
                {
                    this.landed_on = this.land_on;
                    //if (this.scene.z != 555)
                    //{
                        //console.log("Ujir");
                        //this.scene.timer_other_p_move = 0;
                        //this.scene.other_player(true);
                    //}
                }
                else if (this.scene.player_turn == 1)//p1
                {
                    if (this.not_got_a_six_in < this.GET_SIX_AFTER_X_ROLLS)
                    {
                        console.log("Debug roll: " + this.debug_roll);
                        if (this.debug_roll == 555)
                        {
                            this.landed_on = Phaser.Math.Between(1, 6);
                        }
                        else
                        {
                            this.landed_on = this.debug_roll;
                        }
                    }
                    else
                    {
                        this.landed_on = 6;
                    }
                }
                
                console.log("dice landed_on: " + this.landed_on);
                this.dice_imgs[this.landed_on].visible = true;
                this.scene.dice_roll_done();
                    if (this.scene.z != 555)
                    {
                        console.log("Ujir2");
                        this.scene.timer_other_p_move = 0;
                        //this.scene.other_player(true);
                    }
            }
        }
    }
    
    
}