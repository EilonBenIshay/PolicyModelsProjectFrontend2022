//'use strict'
class Question {
    constructor(id, question, answers){
        this.id = id
        this.question = question
        this.answers = answers
    }
}

const jsonQuestionBank = [{
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

class APIMock {
    constructor (){
        this.questionbank = jsonQuestionBank
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
 


const template = document.createElement('template');
var nameOfFileCss = document.getElementById("style").innerHTML;
// if (typeof(document.getElementById("style").innerHTML) != 'undefined' && (document.getElementById("style").innerHTML) != null)
// {
//     nameOfFileCss = document.getElementById("style").innerHTML;
// }
template.innerHTML = "<link rel=\"stylesheet\" href=" + nameOfFileCss + "><div class=\"policy-models-default\"></div>"; 

class PolicyModelsDefault extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.welcomePage();
        

        //NEW
        if(this.getAttribute('h3_color')){
            this.shadowRoot.querySelector('h3').style.color = this.getAttribute('h3_color');
        }
        

    }

    welcomePage(){
        let div = `
        <div>
        <h3>Welcome</h3>
        <h4></h4>
        <div class=\"startInterview\"></div>
        </div>`;
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        this.shadowRoot.querySelector('.startInterview').innerHTML = "<button class = \"startInterview\">" + "START AN INTERVIEW" + "</button>\n";
        this.shadowRoot.querySelector('.startInterview').addEventListener('click', () => this.interviewPage());
    }
    interviewPage(){
        let div = `
        <div>
        <h3></h3>
        <h4></h4>
        <p id="demo"> </p>
        </div>
        <div class="buttons">
        </div>
        <div class = divBtnShowTranscript><button class = btnShowTranscript id="transcript-toggle">show transcript</button></div>
        <div class="transcript"></div>
        <div class="conclusion">
        </div>
        `;
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        
        this.shadowRoot.querySelector('#transcript-toggle').addEventListener('click', () => this.toggleTranscript());
        this.showInfo = true;
        this.transcriptFlag = false;
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
        this.question = new Question(0,"Welcome to the PolicyModels test site!", ["Start"]);
        this.shadowRoot.querySelector('h4').innerText = this.question.question;
        this.shadowRoot.querySelector('.buttons').innerHTML = "<button class = \"btnStart\" id =\"a0\">" + this.question.answers[0] + "</button>\n";
        this.buttons = ['#a0'];
        this.shadowRoot.querySelector('#a0').addEventListener('click', () => this.QuestionSetUp(""));
        this.APIMock = new APIMock();
        
        // answers arre represented in a map
        this.answers = new Map();
              

    }
    conclusionPage(){
        let div = `
        <div>
        <h3>Conclusion Page</h3>
        <h4>Your results:</h4>
        <p class = \"conclusions\"></p>
        <button class=\"backToWelcomePage\">Home</button>
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
        this.shadowRoot.querySelector('.conclusion').innerHTML = "<button class = \"btnConclusion\">" + "show conclusion" + "</button>\n";
        this.shadowRoot.querySelector('.conclusion').addEventListener('click', () => this.conclusionPage());
    }

    /**
     * Loads up the next question in the interview.
     */
    FetchQuestion(answer, overwriteid, answernum){
        let jsonQuestion;
        if (answer != undefined && this.question.id > 0)
            this.answers.set(this.question.id, [this.question.question, answer]);
        if(overwriteid != undefined)
            jsonQuestion = this.APIMock.getNextQuestion(overwriteid, answernum);
        else
            jsonQuestion = this.APIMock.getNextQuestion(this.question.id);
        let obj = JSON.parse(jsonQuestion);
        this.question = new Question(obj.questionID,obj.question,Array.from(obj.answers));
    }
    

    /**
     * sets up the transcript
     */
    setTranscript(){
        let transcriptSTR = "";
        let transcript = this.shadowRoot.querySelector('.transcript');
        this.answers.forEach((value,key) => {transcriptSTR += ("<div>question "+ key.toString() +": " + value[0] +"&emsp;|&emsp;your answer: " +
        value[1] + "&emsp;|&emsp;<button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">revisit this question</button></div>")});
        transcript.innerHTML = transcriptSTR;
        this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
    }

    /**
     * Sets up the current Question.
     */
    QuestionSetUp(answer, overwriteid, answernum){ 
        this.FetchQuestion(answer,overwriteid, answernum);
        this.setTranscript(); 
        this.shadowRoot.querySelector('h4').innerText = this.question.question; 
        if(this.question.id == -1){
            this.shadowRoot.querySelector('.buttons').innerHTML = 
                "<h4>Press the \"show conclusion\" button to see the conclusion of your interview</h4>";
            this.conclusion();
        }
        else
            this.ButtonSetUp();
    }


    /**
     * sets up the buttons for the current question.
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
            this.shadowRoot.querySelector(btnIDs[j]).addEventListener('click', () => this.QuestionSetUp(this.question.answers[j]));
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
     */
    ReturnToQuestion(questionNum){
        if(questionNum > 10 || questionNum < 1){
            return;
        }
        this.answers.forEach((value, key) => {if(key >= questionNum) this.answers.delete(key)});
        this.QuestionSetUp(undefined,questionNum, -1);
    }

    toggleTranscript(){
        let info = this.shadowRoot.querySelector('.transcript');
        let btn = this.shadowRoot.querySelector('#transcript-toggle');
        this.transcriptFlag = !this.transcriptFlag;
        if(this.transcriptFlag){
            info.style.display = 'block';
            btn.innerText = "hide tanscript";
        }
        else{
            info.style.display = 'none';
            btn.innerText = "show tanscript";
        }
    }
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
    }

}

window.customElements.define('policy-models-default',PolicyModelsDefault); //the name of the tag and the name of the class we want to be connected