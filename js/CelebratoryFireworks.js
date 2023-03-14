class CelebratoryFireworks extends Phaser.GameObjects.Sprite 
{
    
    constructor (scene, x, y)
    {
        super(scene, x, y);
        scene.add.existing(this);
    }
    
    init()
    {
        //Fireworks anim
        //
            this.scene.anims.create(
            {
                key: 'celebratory_fireworks_anim', //aniu
                frames: this.scene.anims.generateFrameNumbers('celebratory_fireworks', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] }),
                frameRate: 20, //[CUSTOMIZABLE] this is for the dice roll animation speed
                repeat: -1
            });

            var anim = this.scene.add.sprite(this.x, this.y, 'celebratory_fireworks');
            anim.play('celebratory_fireworks_anim');
        //
    }
    
    
}