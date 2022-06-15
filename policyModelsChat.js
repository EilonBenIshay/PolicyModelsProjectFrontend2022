import {PMAPIHandler} from './connection.js';
import {TextAssets} from './textAssets.js';

class Question {
    constructor(id, question, answers){
        this.id = id
        this.question = question
        this.answers = answers
    }
}

const jsonData ={"Recommendations":["checkElderlyAllowance"],"Duties":["employeePriorNotice"],"EmployerObligations":["honorFormerContractorSeniority","finalAccountSettlement","pensionFundNotice","jobTerminationConfirmation","workPeriodLetter","form161"],"Notices":["severancePayMethod_Monthly","priorNoticePeriod_Varied"],"Benefits":{"Pension":"allowance","Properties":["possiblePersonalAccidentsInsurance"]},"Assertions":{"Employment":{"Type":"contractor","Scope":"full","SalaryUnits":"monthly","Duration":"_6_11"},"AgeGroup":"voluntaryPension","LegalStatus":"israeliCitizenship","Gender":"female"}};
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
    "questionID": -1,
    "question": "",
    "answers": []
}];

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
        console.log("hi");
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
                        <div class=\"policy-models-chat\">
                        </div>
                      `; 
                        
class PolicyModelsChat extends HTMLElement{
    constructor(){
        super();
        var model = document.getElementById("model").innerHTML;
        this.question;
        this.pageIdentifyer = 1;

        // answers are represented in a map  [QuestionID]-->[Question| answer text | answer position]
        this.answers = new Map();  
        
        //comments are stored in the form of [QuestionID => Comment]
        this.comments = new Map();

        this.tagsFlag = false; 
        this.feedbackFlag = false;
        this.commentFlag = false;
        this.tags;
        this.apiHandler = new PMAPIHandler();
        this.language = TextAssets.keys().next().value;

        //this.question = this.apiHandler.initInterview("English-Raw");
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('#mySelect').addEventListener('change', () => {this.changeLanguage();});

        this.welcomePage();

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

    async welcomePage(){
        this.pageIdentifyer = 1;
        let div = `
        <div>
        <p class=welcomeContent>`+ TextAssets.get(this.language).welcome +`</p>
        <h4></h4>
        <div class=\"startInterview\"></div>  
        </div>`;
        
        let model = document.getElementById("model").innerHTML;
        let version = document.getElementById("version").innerHTML;

        await this.apiHandler.initModel(model, version);
        this.shadowRoot.querySelector('.policy-models-chat').innerHTML = div;
        this.shadowRoot.querySelector('.startInterview').innerHTML = "<button class = \"startInterviewBtn\">" + TextAssets.get(this.language).start_interview + "</button>\n";
        this.shadowRoot.querySelector('.startInterviewBtn').addEventListener('click', () => this.interviewPage());
        
    }
    //  <input class type="text" id="fname" name="fname" value = "test"></input><br>
    //</div>
    interviewPage(){
        this.pageIdentifyer = 2;
        let div = `
        <div>
            <h3></h3>
        </div>
        <div class = "grid">
            <div class = \"chat\">
            </div>
            <div>
                <div class="restartClass"></div>
                <div class = divBtnShowTags><button class = btnShowTags id="tags-toggle">`+ TextAssets.get(this.language).show_tags +`</button></div>
                <div class = \"tagsDiv\"></div>
                <div class = \"downloadTranscript\"></div>
            </div>
            <div>
                <input class = "inputClass" type = "text" id = "inputID" placeholder = "`+TextAssets.get(this.language).enter_answer+`"></input>
                <div class="conclusion"></div>
            </div>
        </div>
        `;
        this.shadowRoot.querySelector('.policy-models-chat').innerHTML = div;
        this.checkElementInput();
        // this.shadowRoot.querySelector('.changeLanguageClass').innerHTML =
        // "<script type=\"text/javascript\"> changeLanguage();</script>" ;
        // let answers_text = ``;
        // for (let i = 0; i < this.question.answers.length; i++){
        //     answers_text += `<br>${i} - ${this.question.answers[i]}`;
        // }
        // this.shadowRoot.querySelector('.chat').innerHTML = `<div class=ChatDiv>

        //                                                     <div class=\"boxRight question\">
        //                                                     <br>${this.question.question}
        //                                                     ${answers_text}
        //                                                     </div>
                                                            
        //                                                     </div>`
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
        this.question = undefined;  
        this.tagsFlag = false;
        this.tags = undefined;
        this.welcomePage();
    }

    checkElementInput(){
        if(document.getElementById("inputID") == null){
            this.shadowRoot.querySelector("#inputID").addEventListener("keydown", (e) => {if (e.keyCode == 13) {this.getAnswer()}});
        }
        else{
            var e = document.getElementById("inputID");
            e.parentNode.removeChild(e);
            this.shadowRoot.querySelector("#inputID").addEventListener("keydown", (e) => {if (e.keyCode == 13) {this.getAnswer()}});
        }
    }


    getAnswer(){
    var inputAnswer = parseInt(this.shadowRoot.querySelector("#inputID").value);
    let valid = 0;
    for (let i = 0; i < this.question.answers.length; i++){
       if(inputAnswer == i){
            valid = 1;
       }
    }
    if(valid){
        this.QuestionSetUp(this.question.answers[inputAnswer], undefined, inputAnswer);
    }
    else{
        prompt("Oops! Your answer must be a number between 0 and "+ (this.question.answers.length-1));
        this.shadowRoot.querySelector("#inputID").value = "";
    }
    
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
    // setTranscript(){
    //     let transcriptSTR = "";
    //     let transcript = this.shadowRoot.querySelector('.transcript');
    //     this.answers.forEach((value,key) => {transcriptSTR += ("<div>" +TextAssets.get(this.language).question+ " "+ key.toString() +": " + value[0].question +"&emsp;|&emsp;" +TextAssets.get(this.language).your_answer+ ": " +
    //     value[1] + "&emsp;|&emsp;<button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+TextAssets.get(this.language).revisit+"</button></div>")});
    //     transcript.innerHTML = transcriptSTR;
    //     this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
    // }

    /**
     * Sets up the current Question.
     *  @param
     * answer -> the answer's text
     * overwriteid -> if defined, will fetch a specific question. otherwise if undefined will fetch the next question
     * answerNum -> position of the answer in the answer array
     */
     async QuestionSetUp(answer, overwriteid, answerNum){ 
        await this.FetchQuestion(answer,overwriteid, answerNum);
        //this.setTranscript(); 
        this.shadowRoot.querySelector('.tagsDiv').innerHTML = this.parseTags(this.tags, false);
        if(this.shadowRoot.querySelector("#inputID") != null){
            this.shadowRoot.querySelector("#inputID").value = "";
        }
        let chat_text = ``;
        this.answers.forEach((value,key) => {
            let revisit = "<br><button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+TextAssets.get(this.language).revisit+"</button></div>";
            chat_text += `  <div class=ChatDiv>
                            
                            <div class=\"boxLeft question\">                          
                            <br>${value[0]}
                            ${revisit}
                            </div>

                            <div class=\"boxRight answer\">
                            <br>${value[1]}<br>
                            </div>
                            
                            </div>
                            `;
        });
        let answers_text = "";
        let feedbackBtn = `<button class = feedbackBtn id = feedbackBtnID>`+TextAssets.get(this.language).write_feedback+`</button>`;
        let commentBtn = `<button class = commentBtn id = commentBtnID>`+TextAssets.get(this.language).write_comment+`</button>`;
        for (let i = 0; i < this.question.answers.length; i++){
            answers_text += `<br>(${i}) - ${this.question.answers[i]}`;
        }
        chat_text += `  <div class=ChatDiv>
                            
                        <div class=\"boxLeft question\">
                        <div class=feedback>${feedbackBtn}</div>
                        <div class=comment>${commentBtn}</div>
                        <br>${this.question.question}
                        <div class="buttons">
                        </div>
                        </div>
                        </div>
                        `;
        this.shadowRoot.querySelector('.chat').innerHTML = chat_text; 
        this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
        this.buttonSetUp();
        this.shadowRoot.querySelector('.feedbackBtn').addEventListener('click', () => this.toggleFeedback());
        this.feedbackFlag = false;
        this.shadowRoot.querySelector('.commentBtn').addEventListener('click', () => this.toggleComment());
        this.commentFlag = false;
        if(this.question.id == undefined){
            this.shadowRoot.querySelector('.chat').innerHTML = 
                "<p class=transitionToConclusionPageContent>"+TextAssets.get(this.language).press_conclusions+"</p>";
            this.conclusion();
        }
    }

    /**
     * Loads up the conclusion page when press on conclusion btn.
     */
     conclusion(){
        this.shadowRoot.querySelector('#inputID').style.display = 'none';
        this.shadowRoot.querySelector('.conclusion').innerHTML = "<button class = \"btnConclusion\">" + TextAssets.get(this.language).show_conclusion + "</button>\n";
        this.shadowRoot.querySelector('.conclusion').addEventListener('click', () => this.conclusionPage());
    }

    conclusionPage(){ 
        this.pageIdentifyer = 3;
        let div = `
        <div>
        <p class="conclusionContent">`+TextAssets.get(this.language).conclusion_page+`<p>  
        <div class = \"conclusions\"></div>
        <br>
        <div class="downloadConclusions">
        </div>
        <div class=backToHome><button class=\"backToWelcomePage\">`+TextAssets.get(this.language).home+`</button></div>
        </div>`;
        this.shadowRoot.querySelector('.policy-models-chat').innerHTML = div;
        //the conclusion
        let conclusions = this.parseTags(this.tags, false);
        this.shadowRoot.querySelector('.conclusions').innerHTML = conclusions;
        this.shadowRoot.querySelector('.backToWelcomePage').addEventListener('click', () => this.backToWelcomePage());
        this.shadowRoot.querySelector('.downloadConclusions').innerHTML = "<button class=\"btnDownloadConclusions\">" + TextAssets.get(this.language).download_conclusions + "</button>";
        this.shadowRoot.querySelector('.btnDownloadConclusions').addEventListener('click', () => this.downloadConclusions(this.tags, 'conclusions.json'));
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

    getConclusions(){
        let answersStr = "";
        this.answers.forEach((value, key) => answersStr += (value[1] + ","));
        answersStr ="[" + answersStr + "]";
        return answersStr;
    }

    
    createInputFeedback(){
        if((this.shadowRoot.querySelector('#inputFeedbackID') == null) && (this.shadowRoot.querySelector('#inputFeedbacNameID') == null)){ //AND OR OR TODO
            this.shadowRoot.querySelector('.feedback').innerHTML = 
            `<input type="text" id="inputFeedbacNameID" placeholder="`+TextAssets.get(this.language).my_name_is+`"><br>
            <textarea rows="4" cols="40" id="inputFeedbackID" placeholder="`+TextAssets.get(this.language).my_feedback_is+`"></textarea><br><br>
            <button class = feedbackSubmitBtn>`+TextAssets.get(this.language).submit_feedback+`</button>`;
        }
        else{
            var e = this.shadowRoot.querySelector('#inputFeedbackID');
            e.parentNode.removeChild(e);
            var name = this.shadowRoot.querySelector('#inputFeedbacNameID');
            name.parentNode.removeChild(name);
            this.shadowRoot.querySelector('.feedback').innerHTML = 
            `<input type="text" id="inputFeedbacNameID" placeholder="`+TextAssets.get(this.language).my_name_is+`"><br>
            <textarea rows="4" cols="40" id="inputFeedbackID" placeholder="`+TextAssets.get(this.language).my_feedback_is+`"></textarea><br><br>
            <button class = feedbackSubmitBtn>`+TextAssets.get(this.language).submit_feedback+`</button>`;
        }
        
    }

    feedbackSubmit(){
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var x = this.shadowRoot.querySelector('#inputFeedbackID');
        var strFeedback = String(x.value);
        var name = this.shadowRoot.querySelector('#inputFeedbacNameID');
        var strName = String(name.value);
        if((!specialChars.test(strFeedback)) && (!specialChars.test(strName))){
            this.apiHandler.sendFeedback(strName, strFeedback);
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

    createInputComment(){
        if(this.shadowRoot.querySelector('#inputCommentID') == null){
            if (this.comments.has(this.question.id)){
            this.shadowRoot.querySelector('.comment').innerHTML = 
            `<textarea rows="4" cols="40" id="inputCommentID" placeholder="${TextAssets.get(this.language).my_comment_is}" >${this.comments.get(this.question.id)}</textarea><br>
            <button class = commentSubmitBtn>`+TextAssets.get(this.language).hide_comment+`</button>`;
            }
            else{
                this.shadowRoot.querySelector('.comment').innerHTML = 
                `<textarea rows="4" cols="40" id="inputCommentID" placeholder="`+TextAssets.get(this.language).my_comment_is+`"></textarea><br>
                <button class = commentSubmitBtn>`+TextAssets.get(this.language).hide_comment+`</button>`;  
            }
        }
        else{
            var e = this.shadowRoot.querySelector('#inputCommentID');
            e.parentNode.removeChild(e);
            if (this.comments.has(this.question.id)){
                this.shadowRoot.querySelector('.comment').innerHTML = 
                `<textarea rows="4" cols="40" id="inputCommentID" placeholder="${TextAssets.get(this.language).my_comment_is}" >${this.comments.get(this.question.id)}</textarea><br>
                <button class = commentSubmitBtn>`+TextAssets.get(this.language).hide_comment+`</button>`;
            }
            else{
                this.shadowRoot.querySelector('.comment').innerHTML = 
                `<textarea rows="4" cols="40" id="inputCommentID" placeholder="`+TextAssets.get(this.language).my_comment_is+`"></textarea><br>
                <button class = commentSubmitBtn>`+TextAssets.get(this.language).hide_comment+`</button>`;  
            }
        }
        this.shadowRoot.querySelector("#inputCommentID").addEventListener('keyup', () => this.updateComment())
        
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
        this.feedbackFlag = !this.feedbackFlag;
        if(this.feedbackFlag){
            this.createInputFeedback();
            this.shadowRoot.querySelector('.feedbackSubmitBtn').addEventListener('click', () => this.toggleFeedback());
        }
        else{
            this.feedbackSubmit();
            this.shadowRoot.querySelector('.feedback').innerHTML = 
            `<button class = feedbackBtn id = feedbackBtnID>`+TextAssets.get(this.language).write_feedback+`</button>`;
            this.shadowRoot.querySelector('.feedbackBtn').addEventListener('click', () => this.toggleFeedback());
        }
    }

    toggleComment(){ 
        this.commentFlag = !this.commentFlag;
        if(this.commentFlag){
            this.createInputComment();
            this.shadowRoot.querySelector('.commentSubmitBtn').addEventListener('click', () => this.toggleComment());
        }
        else{
            this.hideComment();
            this.shadowRoot.querySelector('.comment').innerHTML = 
            `<button class = commentBtn id = commentBtnID>`+TextAssets.get(this.language).write_comment+`</button>`;
            this.shadowRoot.querySelector('.commentBtn').addEventListener('click', () => this.toggleComment());
        }
    }

    
    buttonSetUp(){
        let btnIDs = [];
        let btnSTR = ""; 
        for (let i = 0; i< this.question.answers.length; i++){
            btnSTR += "<button class = \"btn\" id =\"a" + i.toString() + "\">(" + i.toString()+ ") - " + this.question.answers[i] + "</button><br>\n";
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
        this.answers.forEach((value, key) => {if(key >= questionNum) this.answers.delete(key)});
        this.comments.forEach((value,key) => {if(key > questionNum) this.comments.delete(key)})
        this.QuestionSetUp(undefined,questionNum, -1);
    }

    // /**
    //  * toggles the transcript button
    //  */
    // toggleTranscript(){
    //     let info = this.shadowRoot.querySelector('.transcript');
    //     let btn = this.shadowRoot.querySelector('#transcript-toggle');
    //     this.transcriptFlag = !this.transcriptFlag;
    //     if(this.transcriptFlag){
    //         info.style.display = 'block';
    //         btn.innerText = TextAssets.get(this.language).hide_transcript;
    //     }
    //     else{
    //         info.style.display = 'none';
    //         btn.innerText = TextAssets.get(this.language).show_transcript;
    //     }
    // }

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

window.customElements.define('policy-models-chat',PolicyModelsChat); //the name of the tag and the name of the class we want to be connected