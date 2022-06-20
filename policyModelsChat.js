import {PMAPIHandler} from './connection.js';
import {TextAssets} from './textAssets.js';

class Question {
    constructor(id, question, answers){
        this.id = id
        this.question = question
        this.answers = answers
    }
}

if(document.getElementById('internalCheckUp') != null){
    //test css
    try{
        let css = document.getElementById("style").innerHTML;
    }
    catch(e){
        prompt("Could not find CSS file!");
    }
    //test Text Assets
    try{
        let keys = TextAssets.keys();
    }
    catch(e){
        prompt("Could not find \"textAssets.js\" file!");
    }
    Array.from(TextAssets.keys()).forEach((key) =>
    {
    
        let welcome = TextAssets.get(key).welcome;
        if (welcome  == undefined){
            prompt(`textAssets is missing 'welcome' for ${key}!`);
        }
        let start_interview = TextAssets.get(key).start_interview;
        if (start_interview  == undefined){
            prompt(`textAssets is missing 'start_interview' for ${key}!`);
        }
        let start = TextAssets.get(key).start;
        if (start  == undefined){
            prompt(`textAssets is missing 'start' for ${key}!`);
        }
        let show_transcript = TextAssets.get(key).show_transcript;
        if (show_transcript  == undefined){
            prompt(`textAssets is missing 'show_transcript' for ${key}!`);
        }
        let hide_transcript = TextAssets.get(key).hide_transcript;
        if (hide_transcript  == undefined){
            prompt(`textAssets is missing 'hide_transcript' for ${key}!`);
        }
        let question = TextAssets.get(key).question;
        if (question  == undefined){
            prompt(`textAssets is missing 'question' for ${key}!`);
        }
        let your_answer = TextAssets.get(key).your_answer;
        if (your_answer  == undefined){
            prompt(`textAssets is missing 'your_answer' for ${key}!`);
        }
        let revisit = TextAssets.get(key).revisit;
        if (revisit  == undefined){
            prompt(`textAssets is missing 'revisit' for ${key}!`);
        }
        let show_conclusion = TextAssets.get(key).show_conclusion;
        if (show_conclusion  == undefined){
            prompt(`textAssets is missing 'show_conclusion' for ${key}!`);
        }
        let home = TextAssets.get(key).home;
        if (home  == undefined){
            prompt(`textAssets is missing 'home' for ${key}!`);
        }
        let result = TextAssets.get(key).result;
        if (result  == undefined){
            prompt(`textAssets is missing 'result' for ${key}!`);
        }
        let conclusion_page = TextAssets.get(key).conclusion_page;
        if (conclusion_page  == undefined){
            prompt(`textAssets is missing 'conclusion_page' for ${key}!`);
        }
        let press_conclusions = TextAssets.get(key).press_conclusions;
        if (press_conclusions  == undefined){
            prompt(`textAssets is missing 'press_conclusions' for ${key}!`);
        }
        let download_transcript = TextAssets.get(key).download_transcript;
        if (download_transcript  == undefined){
            prompt(`textAssets is missing 'download_transcript' for ${key}!`);
        }
        let write_feedback = TextAssets.get(key).write_feedback;
        if (write_feedback  == undefined){
            prompt(`textAssets is missing 'write_feedback' for ${key}!`);
        }
        let submit_feedback = TextAssets.get(key).submit_feedback;
        if (submit_feedback  == undefined){
            prompt(`textAssets is missing 'submit_feedback' for ${key}!`);
        }
        let show_tags = TextAssets.get(key).show_tags;
        if (show_tags  == undefined){
            prompt(`textAssets is missing 'show_tags' for ${key}!`);
        }
        let hide_tags = TextAssets.get(key).hide_tags;
        if (hide_tags  == undefined){
            prompt(`textAssets is missing 'hide_tags' for ${key}!`);
        }
        let my_feedback_is = TextAssets.get(key).my_feedback_is;
        if (my_feedback_is  == undefined){
            prompt(`textAssets is missing 'my_feedback_is' for ${key}!`);
        }
        let my_name_is = TextAssets.get(key).my_name_is;
        if (my_name_is  == undefined){
            prompt(`textAssets is missing 'my_name_is' for ${key}!`);
        }
        let download_conclusions = TextAssets.get(key).download_conclusions;
        if (download_conclusions  == undefined){
            prompt(`textAssets is missing 'download_conclusions' for ${key}!`);
        }
        let enter_answer = TextAssets.get(key).enter_answer;
        if (enter_answer  == undefined){
            prompt(`textAssets is missing 'enter_answer' for ${key}!`);
        }
        let write_comment = TextAssets.get(key).write_comment;
        if (write_comment  == undefined){
            prompt(`textAssets is missing 'write_comment' for ${key}!`);
        }
        let hide_comment = TextAssets.get(key).hide_comment;
        if (hide_comment  == undefined){
            prompt(`textAssets is missing 'hide_comment' for ${key}!`);
        }
        let my_comment_is = TextAssets.get(key).my_comment_is;
        if (my_comment_is  == undefined){
            prompt(`textAssets is missing 'my_comment_is' for ${key}!`);
        }
        let rejection = TextAssets.get(key).rejection;
        if (rejection  == undefined){
            prompt(`textAssets is missing 'rejection' for ${key}!`);
        }
        let rejection_advice = TextAssets.get(key).rejection_advice;
        if (rejection_advice  == undefined){
            prompt(`textAssets is missing 'rejection_advice' for ${key}!`);
        }
    })

    //test connection
    try{
        let apiHandler = new PMAPIHandler();
    }
    catch(e){
        prompt(`could not find 'connection.js' file!`);
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



        this.question;
        this.pageIdentifier = 1;
        this.rejectionFlag = 0;


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

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('#mySelect').addEventListener('change', () => {this.changeLanguage();});

        this.welcomePage();

    }

    async changeLanguage(){
        this.language = this.shadowRoot.querySelector('#mySelect').value;
            if(this.pageIdentifier == 1){
                this.apiHandler.changeHandlerLanguage(this.language);
                this.welcomePage();
            }
            else if (this.pageIdentifier == 2){
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
            else if (this.pageIdentifier == 3){
                this.apiHandler.changeHandlerLanguage(this.language);
                this.tags = await this.apiHandler.getTags(this.language);
                this.conclusionPage();
            }
            else if (this.pageIdentifier == 4){
                let changeLanguageData = await this.apiHandler.changeLanguage(this.language);
                let languageAnswers = changeLanguageData[2];
                let newAnswers = new Map();
                this.answers.forEach((value,key) => {
                    if (key < this.question.id) 
                        newAnswers.set(key, [languageAnswers.get(key)[0], languageAnswers.get(key)[1], value[2]]);
                });
                newAnswers.set(this.question.id, [changeLanguageData[0][1], changeLanguageData[0][2][this.answers.get(this.question.id)[2]], this.answers.get(this.question.id)[2]]);
                this.answers = newAnswers;
                this.rejectionPage();
            }
    }

    async welcomePage(){
        this.pageIdentifier = 1;
        let div = `
        <div>
        <p class=welcomeContent>`+ TextAssets.get(this.language).welcome +`</p>
        <h4></h4>
        <div class=\"startInterview\"></div>  
        </div>`;
        
        let model = document.getElementById("modelId").innerHTML;
        let version = document.getElementById("versionId").innerHTML;

        await this.apiHandler.initModel(model, version);
        this.shadowRoot.querySelector('.policy-models-chat').innerHTML = div;
        this.shadowRoot.querySelector('.startInterview').innerHTML = "<button class = \"startInterviewBtn\">" + TextAssets.get(this.language).start_interview + "</button>\n";
        this.shadowRoot.querySelector('.startInterviewBtn').addEventListener('click', () => this.interviewPage());
        
    }

    interviewPage(){
        this.pageIdentifier = 2;
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
    
        if (this.question == undefined){
            this.QuestionSetUp(undefined,undefined,-1);
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

    rejectionPage(){
        this.pageIdentifier = 4;
        let div = `
        <div>
        <p class=rejectionContent>${TextAssets.get(this.language).rejection}</p>
        <p class=rejectionAdvice>${TextAssets.get(this.language).rejection_advice}</p>
        <div class="restartClass">
        <button class = restartBtn> ${TextAssets.get(this.language).home}</button>
        </div>
        <div class = divBtnShowTranscript><button class = btnShowTranscript id="transcript-toggle">${TextAssets.get(this.language).show_transcript}</button></div>
        <div class="transcript"></div>
        <div class="downloadTranscript">
        <button class="btnDownloadTranscript">${TextAssets.get(this.language).download_transcript}</button>
        </div>
        </div>`;
        this.shadowRoot.querySelector('.policy-models-chat').innerHTML = div;

        this.setTranscript("rejection"); 
        if (this.transcriptFlag == true){
            this.shadowRoot.querySelector('.transcript').style.display = 'block';
            this.shadowRoot.querySelector('#transcript-toggle').innerText = TextAssets.get(this.language).hide_transcript;
        }
        this.shadowRoot.querySelector('#transcript-toggle').addEventListener('click', () => this.toggleTranscript());
        this.shadowRoot.querySelector('.btnDownloadTranscript').addEventListener('click', () => this.downloadTranscript(this.answers, 'myTranscript.json'));
        this.shadowRoot.querySelector('.restartBtn').addEventListener('click', () => this.backToWelcomePage());
    }

    /**
     * sets up the transcript
     */
     setTranscript(str = undefined){
        let transcriptSTR = "";
        let num = 0;
        let transcript = this.shadowRoot.querySelector('.transcript');
        if (str == "rejection"){
            this.answers.forEach((value,key) => {num += 1; transcriptSTR += ("<div>" +TextAssets.get(this.language).question+ " "+ (num).toString() +": " + value[0] +"&emsp;|&emsp;" +TextAssets.get(this.language).your_answer+ ": " +
            value[1])});
            transcript.innerHTML = transcriptSTR;
        }
        else{
        this.answers.forEach((value,key) => {num += 1; transcriptSTR += ("<div>" +TextAssets.get(this.language).question+ " "+ (num).toString() +": " + value[0] +"&emsp;|&emsp;" +TextAssets.get(this.language).your_answer+ ": " +
        value[1] + "&emsp;|&emsp;<button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+TextAssets.get(this.language).revisit+"</button></div>")});
        transcript.innerHTML = transcriptSTR;
        this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
        }
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
        this.rejectionFlag = 0;
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
            if (data == -1){
                this.rejectionFlag = 1;
            }
            else if (data[0] != undefined)
                this.question = new Question(data[0][0],data[0][1],data[0][2]);
            else
                this.question = new Question(undefined,"",[""]);
            this.tags = data[1];
        }
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
        if (this.rejectionFlag == 1){
            this.rejectionPage();
        }
        //this.setTranscript(); 
        else{
            this.shadowRoot.querySelector('.tagsDiv').innerHTML = this.parseTags(this.tags, false);
            if(this.shadowRoot.querySelector("#inputID") != null){
                this.shadowRoot.querySelector("#inputID").value = "";
            }
            let chat_text = ``;
            this.answers.forEach((value,key) => {
                let revisit = "<br><button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+TextAssets.get(this.language).revisit+"</button></div>";
                chat_text += `  <div class=ChatDiv>
                                
                                <div class="boxLeft question">                          
                                <br>${value[0]}
                                ${revisit}
                                </div>

                                <div class="boxRight answer">
                                <br>${value[1]}<br>
                                </div>
                                
                                </div>
                                `;
            })
            if(this.question.id == undefined){
                chat_text +=   ` <div class=ChatDiv>
                                
                                <div class=\"boxLeft question\">
                                <br>${TextAssets.get(this.language).press_conclusions}
                                <div class="buttons">
                                <button class = "btnConclusion">${TextAssets.get(this.language).show_conclusion}</button>
                                </div>
                                </div>
                                </div>
                                `;
                this.shadowRoot.querySelector('.chat').innerHTML = chat_text;
                this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
                this.shadowRoot.querySelector('#inputID').style.display = 'none';
                this.shadowRoot.querySelector('.btnConclusion').addEventListener('click', () => this.conclusionPage());
            }
            else{
            let feedbackBtn = `<button class = feedbackBtn id = feedbackBtnID>${TextAssets.get(this.language).write_feedback}</button>`;
            let commentBtn = `<button class = commentBtn id = commentBtnID>${TextAssets.get(this.language).write_comment}</button>`;
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
            }
        }
    }

    conclusionPage(){ 
        this.pageIdentifier = 3;
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
        this.answers.forEach((value, key) => {if(key >= parseInt(questionNum)){this.answers.delete(key)}});
        this.comments.forEach((value,key) => {if(key > parseInt(questionNum)) this.comments.delete(key)});
        this.QuestionSetUp(undefined,questionNum, -1);
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

window.customElements.define('policy-models-chat',PolicyModelsChat); //the name of the tag and the name of the class we want to be connected