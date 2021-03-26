const fetch = require('node-fetch'); // used to post request
const maxApi = require("max-api"); // used to connect to Max patch. Do not use npm to download this, Max will handle it.

/**
 * Handler for "face_data" input from Max patch.
 * Note: This handler uses an async function because it calls another async function used to send a post request. Unless you
 * are using an async behavior in your function, your function does not need to be asynchronous.
 */
maxApi.addHandler('face_data', async function (name) {
    var data = await getFaceData(name); // Gets face data in the form of the comment below
    
    // Deciding the most powerful emotion
    var max_emotion = "neutral";
    var max_num = 0;
    for(var e in data.emotion){
        if (data.emotion[e] > max_num){
            max_num = data.emotion[e];
            max_emotion = e;
        }
    }

    // Finding the most confident hair color
    var max_hair = data.hair.bald == 1.0 ? "none" : "waiting"; // if bald, don't get hair color.
    max_num = 0;
    for(var i = 0; max_hair != "none" && i < data.hair.hairColor.length; i++){
        if (data.hair.hairColor[i].confidence > max_num){
            max_num = data.hair.hairColor[i].confidence;
            max_hair = data.hair.hairColor[i].color;
        }
    }

    //sending the face info in order to the Max patch
    maxApi.outlet(max_emotion, max_hair, data.age);
});


/**
 * Recieves HooHacks member name and returns their face data using Microsoft's Face API.
 * @param {String} person first name of HooHacks member (picture and names found on https://hoohacks.io) 
 */
async function getFaceData(person){
    // Do not use this link! It will not work after judging at HooHacks. Use Azure to get your own face data.
    var post_url = "http://hoohacksmusicworkshop.eastus.cloudapp.azure.com:5000/face";
    var request = {
        method: "POST",
        headers: {'content-type': 'application/json'}
    };
    var my_req_body = {
        "person": person
    };
    request.body = JSON.stringify(my_req_body);
    var answer = await fetch(post_url, request).then(response =>{
        return response;
    });
    var data = await answer.json();
    return data[0].faceAttributes;
}

// Example return from getFaceData
/*
    "faceAttributes": {
            "age": 71.0,
            "gender": "male",
            "smile": 0.88,
            "facialHair": {
                "moustache": 0.8,
                "beard": 0.1,
                "sideburns": 0.02
            },
            "glasses": "sunglasses",
            "headPose": {
                "roll": 2.1,
                "yaw": 3,
                "pitch": 1.6
            },
            "emotion": {
                "anger": 0.575,
                "contempt": 0,
                "disgust": 0.006,
                "fear": 0.008,
                "happiness": 0.394,
                "neutral": 0.013,
                "sadness": 0,
                "surprise": 0.004
            },
            "hair": {
                "bald": 0.0,
                "invisible": false,
                "hairColor": [
                    {"color": "brown", "confidence": 1.0},
                    {"color": "blond", "confidence": 0.88},
                    {"color": "black", "confidence": 0.48},
                    {"color": "other", "confidence": 0.11},
                    {"color": "gray", "confidence": 0.07},
                    {"color": "red", "confidence": 0.03}
                ]
            },
            "makeup": {
                "eyeMakeup": true,
                "lipMakeup": false
            },
            "occlusion": {
                "foreheadOccluded": false,
                "eyeOccluded": false,
                "mouthOccluded": false
            },
            "accessories": [
                {"type": "headWear", "confidence": 0.99},
                {"type": "glasses", "confidence": 1.0},
                {"type": "mask"," confidence": 0.87}
            ],
            "blur": {
                "blurLevel": "Medium",
                "value": 0.51
            },
            "exposure": {
                "exposureLevel": "GoodExposure",
                "value": 0.55
            },
            "noise": {
                "noiseLevel": "Low",
                "value": 0.12
            }
        }
    */