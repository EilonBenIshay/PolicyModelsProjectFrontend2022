//'use strict'
import {PMAPIHandler} from './connection.js';
import {TextAssets} from './textAssets.js';

class Question {
    constructor(id, question, answers){
        this.id = id
        this.question = question
        this.answers = answers
    }
}

/**
 * temp question bank
 */
 const jsonData = {"Recommendations":["checkElderlyAllowance"],"Duties":["employeePriorNotice"],"EmployerObligations":["honorFormerContractorSeniority","finalAccountSettlement","pensionFundNotice","jobTerminationConfirmation","workPeriodLetter","form161"],"Notices":["severancePayMethod_Monthly","priorNoticePeriod_Varied"],"Benefits":{"Pension":"allowance","Properties":["possiblePersonalAccidentsInsurance"]},"Assertions":{"Employment":{"Type":"contractor","Scope":"full","SalaryUnits":"monthly","Duration":"_6_11"},"AgeGroup":"voluntaryPension","LegalStatus":"israeliCitizenship","Gender":"female"}};
 //answer order - are you a woman? - yes || How old are you? - 62 to 67 || Are you an Israeli citizen? - yes.
 const jsonQuestionBankEnglish = [{
     "questionID": 1,
     "question": "Are you a woman?",
     "answers": ["yes", "no"]
 },
 {
     "questionID": 2,
     "question": "How old are you?",
     "answers": ["under 62", "62 to 67", "67 and over"]
 },
 {
     "questionID": 3,
     "question": "Are you an Israeli citizen?",
     "answers": ["yes", "no"]
 },
 {
     "questionID": 4,
     "question": "How was your salary calculated?",
     "answers": ["monthly", "daily", "hourly"]
 },
 {
     "questionID": 5,
     "question": "How has your day been?",
     "answers":  ["Best day of my life", "Great", "Ok", "Bad", "Straight up agony"]
 },
 {
     "questionID": 6,
     "question": "What is your favorite animal",
     "answers": ["Dog", "Cat", "Mouse", "Frog", "Hedgehog", "Bee", "Wolf", "Other"]
 },
 {
     "questionID": 7,
     "question": "Who is the best?",
     "answers": ["Shady", "Shelly", "Eilon", "Tbh none of them"]
 },
 {
     "questionID": 8,
     "question": "Are you an israeli citizan",
     "answers": ["Yes", "No"]
 },
 {
     "questionID": 9,
     "question": "Who is the best friend?",
     "answers": ["Ross", "Chandler", "Monica", "Rachel", "Pheobe", "Joey"]
 },
 {
     "questionID": 10,
     "question": "HIMYM or Seinfeld?",
     "answers": ["HIMYM", "Seinfeld", "F.r.i.e.n.d.s", "other"]
 },
 {
     "questionID": undefined,
     "question": "",
     "answers": []
 }];

//const jsonQuestionBankArabic = [];
//const jsonQuestionBankHebrew = [];
//const jsonQuestionBankRussian = [];


/**
 * a class that portrays the API calls. later will be changed to include them
 */
class APIMock {
    constructor(){
        this.language = 'English-Raw'
        this.questionId;
        this.questionbank = jsonQuestionBankEnglish
        this.answers = new Map();
    }

    initModel(modelId, versionId){
        return;
    }

    initInterview(language){
        this.answers = new Map();
        this.questionId = this.questionbank[0]['questionID'];
        let retObject = [[this.questionbank[0]['questionID'],this.questionbank[0]['question'],this.questionbank[0]['answers']], jsonData];
        return retObject;
    }

    getNextQuestion(answer, questionId) {
        this.answers.set(questionId, [this.questionbank[questionId]['question'], answer]);
        // if (answer == -1)
        //     retObject = JSON.stringify(this.questionbank[questionID - 1]); 
        // if (questionId == undefined)
        //     retObject = JSON.stringify(this.questionbank[0]);
        // else
        //console.log(this.questionbank[questionId]);
        this.questionId = this.questionbank[questionId]['questionID'];
        let retObject = [[this.questionbank[questionId]['questionID'],this.questionbank[questionId]['question'],this.questionbank[questionId]['answers']], jsonData];
        return retObject;
    }

    returnToQuestion(questionId){
        this.answers.forEach((value, key) => {if(key >= questionId) this.answers.delete(key)});
        let retObject = [[this.questionbank[questionId-1]['questionID'],this.questionbank[questionId-1]['question'],this.questionbank[questionId-1]['answers']], jsonData, this.answers];
        return retObject;
    }

