const http = require('http');

class PMAPIHandler {
    constructor(){
        this.userId;
        this.questionId;
        this.answers;
        this.languages;
        this.activeLangauge;
        this.models;
        this.versionId;
        this.models
    }

    async init(){
        const ans = await this.getModels();
        this.models = ans;
    }

    async initModel(modelId, versionId){
        this.modelId = modelId;
        this.versionId = versionId;
        const ans = await this.getModelLanguages(modelId);
        this.languages = ans;
        return this.languages
    }
    
    async initInterview(language){
        const ans = await this.startInterview(this.modelId,this.versionId,language);
        this.userId = ans['ssid'];
        this.question = ans['questionId'];
        this.activeLangauge = language
        return true;
    }

    async getNextQuestion(questionId, answer){
        const ans = await answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,questionId,answer);
        return [ans['questionId'], ans['questionText'], ans['Answers']]
    }

    async Work(){
        await this.init();
        await this.initModel("1","1");
        await this.initInterview("English-Raw");
        //let returnedQuestion = questionId;
    
        let ansResult = //await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'yes');
        this.question = ansResult['questionId'];
    
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'under 62');
        this.question = ansResult['questionId'];
    
    
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'yes');
        this.question = ansResult['questionId'];
    
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'monthly');
        this.question = ansResult['questionId'];
    
        //return to the secend question
        // ansResult = await answerQuestion(uuid,modelId,versionId,language,returnedQuestion,'yes',language);
        // questionId = ansResult['questionId'];
    
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'direct');
        this.question = ansResult['questionId'];
    
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'full');
        this.question = ansResult['questionId'];
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'11 months or more');
        this.question = ansResult['questionId'];
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'my initiative');
        this.question = ansResult['questionId'];
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'health issues');
        this.question = ansResult['questionId'];
        ansResult = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,this.question,'accident during my work');
        
        //here is the answer 
        var isFinished = ansResult['finished'];
        if(isFinished == 'true'){
            console.log(ansResult);
        }
    
        
    }


    getModels()
    {
        let url = `http://localhost:9000/apiInterviewCtrl/models/`
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

    getModelLanguages(modelId)
    {
        let url = `http://localhost:9000/apiInterviewCtrl/${modelId}/start`
        return new Promise((resolve, reject) =>{
            http.get(url, (res) => {
                res.on('data', (d) => {
                    resolve(JSON.parse(d));
                });
            
                }).on('error', (e) => {
                    reject(e);
                });
        })
    }

    startInterview(modelId,versionId,languageId)
    {
        let url = `http://localhost:9000/apiInterviewCtrl/${modelId}/${versionId}/${languageId}/start`
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

    getLastQuestion(uuid,modelId,versionId,languageId,questionId)
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
    answerQuestion(uuid,modelId,versionId,languageId,questionId,answer)
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
}        
            
    

//2)todo post request answer question 


//GetModels();
//GetModelLanguages(1);
// let uuid = undefined;
// let language = "English-Raw";
// let modelId ="1";
// let versionId = "1";
// let questionId = undefined;
// let questionAnswer = undefined;

// async function getUserId(){
//     const ans = await startInterview(modelId,versionId,language);
//     return ans;
// }

// async function getQuestionId(uuid,questionId){
//     const ans = await GetLastQuestion(uuid,modelId,versionId,language,questionId);
//     return ans;
// }
let APIhandler = new PMAPIHandler();
APIhandler.Work();

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

