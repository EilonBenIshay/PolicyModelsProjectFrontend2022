//'use strict'
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
 


const template = document.createElement('template');
template.innerHTML = `
 <style>
 .btnRevisitQ{
    background: rgba(51, 51, 51, 0.05);
    border-radius: 8px;
    border-width: 0;
    color: #333333;
    cursor: pointer;
    display: inline-block;
    font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    list-style: none;
    margin: 0;
    padding: 3px 4px;
    text-align: center;
    transition: all 200ms;
    vertical-align: baseline;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
 }
.divBtnShowTranscript{
    padding: 15px;
}
 .btnShowTranscript, .btnStart, .btnConclusion, .startInterview{
  align-self: center;
  background-color: #fff;
  background-image: none;
  background-position: 0 90%;
  background-repeat: repeat no-repeat;
  background-size: 4px 3px;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, .2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color: #41403e;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1rem;
  line-height: 23px;
  outline: none;
  padding: .30rem;
  text-decoration: none;
  transition: all 235ms ease-in-out;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin-up: 500px;
  margin-down: 500px;
  }

.btnShowTranscript:hover, .btnStart:hover, .btnConclusion:hover, .startInterview:hover{
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.btnShowTranscript:focus, .btnStart:focus, .btnConclusion:focus, .startInterview:focus{
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
}
 

 .btn {
    font-size: 15px;
    font-weight: 100;
    letter-spacing: 1px;
    padding: 5px 10px 5px;
    outline: 0;
    border: 1px solid black;
    cursor: pointer;
    position: relative;
    background: rgba(0, 0, 0, 0);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }
  
  .btn:after {
    content: "";
    background: #cfebfd;
    width: 100%;
    z-index: -1;
    position: absolute;
    height: 100%;
    top: 7px;
    left: 7px;
    transition: 0.2s;
  }
  
  .btn:hover:after {
    top: 0px;
    left: 0px;
  }
  
  @media (min-width: 768px) {
    .btn {
      padding: 10px 15px 10px;
    }
  }


    .policy-models-default {
        text-align:center
    }
     h1,h2,h3 {
        color: #344CB7;
        font-family: 'Nunito', sans-serif;
    }
    h4 {
        color: black;
        font-family: 'Nunito', sans-serif;
    }
    .transcript {
        display: none
    }
 </style>
 <div class="policy-models-default"> 

 </div>
`; 

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
        
        this.connectedCallback(); //NOT SURE
        this.showInfo = true;
        this.transcriptFlag = false;
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
        this.question = [0,"Welcome to the PolicyModels test site!", ["Start"]]
        this.shadowRoot.querySelector('h4').innerText = this.question[1];
        this.shadowRoot.querySelector('.buttons').innerHTML = "<button class = \"btnStart\" id =\"a0\">" + this.question[2][0] + "</button>\n";
        this.buttons = ['#a0'];
        this.shadowRoot.querySelector('#a0').addEventListener('click', () => this.QuestionSetUp(""));
        
        // answers arre represented in a map
        this.answers = new Map();
              
        ///to be removed later
        this.Qnum = 0;
        ///to be removed later
    }
    conclusionPage(){
        let div = `
        <div>
        <h3>Conclusion Page</h3>
        <h4>These are your results:</h4>
        <p class = \"conclusions\"></p>
        </div>`;
        this.shadowRoot.querySelector('.policy-models-default').innerHTML = div;
        //the conclusion
        let answersStr = "";
        this.answers.forEach((value, key) => answersStr += (value[1] + ","));
        answersStr = answersStr.substring(1, answersStr.length-1);
        answersStr ="[" + answersStr + "]";
        this.shadowRoot.querySelector('.conclusions').innerText = answersStr;
    }

    connectedCallback(){
        this.shadowRoot.querySelector('#transcript-toggle').addEventListener('click', () => this.toggleTranscript());
    }

    disconnectedCallback(){ //WHEN TO CALL THIS
        this.shadowRoot.querySelector('#transcript-toggle').removeEventListener();
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
    FetchQuestion(answer){
    if (answer != undefined && this.Qnum > 0)
        this.answers.set(this.Qnum, [this.question[1], answer]);
    let jsonQuestion = this.getNextQuestion(this.Qnum);
    let obj = JSON.parse(jsonQuestion);
    this.question = [obj.questionID,obj.question,Array.from(obj.answers)];
    this.Qnum = this.Qnum + 1;
    }

    /**
     * set up a return to question button
     */
    /*ReturnSetUp(){
        if (this.Qnum < 2 || this.Qnum > 9)
            return;
        let returnButtonSTR = "<option value=0>choose a question</option>\n";
        for(let i = 1; i < this.Qnum; i++)
            returnButtonSTR += ("<option value = " + i.toString() +">question " + i.toString() + "</option>\n");
        this.shadowRoot.querySelector("#QReturns").innerHTML = returnButtonSTR;
    }*/

    /**
     * sets up the transcript
     */
    setTranscript(answer){
        let transcriptSTR = "";
        if (this.Qnum < 1 || this.Qnum > 11)
            return;
        let transcript = this.shadowRoot.querySelector('.transcript');
        this.answers.forEach((value,key) => {transcriptSTR += ("<div>question "+ key.toString() +": " + value[0] +"&emsp;|&emsp;your answer: " +
        value[1] + "&emsp;|&emsp;<button class = \"btnRevisitQ\" id = \"QR"+ key.toString() +"\">revisit this question</button></div>")});
        transcript.innerHTML = transcriptSTR;
        this.answers.forEach((value,key) => {this.shadowRoot.querySelector('#QR' + key.toString()).addEventListener('click', ()=>this.ReturnToQuestion(key))});
        //NEW problem
        // if(this.getAttribute('btnRevisitQ_background')){
        //     this.shadowRoot.querySelector('.btnRevisitQ').style.background = this.getAttribute('btnRevisitQ_background');
        // }
    }

    /**
     * Sets up the current Question.
     */
    QuestionSetUp(answer){ 
        this.FetchQuestion(answer);
        this.setTranscript(answer); 
        this.shadowRoot.querySelector('h4').innerText = this.question[1]; 
        if(this.question[0] == -1){
            this.Conclude();
            this.conclusion();
        }
        else{
            this.ButtonSetUp();
        }
    }


    /**
     * sets up the buttons for the current question.
     */
    ButtonSetUp(){
        let btnIDs = [];
        let btnSTR = ""; 
        for (let i = 0; i< this.question[2].length; i++){
            btnSTR += "<button class = \"btn\" id =\"a" + i.toString() + "\">" + this.question[2][i] + "</button>\n";
            btnIDs[i] = '#a' + i.toString();
        } 
        this.shadowRoot.querySelector('.buttons').innerHTML = btnSTR;
        for (let j = 0; j< this.question[2].length; j++){
            this.shadowRoot.querySelector(btnIDs[j]).addEventListener('click', () => this.QuestionSetUp(this.question[2][j]));
        }
        //NEW
        if(this.getAttribute('btn_background')){
            this.shadowRoot.querySelector('.btn').style.background = this.getAttribute('btn_background');
        }
        //this.ReturnSetUp();  
    }

    /**
     * Concludes the interview
     */
    Conclude(){
        let answersStr = "";
        this.answers.forEach((value, key) => answersStr += (value[1] + ","));
        answersStr = answersStr.substring(1, answersStr.length-1);
        answersStr ="[" + answersStr + "]";
        this.shadowRoot.querySelector('.buttons').innerHTML = 
        "<h4>Press the \"show conclusion\" button to see the conclusion of your interview</h4>";
        //this.shadowRoot.querySelector('.buttons').innerText = answersStr;
    }

    /**
     * returns to a specific question
     */
    ReturnToQuestion(questionNum){
        if(questionNum > 9 || questionNum < 1){
            return;
        }
        this.Qnum = questionNum -1;
        this.answers.forEach((value, key) => {if(key >= questionNum) this.answers.delete(key)});
        this.QuestionSetUp();

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

    getNextQuestion(qNum) {
        let retQNum = qNum + 1;
        var retObject = JSON.stringify(jsonQuestionBank[retQNum-1]);
        return retObject;
    }


}

window.customElements.define('policy-models-default',PolicyModelsDefault); //the name of the tag and the name of the class we want to be connected