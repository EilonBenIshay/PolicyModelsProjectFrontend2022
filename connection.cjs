const { rejects } = require('assert');
const http = require('http');


function GetModels()
{
    url = `http://localhost:9000/apiInterviewCtrl/models/`
    http.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });

    }).on('error', (e) => {
        console.error(e);
    });
}
function GetModelLanguages(modelId)
{
    url = `http://localhost:9000/apiInterviewCtrl/${modelId}/start`
    http.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });

    }).on('error', (e) => {
        console.error(e);
    });
}

function startInterview(modelId,versionId,languageId)
{
    url = `http://localhost:9000/apiInterviewCtrl/${modelId}/${versionId}/${languageId}/start`
    return new Promise((resolve, reject) =>{
        http.get(url, (res) => {
            // console.log('statusCode:', res.statusCode);
            // console.log('headers:', res.headers);
        
            res.on('data', (d) => {
                resolve(JSON.parse(d)[0]);
            });
        
            }).on('error', (e) => {
                reject(e);
            });
    })
    
}

function GetLastQuestion(uuid,modelId,versionId,languageId,questionId)
{
    url = `http://localhost:9000/apiInterviewCtrl/${uuid}/${uuid}/${versionId}/${languageId}/q/${questionId}`
    http.get(url, (res) => {
    // console.log('statusCode:', res.statusCode);
    
    // console.log('headers:', res.headers);
    res.on('data', (d) => {
        process.stdout.write(d);
    });

    }).on('error', (e) => {
        console.error(e);
    });
}

//1) todo async await 
function answerLastQuestion(uuid,modelId,versionId,languageId,questionId)
{
    url = `http://localhost:9000/apiInterviewCtrl/${uuid}/${uuid}/${versionId}/${languageId}/q/${questionId}`
    http.get(url, (res) => {
    // console.log('statusCode:', res.statusCode);
    
    // console.log('headers:', res.headers);
    res.on('data', (d) => {
        process.stdout.write(d);
    });

    }).on('error', (e) => {
        console.error(e);
    });
}

//2)todo post request answer question 


//GetModels();
//GetModelLanguages(1);
let uuid = undefined;
async function doWork(){
    //let uuid = -1;
    const uid = await startInterview(1,1,"English-Raw");
    uuid = uid;
    console.log(uuid);
    console.log(uid);

}
doWork();
//let uuid = -1;
// startInterview(1,1,"English-Raw").then((uid) => {
//     uuid = uid
// }).catch((messege) => {
//     console.log(messege)
// });
// console.log(uuid)
// for now -1 return the last question
//GetLastQuestion(uuid,1,1,"English-Raw",-1);

