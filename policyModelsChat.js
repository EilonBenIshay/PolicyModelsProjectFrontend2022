class Question {
    constructor(id, question, answers){
        this.id = id
        this.question = question
        this.answers = answers
    }
}

const Languages = {
    ENGLISH_RAW: 0,
    HEBREW: 1,
    ARABIC: 2,
    ENGLISH_US: 3
};

class TextAssets {
    constructor(){
        this.welcome = ["Welcome", "ברוכים הבאים", "", "Welcome"];
        this.start_interview = ["Start Interview", "התחל ראיון", "","Start Interview"];
        this.start = ["Start","התחלה","","Start"];
        this.restart = ["Restart","התחל מחדש","","Restart"];
        this.show_transcript = ["Show Transcript","הראה תשובות","","Show Transcript"];
        this.hide_transcript = ["Hide Transcript","הסתר תשובות", "","Hide Transcript"];
        this.question = ["Question", "שאלה","","Question"];
        this.your_answer = ["Your answer","התשובה שלך","","Your answer"];
        this.revisit = ["Revisit this question", "חזור לשאלה זו","","Revisit this question"];
        this.show_conclusion = ["Show Conclusion", "הראה תוצאות", "", "Show Conclusion"];
        this.home = ["Home", "חזרה לעמוד הבית","","Home"];
        this.welcome_PM = ["Welcome to the PolicyModels test site!", "ברוכים הבאים לאתר הזמני של PolicyModels","","Welcome to the PolicyModels test site!"];
        this.results = ["Your results", "התוצאות שלך", "", "your results"];
        this.conclusion_page = ["Conclusion Page", "עמוד התוצאות","","Conclusion Page"];
        this.press_conclusions = ["Press the \"show conclusion\" button to see the conclusion of your interview","לחץ על כפתור \"הראה תוצאות\" על מנת לראות את תוצאות הראיון","","Press the \"show conclusion\" button to see the conclusion of your interview"];
        this.download_transcript = ["Download Transcript", "הורד גיליון תשובות", "", "Download Transcript"];
        this.writeFeedback = ["Write Feedback", "כתוב משוב", "", "Write Feedback"];
        this.submitFeedback = ["Submit Feedback", "שלח משוב", "", "Submit Feedback"];
        this.show_tags = ["Show Current Tags (intermediate result)", "הראה תוצאות ביניים", "", "Show Current Tags (intermediate result)"];
        this.hide_tags = ["Hide Current Tags (intermediate result)", "הראה תוצאות ביניים", "", "Hide Current Tags (intermediate result)"]
    }
}

const jsonData = {"EmployerObligations":["finalAccountSettlement","jobTerminationConfirmation","workPeriodLetter","form161"],"Assertions":{"Gender":"female"}};
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
        this.questionbank = jsonQuestionBankEnglish
    }

    initInterview(language){
        let RawObj = JSON.stringify(this.questionbank[0]);
        return RawObj;
    }

    getNextQuestion(answer, questionID) {
        var retObject
        if (answer == undefined)
            retObject = JSON.stringify(this.questionbank[questionID - 1]); 
        else
            retObject = JSON.stringify(this.questionbank[questionID]);
        return retObject;
    }
}
const template = document.createElement('template');
var nameOfFileCss = document.getElementById("style").innerHTML;

template.innerHTML = `<link rel=\"stylesheet\" href=` + nameOfFileCss + `>
                        <div class=\"policy-models-chat\">
                        <h4>
                        </h4> 
                        </div>`; 
