class SoundButton extends Phaser.GameObjects.Container 
{
    
    i;
    button_frames = [];
    
    constructor (scene, x, y, children)
    {
        super(scene, x, y, children);
        scene.add.existing(this);
    }
    
    init()
    {
        for (this.i = 0; this.i < 2; this.i++)
        {
            this.button_frames.push(this.scene.add.image(0, 0, 'spritesheet', 'volume' + this.i));
            this.add(this.button_frames[this.i]);
        }
        
        //Click event:
        //
            this.button_frames[1].setInteractive();
            this.button_frames[1].on('pointerdown', function()
            {
                this.click_function();
            }, this);
        //
        
        this.update_frame();
    }

    update_frame()
    {
        if (this.scene.audio_enabled)
        {
            this.button_frames[0].alpha = 0.01;
            this.button_frames[1].alpha = 1;
        }
        else
        {
            this.button_frames[0].alpha = 1;
            this.button_frames[1].alpha = 0.01;
        }
    }

    click_function()
    {
        this.scene.audio_enabled = !this.scene.audio_enabled;
        this.scene.play_sound('button');
        this.update_frame();
        Client.refreshServer(); console.log("Refresh");
    }
    
}