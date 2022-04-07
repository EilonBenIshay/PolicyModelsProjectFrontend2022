//'use strict'

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
        this.press_conclusions = ["Press the \"show conclusion\" button to see the conclusion of your interview","לחץ על כפתור \"הראה תוצאות\" על מנת לראות את תוצאות הראיון","","Press the \"show conclusion\" button to see the conclusion of your interview"]
    }
}

/**
 * temp question bank
 */
const jsonQuestionBankEnglish = [{
	"questionID": 1,
	"question": "Are you a woman?",
	"answers": ["Yes", "No"]
},
{
	"questionID": 2,
	"question": "How old are you?",
	"answers": ["1-14","15-18","19-65","66+"]
},
{
	"questionID": 3,
	"question": "How did your employment end?",
	"answers": ["Resignation", "Lawful Termination", "Unlawful Termination", "Death"]
},
{
	"questionID": 4,
	"question": "What is your favorite chip?",
	"answers": ["Pringles", "Lays", "Walkers", "Tapuchips", "Other"]
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

//const jsonQuestionBankArabic = [];
//const jsonQuestionBankHebrew = [];
//const jsonQuestionBankRussian = [];


/**
 * a class that portrays the API calls. later will be changed to include them
 */
class APIMock {
    constructor(){
        this.questionbank = jsonQuestionBankEnglish
    }

    getNextQuestion(questionID, answer) {
        var retObject
        if (answer == -1)
            retObject = JSON.stringify(this.questionbank[questionID - 1]); 
        else
            retObject = JSON.stringify(this.questionbank[questionID]);
        return retObject;
    }
}

class APIHandler{
    userId;
    modelId;
    versionNum;
    nodeId;

    answers;

    constructor(){
    }

    sendAPIRequest (type){
    }
}
 


const template = document.createElement('template');
var nameOfFileCss = document.getElementById("style").innerHTML;

template.innerHTML = `<div class=\"changeLanguageClass\">
                      </div>
                      <link rel=\"stylesheet\" href=` + nameOfFileCss + `>
                      <div class=\"policy-models-default\">
                      </div>
                      `; 

function changeLanguage() {
    var x = document.createElement("SELECT");
    x.setAttribute("id", "mySelect");
    document.body.appendChild(x);
                      
    var z = document.createElement("option");
    z.setAttribute("value", "ENGLISH_RAW");
    var t = document.createTextNode("ENGLISH_RAW");
    z.appendChild(t);
    document.getElementById("mySelect").appendChild(z);

    var z2 = document.createElement("option");
    z2.setAttribute("value", "HEBREW");
    var t2 = document.createTextNode("HEBREW");
    z2.appendChild(t2);
    document.getElementById("mySelect").appendChild(z2);

    var z3 = document.createElement("option");
    z3.setAttribute("value", "ARABIC");
    var t3 = document.createTextNode("ARABIC");
    z3.appendChild(t3);
    document.getElementById("mySelect").appendChild(z3);

    var z4 = document.createElement("option");
    z4.setAttribute("value", "ENGLISH_US");
    var t4 = document.createTextNode("ENGLISH_US");
    z4.appendChild(t4);
    document.getElementById("mySelect").appendChild(z4);

}

class PolicyModelsDefault extends HTMLElement{
    constructor(){
        super();
        this.number = 1;
        this.showInfo = true;
        this.transcriptFlag = false;
        this.question;
        this.buttons;
        // answers arre represented in a map  [QuestionID]-->[question text | answer text | answer position]
        this.answers = new Map();   
        this.apiHandler = new APIMock();
        this.language = Languages.ENGLISH_RAW;
        this.textassets = new TextAssets();  

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // this.shadowRoot.querySelector('.changeLanguageClass').innerHTML =
        // "<script type=\"text/javascript\"> changeLanguage();</script>" ;
        changeLanguage(); //NEW
        this.welcomePage();
        


        //  NEW (delete the btn and the script)
        document.getElementById('mySelect').addEventListener('change', () => {
            var selectElement = document.getElementById('mySelect').value;
            switch (selectElement) { //FIX
                case "ENGLISH_RAW":
                    this.language = Languages.ENGLISH_RAW;
                    break;
                case "HEBREW":
                    this.language = Languages.HEBREW;
                    break;
                case "ARABIC":
                    this.language = Languages.ARABIC;
                    break;
                case "ENGLISH_US":
                    this.language = Languages.ENGLISH_US;
                    break;
            }
            //this.welcomePage(); //FIX
            //location.reload(true);
            if(this.number == 1)
                this.welcomePage();
            else if (this.number == 2)
                this.interviewPage();
            else if (this.number == 3)
                this.conclusionPage();
        });
        

    }
    /** 
     * a function called to load the welcome page
    */
    welcomePage(){
        this.number = 1;
        let div = `
        <div>
        <h3>`+ this.textassets.welcome[this.language] +`</h3>
        <h4></h4>
        <div class=\"startInterview\"></div>

        </div>`;
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        this.shadowRoot.querySelector('.startInterview').innerHTML = "<button class = \"startInterview\">" + this.textassets.start_interview[this.language] + "</button>\n";
        this.shadowRoot.querySelector('.startInterview').addEventListener('click', () => this.interviewPage());
        
    }

    /**
     * a function called to load the interview page
     */
    interviewPage(){
        this.number = 2;
        let div = `
        <div>
        <h3></h3>
        <h4></h4>
        <p id="demo"> </p>
        </div>
        <div class="buttons">
        </div>
        <div class = divBtnShowTranscript><button class = btnShowTranscript id="transcript-toggle">`+ this.textassets.show_transcript[this.language] +`</button></div>
        <div class="transcript"></div>
        <div class="conclusion">
        </div>
        `;
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        
        this.shadowRoot.querySelector('#transcript-toggle').addEventListener('click', () => this.toggleTranscript());
        this.showInfo = true;
        this.transcriptFlag = false;
        this.question = new Question(0,this.textassets.welcome_PM[this.language], [this.textassets.start[this.language]]);
        this.buttons = ['#a0'];

        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
        this.shadowRoot.querySelector('h4').innerText = this.question.question;
        this.shadowRoot.querySelector('.buttons').innerHTML = "<button class = \"btnStart\" id =\"a0\">" + this.question.answers[0] + "</button>\n";
        this.shadowRoot.querySelector('#a0').addEventListener('click', () => this.QuestionSetUp(""));
        
        
              

    }

    /**
     * a function called to load the conclusion page
     */
    conclusionPage(){ //TODO add text assets
        this.number = 3;
        let div = `
        <div>
        <h3>`+this.textassets.conclusion_page[this.language]+`</h3>  
        <h4>`+this.textassets.results[this.language]+`:</h4>
        <p class = \"conclusions\"></p>
        <button class=\"backToWelcomePage\">`+this.textassets.home[this.language]+`</button>
        </div>`;
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        //the conclusion
        let conclusions = this.getConclusions()
        this.shadowRoot.querySelector('.conclusions').innerText = conclusions;
        this.shadowRoot.querySelector('.backToWelcomePage').addEventListener('click', () => this.welcomePage());
    }

    /**
     * Loads up the conclusion page when press on conclusion btn.
     */
    conclusion(){
        this.shadowRoot.querySelector('.conclusion').innerHTML = "<button class = \"btnConclusion\">" + this.textassets.show_conclusion[this.language] + "</button>\n";
        this.shadowRoot.querySelector('.conclusion').addEventListener('click', () => this.conclusionPage());
    }

    /**
     * Loads up the next question in the interview.
     * @param
     * answer -> the answer's text
     * overwriteid -> if defined, will fetch a specific question. otherwise if undefined will fetch the next question
     * answerNum -> position of the answer in the answer array
     */
    FetchQuestion(answer, overwriteid, answerNum){
        let jsonQuestion;
        if (answer != undefined && this.question.id > 0)
            this.answers.set(this.question.id, [this.question.question, answer, answerNum]);
        if(overwriteid != undefined)
            jsonQuestion = this.apiHandler.getNextQuestion(overwriteid, answerNum);
        else
            jsonQuestion = this.apiHandler.getNextQuestion(this.question.id);
        let obj = JSON.parse(jsonQuestion);
        this.question = new Question(obj.questionID,obj.question,Array.from(obj.answers));
    }
    

    /**
     * sets up the transcript
     */
    setTranscript(){
        let transcriptSTR = "";
        let transcript = this.shadowRoot.querySelector('.transcript');
        this.answers.forEach((value,key) => {transcriptSTR += ("<div>" +this.textassets.question[this.language]+ " "+ key.toString() +": " + value[0] +"&emsp;|&emsp;" +this.textassets.your_answer[this.language]+ ": " +
        value[1] + "&emsp;|&emsp;<button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">"+this.textassets.revisit[this.language]+"</button></div>")});
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
    QuestionSetUp(answer, overwriteid, answerNum){ 
        this.FetchQuestion(answer,overwriteid, answerNum);
        this.setTranscript(); 
        this.shadowRoot.querySelector('h4').innerText = this.question.question; 
        if(this.question.id == -1){
            this.shadowRoot.querySelector('.buttons').innerHTML = 
                "<h4>"+this.textassets.press_conclusions[this.language]+"</h4>";
            this.conclusion();
        }
        else
            this.ButtonSetUp();
    }


    /**
     * sets up the buttons for the current question.
     * button IDs are "#a" + the answers number
     */
    ButtonSetUp(){
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
        let answersStr = "";
        this.answers.forEach((value, key) => answersStr += (value[1] + ","));
        answersStr ="[" + answersStr + "]";
        return answersStr;
    }

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
            btn.innerText = this.textassets.hide_transcript[this.language];
        }
        else{
            info.style.display = 'none';
            btn.innerText = this.textassets.show_transcript[this.language];
        }
    }

    /*
    httpGet()
    {
        // prompt("before1");
        // var XMLHttpRequest = require('xhr2');
        // var xmlHttp = new XMLHttpRequest();
        // const Url = 'http://localhost:9000/api/1/models/testInterviewConnection';
        // xmlHttp.open( "GET", Url, false ); // false for synchronous request
        // xmlHttp.send( null );
        // return xmlHttp.responseText;
        var theUrl = 'http://localhost:9000/api/1/models/testInterviewConnection';
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
        prompt("xmlHttp.responseText is"+xmlHttp.responseText);
    }*/

}

window.customElements.define('policy-models-default',PolicyModelsDefault); //the name of the tag and the name of the class we want to be connected