    changeLanguage(language){
        let retObject = [[this.questionbank[this.questionId]['questionID'],this.questionbank[this.questionId]['question'],this.questionbank[this.questionId]['answers']], jsonData, this.answers];
        return retObject
    }

    changeHandlerLanguage(language){
        this.language = language;
    }

    getTags(language){
        return jsonData;
    }

    sendFeedback(name, feedback){
        console.log(name);
        console.log(feedback);
    }
}
 


const template = document.createElement('template');
var nameOfFileCss = document.getElementById("style").innerHTML;

let languagesSelect = Array.from(TextAssets.keys());
let selectOption = ``
for(let i = 0; i < languagesSelect.length; i++){
    let language = languagesSelect[i];
    selectOption += `<option value = ${language}>${language}</option>
                    `;
}

template.innerHTML = `<link rel=\"stylesheet\" href=` + nameOfFileCss + `>
                        <select name="languageSelect" id="mySelect">
                        ${selectOption}
                        </select>
                        <div class=\"policy-models-default\">
                        </div>
                      `; 


class PolicyModelsDefault extends HTMLElement{
    constructor(){
        super();
        this.pageIdentifyer = 1;
        this.transcriptFlag = false;
        this.feedbackFlag = false;
        this.commentFlag = false;
        this.tagsFlag = false;
        this.question;
        this.tags;
        this.buttons;
        // answers arre represented in a map  [QuestionID]-->[question text | answer text | answer position]
        this.answers = new Map(); 

        //comments are stored in the form of [QuestionID => Comment]
        this.comments = new Map();  


        this.apiHandler = new PMAPIHandler();
        
        //base language will always be the language in index '0' at textAssets.languages.
        this.language = TextAssets.keys().next().value;

        // this.question = new Question(undefined,TextAssets.get(this.language).welcome_PM, [TextAssets.get(this.language).start]);
        // this.buttons = ['#a0'];

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.welcomePage();
        


        //  NEW (delete the btn and the script)
        this.shadowRoot.querySelector('#mySelect').addEventListener('change', () => {this.changeLanguage();});
        

    }
    async changeLanguage(){
        this.language = this.shadowRoot.querySelector('#mySelect').value;
            if(this.pageIdentifyer == 1){
                this.apiHandler.changeHandlerLanguage(this.language);
                this.welcomePage();
            }
            else if (this.pageIdentifyer == 2){
                let changeLanguageData = await this.apiHandler.changeLanguage(this.language);
                let languageAnswers = changeLanguageData[2];
                let newAnswers = new Map();
                this.question = new Question(changeLanguageData[0][0],changeLanguageData[0][1],changeLanguageData[0][2]);
                this.answers.forEach((value,key) => { 
                    newAnswers.set(key, [languageAnswers.get(key)[0], languageAnswers.get(key)[1], value[2]]);
                });
                this.answers = newAnswers;
                this.interviewPage();
            }
            else if (this.pageIdentifyer == 3){
                this.apiHandler.changeHandlerLanguage(this.language);
                this.tags = await this.apiHandler.getTags(this.language);
                this.conclusionPage();
            }
    }
    /** 
     * a function called to load the welcome page
    */
    async welcomePage(){
        this.pageIdentifyer = 1;
        let div = `
        <div>
        <p class=welcomeContent>`+ TextAssets.get(this.language).welcome +`</p>
        <h4></h4>
        <div class=\"startInterview\"></div>
        </div>`;

        let model = document.getElementById("modelId").innerHTML;
        let version = document.getElementById("versionId").innerHTML;

        await this.apiHandler.initModel(model, version);
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        this.shadowRoot.querySelector('.startInterview').innerHTML = "<button class = \"startInterview\">" + TextAssets.get(this.language).start_interview + "</button>\n";
        this.shadowRoot.querySelector('.startInterview').addEventListener('click', () => this.interviewPage());
        
    }

