/*Director
	Scene
		loadActor
		Background	
		playbackBoard (set zindex 2)
			playbackKey	
		keyBoardActor
			keyBoardActorWhite
			keyBoardActorBlack
		mouseEventActor		
		countdownActor
		clock		
		hintActor
		showKeyActor
		santaActor
		Statistic
		menuContainer
			button
		volumebar
		PlayListContainer
		HighScoreContainer
*/
loadingIconLoaded = false;
var loadingIcon = new Image();
loadingIcon.src = "Pack/loading-icon.png";
loadingIcon.onload = function(){
	loadingIconLoaded = true;
}
var fontloaded=true;

  
window.onload = function () {
	WebFont.load({
  custom: {
    families: ['UTM Avo:n4,i4,n7'],
    urls: ['font/font.css'],
    
    fontactive:function( fontname, fontdescription ) {
        console.log( fontname, fontdescription );
        // Only trigger once `My font, n4`
    }
  },
  active: windowLoad
});
    var loadedImage = 0;
	var loadedAudio = 0;
	var loadedPercent = 0;
	var loadAudios,loadImages;
	var processed = true;
	var firstNodeData;
	var loadStorage=function(server){
		var player={};
    	

    	var dtplayer={
    		id:-1,
    		name:"Pianoic",
    		setting:{
    			general:{},
    			keyboard:{},
    			record:{},
    			social:{}
    		},
    		score:[{
				id:0,
				lv:[0,0,0]
			}]
    	};
    	if (server) {
			var score=[];
			if(server.highscore.length>0) {
				var songscore={id:server.highscore[0].mid,lv:[0,0,0]};
					songscore.lv[server.highscore[0].level]=server.highscore[0].score;
					score.push(songscore);
			}console.log(songscore)
			for (var i=1;i<server.highscore.length;i++){
				for (var j=0;j<score.length;j++){
					var songscore={id:server.highscore[i].mid,lv:[0,0,0]};
					songscore.lv[server.highscore[i].level]=server.highscore[i].score;	
					console.log(songscore)							
					if(score[j])
					if(score[j].id==server.highscore[i].mid)	{
						songscore={id:server.highscore[i].mid,lv:score[j].lv};
						songscore.lv[server.highscore[i].level]=server.highscore[i].score;
						break;									
					}
				}
				score.push(songscore);
			}
			if(server.settings)
			dtplayer={
	    		id:server.fid,
	    		name:server.name,
	    		setting: server.settings,
	    		score:score
	    	};
	    	else
	    		dtplayer={
	    		id:server.fid,
	    		name:server.name,
	    		setting:{
	    			general:{},
	    			keyboard:{},
	    			record:{},
	    			social:{}
	    		},
	    		score:score
	    	};

	    	
		}
		// if (localStorage.pianoHighscore){
		// 	dtplayer.score=JSON.parse(localStorage.pianoHighscore);
		// 	localStorage.clear();
		// }
		// if (localStorage.pianoic)
		// 	if(!JSON.parse(LZString.decompressFromUTF16(localStorage.pianoic)).length){
		// 		dtplayer=JSON.parse(LZString.decompressFromUTF16(localStorage.pianoic));					
		// 		localStorage.clear();
		// 	}
    	if(typeof(Storage)!=="undefined"){
    		if (localStorage.pianoic) {
				try {
					
					if (server){
						localStorage.clear();
				    	localStorage.pianoic=LZString.compressToUTF16(JSON.stringify(dtplayer));
			    	}			    	
			    	try{
						player=JSON.parse(LZString.decompressFromUTF16(localStorage.pianoic));
					} catch (e){
							player=dtplayer;
							localStorage.clear();
						}
						
				
			    } catch (e) {
			    	//if (localStorage.pianoHighscore)
    				//player.score=JSON.parse(localStorage.pianoHighscore);
			    	//localStorage.clear();
			    	console.log(e)
			    }
				
			}else {
				player=dtplayer;
			} 
		} else {
			  // Sorry! No web storage support..
			  }
		return player;

    }
    var setDefault = function(global){
    	//Setting general panel
		global.LANGUAGE = 0; //0: English, 1: Vietnamese
		global.AUTOPLAY = true;		// tu danh not play 1 ban nhac
		global.ENABLE_PLAY_FILE = true;	// tim va phat File thay cho Note On neu co;
		global.PLAY_FULL_FILE = true; 	// down file Full thay vi file Simple
		global.AUTO_PAUSE = false; 	
		global.SHOW_KEYBOARD_TEXT = true;
		global.SHOW_PLAYBACK_TEXT = true;
		
    }
    var initSetting = function(global){
    	//Setting general panel
		global.LANGUAGE = global.player.setting.general.LANGUAGE; //0: English, 1: Vietnamese
		global.AUTOPLAY = global.player.setting.general.AUTOPLAY;		// tu danh not play 1 ban nhac
		global.ENABLE_PLAY_FILE = global.player.setting.general.ENABLE_PLAY_FILE;	// tim va phat File thay cho Note On neu co;
		global.PLAY_FULL_FILE = global.player.setting.general.PLAY_FULL_FILE; 	// down file Full thay vi file Simple
		global.AUTO_PAUSE = global.player.setting.general.AUTO_PAUSE; 	
		global.SHOW_KEYBOARD_TEXT = global.player.setting.general.SHOW_KEYBOARD_TEXT;
		global.SHOW_PLAYBACK_TEXT = global.player.setting.general.SHOW_PLAYBACK_TEXT;
		
    }
    
     var initGlobal = function(global,server){
    	//Load storage
		if(!server) {global.player=loadStorage();global.access=false;}
		else 		{global.player=loadStorage(server);global.access=true;}
		if (server){
			if (!server.settings) setDefault(global);
			else {			
				initSetting(global);
			}
		} else {
			if (global.player.setting.general.toString().length==15){
				//Setting general panel
				initSetting(global);
			} else setDefault(global);
		}
		//thach dau?
		if (server) if(server.challenge) {
	    	global.challenge=server.challenge;
		}
		global.cancel=function(){
			if (global.td!=-1)
		    	{var r=confirm(LANG.challenge.cancel[global.LANGUAGE]);
				if (r==true)
				  {
				  			  
				  //send data nhan thua :(
				  	var fd = new FormData();
                	var _id=global.td;
                    fd.append("_id", _id);
                    fd.append("action", 1);
                    try {
			            $.ajax({
			                url: "/challenge/respon",
			                type: "POST",
			                data: fd,
			                processData: false,
			                contentType: false,
			                cache: false,
			                success: function (data) {
			                    initGlobal(global,data);
                    			
			                },
			                error: function (shr, status, data) {
			                    console.log("error " + data + " Status " + shr.status);
			                },
			                complete: function () {
			                    console.log("li");
			                }
			            });

			        } catch (e) {
			            console.log(e);
			        }
			        global.td=-1;	
				  return false;
				  }
				else
				  {
				  return true;
				  }
				}
	    	
	    };
		//if (global.player.setting.keyboard.keyData)
			//keyData= global.player.setting.keyboard.keyData;
		//Load score xuong
		global.pointData = global.player.score||[];

		console.log(global.player)
    }
    

    //windowLoad();
	function windowLoad(){	
		
		var director = new CAAT.Foundation.Director().initialize(CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById("canvas"));		
		//director.renderMode=2
		var global = director.globalVariables = {};

		initGlobal(global);//Load storage, setting general panel, score

		//set key
		global.onsetkey=true;
		//Volume bar
		global.SFX_VOLUME = 100;
		global.MUSIC_VOLUME = 100;
		global.PLAYBACK_SPEED = 1;

	
		var firstLoad;
		if(location.hash){
			var link = location.hash.substr(2, location.hash.length);
			firstLoad = link.split("-")[1];
			console.log(firstLoad);
		}
		global.SELECTING_RECORD = firstLoad||3;
		global.DIFFICULTY_EASY = 0;
		global.DIFFICULTY_HARD = 1;
		global.DIFFICULTY_INSANE = 2;
		global.DIFFICULTY = global.DIFFICULTY_HARD;
		global.DIFFICULTY_NUMBER = 3;

		global.RECORDING = false;		// dang record 1 ban nhac
		global.PLAYING_RECORD = false;	// dang play 1 ban nhac
		global.PAUSING_RECORD = false;	// dang pause
		global.PLAY_FILE = false;		// co dang phat file khong
		global.JUST_LOAD_A_SONG = false;

		global.countingDown = false;
		global.pausedStart=0;
		global.Sound;
		global.playingAudio;
		
		global.td=-1; // khoi tao id nguoi choi thach dau
		var onResizeCallback = function( director, newWidth, newHeight ){
			var cwch=CANVAS_WIDTH/CANVAS_HEIGHT;
			var minheight=400;
			var minwidth=minheight*cwch;
			if (newWidth<=minwidth||newHeight<=minheight){
				director.setScaleProportional(minwidth, minheight);
			} 
		}
		director.enableResizeEvents(CAAT.Foundation.Director.RESIZE_PROPORTIONAL,onResizeCallback );
		var scene = director.createScene();
		var startTime = +new Date();
        var loadActor = new CAAT.Foundation.ActorContainer().setBounds(0,0,director.width,director.height);
		scene.addChild(loadActor);
		var loginButtonWidth = 450;
		var loginButtonHeight = 70;
		loadActor.loadingComplete = function(){
			var self = this;
			FB.getLoginStatus(function(response) {     
            	if (response.status === 'connected') {
            		run(director,loadImages,loadAudios);
        			scene.removeChild(self);
    				var fd = new FormData();
                	var uid=response.authResponse.userID;
                	var access_token=response.authResponse.accessToken;
                    fd.append("uid", uid);
                    fd.append("access_token", access_token);
                    try {
			            $.ajax({
			                url: "/user",
			                type: "POST",
			                data: fd,
			                processData: false,
			                contentType: false,
			                cache: false,
			                success: function (data) {
			                    initGlobal(global,data);
                    			
			                },
			                error: function (shr, status, data) {
			                    console.log("error " + data + " Status " + shr.status);
			                },
			                complete: function () {
			                    console.log("li");
			                }
			            });

			        } catch (e) {
			            console.log(e);
			        }
            	}
        	});
			var fbLoginButton = new CAAT.ActorContainer().setBounds(this.width/2-loginButtonWidth/2,this.height*2/3-loginButtonHeight/2,loginButtonWidth,loginButtonHeight);
			var noLoginButton = new CAAT.ActorContainer().setBounds(this.width/2-loginButtonWidth/2,this.height*2/3+loginButtonHeight,loginButtonWidth,loginButtonHeight);
			iconWidth = 60;
			iconHeight = 60;
			fbLoginButton.paint = function(director,time){
				var ctx = director.ctx;
				ctx.fillStyle = "#29497f";
				ctx.fillRect(0,0,this.width,this.height);
				ctx.drawImage(director.getImage("fbLoginIcon"),10,this.height/2-iconHeight/2,iconWidth,iconHeight);
				var text = "LOGIN VIA FACEBOOK";
				ctx.fillStyle = "#FFF";
				ctx.font = "27px UTM Avo";
				ctx.fillText(text,80,45);
				
			}
			noLoginButton.paint = function(director,time){
				var ctx = director.ctx;
				ctx.fillStyle = "#0e0e0e";
				ctx.fillRect(0,0,this.width,this.height);
				ctx.drawImage(director.getImage("noLoginIcon"),10,this.height/2-iconHeight/2,iconWidth,iconHeight);
				var text = "DON'T LOGIN, JUST PLAY!";
				ctx.fillStyle = "#FFF";
				ctx.font = "27px UTM Avo";
				ctx.fillText(text,80,45);
			}
			fbLoginButton.mouseDown = function(){
				FB.login(function (response) {
                        if (response.authResponse) {
                        	var fd = new FormData();
                        	var uid=response.authResponse.userID;
                        	var access_token=response.authResponse.accessToken;
                            fd.append("uid", uid);
                            fd.append("access_token", access_token);
                            try {
					            $.ajax({
					                url: "/user",
					                type: "POST",
					                data: fd,
					                processData: false,
					                contentType: false,
					                cache: false,
					                success: function (data) {
					                    initGlobal(global,data);
                            		run(director,loadImages,loadAudios);
                            		scene.removeChild(self);
					                },
					                error: function (shr, status, data) {
					                    console.log("error " + data + " Status " + shr.status);
					                },
					                complete: function () {
					                    console.log("li");
					                }
					            });

					        } catch (e) {
					            console.log(e);
					        }
                            
                        } else {
                        	var message="You must install the application to share your greeting \n Bạn phải cho phép ứng dụng mới có thể chia sẻ thông tin của bạn với bạn bè"
                            alert(message);
                            run(director,loadImages,loadAudios);
                            scene.removeChild(self);
                        }
	                    }, {
	                        scope: 'publish_actions,publish_stream'
	                    });	
				
			}
			noLoginButton.mouseDown = function(){
				run(director,loadImages,loadAudios);
				scene.removeChild(self);
			}
			this.fbLoginButton = fbLoginButton;
			this.noLoginButton = noLoginButton;
			this.addChild(fbLoginButton);
			this.addChild(noLoginButton);
			
			
		}
		loadActor.paint = function(director,time){
			var ctx = director.ctx;
			ctx.fillStyle = "#8d1f1f";
			ctx.fillRect(0,0,this.width,this.height);
			var startY = this.height/8;
			var imageSize = this.height/5;
			if(loadingIconLoaded&&!this.loadComplete){
				ctx.drawImage(loadingIcon,this.width/2 - imageSize/2,startY,imageSize,imageSize);
			}
			ctx.font = "100 120px UTM Avo";
			ctx.fillStyle = "#FFF";
			var text = "PIANOIC";
			ctx.fillText(text,this.width/2-ctx.measureText(text).width/2,this.height/2);
			if(!this.loadComplete){
				var loadText = "Loading";
				ctx.font = "italic 30px UTM Avo"
				var loadTextX = this.width/2 - ctx.measureText(loadText).width/2;
				var dotNumber = (((time/500)<<0)%4);
				for(var i=0;i<dotNumber;i++) loadText+=".";
				ctx.fillText(loadText,loadTextX,this.height*3/4);
			}
			else{
				if(!this.justComplete){
					this.justComplete = true;
					this.loadingComplete();
				}
			}
			if(processed&&loadImages&&loadAudios&&(+new Date() - startTime>1000)) {
				this.loadComplete = true;
				ctx.drawImage(director.getImage("bkgmLogo"),this.width/2 - imageSize/2,startY,imageSize,imageSize);
				
			
									
			}
		}
		load(director);
		CAAT.loop(60);
	}
    function load(director) {
		var global = director.globalVariables;
		loadMaxAudio=10;
		loadAudio = 0;
		maxSoundIndex = 87;
		processedSound = 0;
		var soundUrl;
		(location.href.substr(0,4) == "file")?soundUrl = "soundfont/": soundUrl = "soundfont/";
		MIDI.loadPlugin({
		soundfontUrl: soundUrl,
		instrument: "acoustic_grand_piano",
		callback: function() {
			loadAudio=loadMaxAudio;
		}
		});
		MIDI.onloadOne = function(){
			processedSound++;
			loadedPercent = Math.round((processedSound+loadAudio+loadedImage)/elementLength*100);
			if(processedSound == maxSoundIndex) MIDI.onloadAll();
		}
		MIDI.onloadAll = function(){
			processed=true;
		}
		
		
		if (!(window.webkitAudioContext)) {	
			MIDI.onloadAll();
		}
		var audioElement = new AudioPreloader();
		for(var i=0;i<musicList.length;i++){
			var dataObject = musicList[i].Data;
			audioElement.addElement(dataObject.Easy.Simple)
						.addElement(dataObject.Easy.Full)
						.addElement(dataObject.Hard.Simple)
						.addElement(dataObject.Hard.Full);
		}
		audioElement.load(
		function loadAll(audios){
			global.Sound = new CAAT.SoundPiano().initialize(director,audios);
			///*
			if(musicList[global.SELECTING_RECORD]) {
				var musicAllData = musicList[global.SELECTING_RECORD].Data;			
				var singleMusicData;
				switch(global.DIFFICULTY){
					case global.DIFFICULTY_EASY: singleMusicData = musicAllData.Easy; break;
					case global.DIFFICULTY_HARD: singleMusicData = musicAllData.Hard; break;
					case global.DIFFICULTY_INSANE: singleMusicData = musicAllData.Insane; break;
				}
				
			
				var audioLink;
				if((!global.PLAY_FULL_FILE)&&(singleMusicData.Simple))audioLink = singleMusicData.Simple;
				else audioLink = singleMusicData.Full;
				global.Sound.playMusic(audioLink,
				function(){
					loadAudios = true;
				},true);
			
				firstNodeData = singleMusicData.NodeData;
			
			}
			//*/
		});
        var imageElement = new CAAT.Module.Preloader.Preloader().
			addElement("recordButton","img/menu/record.png").
			addElement("playButton","img/menu/play.png").
			addElement("stopButton","img/menu/stop.png").
			addElement("shareButton","img/menu/share.png").
			addElement("fullscreenButton","img/menu/fullscreen.png").
			addElement("sheetButton","img/menu/sheet.png").
			addElement("pauseButton","img/menu/pause.png").
			addElement("settingButton","img/menu/settings.png").
			addElement("volumeButton","img/menu/sound.png").
			addElement("playListButton","img/menu/playlist.png").
			addElement("tickIcon","img/menu/tick.png").
			addElement("santa","img/santa.png").
			addElement("blackgiftbox","img/hello_b_1.png").
			addElement("giftbox","img/hello_w_1.png").
			addElement("keyboard","img/keyboard.png").
			addElement("keyboardNumber","img/point_number.png").
			addElement("statBg","img/statistic/result_bg.png").
			addElement("statPerfect","img/statistic/perfect.png").
			addElement("statGreat","img/statistic/great.png").
			addElement("statCool","img/statistic/cool.png").
			addElement("statNotbad","img/statistic/notbad.png").
			addElement("statMissed","img/statistic/missed.png").
			addElement("statPassed","img/statistic/passed.png").
			addElement("statTotal","img/statistic/total.png").
			addElement("multiplier","img/statistic/multiplier.png").
			addElement("equal","img/statistic/equal.png").
			addElement("lineBreak","img/statistic/line_break.png").
			addElement("facebookIcon","img/statistic/facebook.png").
			addElement("likeIcon","img/statistic/like.png").
			addElement("fireEff","img/fire.png").
			addElement("backgroundChristmas","img/backgroundChristmas.jpg").
			addElement("bkgmLogo","Pack/BKGM-logo-big.png").
			addElement("fbLoginIcon","Pack/big-facebookshare-icon.png").
			addElement("noLoginIcon","Pack/anonymous-icon.png")
		var elementLength =imageElement.elements.length+loadMaxAudio+maxSoundIndex;

        imageElement.load(
		function onAllAssetsLoaded(images) {
			loadImages = images;
			director.setImagesCache(images);
		},
		function onEachLoad(index){
			loadedImage++;
			loadedPercent = Math.round((processedSound+loadAudio+loadedImage)/elementLength*100);
		});
    }
    function run(director,images) {
        //director.setImagesCache(images);
		var global = director.globalVariables;
		var scene = director.currentScene;
		
		var whiteKey = [];
		var blackKey = [];
		var whiteKeyLength = 36;
		var blackKeyLength = 25;

		var timePlayOffset=[80,180,330,500];
		var greatnessText = ["Perfect","Great","Cool","Not Bad","Missed","Passed"];
		var statisticList = [20,40,100,20,30,40];
		var PERFECT_NUMBER = 0;
		var GREAT_NUMBER = 1;
		var COOL_NUMBER = 2;
		var NOTBAD_NUMBER = 3;
		var MISS_NUMBER = 4;
		var PASS_NUMBER = 5;
		var currentText = "";
		var Point=0;
		//ca 2 cai deu la pointeach nhe
		var pointEach=[0,0,0,0];
		var pe=[];

		var playerKeyData = [];
		//ca 2 deu la score tinh miss nhe :v
		var pointPenalty = 100;
		var pp=100;
		
		var keyBoardPosX = 15;
		var keyBoardPosY = 440;
		var whiteKeyWidth = 33.1;
		var whiteKeyHeight = 200;
		var blackKeyWidth = 23;
		var blackKeyHeight = 120;
		var playbackBoardPoxY = 100;
		var resizeKey=function(){
			if (defaultresolution==4/3){
				keyBoardPosY = 520;
				whiteKeyWidth = 20.5;
				whiteKeyHeight = 120;
				blackKeyWidth = 15;
				blackKeyHeight = 70;
				playbackBoardPoxY = 100;
			}
		}
		resizeKey();
		
		var statBg = director.getImage("statBg");
		var	statPerfect = director.getImage("statPerfect");
		var	statGreat = director.getImage("statGreat");
		var	statCool = director.getImage("statCool");
		var	statNotbad = director.getImage("statNotbad");
		var	statMissed = director.getImage("statMissed");
		var	statPassed = director.getImage("statPassed");
		var	keyBoardImage = director.getImage("keyboard");
		var	keyBoardNumberImage = director.getImage("keyboardNumber");
		
		scene.createTimer(0,Number.MAX_VALUE,
		function (scene_time, timer_time, timertask_instance) {   // timeout

		},
		function (scene_time, timer_time, timertask_instance) {   // 
			if((global.pausedStart==0)&&global.PAUSING_RECORD){
				global.pausedStart = scene.time;
			}
			if((global.pausedStart!=0)&&!global.PAUSING_RECORD){
				scene.time = global.pausedStart;
				global.pausedStart = 0;
			}
			if(global.playingAudio&&global.playingAudio.currentTime){
				if((!global.PLAYING_RECORD)&&global.playingAudio.currentTime>0){
					global.playingAudio.currentTime = 0;
					global.playingAudio.pause();
				}
			}
			/*if(global.PLAYING_RECORD&&(!global.PAUSING_RECORD)){
				if(santaActor.noAnimation){
					santaActor.noAnimation = false;
					santaActor.setAnimationImageIndex([0,1,2,3]);
				}
			}
			else if(!santaActor.noAnimation){
				santaActor.noAnimation = true;
				santaActor.setAnimationImageIndex([0]);
			}*/
			clockActor.update(scene_time);
		},
		function (scene_time, timer_time, timertask_instance) {   // cancel
		
		});
		
		var background = new CAAT.ActorContainer().setBounds(0,0,director.width,director.height)
			//.setBackgroundImage(director.getImage("backgroundChristmas"));
		///*
		background.paint = function(director,time){
			
			var ctx = director.ctx;
			var backgroundGradient= ctx.createLinearGradient(0,0,0,this.height); 
			var redStr = "00";
			if(global.PLAYING_RECORD){
				var redPercent = (256*clockActor.playedTime/scene.recordData[scene.recordData.length-1].time)<<0;
				if((redPercent>0)&&(redPercent<256)) {}
				else redPercent = 0;
				redStr = redPercent.toString(16);
				if(redStr.length==1) redStr = "0"+redStr;
			}
			backgroundGradient.addColorStop(0,"#"+redStr+"0000");
			backgroundGradient.addColorStop(1,"#FFF");
			ctx.fillStyle = backgroundGradient;
			ctx.fillRect(0,0,this.width,this.height);
			ctx.beginPath();
				ctx.drawImage(director.getImage("backgroundChristmas"), 0, 0,this.width,this.height);
				//ctx.scale(0.5, 0.5)
				//console.log(1);
				ctx.closePath();
			return this;
		}
		//*/
		scene.addChild(background);

		var timePerScene = 3000;
		var playbackBoard = new CAAT.ActorContainer().setBounds(0,playbackBoardPoxY,whiteKeyLength*whiteKeyWidth,keyBoardPosY-playbackBoardPoxY);
		var playbackKey = new CAAT.ActorContainer().setBounds(keyBoardPosX,0,whiteKeyLength*whiteKeyWidth,keyBoardPosY-playbackBoardPoxY);
		var fff = false;
		playbackKey.paint = function(director,time){
			var ctx = director.ctx;
			if(global.PLAYING_RECORD){
				var playedTime = clockActor.playedTime;//((global.PAUSING_RECORD)?pausedStart:time) - recordStartTime;
				var passedPixel = playedTime/timePerScene*this.height*Math.pow(global.PLAYBACK_SPEED,2);
				
				if(!fff) var start = Date.now();
				//if(recordData[10].time==scene.recordData[10].time)console.log("scene.recordData");
				for(var i=currentRecordIndex;i<scene.recordData.length;i++){
					var currentKey = keyData[scene.recordData[i].keyIndex];
					if(playerKeyData[i]) continue;
					if(scene.recordData[i].time>(playedTime+timePerScene)/Math.sqrt(global.PLAYBACK_SPEED)) break;
					var hitKeyActor;
					ctx.font = "30px UTM Avo";
					var giftboxSize =30;
					var key="";
					var bgcolor;
					if ( currentKey.keyCode[0] >= 96 && currentKey.keyCode[0] <= 105){
						key=String.fromCharCode(currentKey.keyCode[0]-48);
						bgcolor="red";
					} else
						key=String.fromCharCode(currentKey.keyCode[0]);
					if(currentKey.type="white"){
						hitKeyActor = whiteKey[currentKey.index];
						ctx.fillStyle = bgcolor||"#FFF";
						ctx.strokeStyle = "#000";
						var posY = this.height + passedPixel -hitKeyActor.width - scene.recordData[i].time/timePerScene*this.height*global.PLAYBACK_SPEED;
						//ctx.fillRect(hitKeyActor.x,posY,hitKeyActor.width,hitKeyActor.width);
						//ctx.strokeRect(hitKeyActor.x,posY,hitKeyActor.width,hitKeyActor.width);
						ctx.drawImage(director.getImage("giftbox"),hitKeyActor.x-hitKeyActor.width/3,posY-hitKeyActor.width/3,42,50)//,giftboxSize,giftboxSize);
						if(global.SHOW_PLAYBACK_TEXT){
							drawText(ctx,key,false,hitKeyActor.x-hitKeyActor.width/3+2,posY+5,30,30)
						}
						//ctx.fillStyle = "#000";
						//ctx.fillText(key.toLowerCase(),hitKeyActor.x+2,hitKeyActor.width+posY-2);
					} 
					else {
						hitKeyActor = blackKey[currentKey.index];
						ctx.fillStyle = bgcolor||"#000";
						var posY = this.height + passedPixel - hitKeyActor.width-scene.recordData[i].time/timePerScene*this.height*global.PLAYBACK_SPEED;
						ctx.drawImage(director.getImage("blackgiftbox"),hitKeyActor.x-hitKeyActor.width/3,posY-hitKeyActor.width/3,42,50)//,giftboxSize,giftboxSize);
						if(global.SHOW_PLAYBACK_TEXT){
							ctx.fillStyle = "#FFF";
							ctx.fillText(key,hitKeyActor.x+5,hitKeyActor.width+posY+12);
						}
					}
				}
				
				if(!fff){
					console.log(Date.now()-start);
					fff =true;
				}
			}
		}
		playbackBoard.addChild(playbackKey);
		scene.addChild(playbackBoard);

		var keyBoardActor = new CAAT.ActorContainer().setBounds(keyBoardPosX,keyBoardPosY,whiteKeyWidth*whiteKeyLength,whiteKeyHeight);
		var keyBoardActorWhite = new CAAT.KeyBoardContainer().initialize(director,whiteKey,0,0,whiteKeyWidth*whiteKeyLength,whiteKeyHeight);
		var keyBoardActorBlack = new CAAT.KeyBoardContainer().initialize(director,blackKey,0,0,whiteKeyWidth*whiteKeyLength,whiteKeyHeight);
		
		keyBoardActor.addChild(keyBoardActorWhite);
		for(var i=0;i<whiteKeyLength;i++){
			var whiteKeyActor = new CAAT.PianoKey().initialize(director,keyBoardActor,whiteKeyWidth*i,0,whiteKeyWidth,whiteKeyHeight,"white",i+blackKeyLength);
			whiteKey.push(whiteKeyActor);
		}
		keyBoardActor.addChild(keyBoardActorBlack);
		var blackKeyIndex = 0;
		for(var i=0;i<whiteKeyLength-1;i++){
			if((i%7!=2)&&(i%7!=6)){
				var blackKeyActor = new CAAT.PianoKey().initialize(director,keyBoardActor,whiteKeyWidth-blackKeyWidth/2+whiteKeyWidth*i,0,blackKeyWidth,blackKeyHeight,"black",blackKeyIndex);
				blackKey.push(blackKeyActor);
				blackKeyIndex++;
			}
		}
		scene.addChild(keyBoardActor);

		mouseEventActor = new CAAT.ActorContainer().setBounds(keyBoardPosX,keyBoardPosY,whiteKeyWidth*whiteKeyLength,whiteKeyHeight)
		
		mouseEventActor.mouseDown = function(e){_down(e.x,e.y)}
		mouseEventActor.touchStart = function(e){var touch = e.changedTouches[0]; _down(touch.pageX,touch.pageY)}
		
		_down = function(ex,ey){
			//if(global.PLAYING_RECORD) return;
			var keyActor;
			for(var i=0;i<blackKey.length;i++){
				if((ex>=blackKey[i].x)&&(ex<=blackKey[i].x+blackKey[i].width)&&(ey>=blackKey[i].y)&&(ey<=blackKey[i].y+blackKey[i].height)){
					keyActor = blackKey[i];
					break;
				}
			}
			if(!keyActor){
				var index = (ex/whiteKeyWidth)<<0;
				keyActor = whiteKey[index];
			}
			if(!keyActor) return;
			//playKey(keyActor.keyIndex);
			changeKey(keyActor.keyIndex);
			keyPress(keyActor.keyIndex);
			if(global.RECORDING) {
				scene.recordData.push({keyIndex: keyActor.keyIndex, time: scene.time-recordStartTime});
			}
		}
		scene.addChild(mouseEventActor);

		var countdownTime = 3000;
		global.startCountdownTime = 0;
		var countdownActorSize = 100;
		var countdownActor = new CAAT.ActorContainer().setBounds(director.width/2-countdownActorSize/2,director.height/2-countdownActorSize/2,countdownActorSize,countdownActorSize).enableEvents(false);
		countdownActor.paint = function(director,time){
			var ctx = director.ctx;
			if(global.JUST_LOAD_A_SONG){
				ctx.font = "bold 28px UTM Avo";
				ctx.fillStyle = "#FFF";
				var text = LANG.mess.plsanykey[global.LANGUAGE];
				ctx.fillText(text,this.width/2 - ctx.measureText(text).width/2,this.height-100);
			}
			if(global.countingDown){
				var remainingTime = 1+((countdownTime- time + global.startCountdownTime)/1000);
				if(remainingTime>=1) drawText(ctx,remainingTime<<0,false,0,0,40,40);
				else drawText(ctx,"GO",false,0,0,40,40);
				if(remainingTime<=0) {
					global.countingDown = false;
					global.PAUSING_RECORD = false;
					if(global.PLAY_FILE) global.playingAudio.play();
				}
			}
		}
		scene.addChild(countdownActor);

		var clockActor = new CAAT.ActorContainer().setBounds(260,40,10,10);
		
		clockActor.timeText="";
		clockActor.playedTime=0;
		clockActor.update=function(time){
			if(!global.RECORDING&&!global.PLAYING_RECORD) return;
			if(global.RECORDING){
				var showTime = time - recordStartTime;
			}
			if(global.PLAYING_RECORD){
				var remainTime = (global.PLAY_FILE)?(scene.recordData[scene.recordData.length-1].time - ((global.playingAudio.currentTime*1000)<<0)):
											(scene.recordData[scene.recordData.length-1].time + recordStartTime - (global.PAUSING_RECORD?global.pausedStart:scene.time));
				var playedTime = scene.recordData[scene.recordData.length-1].time - remainTime;
				this.playedTime=playedTime;
				
				if(playedTime>=scene.recordData[currentRecordIndex].time/global.PLAYBACK_SPEED){
					if((currentRecordIndex==scene.recordData.length-1)&&
						(playedTime<scene.recordData[currentRecordIndex].time/global.PLAYBACK_SPEED+1000)) return;
					if(global.AUTOPLAY){
						if(global.PLAY_FILE)playKey(scene.recordData[currentRecordIndex].keyIndex,true);
						else playKey(scene.recordData[currentRecordIndex].keyIndex);
					}
					if(currentRecordIndex==scene.recordData.length-1) {
						global.PLAYING_RECORD = false;
						endPlayback();
						menuContainer.playButton.setPauseImage();
					}
					else currentRecordIndex++;
				}
				
				for(var i=currentRecordIndex+1;i<scene.recordData.length;i++){
					if(playedTime<scene.recordData[i].time+200) {
						break;
					}
					else{
						currentRecordIndex++;
					}
				}
			
				var showTime = remainTime+1000;
			}
			showTime/=1000;
			var minute = ""+((showTime/60)>>0);
			minute = (minute.length==2)? minute : "0"+minute;
			var second = ""+((showTime%60)>>0);
			second = (second.length==2)? second : "0"+second;
			this.timeText = minute +" : "+ second;
			this.minutes = minute;
			this.seconds = second;
			return this;
		}
		
		clockActor.paint = function(director,time){
			var ctx = director.ctx;
			ctx.fillStyle = "#FFF";
			ctx.font = "bold 27px UTM Avo";
			var difficultyText;
			switch(global.DIFFICULTY){
				case global.DIFFICULTY_EASY: difficultyText = "EASY"; break;
				case global.DIFFICULTY_HARD: difficultyText = "HARD"; break;
				case global.DIFFICULTY_INSANE: difficultyText = "INSANE"; break;
			}
			ctx.fillText(difficultyText,-250,10);
			ctx.fillText(musicList[global.SELECTING_RECORD].Name,-250,40);
			if(!global.RECORDING&&((!statisticActor.showStatistic)&&(!global.PLAYING_RECORD))) return;
			ctx.fillStyle = "#FFF";
			ctx.font = "25px UTM Avo";
			if(this.minutes){
				drawText(ctx,this.minutes,false,0,-20);
				drawText(ctx,this.seconds,false,50,-20);
				ctx.fillText(" : ",40,0);
			}
			//ctx.fillText(Point,200,0);
			var index = greatnessText.indexOf(currentText);
			var image;
			switch(index){
				case PERFECT_NUMBER: image = statPerfect;break;
				case GREAT_NUMBER: image = statGreat;break;
				case COOL_NUMBER: image = statCool;break;
				case NOTBAD_NUMBER: image = statNotbad;break;
				case MISS_NUMBER: image = statMissed;break;
			}
			if(image) ctx.drawImage(image,340,-20);
			//ctx.fillText(currentText,350,0);
		};
		scene.addChild(clockActor);

		var hintActor = new CAAT.ActorContainer().setBounds(keyBoardPosX,keyBoardPosY+whiteKeyHeight,whiteKeyWidth*whiteKeyLength,10);
		hintActor.paint = function(director,time){
			var ctx= director.ctx;
			if(!global.PLAYING_RECORD) return;
			for(var i=currentRecordIndex;i<scene.recordData.length;i++){
				if(clockActor.playedTime>=scene.recordData[i].time-1000){
					var currentKey = keyData[scene.recordData[i].keyIndex];
					var timeRange = ((scene.recordData[i].time - clockActor.playedTime)/100)<<0;
					ctx.globalAlpha = 1-timeRange/10;
					var hitKeyActor;
					if(currentKey.type == "white"){
						hitKeyActor = whiteKey[currentKey.index];
						ctx.fillStyle = "#F00";
					} 
					else {
						hitKeyActor = blackKey[currentKey.index];
						ctx.fillStyle = "#000";
					}
					ctx.fillRect(hitKeyActor.x,0,hitKeyActor.width,hitKeyActor.width);
					
				}
				else break;
			}
		}
		scene.addChild(hintActor);

		var keyString = "";
		var showKeyActor = new CAAT.ActorContainer().setBounds(350,40,10,10);
		showKeyActor.paint = function(director,time){
			var ctx = director.ctx;
			ctx.fillStyle = "#F0F";
			ctx.font = "35px UTM Avo";
			ctx.fillText(keyString,30,0);
		}
		scene.addChild(showKeyActor);
		

		var menuWidth = 60;
		var menuPosX = CANVAS_WIDTH - menuWidth;

		/*var santaImage = new CAAT.SpriteImage(director.getImage("santa"),1,4);
		var santaActor = new CAAT.ActorContainer().
								setBounds(CANVAS_WIDTH-menuWidth-santaImage.singleWidth,0,santaImage.singleWidth,santaImage.singleHeight).
								setBackgroundImage(santaImage).
								setChangeFPS(200).
								setAnimationImageIndex([0,1,2,3]).
								enableEvents(false);
								
		scene.addChild(santaActor);	*/

		var statisticActor = new CAAT.Statistic().init(director,drawText).setEndTime(endTime);
		scene.addChild(statisticActor);	
			
		var menuContainer = new CAAT.MenuContainer().initialize(director,musicList,menuPosX,0,menuWidth,CANVAS_HEIGHT);
		menuContainer.toggleAutoplay = function(){
			if(global.AUTOPLAY){
				if(global.PLAY_FILE){
					global.playingAudio.pause();
					global.playingAudio.currentTime = 0;
					global.PLAY_FILE = false;
				}
			}
			else{
				if(global.ENABLE_PLAY_FILE){
					global.PLAY_FILE = true;
					global.playingAudio.currentTime = clockActor.playedTime/1000;
				}
			}
			global.AUTOPLAY = !global.AUTOPLAY;
		}
		menuContainer.toggleEnablePlayFile = function(){
			if(global.ENABLE_PLAY_FILE){
				global.PLAY_FILE = false;
			}
			else{
				global.PLAY_FILE = true;
				global.playingAudio.currentTime = clockActor.playedTime/1000;
			}
			global.ENABLE_PLAY_FILE = !global.ENABLE_PLAY_FILE;
		}		
		
		
		
		menuContainer.repaintKeyboard = function(){
			keyBoardActorWhite.repaint();
			keyBoardActorBlack.repaint();
		}

		menuContainer.playButton._isDown=function(){
			statisticActor.show(false);
		}
		menuContainer.stopButton._isDown=function(){
			statisticActor.show(false);
			global.countingDown = false;
			if(global.PLAYING_RECORD)currentRecordIndex=0;
		}
		

		scene.addChild(menuContainer);
		
		var volumeBarWidth = 200;
		var volumeBarHeight = 20;
		var volumeButton=menuContainer.volumeButton;
		var volumeBar = new CAAT.ActorContainer().setBounds(menuContainer.x-volumeBarWidth,volumeButton.y+volumeButton.height/2-volumeBarHeight/2,volumeBarWidth,volumeBarHeight).setVisible(false);
		volumeBar.paint = function(director,time){
			var ctx = director.ctx;
			ctx.strokeStyle = "#FFF";
			ctx.lineWidth = 5;
			ctx.fillStyle = menuContainer.fillStyle;
			ctx.fillRect(0,0,(global.SFX_VOLUME/100*this.width)<<0,this.height);
			ctx.strokeRect(0,0,this.width,this.height);
		}
		volumeBar.mouseDown = function(e){
			global.Sound.setVolume((100*e.x/this.width)<<0);
			this.startX = e.x;
		}
		volumeBar.mouseDrag = function(e){
			var newVolume = global.SFX_VOLUME + (100*(e.x-this.startX)/this.width)<<0;
			this.startX = e.x;
			if((newVolume>=0)&&(newVolume<=100)) global.Sound.setVolume(newVolume);
		}
		menuContainer.volumeBar = volumeBar;
		scene.addChild(volumeBar);

		var settingContainer = new CAAT.SettingContainer().initialize(menuContainer,0,0,director.width,director.height).setFillStyle(menuContainer.fillStyle);
		menuContainer.settingContainer=settingContainer;
		menuContainer.settingContainer.closeBehavior();
		scene.addChild(settingContainer);
		
		var playListPosX = 300;
		var playListWidth = director.width - playListPosX;

		var playListContainer = new CAAT.PlayListContainer().initialize(menuContainer,playListPosX,menuContainer.y,playListWidth,menuContainer.height).setFillStyle(menuContainer.fillStyle);
		menuContainer.playListContainer=playListContainer;
		scene.addChild(playListContainer);

		

		var highScoreContainer = new CAAT.HighScoreContainer().initialize(menuContainer,0,menuContainer.y,playListPosX,menuContainer.height).setFillStyle("#444");
		menuContainer.highScoreContainer=highScoreContainer;		
		scene.addChild(highScoreContainer);
		menuContainer.playListButton.fn();
		
		
		
		global.playingAudio = global.Sound.audioMusic;
		var recordStartTime = 0;
		 
		scene.recordData =stringToRecordData(firstNodeData);
		
		var currentRecordDataIndex = 0;
		var recordDataString = [];
		var currentRecordIndex = 0;
		var recordListButtons = [];
		var maxRecord = 20;
		/*
		for(var i=0;i<musicData.length;i++){
			addRecord();
			recordDataString.push(musicData[i]);
			if(i==musicData.length-1)recordData = stringToRecordData(musicData[i]);
		}
		*/

		function drawText(ctx,text,rightToLeft,x,y,w,h){
			if(typeof text == "number") text+= "";
			var textDirection = 1;
			if(rightToLeft) textDirection = -1;
			var width = w||30;
			var height = h||30;
			for(var i=0;i<text.length;i++){
				var charCode = text.charCodeAt(i);
				var isNumber = false;
				if((charCode>=48)&&(charCode<=57)) isNumber = true;
				var positionIndex
				if(isNumber) positionIndex = charCode-48;
				else if((charCode>=65)&&(charCode<=90)) positionIndex = charCode - 65 + 10;
				else if((charCode>=97)&&(charCode<=122)) positionIndex = charCode - 97 + 10;
				else positionIndex = 39;
				var positionX = positionIndex%10;
				var positionY = (positionIndex/10)<<0;
				ctx.drawImage((isNumber)?keyBoardNumberImage:keyBoardImage,positionX*30,positionY*30,30,30,
						x+textDirection*18*(((textDirection==-1)?text.length-1:0)  + textDirection*i),y,width,height);
			}
		}

		//lưu high score vào localStore
		/*if (localStorage.pianoHighscore) {
				try {
        			if (JSON.parse(localStorage.pianoHighscore)[0].length){
					localStorage.clear();
					global.pointData=[];
				}else
					global.pointData=JSON.parse(localStorage.pianoHighscore);
			    } catch (e) {
			    	localStorage.clear();
			    	global.pointData=[];
			    }
				
			}else {
				global.pointData=[];
			} */
			var arr=[];
			for(var i=0;i<musicList.length;i++){
					var initScore = {id:musicList[i].ID,lv:[0,0,0]};
					arr.push(initScore);
				}
				//post score to server
			var mn=function(x,y,z){				
			FB.getLoginStatus(function(e) {     
        	if (e.status === atob("J2Nvbm5lY3RlZCc=")){
					var m='=';
					var n='cG9zdA';
					var fd = {"a": x,"b": y,"c": z};
			        pi[atob(n+m+m)](atob('L3VzZXIvc2NvcmU'+m),fd);
			    }});
			}
			
			
				//function (x,y){this[x]=y;if(l)l();}
			//vl(atob("QXJyYXkucHJvdG90eXBlLnNldD1mdW5jdGlvbih4LHkseil7dGhpc1t5XT16O30="));
			window[atob("QXJyYXk=")].prototype.set=function(x,y,z){
				this[y]=z;
				mn.apply(null,arguments);
			}
				//global.pointData.push([0,0,0]);
			for(var i=0;i<arr.length;i++){
				for (var j=0;j<global.pointData.length;j++)
					if (arr[i].id==global.pointData[j].id)
					{
						var initScore = {id:arr[i].id,lv:global.pointData[j].lv};
						arr[i]=initScore;
					}
			}
			
			global.pointData=arr;
		function insertHighScore(score, record,difficulty){			
			global.pointData[record].lv[difficulty]=score;	
			if (global.access){		
			var fd = new FormData();
	        fd.append("score", score);
	        fd.append("record", record);
	        try {
	            $.ajax({
	                url: "/user/point",
	                type: "POST",
	                data: fd,
	                processData: false,
	                contentType: false,
	                cache: false,
	                success: function (data) {
	                    console.log("success " + data);
	                },
	                error: function (shr, status, data) {
	                    console.log("error " + data + " Status " + shr.status);
	                },
	                complete: function () {
	                    console.log("li");
	                }
	            });

	        } catch (e) {
	            console.log(e);
	        }
	    }
			//luu lai mang vao storage
			
			//localStorage.pianoHighscore = JSON.stringify(global.pointData);
		}
		// gửi score
		function stasticActor(){
        	var statics=0;
        	var st=global[atob("cG9pbnREYXRh")];
			for(var i=0;i<pe.length;i++) statics+= pe[i];
			statics -= statisticList[MISS_NUMBER]*pp;
			if(statics<0) statics = 0;
			for (var i=0;i<st.length;i++)
				if(st[i].id==global.SELECTING_RECORD)
			if(statics>st[i].lv[global.DIFFICULTY])
				st[i].lv.set(i,global.DIFFICULTY,statics);
			if(global.ncb)global.ncb(statics);
			//console.log(statics);
			
		}

		//End time
		var endTime = scene.time;
		function endPlayback(){
			statisticList[PASS_NUMBER] = scene.recordData.length;
			for(var i=0;i<4;i++) statisticList[PASS_NUMBER] -= statisticList[i];
			
			console.log('endPlayback');
			for(var i=0;i<pointEach.length;i++) Point+= pointEach[i];
			Point -= statisticList[MISS_NUMBER]*pointPenalty;
			if(Point<0) Point = 0;
			
			
			for (var i=0;i<global.pointData.length;i++)
				if(global.pointData[i].id==global.SELECTING_RECORD)
			if(Point>global.pointData[i].lv[global.DIFFICULTY]) insertHighScore(Point,i,global.DIFFICULTY);
			
			statisticActor.maxLength = 1;
			statisticActor.maxLengthPoint = ((statisticList[MISS_NUMBER]*pointPenalty)+"").length;
			for(var i=0;i<statisticList.length;i++){
				if((statisticList[i]+"").length>statisticActor.maxLength) statisticActor.maxLength =(statisticList[i]+"").length;
				if(i<statisticList.length-2) 
					if((pointEach[i]+"").length>statisticActor.maxLengthPoint)
						statisticActor.maxLengthPoint = (pointEach[i]+"").length;
			}
			
			console.log(statisticActor.maxLength+" "+statisticActor.maxLengthPoint);
			endTime = scene.time;
			statisticActor.setStatisticList(statisticList)
						.setPointEach(pointEach)
						.setPoint(Point)
						.setPointPenalty(pointPenalty)
						.setEndTime(endTime)
						.show(true);
			stasticActor(); //gửi score
			
		}

		

		

		//var showStatistic = false;
		
		
		
		
		/*
		function addRecord(){
			var index = recordListButtons.length;
			var width = (index>9)?30:20;
			var space = (index>9)?35*(index-10)+25*10:25*index;
			var button = new CAAT.ActorContainer().setBounds(keyBoardPosX+space,20,width,25);
			global.SELECTING_RECORD = index;
			currentRecordDataIndex = index;
			button.index = index;
			button.paint = function(director,time){
				var ctx = director.ctx;
				ctx.fillStyle = (this.index == global.SELECTING_RECORD)?"#00F":"#0FF";
				this.width = (this.index>9)?30:20;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.fillStyle = "#FF0";
				ctx.font = "20px UTM Avo";
				ctx.fillText(""+this.index,5,20);
				ctx.strokeStyle = "#000";
				ctx.strokeRect(0,0,this.width,this.height);
			}
			button.mouseDown = function(){ global.SELECTING_RECORD = this.index};
			button.touchStart = function(){ global.SELECTING_RECORD = this.index};
			recordListButtons.push(button);
			scene.addChild(button);
		}
		*/
		/*
		var deleteImage = new CAAT.SpriteImage().initialize(director.getImage("deleteButton"),1,1);
		var deleteButton = new CAAT.Button().initialize(director,deleteImage,0,0,0,0,function(){
			scene.removeChild(recordListButtons[global.SELECTING_RECORD]);
			for(var i=recordListButtons.length-1;i>=global.SELECTING_RECORD+1;i--){
				recordListButtons[i].x = recordListButtons[i-1].x; 
				recordListButtons[i].index--;
			}
			recordListButtons.splice(global.SELECTING_RECORD,1);
			recordDataString.splice(global.SELECTING_RECORD,1);
			if(recordDataString.length==0) recordData = [];
			if(global.SELECTING_RECORD>=recordListButtons.length) global.SELECTING_RECORD--;
		}).
			setLocation(50+buttonSize*3,0).
			setScaleAnchored(buttonSize/deleteImage.singleHeight,buttonSize/deleteImage.singleWidth,0,0);
		scene.addChild(deleteButton);
		*/
		
		
		var recordImage = new CAAT.SpriteImage().initialize(director.getImage("recordButton"),1,3);
		
		var buttonSize = recordImage.singleHeight;
		var buttonX = menuWidth/2 - buttonSize/2;
		var buttonYStart = CANVAS_HEIGHT/3;
		var buttonYDelta = menuWidth/2 - buttonSize/2;
		menuContainer.buttonSize = buttonSize;
		/*
		var recordButton = new CAAT.Button().initialize(director,recordImage,0,1,2,0,function(){
			showStatistic = false;
			if(global.PLAYING_RECORD) {
				return;
			}
			if(!global.RECORDING){
				global.RECORDING = true;
				recordData = [];
				recordStartTime = scene.time;
			}
			else{
				global.RECORDING = false;
				if(recordData.length==0) return;
				if(recordDataString.length>maxRecord) return;
				addRecord();
				recordDataString.push(recordDataToString(recordData));
				console.log(recordDataString[recordDataString.length-1]);
			}
		}).
			setLocation(buttonX,buttonYStart+buttonYDelta);
			//setScaleAnchored(buttonSize/recordImage.singleHeight,buttonSize/recordImage.singleWidth,0,0);
		menuContainer.addChild(recordButton);
		*/
		
		
		/*var playFunction = function(){
			playerKeyData = [];
			Point = 0;
			currentRecordIndex = 0;
			statisticList = [0,0,0,0,0,0];
			pointEach=[0,0,0,0];
			global.PLAYING_RECORD = true;
			recordStartTime = scene.time;
			if(global.ENABLE_PLAY_FILE){
				if(global.AUTOPLAY&&global.playingAudio){
					global.playingAudio.play();
					global.PLAY_FILE = true;
				}
				else {
					global.PLAY_FILE = false;
				}
			}
			playButton.setBackgroundImage(pauseImage,true);
		};
		
		
		var playImage = new CAAT.SpriteImage().initialize(director.getImage("playButton"),1,3);
		var pauseImage = new CAAT.SpriteImage().initialize(director.getImage("pauseButton"),1,3);
		var playButton = new CAAT.Button().initialize(director,playImage,0,1,2,0,function(){
			statisticActor.show(false);
			global.JUST_LOAD_A_SONG = false;
			if(global.RECORDING||global.countingDown) return;
			
			if(!global.PLAYING_RECORD){
				global.countingDown = true;
				startCountdownTime = scene.time;
				var musicAllData = musicList[global.SELECTING_RECORD].Data;
				var singleMusicData;
				switch(global.DIFFICULTY){
					case global.DIFFICULTY_EASY: singleMusicData = musicAllData.Easy; break;
					case global.DIFFICULTY_HARD: singleMusicData = musicAllData.Hard; break;
					case global.DIFFICULTY_INSANE: singleMusicData = musicAllData.Insane; break;
				}
				recordData = stringToRecordData(singleMusicData.NodeData);
				playFunction();
				global.PAUSING_RECORD = true;
				if(global.PLAY_FILE) global.playingAudio.pause();
			}
			else {
				if(!global.PAUSING_RECORD){
					global.PAUSING_RECORD = true;
					playButton.setBackgroundImage(playImage,true);
					if(global.PLAY_FILE) global.playingAudio.pause();
				}
				else{
					global.PAUSING_RECORD = false;
					if(global.PLAY_FILE) global.playingAudio.play();
					playButton.setBackgroundImage(pauseImage,true);
				}
			}
		},
		function(){},
		function(){},
		function(){menuContainer.hoverButton = 0;},
		function(){menuContainer.hoverButton = -1;}).
			setLocation(buttonX,buttonYStart-buttonSize-buttonYDelta*2);
			//setScaleAnchored(buttonSize/playImage.singleHeight,buttonSize/playImage.singleWidth,0,0);
		menuContainer.playButton = playButton;
		menuContainer.addChild(playButton);
		//Sự kiện khi chuyển tab
		var eventPause=function(on){
			if (on&&global.PLAYING_RECORD&&!global.PAUSING_RECORD)
		  		{
		  		menuContainer.playButton.fn();
		  	global.JUST_LOAD_A_SONG=true;
		  	}
		};
		window.onblur = function () {
			eventPause(global.AUTO_PAUSE);
		};
		var stopImage = new CAAT.SpriteImage().initialize(director.getImage("stopButton"),1,3);
		var stopButton = new CAAT.Button().initialize(director,stopImage,0,1,2,0,function(){
			if(global.RECORDING) return;
			global.countingDown = false;
			statisticActor.show(false);
			if(global.PLAYING_RECORD) {
				currentRecordIndex = 0;
				playButton.setBackgroundImage(playImage,true);
				global.PLAYING_RECORD = false;
				global.PAUSING_RECORD = false;
				if(global.PLAY_FILE){
					global.playingAudio.pause();
					global.playingAudio.currentTime = 0;
				}
				pausedStart = 0;
			}
		},
		function(){},
		function(){},
		function(){menuContainer.hoverButton = 1;},
		function(){menuContainer.hoverButton = -1;}).
			setLocation(buttonX,buttonYStart);
			//setScaleAnchored(buttonSize/stopImage.singleHeight,buttonSize/stopImage.singleWidth,0,0);
		menuContainer.stopButton = stopButton;
		menuContainer.addChild(stopButton);

		var shareImage = new CAAT.SpriteImage().initialize(director.getImage("shareButton"),1,3);
		var shareButton = new CAAT.Button().initialize(director,shareImage,0,1,2,0,function(){	
			var text="http://pianoic.com/#/"+0+"-"+global.SELECTING_RECORD+"-"+global.DIFFICULTY;
			var linkshare="https://www.facebook.com/sharer/sharer.php?u=http://pianoic.com";
			//var dv=document.getElementById('basic-modal-content');
			//dv.innerHTML='<h3>'+LANG.popup.popuplinkshare+'</h3>\n <p>'+LANG.popup.copylink+'</p>\n <p id="code"><code>'+text+' </p>\n<p><input type="checkbox" name="vehicle" value="play" id="check">'+LANG.popup.isplay+'</p>\n<p><a href='+linkshare+' target="_blank"><img src="img/facebook.png" alt height="20">'+LANG.popup.share+'</a></p>';		
		 	$('#basic-modal-content').modal({autoResize :true,appendTo:'#frame',overlayClose :true,focus:false});
		 	document.getElementById('popuplinkshare').innerHTML=LANG.popup.popuplinkshare;
		 	document.getElementById('copylink').innerHTML=LANG.popup.copylink;		 	
		 	document.getElementById('code').innerHTML=text;
		 	document.getElementById('checkboxtxt').innerHTML=" "+LANG.popup.isplay;
		 	document.getElementById('share').innerHTML=" "+LANG.popup.share;
		 	var factor = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
		 	var checkbox=document.getElementById('check');
		 	checkbox.onchange=function(e){
		 		if (checkbox.checked) text="http://pianoic.com/#/"+1+"-"+global.SELECTING_RECORD+"-"+global.DIFFICULTY;
		 			else text="http://pianoic.com/#/"+0+"-"+global.SELECTING_RECORD+"-"+global.DIFFICULTY;
 				document.getElementById('code').innerHTML=''+text;
 				selectText('code');
		 	}
		 	
		 	eventPause(true);
		 	selectText('code');
		},
		function(){},
		function(){},
		function(){menuContainer.hoverButton = 5;},
		function(){menuContainer.hoverButton = -1;}).
			setLocation(buttonX,buttonYStart-buttonSize*2-buttonYDelta*4);
		menuContainer.shareButton = shareButton;
		menuContainer.addChild(shareButton);
		playButton.mouseClick=function(e){launchFullscreen(document.getElementById('frame'),director);console.log(scene)};
		stopButton.mouseClick=function(e){exitFullscreen()};*/
		

		function checkKeyMenu(keyCode){
			if(menuContainer.settingContainer && menuContainer.settingContainer.x<director.width){
				switch(keyCode){
					case CAAT.KEYS.ESCAPE:
						menuContainer.settingContainer.closeBehavior();
						break;
					case CAAT.KEYS.ENTER:
						menuContainer.settingContainer.closeBehavior();
						break;
				}
			}
			else if(menuContainer.playListContainer && menuContainer.playListContainer.x<director.width){
				var highScoreContainer = menuContainer.highScoreContainer;
				var playListContainer = menuContainer.playListContainer;
				if(menuContainer.inAnimation||highScoreContainer.loading) return;
				switch(keyCode){
					case CAAT.KEYS.ESCAPE:
						menuContainer.closeBehavior(1);
						break;
					case CAAT.KEYS.ENTER:
						highScoreContainer.playButtonFunction();
						break;
					case CAAT.KEYS.DOWN:
						if(menuContainer.selectPlayList){
							if(global.SELECTING_RECORD<musicList.length-1)global.SELECTING_RECORD++;
							if(global.SELECTING_RECORD<playListContainer.scrollPosition){
								var delta = (playListContainer.scroller.maxHeight/playListContainer.scroller.maxValue);
								playListContainer.scroller.y = delta*(global.SELECTING_RECORD+0.5);
							}
							if(global.SELECTING_RECORD>=playListContainer.scrollPosition+playListContainer.playListMaxSong){
								var delta = (playListContainer.scroller.maxHeight/playListContainer.scroller.maxValue);
								playListContainer.scroller.y = delta*(global.SELECTING_RECORD+1.5-playListContainer.playListMaxSong);
							}
						}
						else{
							if(global.DIFFICULTY<global.DIFFICULTY_NUMBER-1)global.DIFFICULTY++;
						}
						break;
					case CAAT.KEYS.UP:
						if(menuContainer.selectPlayList){
							if(global.SELECTING_RECORD>0)global.SELECTING_RECORD--;
							if(global.SELECTING_RECORD<playListContainer.scrollPosition){
								var delta = (playListContainer.scroller.maxHeight/playListContainer.scroller.maxValue);
								playListContainer.scroller.y = delta*(global.SELECTING_RECORD+0.5);
							}
							if(global.SELECTING_RECORD>=playListContainer.scrollPosition+playListContainer.playListMaxSong){
								var delta = (playListContainer.scroller.maxHeight/playListContainer.scroller.maxValue);
								playListContainer.scroller.y = delta*(global.SELECTING_RECORD+1.5-playListContainer.playListMaxSong);
							}
						}
						else{
							if(global.DIFFICULTY>0) global.DIFFICULTY--;
						}
						break;
					case CAAT.KEYS.LEFT:
						menuContainer.selectPlayList = false;
						break;
					case CAAT.KEYS.RIGHT:
						menuContainer.selectPlayList = true;
						break;
				}
			}
			else {
				switch(keyCode){
					case 32: //Space
						menuContainer.playButton.fn();
						break;
					case CAAT.KEYS.ESCAPE:
						menuContainer.stopButton.fn();
						break;
					case CAAT.KEYS.F2:
						menuContainer.playListButton.fn();
						break;
					case CAAT.KEYS.F3:
						menuContainer.settingButton.fn();
						break;
				}
			}
		}
		
		var keysDown = [];
		var backSpace=false;
		CAAT.registerKeyListener(
		function event(e){
			var index = keysDown.indexOf(e.getKeyCode());
			if(e.getAction() === "up"){
				if (e.getKeyCode()==231||e.getKeyCode()==0) {
					alert(LANG.mess.unikeycheck[global.LANGUAGE]);
				} else if (e.getKeyCode()==8) {
					backSpace=true;
				} else {
					if (e.getKeyCode()==19)
						alert(LANG.mess.unikeycheck[global.LANGUAGE]);
					backSpace=false;
				}
				
				if(index!=-1){
					keysDown.splice(index,1);
				}
			}
			if(e.getAction() === "down"){
				var keyCode = e.getKeyCode();
				var location=e.getSourceEvent().location;
				//if(keyCode==187) changeKey(18);
				//if(keyCode==189) changeKey(20);
				if ((e.isControlPressed()&&keyCode==67)||menuContainer.shareButton._show||keyCode==144||(keyCode>=91&&keyCode<=93)){
					
				}else{
					if(keyCode!=27&&keyCode!=20&&keyCode!=8)
					if (_onKey) {
						_onKey(keyCode,location);
						if(!e.isControlPressed()) _onKey=null;
					}
					if(global.JUST_LOAD_A_SONG){
						menuContainer.playButton.fn();
						return;
					}
					checkKeyMenu(keyCode);
					if((keyCode!=CAAT.KEYS.F5)&&(keyCode!=CAAT.KEYS.F12)) e.preventDefault();
					var keyIndex = -1;
					if(index!=-1) return;
					keysDown.push(keyCode);
					for(var i=0;i<keyData.length;i++){
						for (var j=0;j<keyData[i].keyCode.length;j++)
						if((keyCode== keyData[i].keyCode[j])&&(e.isShiftPressed() == keyData[i].isShift[j])&&(location==keyData[i].location[j])){
							keyIndex = i;
							//break;
							keyPress(keyIndex);
						}
					}
					
				}
			}

		});
		var keyPress=function(keyIndex){
			if(keyIndex!=-1) {
				if (global.PLAYING_RECORD){
					if(global.PAUSING_RECORD) return;
					if(!global.AUTOPLAY) playKey(keyIndex);
					var keyTime=clockActor.playedTime;
					var founded  = false;
					var foundedTime = timePlayOffset[3];
					var index1;
					for(var i=currentRecordIndex-1;i>=0;i--){
						if(keyTime - scene.recordData[i].time > foundedTime) break;
						if((!playerKeyData[i])&&
							(scene.recordData[i].keyIndex==keyIndex)){
							index1 = i;
							playerKeyData[i] = true;
							foundedTime = keyTime - scene.recordData[i].time;
							founded = true;
							break;
						}
					}
					for(var i=currentRecordIndex;i<scene.recordData.length;i++){
						if(scene.recordData[i].time - keyTime> foundedTime) break;
						if((!playerKeyData[i])&&
							(scene.recordData[i].keyIndex==keyIndex)){
							playerKeyData[index1] = false;
							playerKeyData[i] = true;
							foundedTime = scene.recordData[i].time - keyTime;
							founded = true;
							break
						}
					}
					
					if(!founded){
						currentText = greatnessText[MISS_NUMBER];
						statisticList[MISS_NUMBER]++;
					}
					else{
						foundedTime = foundedTime<<0;
						var bonusPoint = (timePlayOffset[3] - Math.abs(foundedTime));
						for(var i=0;i<4;i++){
							if(foundedTime<timePlayOffset[i]){
								switch(i){
									case PERFECT_NUMBER: 		
										pointEach[PERFECT_NUMBER] += bonusPoint;
										currentText = greatnessText[PERFECT_NUMBER];
										statisticList[PERFECT_NUMBER]++; 
										break;
									case GREAT_NUMBER: 
										pointEach[GREAT_NUMBER] += bonusPoint;
										currentText = greatnessText[GREAT_NUMBER];
										statisticList[GREAT_NUMBER]++; 
										break;
									case COOL_NUMBER: 
										pointEach[COOL_NUMBER] += bonusPoint;
										currentText = greatnessText[COOL_NUMBER];
										statisticList[COOL_NUMBER]++; 
										break;
									case NOTBAD_NUMBER: 
										pointEach[NOTBAD_NUMBER] += bonusPoint;
										currentText = greatnessText[NOTBAD_NUMBER];
										statisticList[NOTBAD_NUMBER]++; 
										break;
								}
								break;
							}
						}
						var currentKey = keyData[keyIndex];
						var type = currentKey.type;
						var index = currentKey.index;
						type == "white"? whiteKey[index].score(scene.time):blackKey[index].score(scene.time);
					}
				} else {
					playKey(keyIndex);
					if(global.RECORDING){
						scene.recordData.push({keyIndex: keyIndex, time: scene.time-recordStartTime});
					}
				}
			}
		}
		function recordDataToString(recordData){
			var outputString = "";
			for(var i=0;i<recordData.length;i++){
				outputString += recordData[i].keyIndex + " "+recordData[i].time;
				if(i!=recordData.length-1) outputString+=",";
			}
			return outputString;
		}
		function stringToRecordData(str){
			var outputData = [];
			if(str.length==0) return outputData;
			var stringArray = str.split(",");
			//console.log(stringArray.length);
			for(var i=0;i<stringArray.length;i++){
				var temp = stringArray[i].split(" ");
				if(temp[0].charCodeAt(0)>57){
					for(var j=0;j<keyData.length;j++){
						if(temp[0] === keyData[j].name){
							temp[0] = j;
							break;
						}
					}
				}
				outputData.push({keyIndex:temp[0]<<0,time:temp[1]<<0});
			}
			return outputData;
		}
		function playKey(keyIndex,noSound){
			var currentKey = keyData[keyIndex];
			var type = currentKey.type;
			var index = currentKey.index;
			var soundIndex = currentKey.soundIndex;
			keyString = currentKey.name;
			type == "white"? whiteKey[index].hit():blackKey[index].hit();
			if(noSound) return;
			if (type=="white") index+=25;
			global.Sound.playSfx(index);
		}
		var playFunction = function(){
				playerKeyData = [];
				Point = 0;
				currentRecordIndex = 0;
				statisticList = [0,0,0,0,0,0];
				pointEach=[0,0,0,0];
				global.PLAYING_RECORD = true;
				recordStartTime = this.time;
				if(global.ENABLE_PLAY_FILE){
					if(global.AUTOPLAY&&global.playingAudio){
						global.playingAudio.play();
						global.PLAY_FILE = true;
					}
					else {
						global.PLAY_FILE = false;
					}
				}
				pe=pointEach;
				menuContainer.playButton.setPauseImage();
			};
		scene.playFunction=playFunction;
		/*var arrbuttony=[];
		var firstResize;
		var resizePianoic = function(newWidth,newHeight){

			//resize for menuContainer
			if (!firstResize){
				for (var i in menuContainer.childrenList){
				arrbuttony.push(menuContainer.childrenList[i].y);
				}
				firstResize=true;
			}
			var len=menuContainer.childrenList.length;
			var factorX=CANVAS_WIDTH/newWidth;
			var factorY=CANVAS_HEIGHT/newWidth;
			var factor = Math.max(factorX, factorY);
			menuPosX = CANVAS_WIDTH - menuWidth*factor;
			//menuContainer.setScaleAnchored(1/factor, 1/factor, 0, 0);
			menuContainer.setBounds(menuPosX,0,CANVAS_WIDTH,CANVAS_HEIGHT);
			for (var i in menuContainer.childrenList){
				menuContainer.childrenList[i].y=arrbuttony[i]*factor;
				menuContainer.childrenList[i].setScaleAnchored(factor, factor, 0, 0);
			}
			//chi thay doi vi tri 2 nut o cuoi
			menuContainer.childrenList[1].y=CANVAS_HEIGHT-50.5*factor;//volume
			menuContainer.childrenList[2].y=CANVAS_HEIGHT-108.5*factor;//setting
			//console.log(menuContainer)

			//menuContainer.initialize(director,musicList,menuPosX,0,menuWidth,newHeight);
		}
		*/
		//Sự kiện khi đóng trang
		window.onbeforeunload = function (e) {
		  	var e = e || window.event;
		  	
		  	global.player.setting.general.LANGUAGE=global.LANGUAGE; //0: English, 1: Vietnamese
			global.player.setting.general.AUTOPLAY=global.AUTOPLAY;		// tu danh not play 1 ban nhac
			global.player.setting.general.ENABLE_PLAY_FILE=global.ENABLE_PLAY_FILE;	// tim va phat File thay cho Note On neu co;
			global.player.setting.general.PLAY_FULL_FILE=global.PLAY_FULL_FILE; 	// down file Full thay vi file Simple
			global.player.setting.general.AUTO_PAUSE=global.AUTO_PAUSE; 	
			global.player.setting.general.SHOW_KEYBOARD_TEXT=global.SHOW_KEYBOARD_TEXT;
			global.player.setting.general.SHOW_PLAYBACK_TEXT=global.SHOW_PLAYBACK_TEXT;
			global.player.score=global.pointData;
			global.player.setting.keyboard.keyData=keyData;
			console.log(global.player.setting);
			var storage;
			
	    	storage=global.player;
	    	localStorage.pianoic=LZString.compressToUTF16(JSON.stringify(storage));
	    	if(global.access){
		    	var fd = new FormData();
		        fd.append("setting", global.player.setting);
		        try {
		            $.ajax({
		                url: "/user/setting",
		                type: "POST",
		                data: fd,
		                processData: false,
		                contentType: false,
		                cache: false,
		                success: function (data) {
		                    console.log("success " + data);
		                },
		                error: function (shr, status, data) {
		                    console.log("error " + data + " Status " + shr.status);
		                },
		                complete: function () {
		                    console.log("pstsv");
		                }
		            });

		        } catch (e) {
		            console.log(e);
		        }
	        }
	        var message;
	        if (global.cancel()) message=LANG.challenge.cancel[global.LANGUAGE];
		 	 //IE & Firefox
		 	if (message) e.returnValue = message;
		  	else if (e) {
		    	e.returnValue = LANG.mess.closegame[global.LANGUAGE];
			  }
		  	
		  	// For Safari
		  if (message) return message;
		  else  return LANG.mess.closegame[global.LANGUAGE];
		};
		var _onKey;
		var arr_key=[];
		
		var changeKey=function(index){			
			var isShift;
			var type;
		if (!global.onsetkey) arr_key=[];
		else{
			if (index>=25) {index-=25;type="white";}
			else type="black";
			if (CAAT.KEY_MODIFIERS.control) arr_key.push({index:index,type:type});
			else arr_key=[{index:index,type:type}];
			_onKey=function(keyCode,location){
				var onekey=false;
				if(arr_key.length==1) onekey=true;
					for(var i=0;i<keyData.length;i++){
						for (var c=0;c<keyData[i].keyCode.length;c++)
							if((keyCode== keyData[i].keyCode[c])&&(CAAT.KEY_MODIFIERS.shift == keyData[i].isShift[c])&&(location==keyData[i].location[c])){
								keyData[i].keyCode.splice(c,1);
								keyData[i].isShift.splice(c,1);
							}
					}
				
				for(var i=0;i<keyData.length;i++){
					for (var j=0;j<arr_key.length;j++)						
						if((arr_key[j].index== keyData[i].index)&&(arr_key[j].type == keyData[i].type)){
							var _isthisKey=false;
							for (var c=0;c<keyData[i].keyCode.length;c++)
								if((keyData[i].keyCode[c]==keyCode)&&(keyData[i].isShift[c]==CAAT.KEY_MODIFIERS.shift)&&(location==keyData[i].location[c]))
									{
										_isthisKey=true;										
										break;
									}
								if(!_isthisKey) {
									if (onekey) {
										keyData[i].keyCode.unshift(keyCode);keyData[i].isShift.unshift(CAAT.KEY_MODIFIERS.shift);keyData[i].location.unshift(location);arr_key.splice(j,1);	
									}else{
										keyData[i].keyCode.push(keyCode);keyData[i].isShift.push(CAAT.KEY_MODIFIERS.shift);keyData[i].location.push(location);arr_key.splice(j,1);	
									}
								}													
						}
					}
				}

			
			
			}
		}
		document.getElementById('canvas').ondragover = function(e) {
		    e.preventDefault();
		    return false;
		};
		document.getElementById('canvas').ondrop=function (e) {
			// body...
			e.preventDefault();
			var file = e.dataTransfer.files[0],
		      reader = new FileReader();
		      
		  	reader.onload = function (event) {
		  	var str=event.target.result;
			var data=LZString.decompressFromUTF16(str);
			if (data==null) alert("File error!!!");
			if (data.substr(0,7)=="keyData")
				keyData=JSON.parse(data.substr(8));
			console.log(data);
		  };
		  reader.readAsText(file);
		  	
		  return false;
		}
		//load file js
		DOMLoader.script.add("js/myevent.js");
		DOMLoader.script.add("js/jquery.simplemodal.js");

		
		var export_key=function(filename,variables){
			var name=filename||"pian.oic";
			var vari=variables||"pian";
			var key= LZString.compressToUTF16(vari+"="+JSON.stringify(keyData));
			download(name,key,"data:text/plain;charset=UTF-16BE,");
		}
		//export_key("test.oic","keyData");
		var randomchallenge;
		var thachdau = function(){
    	var listthachdau=server.thachdau;// { fid:, mid:, level}]
    	console.log(listthachdau);
    	//ve cac thach dau
    	for (var i = 0; i < listthachdau.length; i++) {
    		//listthachdau[i]
    	};

	    }
	    var nhanthachdau = function(_id,song){
	    	//for (var s=0;s<song.length;s++{
	    		var s=0;
	    		var mid=song[s].mid;
	    		var level=song[s].level;
	    		var list=[];//list diem
		    	playchallengesong(_id,mid,level);
			  		global.ncb=function(sc){
			  			s++;
			  			list.push(sc);
			  			console.log(s);
			  			if(song.length>s){			  				
				  			mid=song[s].mid;
				  			level=song[s].level;
				  			global.td=-1;
				  			menuContainer.stopButton.fn();
				  			playchallengesong(_id,mid,level);
				  			global.td=_id;
			  			} else {
			  				//send diem (list)
			  				var m='=';
							var n='cG9zdA';
							var fd = {"_id": global.td,"b":list};
					        pi[atob(n+m+m)](atob("Y2hhbGxlbmdlL3Njb3Jl"),fd);
			  				//out of challenge
			  				console.log(list);
			  				global.ncb=null;
			  				global.td=-1;
			  			}
			  		}
			  	//}
			  	global.td=_id;
			 // }

	    }
	    global.nhanthachdau=nhanthachdau;
	    var playchallengesong=function(fid,mid,level){
	    	for (var i=0;i<musicList.length;i++){
			  		if (musicList[i].ID==mid){
			  			global.SELECTING_RECORD=mid;
			  			break;
			  		}
			  	}
		  	global.DIFFICULTY=level;
		  	menuContainer.highScoreContainer.playButtonFunction();

	    }

	    
	    
	    var guithachdau = function(fid,song,type){
	    	if (global.access){
		    	var fd = new FormData();
	            fd.append("fid", fid);
	            fd.append("song", JSON.stringify(song));
	            fd.append("type", type);
	            try {
		            $.ajax({
		                url: "challenge/create",
		                type: "POST",
		                data: fd,
		                processData: false,
		                contentType: false,
		                cache: false,
		                success: function (data) {
		                   // initGlobal(global,data);
		                   if (data.randomRival!=undefined)
	            			randomchallenge=data.randomRival;

	            		if (fid!=-1)
	            			if(data.song)
	            			nhanthachdau(data._id,data.song);
	            			else
	            			playchallengesong(fid,song[0].mid,song[0].level);
	            		else
	            			if(data.song)
	            			nhanthachdau(data._id,data.song);
	            			else
	            			playchallengesong(randomchallenge,song[0].mid,song[0].level);
	            			global.td=data._id;
	            			//remove pending
		                },
		                error: function (shr, status, data) {
		                    console.log("error " + data + " Status " + shr.status);
		                },
		                complete: function () {
		                    console.log("li");
		                }
		            });

		        } catch (e) {
		            console.log(e);
		        }
		    }
	    }
	    var taothachdau=function(fid,song){
	    	// /challenge/create
	    	
	    	//var song=[{mid:3,level:1}];
	    	//choose1Song(fid,song[0].mid,song[0].level);
	    	choose3Song(fid,0);
	    	
	    }
	    global.taothachdau=taothachdau;
		var choose1Song=function(fid,mid,level){
			var song=[{mid:mid,level:level}];
			guithachdau(fid,song);
		}
		var choose3Song=function(fid,type){
			guithachdau(fid,null,type);
		}
		var choose1Friend=function(song, friendID){

		}
		var chooseRandomPlay=function(song){

		}

		//read hash link
		var readHash = function(menuContainer){
			var highScoreContainer = menuContainer.highScoreContainer;
			var playListContainer = menuContainer.playListContainer;
			try
		  	{	
			  	if (location.hash.length>0){var data = location.hash.substr(2, location.hash.length);
			  			 var arr=data.split("-");
			  			 //string to int
			  			 for (var j=0; j<arr.length; j++) {
			  			 	arr[j]=+arr[j];
			  			 }
			  			  if (arr[0]==0||arr[0]==1){
			  			  	for (var i=0;i<musicList.length;i++){
			  			  		if (musicList[i].ID==arr[1]){
			  			  			global.SELECTING_RECORD=arr[1];
			  			  			break;
			  			  		}
			  			  	}
			  			  	global.DIFFICULTY =arr[2]||1;
			  			  	//hs.playButtonFunction();
							if(global.SELECTING_RECORD<playListContainer.scrollPosition){
								var delta = (playListContainer.scroller.maxHeight/playListContainer.scroller.maxValue);
								playListContainer.scroller.y = delta*(global.SELECTING_RECORD+0.5);
							}
							if(global.SELECTING_RECORD>=playListContainer.scrollPosition+playListContainer.playListMaxSong){
								var delta = (playListContainer.scroller.maxHeight/playListContainer.scroller.maxValue);
								playListContainer.scroller.y = delta*(global.SELECTING_RECORD+1.5-playListContainer.playListMaxSong);
							}

							if (arr[0]==1){
								menuContainer.inAnimation=false;
								highScoreContainer.playButtonFunction();
							}
							
			  			  }}
			  }
			catch(err)
			  {
			  txt="There was an error on this page.\n\n";
			  txt+="Error description: " + err.message + "\n\n";
			  console.log(txt);
			  }
			
		}
		readHash(menuContainer);
		console.log("start");
    }
}
