/*
Regular Expression tricks for RegExpFuzzy
-\\Ss\\b = finds words that end in s
*/
function CatechizerV0() {

    //distance between main word & question category words
    CatechizerV0.wordspace = 1;

    //record each category for questions & words
    CatechizerV0.questionKeys = {};
    //word in question is before (e.g. A tuxedo is, Lobsters are, The virus causes)
    CatechizerV0.questionKeys["what_before"] = "is,are,was,can,has,cause,causing,causation";
    // CatechizerV0.questionKeys["what_before"] = "is a,is an,is the,is when," + 
    // "are a,are an,are the,are when," + 
    // "was a,was an,was the,was when," + 
    // "can,has,cause,causing,causation";

    CatechizerV0.questionKeys["what_after"] = "such as,for instance,for example";        //word in question is are (e.g. brain processes such as..., animals in the wild, for instance...)
    // CatechizerV0.questionKeys[ "when_num" ] = "before,after,during,am,pm,at,for,by,until,till,around";

    CatechizerV0.questionKeys["why_A"] = "because,why";
    CatechizerV0.questionKeys["when_occur"] = "occur,occurs,occurred,occurring";

    //phrase questions based on keys in hash CatechizerV0.questionKeys
    CatechizerV0.questionPhrase = {};
    CatechizerV0.questionPhrase["what_before"] = "what";
    CatechizerV0.questionPhrase["what_after"] = "what";
    CatechizerV0.questionPhrase["why_A"] = "why";
    CatechizerV0.questionPhrase["when_occur"] = "when does";
    
    //split each cateogory into an array of words
    for (var i in CatechizerV0.questionKeys)
        CatechizerV0.questionKeys[i] = CatechizerV0.questionKeys[i].split(",");

    //TEST:: console.log( "all Q types = ", CatechizerV0.questionKeys );
}

CatechizerV0.prototype = {
    constructor: CatechizerV0,

    searchQuestion: function (keyQuestion, sent) {
        //VAR: keyQuestion = key in CatechizerV0.questionKeys, which is basically a question category
        //VAR: sent = string that is the sentence
        //METHOD: searches sentence & records any key question words in this found in "CatechizerV0.questionKeys[keyQuestion]" & returns array of words found
        var question = CatechizerV0.questionKeys[keyQuestion];       //question = array
        var wordsFound = [];        //records key words found for a given category
        for ( var i in question ) {    //question[ i ] = word within question category "keyQuestion"
            var regExp = new RegExp("\\b" + question[i] + "\\b", "gi");  
            if ( sent.match(regExp) )
                wordsFound.push(question[i]);
        }

        return wordsFound;
    },

    questionType: function (sent) {
        //METHOD: determine the question type based on words used
       
        //go through each type of question, and then return the potential types of question this sentence can answer
        var possibleQues = {};
        for (var i in CatechizerV0.questionKeys) {  //i = question type (e.g. who, what, when), CatechizerV0.questionKeys[i] = each word in question type "i"
            var wordsFound = this.searchQuestion(i, sent);
            if (wordsFound.length > 0)
                possibleQues[i] = wordsFound;
        }

        //TEST::
        // console.log("TEST - pQ = ", possibleQues);

        return possibleQues;
    },

    searchQuestionV2: function (keyQuestion, word, sent) {
        //VAR: keyQuestion = key in CatechizerV0.questionKeys, which is basically a question category
        //VAR: word = the main word that will be used in the question. e.g. What is a panda, "panda" is the word
        //VAR: sent = string that is the sentence. Variable "word" will be searched in this variable "sent"
        //METHOD: searches sentence & records any key question words in this found in "CatechizerV0.questionKeys[keyQuestion]" & returns array of words found
        var question = CatechizerV0.questionKeys[keyQuestion];       //question = array
        var wordsFound = [];        //records key words found for a given category
        for (var i in question) {    //question[ i ] = word within question category "keyQuestion"
            //create order & distance to be searched, and if true then record question category word
            searchwords = [word, question[i]];      //order in array does matter
            if (searchOD(sent, searchwords, [CatechizerV0.wordspace]))
                wordsFound.push(question[i]);
        }

        return wordsFound;
    },

    questionTypeV2: function(word, sent) {
        //VAR: word = the main word that will be used in the question. e.g. What is a panda, "panda" is the word
        //VAR: sent = string that is the sentence. Variable "word" will be searched in this variable "sent" 
        //METHOD: determine the question type based on words used

        //go through each type of question, and then return the potential types of question this sentence can answer
        var possibleQues = {};
        //i = question type (e.g. who, what, when), CatechizerV0.questionKeys[ i ] = each word in question type in variable "i"
        for (var i in CatechizerV0.questionKeys) { 
            var wordsFound = this.searchQuestionV2(i, word, sent);
            if (wordsFound.length > 0)
                possibleQues[i] = wordsFound;
        }

        //TEST:: console.log(word, " - pQ = ", possibleQues);

        return possibleQues;
    },

    questionPhrase: function(word, quesType, quesWord) {
        //VAR: word = the main word that will be used in the question. e.g. What is a panda, "panda" is the word
        //VAR: quesType = the type of question to be answered (e.g. who, what, where, when, why, how)
        //VAR: quesWord = the word in the quesType (i.e. the question cateogory) - e.g. "is" = "what" category
        //METHOD: this will phrase the question

        //retrieve question category, word in category, and 
        return CatechizerV0.questionPhrase[quesType] + " " + quesWord + " " + word + "?";
    },

    find_what: function() {
        //METHOD: finds sentences that could potentially answer the question "what"

        //go through all sentences and find words associated with question "what"
        var arrSentWhat = [];
        var arrWhat = CatechizerV0.questionKeys[ "what_before" ].split( "," );
        for ( var i in this.arrSents ) {
            //see if there is a word match, and if so record the sentence index & the word match
            var wordMatch = this.return_matches( this.arrSents[ i ], arrWhat );
            if ( wordMatch )
                arrSentWhat.push( [ i, wordMatch ] );     //format: [0] = sent index
        }

        this.sentWhat = arrSentWhat;
        // return arrSentWhat;
    },

    phrase_what: function() {
        //METHOD: will phrase "what" questions

        //go through each recorded 
        for ( var i in this.sentWhat ) {
            //split each sentence by word found
            var sentI = this.sentWhat[ i ][ 0 ];
            var wordSplit = this.sentWhat[ i ][ 1 ];
            var regExpSplit = new RegExp( "\\b" + this.sentWhat[ i ][ 1 ] + "\\b", "i" );
            var arrSplit = this.arrSents[ sentI ].split( regExpSplit );

            //TEST::
            var dispSplitSent = arrTools_showArr_ConsoleLog( arrSplit );
            console.log( i + " - WHAT: wordSplit = " + wordSplit + " & arrSplit = " + dispSplitSent );
        }
    },
}