class PolicyModelsChat extends HTMLElement{
    constructor(){
        super();
        var model = document.getElementById("model").innerHTML;
        this.question;
        this.number = 1;
        // answers are represented in a map  [QuestionID]-->[Question| answer text | answer position]
        this.answers = new Map();  
        this.tagsFlag = false; 
        this.apiHandler = new APIMock();
        this.language = Languages.ENGLISH_RAW;
        this.textassets = new TextAssets();  
        //this.question = this.apiHandler.initInterview("English-Raw");
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.welcomePage();
    }
    welcomePage(){
        this.number = 1;
        let div = `
        <div>
        <h3>`+ this.textassets.welcome[this.language] +`</h3>
        <h4></h4>
        <div class=\"startInterview\"></div>  
        </div>`;
        this.shadowRoot.querySelector('.policy-models-chat').innerHTML = div;
        this.shadowRoot.querySelector('.startInterview').innerHTML = "<button class = \"startInterview\">" + this.textassets.start_interview[this.language] + "</button>\n";
        this.shadowRoot.querySelector('.startInterview').addEventListener('click', () => this.interviewPage());
        
    }
    //  <input class type="text" id="fname" name="fname" value = "test"></input><br>
    //</div>
    interviewPage(){
        this.number = 2;
        let div = `
        <div>
            <h3></h3>
        </div>
        <div class = "grid">
            <div class = \"chat\">
            </div>
            <div>
            <div class = divBtnShowTags><button class = btnShowTags id="tags-toggle">`+ this.textassets.show_tags[this.language] +`</button></div>
            <div class = \"tagsDiv\"></div>
            </div>
            <div>
            <input class = "inputClass" type = "text" id = "inputID" placeholder = "Enter your answer here"></input>
            </div>
        </div>
        `;
        this.shadowRoot.querySelector('.policy-models-chat').innerHTML = div;
        this.createElementInput();
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
        this.QuestionSetUp(undefined,undefined,-1);
        this.shadowRoot.querySelector('#tags-toggle').addEventListener('click', () => this.toggleTags());
        this.shadowRoot.querySelector('.tagsDiv').innerHTML = this.parseTags(jsonData, false);
        if (this.tagsFlag == true){
            this.shadowRoot.querySelector('.tagsDiv').style.display = 'block';
            this.shadowRoot.querySelector('#tags-toggle').innerText = this.textassets.hide_tags[this.language];
        }

    }
    
