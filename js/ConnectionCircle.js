class ConnectionCircle extends Phaser.GameObjects.Container 
{
    
    green_frame;
    red_frame;
    
    constructor (scene, x, y, children)
    {
        super(scene, x, y, children);
        scene.add.existing(this);
    }
    
    init()
    {
        this.green_frame = this.scene.add.image(0, 0, 'spritesheet', 'greenDot');
        this.red_frame = this.scene.add.image(0, 0, 'spritesheet', 'redDot');
        this.green_frame.setScale(0.7);
        this.red_frame.setScale(0.7);
        this.add(this.green_frame); //tjos *Again
        this.add(this.red_frame);
        
        this.red_frame.visible = false;
    }

}