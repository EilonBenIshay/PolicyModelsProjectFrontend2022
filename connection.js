//import * as http from 'http';
//const http = require('http');
export class PMAPIHandler {
    constructor(){
        this.serverDomain = `https://policymodelsserver.azurewebsites.net`
        this.userId;
        this.questionId;
        this.questionText;
        this.answers;
        this.languages;
        this.activeLanguage;
        this.modelId;
        this.versionId;
        this.models
    }

    /**
     * 
     * @returns 
     * 
     * json array of objects
     * 
     * [{id,title,versionid},{id,title,versionid}...]
     * 
     */
    async getModels() {
        let response = await fetch(`${this.serverDomain}/apiInterviewCtrl/models/`);
        let data = await response.json();
        //this.models = data;
        return data;
    }

    /**
     * 
     * @returns
     * 
     * Json array
     * 
     * [language 1, language 2]
     *  
     */

    async getModelLanguages(modelId) {
        let response = await fetch(`${this.serverDomain}/apiInterviewCtrl/${modelId}/start/`);
        let data = await response.json();
        //this.languages = data;
        return data;
    }

    /**
     * 
     * @returns
     * 
     * json object
     * 
     * {userid, questionId, questionText, Answers[answer1, answer2], AnswersInYourLanguage[answer1, answer2], finished, tags}
     *  
     */

    async startInterview(modelId,versionId,languageId)
    {
        let response = await fetch(`${this.serverDomain}/apiInterviewCtrl/${modelId}/${versionId}/${languageId}/start/`);
        let data = await response.json();
        return data;
    }

    async initInterview(language){
        const ans = await this.startInterview(this.modelId,this.versionId,language);
        this.userId = ans['ssid'];
        this.questionId = ans['questionId'];
        this.activeLanguage = language;
        let returnValue =  [[ans['questionId'], ans['questionText'], ans['AnswersInYourLanguage']],ans['tagsInYourLanguage']];
        return returnValue; 
    }

    /**
     * 
     * @returns
     * 
     * {userid, questionId, questionText, Answers[answer1, answer2], AnswersInYourLanguage[answer1, answer2], finished, tags}
     *  
     */

    async answerQuestion(uuid,modelId,versionId,languageId,questionId,answer)
    {
        try{
            let response = await fetch(`${this.serverDomain}/apiInterviewCtrl/answer/${uuid}/${modelId}/${versionId}/${languageId}/${questionId}/${answer}/`);
            let data = await response.json();
            return data;
        }
        catch(e){
            return "rejection";
        }
    }

    async getNextQuestion(answer, questionId = this.questionId){
        const ans = await this.answerQuestion(this.userId,this.modelId,this.versionId,this.activeLanguage,questionId,answer);
        if(ans == "rejection"){
            return -1;
        }
        if(ans['finished'] == 'true'){
            this.questionId = undefined;
            return [[undefined, "", [""]], ans['tagsInYourLanguage']];
        }
        this.questionId = ans['questionId'];
        const returnValue = [[ans['questionId'], ans['questionText'], ans['AnswersInYourLanguage']],ans['tagsInYourLanguage']];
        return returnValue;
    }

    /**
     * 
     * @returns 
     * 
     * json object
     * 
     * {questionId, questionText, Answers[answer1, answer2], AnswersInYourLanguage[answer1, answer2],answersHistory[{id, questionText, answer}], finished, tags}
     * 
     */

    async askHistory(uuid,modelId,versionId,languageId,questionId)
    {
        let response = await fetch(`${this.serverDomain}/apiInterviewCtrl/askHistory/${uuid}/${modelId}/${versionId}/${languageId}/${questionId}/`);
        let data = await response.json();
        return data;
    }
    async returnToQuestion(questionId){
        this.questionId = questionId;
        const ans = await this.askHistory(this.userId,this.modelId,this.versionId,this.activeLanguage,questionId);
        var history = new Map();
        for (var item in ans['answersHistory']){
            history.set(ans['answerHistory'][item]['id'], [ans['answerHistory'][item]['questionText'], ans['answerHistory'][item]['answer']]);
        }
        const returnValue = [[ans['questionId'], ans['questionText'], ans['AnswersInYourLanguage']],ans['tagsInYourLanguage'], history];
        return returnValue;
    }
    async changeLanguage(language){
        this.activeLanguage = language;
        const ans = await this.askHistory(this.userId,this.modelId,this.versionId,language,this.questionId);
        let history = new Map();
        for (var item in ans['answerHistory']){
            history.set(ans['answerHistory'][item]['id'], [ans['answerHistory'][item]['questionText'], ans['answerHistory'][item]['answer']]);
        }
        const returnValue = [[ans['questionId'], ans['questionText'], ans['AnswersInYourLanguage']],ans['tagsInYourLanguage'], history];
        return returnValue;
    }

    async getTags(language){
        console.log(language);
        let response = await fetch(`${this.serverDomain}/apiInterviewCtrl/getTags/${this.userId}/${this.modelId}/${this.versionId}/${language}/`);
        let data = await response.json();
        return data;
    }

    async feedbackHandle(userId, modelId, versionId, language, questionId, name, feedback){
        await fetch(`${this.serverDomain}/apiInterviewCtrl/feedback/${userId}/${modelId}/${versionId}/${language}/${questionId}/${name}/${feedback}/`);
    }

    async sendFeedback(name, feedback){
        await this.feedbackHandle(this.userId, this.modelId, this.versionId, this.activeLanguage, this.questionId, name, feedback);
    }

    changeHandlerLanguage(language){
        this.activeLanguage = language;
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
}