    createElementInput(){
        // var x = document.createElement("INPUT");
        // x.setAttribute("type", "text");
        // x.setAttribute("id", "inputID");
        // x.setAttribute("class", "inputClass");
        // x.setAttribute("placeholder", "Enter your answer here");
        // document.body.appendChild(x);
        this.shadowRoot.querySelector("#inputID").addEventListener("keydown", (e) => {if (e.keyCode == 13) {this.getAnswer()}});
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
        this.QuestionSetUp(inputAnswer, `\n${this.question.answers[inputAnswer]}\n`);
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
     FetchQuestion(answerNum, answer, overwriteid = undefined){ 
        let jsonQuestion;
        if (answer != undefined && this.question.id != undefined){
            this.answers.set(this.question.id, [this.question, answer, answerNum]);
        }
        if(overwriteid == -1){
            jsonQuestion = this.apiHandler.initInterview(this.language);
        }
        else if(overwriteid != undefined){
            jsonQuestion = this.apiHandler.getNextQuestion(answerNum, overwriteid);
        }
        else{
            jsonQuestion = this.apiHandler.getNextQuestion(answerNum, this.question.id);
        }
        let obj = JSON.parse(jsonQuestion);
        this.question = new Question(obj.questionID,obj.question,Array.from(obj.answers));
    }

    /**
     * sets up the transcript
     */
    // setTranscript(){
    //     let transcriptSTR = "";
    //     let transcript = this.shadowRoot.querySelector('.transcript');
    //     this.answers.forEach((value,key) => {transcriptSTR += ("<div>" +this.textassets.question[this.language]+ " "+ key.toString() +": " + value[0].question +"&emsp;|&emsp;" +this.textassets.your_answer[this.language]+ ": " +
    //     value[1] + "&emsp;|&emsp;<button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+this.textassets.revisit[this.language]+"</button></div>")});
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
     QuestionSetUp(answerNum, answer, overwriteid = undefined){
        this.FetchQuestion(answerNum, answer, overwriteid);
        //this.setTranscript(); 
        this.shadowRoot.querySelector("#inputID").value = "";
        let chat_text = ``;
        this.answers.forEach((value,key) => {
            let revisit = "<br><button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+this.textassets.revisit[this.language]+"</button></div>";
            chat_text += `  <div class=ChatDiv>
                            
                            <div class=\"boxRight question\">                            
                            <br>${value[0].question}
                            ${revisit}
                            </div>

                            <div class=\"boxLeft answer\">
                            <br>${value[1]}<br>
                            </div>
                            
                            </div>
                            `;
        });
        let answers_text = "";
        for (let i = 0; i < this.question.answers.length; i++){
            answers_text += `<br>(${i}) - ${this.question.answers[i]}`;
        }
        chat_text += `  <div class=ChatDiv>
                            
                        <div class=\"boxRight question\">
                        <br>${this.question.question}
                        <div class="buttons">
                        </div>
                        </div>
                        </div>
                        `;
        this.shadowRoot.querySelector('.chat').innerHTML = chat_text; 
        this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
        this.buttonSetUp();
        // this.shadowRoot.querySelector('.feedbackDiv').innerHTML = 
        // `<button class = feedbackBtn id = feedbackBtnID>`+this.textassets.writeFeedback[this.language]+`</button>`;
        // this.shadowRoot.querySelector('.feedbackBtn').addEventListener('click', () => this.toggleFeedback());
        // this.feedbackFlag = false;
        if(this.question.id == -1){
            // this.shadowRoot.querySelector('.buttons').innerHTML = 
            //     "<h4>"+this.textassets.press_conclusions[this.language]+"</h4>";

            this.conclusion();
        }
        else{
           // prompt ("stuff");
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
            this.shadowRoot.querySelector(btnIDs[j]).addEventListener('click', () => this.QuestionSetUp(j, this.question.answers[j]));
        }
    }

     /**
     * Concludes the interview
     */
      getConclusions(){
        let answersStr = "";
        this.answers.forEach((value, key) => answersStr += (value[1] + ","));
        answersStr ="[" + answersStr + "]";
        return answersStr;
    }

    /**
     * toggles the transcript button
     */
    // toggleTranscript(){
    //     let info = this.shadowRoot.querySelector('.transcript');
    //     let btn = this.shadowRoot.querySelector('#transcript-toggle');
    //     this.transcriptFlag = !this.transcriptFlag;
    //     if(this.transcriptFlag){
    //         info.style.display = 'block';
    //         btn.innerText = this.textassets.hide_transcript[this.language];
    //     }
    //     else{
    //         info.style.display = 'none';
    //         btn.innerText = this.textassets.show_transcript[this.language];
    //     }
    // }

    /**
     * returns to a specific question
     * @param
     * questionNum -> question to return to
     */
    ReturnToQuestion(questionNum){
        //TODO remove this condition with the full API implementation
        if(questionNum > 10 || questionNum < 1){
            return;
        }
        this.answers.forEach((value, key) => {if(key >= questionNum) this.answers.delete(key)});
        this.QuestionSetUp(undefined, undefined, questionNum);
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
    //         btn.innerText = this.textassets.hide_transcript[this.language];
    //     }
    //     else{
    //         info.style.display = 'none';
    //         btn.innerText = this.textassets.show_transcript[this.language];
    //     }
    // }

    toggleTags(){
        let info = this.shadowRoot.querySelector('.tagsDiv');
        let btn = this.shadowRoot.querySelector('#tags-toggle');
        this.tagsFlag = !this.tagsFlag;
        if(this.tagsFlag){
            info.style.display = 'block';
            btn.innerText = this.textassets.hide_tags[this.language];
        }
        else{
            info.style.display = 'none';
            btn.innerText = this.textassets.show_tags[this.language];
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