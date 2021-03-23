const fetch = require('node-fetch');
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
    return await answer.json();
}

