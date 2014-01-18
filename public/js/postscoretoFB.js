(function(window){
    var access_token,uid;
    var LoginFB=function(callback){
        FB.getLoginStatus(function(response) {
     
            if (response.status === 'connected') {
                //If you want the user's Facebook ID or their access token, this is how you get them.
                uid = response.authResponse.userID;
                access_token = response.authResponse.accessToken;
                if(callback) callback(access_token);
                
                
     
            } else {
        FB.login(function (response) {
                        if (response.authResponse) {
                            uid = response.authResponse.userID;
                            access_token = response.authResponse.accessToken;
                            getName();
                        } else {
                            alert(LANG.fb.permission[LANGUAGE]);
                        }
                    }, {
                        scope: 'publish_actions,publish_stream'
                    });
            }

      });
        
  }
    
    window.LoginFB=LoginFB;
})(window);