/* Types of questions to ask
-who? Proper Nouns (check for capitalization)
-what? - is, are, was, can, causes/causing (e.g. X causes Y -> what does X do? What causes Y?)
    -what is X?
    -what does X do? - can, will, should, does, do, cause
        -X causes blah blah
    -what causes X?
    -what can satellite galaxies do?
        -These satellite galaxies can orbit for billions of years around their host before a potential merger.
    -X consists of...
-where? - some sort of preposition: inside, outside, under, below, over, on top, into, between, within, on (noun, on the table), in (noun), around (noun), next to, beside (noun, e.g. beside the car), from (noun), towards (article, noun), onto (article, noun)
    -don't confuse "beside" with "besides"
-when? - before, after, during, am, pm, at (#, e.g. 4pm, night, day), for (# time, e.g. 3 years), ago, on (same date or time), since, in (e.g. an hour), until, past (#), till, by (#), before (#), around (#)
-why? - because, why ( maybe the word is included ), reason??, since, as
    -why did Carmen think Destiny was getting better? - Carmen thought Destiny was getting better because she was no longer coughing.
    -why do I want another baby? - I want another baby because I want more children.
    -why does everyone win in trade? - Everyone wins in trade, because goods are reallocated in a way that increases utility to all parties involved
    -CAUTION: Is it because winning the award gives them more confidence? - why do is it?? This doesn't make sense, another reason to use non-common words
-how? - may?, by?
    -how is X made? X is made, X is created, X is synthesized, X is generated, X is developed
*/

/* Creating class
-what is the smallest thing I will be manipulating? A letter? Word? Sentence? Start with the smallest thing and make methods for that 
-for Catechizer, the smallest unit: sentence, as this is what conveys information 
*/

/* Ideas for Catechizer
-word math: perhaps there is a formulaic way or ways to convey information (e.g. X is Y means X = Y), need to find more examples
-the subject & the associated information can be separated by prepositions
    -FU Orionis star in the constellation of Orion is the prototype example
*/



/* POTENTIAL ANSWERS:
-RCW 106 is a sprawling cloud of gas and dust located about 12,000 light-years away in the southern constellation of Norma (The Carpenter's Square).
-The lower filaments are RCW 104, surrounding the Wolf-Rayet star WR 75.
-H II regions like RCW 106 are clouds of hydrogen gas that are being ionised by the intense starlight of scorching-hot, young stars, causing them to glow and display weird and wonderful shapes.
*/