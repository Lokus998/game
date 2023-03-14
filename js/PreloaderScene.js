class PreloaderScene extends Phaser.Scene
{
    
    preload_timer;
    PT_RESET = 1 * 60;
    load_text;

    constructor()
    {
        super('PS');
    }

    //This function in PreloaderScene.js loads start parameters from url
    init_start_parameters()
    {
        var url = document.location.href;
        console.log("Url: " + url);
        var ind_of_hash_tag = url.indexOf("#",0);
        var after_dash_string = url.substr(ind_of_hash_tag, url.length - ind_of_hash_tag);
        console.log("After dash string: " + after_dash_string);
        
        var start_params_ind = 0;
        for (var i = 0; i < after_dash_string.length; i++)
        {
            if (after_dash_string.charAt(i) == "?")
            {
                var substring = "";
                for (var j = 1; j < after_dash_string.length - i; j++)
                {
                    if (after_dash_string.charAt(i + j) == "?")
                    {
                        i = i + j + 1;
                        break;
                    }
                    else
                    {
                        substring += after_dash_string.charAt(i + j);
                    }
                }
                
                //URL parameters(lobby.html):
                /*
                    location.href = base_url + '#?' game_type + '?_?' + prize + '?_?' 
                    + p1_id + '?_?' + name + '?_?' + avatar_ind + '?_?'
                    + opponent_id + '?_?' + opponent_name + '?_?' + opponent_avatar_ind + '?';
                */
                
                start_params_ind++;
                //Order needs to match layout given by lobby.html for URL
                var log_s1;
                switch (start_params_ind)
                {
                    case 1:
                        log_s1 = "Game type: "
                        UserData.game_type = parseInt(substring);
                        break;
                    case 2:
                        log_s1 = "Prize: ";
                        UserData.prize = parseInt(substring);
                        break;
                    case 3:
                        log_s1 = "Playing player ID: ";
                        UserData.id = substring;
                        break;
                    case 4:
                        log_s1 = "Name: ";
                        UserData.name = substring;
                        break;
                    case 5:
                        log_s1 = "Avatar: ";
                        UserData.avatar = parseInt(substring);
                        break;
                    case 6:
                        log_s1 = "Opponent ID: ";
                        UserData.opponent_id = substring;
                        break;
                    case 7:
                        log_s1 = "Opponent Name: ";
                        UserData.opponent_name = substring;
                        break;
                    case 8:
                        log_s1 = "Opponent Avatar: ";
                        UserData.opponent_avatar = parseInt(substring);
                        break;
                }
                console.log(log_s1 + substring);
            }
        }
    }

    preload()
    { 
        this.load_text = this.add.text(300, 300, 'Loading...', { fontFamily: 'Arial', fontSize: '33px', fill: '#FFFFFF' });
        
        this.init_start_parameters();
        
        this.load.spritesheet('anim_dice', 'assets/DiceRoll.png', { frameWidth: 0x64, frameHeight: 0x64, endFrame: 0x9 });
        this.load.atlas('spritesheet', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.image('bg_0', 'assets/background.jpg');  
        this.load.image('new_pawn_circle', 'assets/NewPawnCircle.png');  
        this.load.image('logo', 'assets/LogoTransparentVWWRODN.png');  
        this.load.audioSprite('audioSprite', 'assets/spriteAudioGamma.json', ['assets/spriteAudioGamma.ogg', 'assets/spriteAudioGamma.mp3']);
        this.load.spritesheet('move_timer_anim', 'assets/MTAnim.png', { frameWidth: 100, frameHeight: 100, endFrame: 75 });
        //this.load.image('profile_pic_not_loaded', 'assets/Profile_Pic_Unloaded.png');
        this.load.spritesheet('wifi_icon', 'assets/wifi_spritesheet.png', {'frameWidth':0x22,'frameHeight':0x1e,'endFrame':0x5});
        this.load.spritesheet('waiting_icon', 'assets/waitingAnimation.png', {'frameWidth':0x69,'frameHeight':0x69,'endFrame':0x8});
        this.load.spritesheet('celebratory_fireworks', 'assets/celebration_sheet.png', {'frameWidth':0x2d0,'frameHeight':0x276,'endFrame':0xc});
        
        //Avatar 0 to 8 indexes
        this.game.avatars_indexes[0] = UserData.avatar - 1;
        this.game.avatars_indexes[1] = UserData.opponent_avatar - 1;
        //if (this.game.avatars_indexes[1] == this.game.avatars_indexes[0])
        //{
          //  if (this.game.avatars_indexes[1] == 0)
            //{
              //  this.game.avatars_indexes[1] = 1;
            //}
            //else
            //{
              //  this.game.avatars_indexes[1]--;
            //}
        //}
        this.load.image('avatar_p1', 'assets/Avatar' + this.game.avatars_indexes[0] + '.png');
        this.load.image('avatar_p2', 'assets/Avatar' + this.game.avatars_indexes[1] + '.png');
        
        if (this.game.pic_urls[0] != "")
        {
            this.load.image('p1_pic', this.p1_pic_url);
        }
        if (this.game.pic_urls[1] != "")
        {
            this.load.image('p2_pic', this.p2_pic_url);
        }
        
        this.load.image('Emoticon', 'assets/Emoticon.png');
    }

    create()
    {
        Client.askNewPlayer();
        this.preload_timer = this.PT_RESET;
    }
    
    update() //updare
    {
        if (this.preload_timer > 0)
        {
            this.preload_timer--;
        }
        else
        {
            this.scene.start('GS');
        }
    }
    
}
