$(document).ready(function() {

    // event listeners
    $("#remaining-time").hide();
    $("#q-counter").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click', '.option', trivia.guessChecker);

})

var trivia = {
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',
    counter: 10,
    // questions options and answers data
    questions: {
        q1: '#1: Who played Neo in the movie "The Matrix"?',
        q2: '#2: How many colors are there in a rainbow?',
        q3: '#3: What flavor ice cream did Baskin-Robbins release in 1969 to commemorate Americas landing on the moon?',
        q4: '#4: What is it illegal to duel with in Massachusetts?',
        q5: "#5: What is the world's biggest spider?",
        q6: '#6: In Texas its illegal to swear in front of a what?',
        q7: "#7: What is Johnny Depp afraid of?",
        q8: "#8: In Georgia it's illegal to keep what in your bathtub?",
        q9: "Final Question: Where are 40,000 Americans injured each year?"
    },
    options: {
        q1: ['David Bowie', 'Chris Hansen', 'Adam Sandler', 'Keanu Reeves'],
        q2: ['7', '6', '5', '4'],
        q3: ['Galaxy Dots', 'Lunar Cheesecake', 'Moon Cookies', 'Rocket Pop'],
        q4: ['Hockey Stick', 'Water Pistols', 'Air-soft Guns', 'Roman Candles'],
        q5: ['Eight-legged Freak', 'BlackWidow', 'Goliath Birdeater', 'Huntsmen'],
        q6: ['Cowboy', 'Sheep', 'Your Pet', 'Corpse'],
        q7: ['Clowns', 'Rice', 'Barney', 'Turkey'],
        q8: ['Toaster', 'Gabe Newell', 'Donkey', 'Rats'],
        q9: ['Toilet', 'Elevator', 'Driving', 'Dancing']
    },
    answers: {
        q1: 'Keanu Reeves',
        q2: '7',
        q3: 'Lunar Cheesecake',
        q4: 'Water Pistols',
        q5: 'Goliath Birdeater',
        q6: 'Corpse',
        q7: 'Clowns',
        q8: 'Donkey',
        q9: 'Toilet'
    },
    // trivia methods
    // method to initialize game
    startGame: function() {
        // restarting game results
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);

        // show game section
        $('#game').show();

        //  empty last results
        $('#results').html('');

        // show timer
        $('#timer').text(trivia.timer);

        // remove start button
        $('#start').hide();

        $('#remaining-time').show();

        $('#q-counter').show();

        // ask first question
        trivia.nextQuestion();

    },
    // method to loop through and display questions and options 
    nextQuestion: function() {


        trivia.timer = 15; //Set the timer to 15 seconds per question
        $('#timer').removeClass('Final-seconds');

        $('#timer').text(trivia.timer);

        // to prevent timer speed up
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000); // Sets Delay Timer
        }

        // gets all the questions then indexes the current questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);

        // an array of all the user options for the current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        // creates all the trivia guess options in the html
        $.each(questionOptions, function(index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })

    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning: function() {

        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('Final-seconds');
            }
        }
        // the time has run out and increment unanswered, run result
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 2000); //Sets a small timer when revealing the answer
            $('#results').html('<h2>Times up! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h2>');
            counter--;
        }
        // show results
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {

            // add the final score/results of game
            $('#results')
                .html('<h1>Thanks for playing!</h1>' +
                    '<h2>Results</h2>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Wrong: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>' +
                    '<p>Wanna try again?</p>');

            // hide game sction
            $('#game').hide();

            // show start button to begin a new game
            $('#start').show();
        }

    },
    // method to evaluate the option clicked
    guessChecker: function() {

        // timer ID for gameResult setTimeout
        var resultId;

        // the answer to the current question being asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

        // if the text of the option picked matches the answer of the current question, increment correct
        if ($(this).text() === currentAnswer) {
            // turn button green for correct
            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 2000);
            $('#results').html('<h2>Correct Answer!</h2>');
        }
        // else the user picked the wrong option, increment incorrect
        else {
            // turn button clicked red for incorrect
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 2000);
            $('#results').html('<h2>Sorry! The answer was: ' + currentAnswer + '</h2>');
        }

    },
    // method to remove previous question results and options
    guessResult: function() {

        // increment to next question set
        trivia.currentSet++;

        // remove the options and results
        $('.option').remove();
        $('#results h2').remove();

        // begin next question
        trivia.nextQuestion();

    }

}