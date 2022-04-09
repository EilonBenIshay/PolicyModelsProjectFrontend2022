const http = require('http');


class APIHandler {
    constructor(){
        this.userId = undefined;
        this.questionId = undefined;
        this.answers = undefined;
        this.languages = undefined;
        this.activeLangauge = undefined;
        this.models = undefined;
        this.versionId = undefined;
    }
}
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
        
            res.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        
            }).on('error', (e) => {
                reject(e);
            });
    })
}

function GetLastQuestion(uuid,modelId,versionId,languageId,questionId)
{
    const postData = JSON.stringify({
        'uuid': uuid,
        'modelId':modelId,
        'versionNum':versionId,
        'languageId':languageId,
        'reqNodeId':questionId
      });
      
      const options = {
        hostname: 'localhost',
        method: 'POST',
        path: '/apiInterviewCtrl/ask/',
        port: 9000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

    return new Promise((resolve, reject) =>{
        const req = http.request(options, (res) => {
                   
            res.on('data', (d) => {
                resolve(JSON.parse(d));
            });
            req.on('error', (e) => {
                reject(e);
            });
        });
        req.write(postData);
        req.end();
    })
}
        
        
function answerQuestion(uuid,modelId,versionId,languageId,questionId,answer,languageId)
{
    const postData = JSON.stringify({
        'uuid': uuid,
        'modelId':modelId,
        'versionNum':versionId,
        'languageId':languageId,
        'reqNodeId':questionId,
        'answer':answer,
        'languageId':languageId
      });
      
      const options = {
        hostname: 'localhost',
        method: 'POST',
        path: '/apiInterviewCtrl/answer/',
        port: 9000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

    return new Promise((resolve, reject) =>{
        const req = http.request(options, (res) => {
            res.on('data', (d) => {
                resolve(JSON.parse(d));
            });
            req.on('error', (e) => {
                reject(e);
            });
        });
        req.write(postData);
        req.end();
    })
}

//2)todo post request answer question 


//GetModels();
//GetModelLanguages(1);
let uuid = undefined;
let language = "English-Raw";
let modelId ="1";
let versionId = "1";
let questionId = undefined;
let questionAnswer = undefined;

// async function getUserId(){
//     const ans = await startInterview(modelId,versionId,language);
//     return ans;
// }

// async function getQuestionId(uuid,questionId){
//     const ans = await GetLastQuestion(uuid,modelId,versionId,language,questionId);
//     return ans;
// }

async function WORK(){
    let ans = await startInterview(modelId,versionId,language);
    uuid = ans['ssid'];
    questionId = ans['questionId'];
    //let returnedQuestion = questionId;

    let ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'yes',language);
    questionId = ansResult['questionId'];

    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'under 62',language);
    questionId = ansResult['questionId'];


    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'yes',language);
    questionId = ansResult['questionId'];

    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'monthly',language);
    questionId = ansResult['questionId'];

    //return to the secend question
    // ansResult = await answerQuestion(uuid,modelId,versionId,language,returnedQuestion,'yes',language);
    // questionId = ansResult['questionId'];

    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'direct',language);
    questionId = ansResult['questionId'];

    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'full',language);
    questionId = ansResult['questionId'];
    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'11 months or more',language);
    questionId = ansResult['questionId'];
    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'my initiative',language);
    questionId = ansResult['questionId'];
    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'health issues',language);
    questionId = ansResult['questionId'];
    ansResult = await answerQuestion(uuid,modelId,versionId,language,questionId,'accident during my work',language);
    
    //here is the answer 
    var isFinished = ansResult['finished'];
    if(isFinished == 'true'){
        console.log(ansResult);
    }

    
}
WORK();

// getUserId().then((uuidWithFirstQuestionId) => {
//     //here we hgave the usierId of the interview
//     uuid = uuidWithFirstQuestionId[0];
//     questionId = uuidWithFirstQuestionId[1];

//     getQuestionId(uuid,questionId).then((QuestionWithAnswers) => {
//         console.log(QuestionWithAnswers);
//     });

// });
//let uuid = -1;
// startInterview(1,1,"English-Raw").then((uid) => {
//     uuid = uid
// }).catch((messege) => {
//     console.log(messege)
// });
// console.log(uuid)
// for now -1 return the last question
//GetLastQuestion(uuid,1,1,"English-Raw",-1);