    /**
     * a function called to load the interview page
     */
    interviewPage(){
        this.pageIdentifyer = 2;
        let div = `
        <div class = "grid">
            <div class = "defaultInterview">
                <div>
                    <div class="restartClass"></div>
                    <p class=namePolicyModels></p>
                    <p class=questions></p>
                </div>
                <div class="buttons"></div>
                <div class="feedbackDiv" id="feedbackDivID"></div>
                <div class="feedbackInputDiv"></div>
                <div class="commentDiv" id="commentDivID"></div>
                <div class="commentInputDiv"></div>
                <div class = divBtnShowTranscript><button class = btnShowTranscript id="transcript-toggle">`+ TextAssets.get(this.language).show_transcript +`</button></div>
                <div class="transcript"></div>
                <div class="conclusion"></div>
                <div class="downloadTranscript"></div>
            </div>
            <div class = "tags">
                <div class = divBtnShowTags><button class = btnShowTags id="tags-toggle">`+ TextAssets.get(this.language).show_tags +`</button></div>
                <div class = \"tagsDiv\"></div>
            </div>
        </div>
        `;


        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        
        this.shadowRoot.querySelector('#transcript-toggle').addEventListener('click', () => this.toggleTranscript());
        //this.transcriptFlag = false;
        //this.question = new Question(0,TextAssets.get(this.language).welcome_PM, [TextAssets.get(this.language).start]);
        //this.buttons = ['#a0'];
        this.shadowRoot.querySelector('.namePolicyModels').innerText = this.getAttribute('name');
        //this.shadowRoot.querySelector('h4').innerText = this.question.question;
        if (this.question == undefined){
            this.QuestionSetUp(undefined,undefined,-1);
            // this.shadowRoot.querySelector('.buttons').innerHTML = "<button class = \"btnStart\" id =\"a0\">" + TextAssets.get(this.language).start + "</button>\n";
            // this.shadowRoot.querySelector('#a0').addEventListener('click', () => this.QuestionSetUp(""));
            }
        else{
            this.QuestionSetUp(undefined,this.question.id);
        }
        
        this.shadowRoot.querySelector('.restartClass').innerHTML = "<button class = \"restartBtn\">" + TextAssets.get(this.language).home + "</button>\n";
        this.shadowRoot.querySelector('.restartBtn').addEventListener('click', () => this.backToWelcomePage());
        this.shadowRoot.querySelector('#tags-toggle').addEventListener('click', () => this.toggleTags());
        this.shadowRoot.querySelector('.tagsDiv').innerHTML = this.parseTags(this.tags, false);
        if (this.tagsFlag == true){
            this.shadowRoot.querySelector('.tagsDiv').style.display = 'block';
            this.shadowRoot.querySelector('#tags-toggle').innerText = TextAssets.get(this.language).hide_tags;
        }
        if (this.transcriptFlag == true){
            this.shadowRoot.querySelector('.transcript').style.display = 'block';
            this.shadowRoot.querySelector('#transcript-toggle').innerText = TextAssets.get(this.language).hide_transcript;
        }
                
        this.shadowRoot.querySelector('.downloadTranscript').innerHTML = "<button class=\"btnDownloadTranscript\">" + TextAssets.get(this.language).download_transcript + "</button>";
        this.shadowRoot.querySelector('.btnDownloadTranscript').addEventListener('click', () => this.downloadTranscript(this.answers, 'myTranscript.json'));
    }

    downloadTranscript(objToJson, name) {
        const obj = Object.fromEntries(objToJson);
        const text = JSON.stringify(obj);
        const a = document.createElement('a');
        const type = name.split(".").pop();
        a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
        a.download = name;
        a.click();
    }

    backToWelcomePage(){
        this.answers = new Map();   
        this.transcriptFlag = false;
        this.question = undefined;
        this.tagsFlag = false;
        this.tags = undefined;
        this.welcomePage();
    }
      
      
    /**
     * a function called to load the conclusion page
     */
    conclusionPage(){ //TODO add text assets
        this.pageIdentifyer = 3;
        let div = `
        <div>
        <p class=conclusionContent>`+TextAssets.get(this.language).conclusion_page+`</p>  
        <div class = \"conclusions\"></div>
        <br>
        <div class="downloadConclusions"> 
        </div>
        <div class=backToHome><button class=\"backToWelcomePage\">`+TextAssets.get(this.language).home+`</button></div>
        </div>`;
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        //the conclusion
        let conclusions = this.getConclusions();
        this.shadowRoot.querySelector('.conclusions').innerHTML = conclusions;
        this.shadowRoot.querySelector('.backToWelcomePage').addEventListener('click', () => this.backToWelcomePage());
        this.shadowRoot.querySelector('.downloadConclusions').innerHTML = "<button class=\"btnDownloadConclusions\">" + TextAssets.get(this.language).download_conclusions + "</button>";
        this.shadowRoot.querySelector('.btnDownloadConclusions').addEventListener('click', () => this.downloadConclusions(this.apiHandler.getTags(TextAssets.keys().next().value), 'conclusions.json'));
    }

