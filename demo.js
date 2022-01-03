const array = [[1, "Are you a woman?", ["Yes", "No"]],
[2, "How old are you?",["1-14","15-18","19-65","66+"]],
[3, "How did your employment end?", ["Resignation", "Lawful Termination", "Unlawful Termination", "Death"]],
[4, "What is your favorite chip?", ["Pringles", "Lays", "Walkers", "Tapuchips", "Other"]],
[5, "How has your day been?", ["Best day of my life", "Great", "Ok", "Bad", "Straight up agony"]],
[6, "What is your favorite animal", ["Dog", "Cat", "Mouse", "Frog", "Hedgehog", "Bee", "Wolf", "Other"]],
[7, "Who is the best?", ["Shady", "Shelly", "Eilon", "Tbh none of them"]],
[8, "Are you an israeli citizan", ["Yes","No"]],
[9, "Who is the best friend?", ["Ross", "Chandler", "Monica", "Rachel", "Pheobe", "Joey"]],
[10, "HIMYM or Seinfeld?", ["HIMYM", "Seinfeld", "F.r.i.e.n.d.s", "other"]],
[-1, "These are your results:"]];
class Demo{
    getNextQuestion(qNum) {
        retQNum = qNum + 1;
        var retObject = JSON.stringify(array[retQNum-1]);
        //retQuestion = array[retQNum-1][1];
        //retAnswer = array[retQNum-1][2];
        console.log(retObject);
        return retObject;
    }
}

export {getNextQuestion};

