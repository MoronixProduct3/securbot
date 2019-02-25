let operatorID = null

ipc.on('data', (emitter, data) => {
    console.log(data)
    if(operatorID != null)
        easyrtc.sendDataP2P(operatorID, 'rosdata', data);
})

easyrtc.setStreamAcceptor( function(callerEasyrtcid, stream) {
    operatorID = callerEasyrtcid
    var video = document.getElementById('caller');
    easyrtc.setVideoObjectSrc(video, stream);
});

 easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
     operatorID = null
    easyrtc.setVideoObjectSrc(document.getElementById('caller'), "");
});

function get_video_id() {
    return new Promise((resolve, reject) => {
        easyrtc.getVideoSourceList(list => {
            list.forEach(source => {
                if(source.label === "Virtual Webcam") {
                    resolve(source.id)
                }
            })
            reject()
        })
    })
}

function dataCallback(easyrtcid, msgType, msgData, targeting) {
    console.log(msgData)
}


function my_init() {
    easyrtc.setSocketUrl('http://localhost:8080');
    easyrtc.setRoomOccupantListener( loggedInListener);
    var connectSuccess = function(myId) {
        console.log("My easyrtcid is " + myId);
    }
    var connectFailure = function(errorCode, errText) {
        console.log(errText);
    }

    get_video_id().then(videoId => {
        easyrtc.setVideoSource(videoId)
        easyrtc.enableDataChannels(true)
        easyrtc.enableAudio(false)
        easyrtc.setPeerListener(dataCallback, 'rosdata')

        easyrtc.initMediaSource(
              function(){        // success callback
                  var selfVideo = document.getElementById("self");
                  easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                  easyrtc.connect("Company_Chat_Line", connectSuccess, connectFailure);
              },
              connectFailure
        );
    })
 }


function loggedInListener(roomName, otherPeers) {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
    for(var i in otherPeers) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            }
        }(i);

        label = document.createTextNode(i);
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}


function performCall(easyrtcid) {
    easyrtc.call(
       easyrtcid,
       function(easyrtcid) { console.log("completed call to " + easyrtcid);},
       function(errorCode, errorText) { console.log("err:" + errorText);},
       function(accepted, bywho) {
          console.log((accepted?"accepted":"rejected")+ " by " + bywho);
       }
   );
}