class MovementTimerAnim extends Phaser.GameObjects.Container 
{
    
    //abu
    anim;
    
    constructor (scene, x, y, children)
    {
        super(scene, x, y, children);
        scene.add.existing(this);
    }
    
    init()
    {
        var frames_array = [];
        for (this.i = 0; this.i < 75; this.i++)
        {
            frames_array.push(this.i);
        }
        
        this.scene.anims.create(
        {
            key: 'mta',
            frames: this.scene.anims.generateFrameNumbers('move_timer_anim', { frames: frames_array }),
            frameRate: 0,
            repeat: -1
        });

        this.anim = this.scene.add.sprite(0, 0, 'move_timer_anim'); //abu //anmim
        this.anim.play('mta');
        this.anim.setFrame(0);
        this.anim.stop();
        this.add(this.anim);
    }

    update_frame(frame)
    {
        this.anim.setFrame(frame); //anium
    }
    
    
}