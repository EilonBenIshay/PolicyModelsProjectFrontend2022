//import * as http from 'http';
const http = require("http");
class PMAPIHandler {
    constructor(){
        this.userId;
        this.questionId;
        this.questionText;
        this.answers;
        this.answerHistory;
        this.languages;
        this.activeLangauge;
        this.models;
        this.versionId;
        this.models;
        this.tags;
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
        this.questionId = ans['questionId'];
        this.questionText = ans['questionText'];
        this.activeLangauge = language
        return true;
    }

    async getNextQuestion(questionId, answer){
        const ans = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLangauge,questionId,answer);
        this.tags = ans['tags'];
        this.answerHistory = ans['answerHistory']
        if(ans['finished'] == 'true'){
            this.questionId = undefined;
            return ans['tags'];
        }
        this.questionId = ans['questionId'];
        this.questionText = ans['questionText'];
        const returnValue = [ans['questionId'], ans['questionText'], ans['Answers']];
        return returnValue;
    }

    async Work(){
        await this.init();
        await this.initModel("3","1");
        await this.initInterview("English-Raw");
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'multiple');
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'Cancer');
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'yes');
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'yes');
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'yes');
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'somewhat');
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'no');
        console.log(this.questionText);
        await this.getNextQuestion(this.questionId,'no');
        console.log(this.questionText);
        var shady = await this.getNextQuestion(this.questionId,'yes');
        //console.log(this.questionText);
        //res
        console.log(this.tags);
        console.log("********************************************/n/n/n**************");
        console.log(this.answerHistory);

        
       
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
         


let APIhandler = new PMAPIHandler();
APIhandler.Work();
// async function TestInit(){
//     return await APIhandler.getModels();
//     return ans;
// }
// TestInit();
// test("Returns about-us for english language", () => {
//     expect(TestInit()).toBe(0);
// });