    downloadConclusions(obj, name) {
        // const obj = Object.fromEntries(objToJson);
        const text = JSON.stringify(obj);
        const a = document.createElement('a');
        const type = name.split(".").pop();
        a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
        a.download = name;
        a.click();
    }
    /**
     * Loads up the conclusion page when press on conclusion btn.
     */
    conclusion(){
        this.shadowRoot.querySelector('.feedbackBtn').style.display = 'none';
        this.shadowRoot.querySelector('.commentBtn').style.display = 'none';
        if(this.shadowRoot.querySelector('#inputID')  != null){
            var e = this.shadowRoot.querySelector('#inputID') ;
            e.parentNode.removeChild(e);
        }
        if(this.shadowRoot.querySelector('#inputNameID')  != null){
            var e = this.shadowRoot.querySelector('#inputNameID') ;
            e.parentNode.removeChild(e);
        }
        this.shadowRoot.querySelector('.conclusion').innerHTML = "<button class = \"btnConclusion\">" + TextAssets.get(this.language).show_conclusion + "</button>\n";
        this.shadowRoot.querySelector('.conclusion').addEventListener('click', () => this.conclusionPage());
    }

    /**
     * Loads up the next question in the interview.
     * @param
     * answer -> the answer's text
     * overwriteid -> if defined, will fetch a specific question. otherwise if undefined will fetch the next question
     * answerNum -> position of the answer in the answer array
     */
    async FetchQuestion(answer, overwriteid, answerNum){ 
        if (answer != undefined && this.question.id >= 0){
            this.answers.set(this.question.id, [this.question.question, answer, answerNum]);
        }
        if (this.question == undefined){
            let data = await this.apiHandler.initInterview(this.language);
            this.question = new Question(data[0][0],data[0][1],data[0][2]);
            this.tags = data[1];
        }
        else if(overwriteid != undefined){
            let data = await this.apiHandler.returnToQuestion(overwriteid);
            this.question = new Question(data[0][0],data[0][1],data[0][2]);
            this.tags = data[1];
        }
        else{
            let data = await this.apiHandler.getNextQuestion(answerNum,this.question.id);
            if (data[0] != undefined)
                this.question = new Question(data[0][0],data[0][1],data[0][2]);
            else
                this.question = new Question(undefined,"",[""]);
            this.tags = data[1];
        }
    }
    

