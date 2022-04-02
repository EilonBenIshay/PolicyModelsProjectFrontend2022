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
        'versionId':versionId,
        'languageId':languageId,
        'questionId':questionId
      });
      
      const options = {
        hostname: 'http://localhost',
        method: 'POST',
        path: '/apiInterviewCtrl/ask/',
        port: 9000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

    return new Promise((resolve, reject) =>{
        http.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
        
            res.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        
            }).on('error', (e) => {
                reject(e);
            });
    })
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
let language = "English-Raw";
let modelId = 1;
let versionId = 1;
let questionId = undefined;
let questionAnswer = undefined;

async function getUserId(){
    const ans = await startInterview(modelId,versionId,language);
    return ans;
}

async function getQuestionId(uuid,questionId){
    const ans = await GetLastQuestion(uuid,modelId,versionId,language,questionId);
    return ans;
}

getUserId().then((uuidWithFirstQuestionId) => {
    //here we hgave the usierId of the interview
    uuid = uuidWithFirstQuestionId[0];
    questionId = uuidWithFirstQuestionId[1];

    getQuestionId(uuid,questionId).then((QuestionWithAnswers) => {
        console.log(QuestionWithAnswers);
    });

});
//let uuid = -1;
// startInterview(1,1,"English-Raw").then((uid) => {
//     uuid = uid
// }).catch((messege) => {
//     console.log(messege)
// });
// console.log(uuid)
// for now -1 return the last question
//GetLastQuestion(uuid,1,1,"English-Raw",-1);

