var config=
{
    'type': Phaser['AUTO'],
    'scale': 
    {
        'parent': 'gameBody', 
        'mode': Phaser['Scale']['FIT'],
        'width': 0x2d0,
        'height': 0x500
    
    },
    'fps': 
    {
      'target': 60,
      'min': 60,
      'forceSetTimeOut': true
    },
    scene: 
        [PreloaderScene,
        GameplayScene]//,
        //PreloaderScene
    
},
game = new Phaser['Game'](config);
game.pic_urls = ["",""];
game.avatars_indexes = [0, 1];
game.socket = io();

function preload()
{
        //this['load']['spritesheet']('DiceAnim','assets/DiceRoll.png', {'frameWidth':0x64,'frameHeight':0x64,'endFrame':0x9}),
        //this['load']['spritesheet']('wifiIcon','assets/wifi_spritesheet.png',{'frameWidth':0x22,'frameHeight':0x1e,'endFrame':0x5}),
        //this['load']['spritesheet']('waitingIcon','assets/waitingAnimation.png',{'frameWidth':0x69,'frameHeight':0x69,'endFrame':0x8}),
        //this['load']['spritesheet']('celebration','assets/celebration_sheet.png',{'frameWidth':0x2d0,'frameHeight':0x276,'endFrame':0xc}),
        //this['load']['atlas']('spritesheet','assets/spritesheet.png','assets/spritesheet.json'),
        //this['load']['image']('bg_0','assets/background.jpg'),
        //this['load']['audioSprite']('audioSprite','assets/spriteAudioGamma.json',['assets/spriteAudioGamma.ogg','assets/spriteAudioGamma.mp3']);
    //this.scene.start('GS');
}

function create()
{
    //this.scene.start('GS');
    //bg = this['add']['image'](0x0,0x0,'bg_0')['setOrigin'](0x0);
    //bg = this['add']['image'](0x0,0x0,'bg_0')['setOrigin'](0x0);
}
