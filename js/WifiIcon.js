class WifiIcon extends Phaser.GameObjects.Sprite 
{
    
    constructor (scene, x, y)
    {
        super(scene, x, y, 'wifi_icon', 3);
        //this.setFrame(0);
        scene.add.existing(this);
    }
    
    
}