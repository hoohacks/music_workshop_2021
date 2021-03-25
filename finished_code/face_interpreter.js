const fetch = require('node-fetch');
const maxApi = require('max-api');

maxApi.addHandler('face_data', async function (name) {
    if (name == null || name.length == 0){
        name = "random";
    }
    var data = await getFaceData(name);
    maxApi.post(0); // pick out the values we want
});

async function getFaceData(person){
    if(person == null){
        person = "random";
    }
    var post_url = "http://hoohacksmusicworkshop.eastus.cloudapp.azure.com:5000/";
    const request = {
        method: "POST",
        body: JSON.stringify({"person": person})
    };
    var answer = await fetch(post_url, request).then(response =>{
        return response;
    });
    var data = await answer.json();
    return data[0].faceAttributes;
}

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