    /**
     * sets up the transcript
     */
    setTranscript(){
        let transcriptSTR = "";
        let transcript = this.shadowRoot.querySelector('.transcript');
        this.answers.forEach((value,key) => {transcriptSTR += ("<div>" +TextAssets.get(this.language).question+ " "+ key.toString() +": " + value[0] +"&emsp;|&emsp;" +TextAssets.get(this.language).your_answer+ ": " +
        value[1] + "&emsp;|&emsp;<button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+TextAssets.get(this.language).revisit+"</button></div>")});
        transcript.innerHTML = transcriptSTR;
        this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
    }

    /**
     * Sets up the current Question.
     *  @param
     * answer -> the answer's text
     * overwriteid -> if defined, will fetch a specific question. otherwise if undefined will fetch the next question
     * answerNum -> position of the answer in the answer array
     */
    async QuestionSetUp(answer, overwriteid, answerNum){ 
        await this.FetchQuestion(answer,overwriteid, answerNum);
        this.setTranscript(); 
        this.shadowRoot.querySelector('.tagsDiv').innerHTML = this.parseTags(this.tags, false);
        this.shadowRoot.querySelector('.questions').innerText = this.question.question; 
        this.shadowRoot.querySelector('.feedbackInputDiv').innerHTML = '';
        this.shadowRoot.querySelector('.feedbackDiv').innerHTML = 
        `<button class = feedbackBtn id = feedbackBtnID>`+TextAssets.get(this.language).write_feedback+`</button>`;
        this.shadowRoot.querySelector('.feedbackBtn').addEventListener('click', () => this.toggleFeedback());
        this.feedbackFlag = false;
        this.shadowRoot.querySelector('.commentDiv').innerHTML = 
        `<button class = commentBtn id = commentBtnID>`+ TextAssets.get(this.language).write_comment +`</button>`;
        this.shadowRoot.querySelector('.commentBtn').addEventListener('click', () => this.toggleComment());
        this.commentFlag = false;
        if(this.question.id == undefined){
            this.shadowRoot.querySelector('.buttons').innerHTML = 
                "<p class=transitionToConclusionPageContent>"+TextAssets.get(this.language).press_conclusions+"</p>";

            this.conclusion();
        }
        else{
            this.buttonSetUp();
            var e = this.shadowRoot.querySelector('#inputID') ; //NEW
            if (e != null){
                e.parentNode.removeChild(e);
            }
            var name = this.shadowRoot.querySelector('#inputNameID') ; //NEW
            if (name != null){
                name.parentNode.removeChild(name);
            }
            var c = this.shadowRoot.querySelector('#inputCommentID') ; //NEW
            if (c != null){
                c.parentNode.removeChild(c);
            }
        }
    }


    createInputFeedback(){
        if((this.shadowRoot.querySelector('#inputID') == null) && (this.shadowRoot.querySelector('#inputNameID') == null)){
            this.createElementInput();
        }
        else{
            var e = this.shadowRoot.querySelector('#inputID');
            e.parentNode.removeChild(e);
            var name = this.shadowRoot.querySelector('#inputNameID');
            name.parentNode.removeChild(name);
            this.createElementInput();
        }
    }

    createInputComment(){
        if(this.shadowRoot.querySelector('#inputCommentID') == null){
            this.createElementCommentInput();
        }
        else{
            var e = this.shadowRoot.querySelector('#inputCommentID');
            e.parentNode.removeChild(e);
            this.createElementCommentInput();
        }
        
    }
    createElementCommentInput(){
        if (this.comments.has(this.question.id)){
            this.shadowRoot.querySelector('.commentInputDiv').innerHTML = 
            `<textarea rows="4" cols="40" id="inputCommentID" placeholder="${TextAssets.get(this.language).my_comment_is}" >${this.comments.get(this.question.id)}</textarea>`;
            this.shadowRoot.querySelector("#inputCommentID").addEventListener('keyup', () => this.updateComment())
        }
        else{
            this.shadowRoot.querySelector('.commentInputDiv').innerHTML = 
            `<textarea rows="4" cols="40" id="inputCommentID" placeholder="`+TextAssets.get(this.language).my_comment_is+`"></textarea>`;}
            this.shadowRoot.querySelector("#inputCommentID").addEventListener('keyup', () => this.updateComment())
    }

    createElementInput(){
        this.shadowRoot.querySelector('.feedbackInputDiv').innerHTML = 
        `<input type="text" id="inputNameID" placeholder="`+TextAssets.get(this.language).my_name_is+`">
        <br><textarea rows="4" cols="40" id="inputID" placeholder="`+TextAssets.get(this.language).my_feedback_is+`"></textarea>`;
    }

    feedbackSubmit(){
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var x = this.shadowRoot.querySelector('#inputID');
        var strFeedback = String(x.value);
        var name = this.shadowRoot.querySelector('#inputNameID');
        var strName = String(name.value);
        if((!specialChars.test(strFeedback)) && (!specialChars.test(strName))){
            this.apiHandler.sendFeedback(name, strFeedback);
        }
        else{
            if(specialChars.test(strFeedback)){
                prompt("Error : Your feedback contains special characters like : `!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?~ ")
            } else if(specialChars.test(strName)){
                prompt("Error: Your name contains special characters like : `!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?~ ")
            }
        }
        x.parentNode.removeChild(x);
        name.parentNode.removeChild(name);
    }

    hideComment(){
        var x = this.shadowRoot.querySelector('#inputCommentID');
        x.parentNode.removeChild(x);
    }

    updateComment(){
        let comment = this.shadowRoot.querySelector("#inputCommentID").value;
        this.comments.set(this.question.id, comment);
    }

    /**
     * toggles the feedback button
     */
    toggleFeedback(){ 
        let btn = this.shadowRoot.querySelector('#feedbackDivID');
        this.feedbackFlag = !this.feedbackFlag;
        if(this.feedbackFlag){
            this.createInputFeedback();
            this.shadowRoot.querySelector('.feedbackDiv').innerHTML = `
            <button class = feedbackSubmitBtn>`+TextAssets.get(this.language).submit_feedback+`</button>`;
            this.shadowRoot.querySelector('.feedbackSubmitBtn').addEventListener('click', () => this.toggleFeedback());
        }
        else{
            this.feedbackSubmit();
            this.shadowRoot.querySelector('.feedbackDiv').innerHTML = 
            `<button class = feedbackBtn id = feedbackBtnID>`+TextAssets.get(this.language).write_feedback+`</button>`;
            this.shadowRoot.querySelector('.feedbackBtn').addEventListener('click', () => this.toggleFeedback());
            this.shadowRoot.querySelector('.feedbackInputDiv').innerHTML = '';
        }
    }

    toggleComment(){ 
        this.commentFlag = !this.commentFlag;
        if(this.commentFlag){
            this.createInputComment();
            this.shadowRoot.querySelector('.commentDiv').innerHTML = `
            <button class = commentSubmitBtn>`+TextAssets.get(this.language).hide_comment+`</button>`;
            this.shadowRoot.querySelector('.commentSubmitBtn').addEventListener('click', () => this.toggleComment());
        }
        else{
            this.hideComment();
            this.shadowRoot.querySelector('.commentDiv').innerHTML = 
            `<button class = commentBtn id = commentBtnID>`+TextAssets.get(this.language).write_comment+`</button>`;
            this.shadowRoot.querySelector('.commentBtn').addEventListener('click', () => this.toggleComment());
        }
    }

    /**
     * sets up the buttons for the current question.
     * button IDs are "#a" + the answers number
     */
    buttonSetUp(){
        let btnIDs = [];
        let btnSTR = ""; 
        for (let i = 0; i< this.question.answers.length; i++){
            btnSTR += "<button class = \"btn\" id =\"a" + i.toString() + "\">" + this.question.answers[i] + "</button>\n";
            btnIDs[i] = '#a' + i.toString();
        } 
        this.shadowRoot.querySelector('.buttons').innerHTML = btnSTR;
        for (let j = 0; j< this.question.answers.length; j++){
            this.shadowRoot.querySelector(btnIDs[j]).addEventListener('click', () => this.QuestionSetUp(this.question.answers[j],undefined,j));
        }
    }

    /**
     * Concludes the interview
     */
    getConclusions(){
        return this.parseTags(this.tags, false);
    }

    /**
     * returns to a specific question
     * @param
     * questionNum -> question to return to
     */
    ReturnToQuestion(questionNum){
        //TODO remove this condition with the full API implementation
        // if(questionNum > 10 || questionNum < 1){
        //     return;
        // }
        this.answers.forEach((value, key) => {if(key >= questionNum) this.answers.delete(key)});
        this.comments.forEach((value,key) => {if(key > questionNum) this.comments.delete(key)})
        this.QuestionSetUp(undefined,questionNum, -1);
    }

    /**
     * toggles the transcript button
     */
    toggleTranscript(){
        let info = this.shadowRoot.querySelector('.transcript');
        let btn = this.shadowRoot.querySelector('#transcript-toggle');
        this.transcriptFlag = !this.transcriptFlag;
        if(this.transcriptFlag){
            info.style.display = 'block';
            btn.innerText = TextAssets.get(this.language).hide_transcript;
        }
        else{
            info.style.display = 'none';
            btn.innerText = TextAssets.get(this.language).show_transcript;
        }
    }

    toggleTags(){
        let info = this.shadowRoot.querySelector('.tagsDiv');
        let btn = this.shadowRoot.querySelector('#tags-toggle');
        this.tagsFlag = !this.tagsFlag;
        if(this.tagsFlag){
            info.style.display = 'block';
            btn.innerText = TextAssets.get(this.language).hide_tags;
        }
        else{
            info.style.display = 'none';
            btn.innerText = TextAssets.get(this.language).show_tags;
        }
    }

    parseTags(data, isSub){
        var html = (isSub)?'<div>':''; // Wrap with div if true
        html += '<ul>';
        for(var item in data){
            html += '<li>';
            if(typeof(data[item]) === 'object'){ // An array will return 'object'
                html += item; // Submenu found, but top level list item.
                html += this.parseTags(data[item], true); // Submenu found. Calling recursively same method (and wrapping it in a div)
            } else {
                if(isNaN(item)){
                  html += item; 
                  html += `: `; 
                }
                html += data[item]; // No submenu
            }
            html += '</li>';
        }
        html += '</ul>';
        html += (isSub)?'</div>':'';
        return html;
    } 
}

window.customElements.define('policy-models-default',PolicyModelsDefault); //the name of the tag and the name of the class we want to be connected