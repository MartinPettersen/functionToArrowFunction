const functionConverter = (input) => {
  let parenthesisStack = [];
  let doubleQuoteStack = [];
  let singleQuoteStack = [];
  let backtickStack = [];

  let oldLength = 0;
  let lengthAdjustment = 0;

  let commentStack = [];

  const matchPattern = "function";
  const matchParenthesis = "(";

  const commentList = ['"', "'", "`"];
  const commentListBackslash = ["//", "/*", "*/", "\t", '"', "'", "`", "\n"];

  const matchPaternLength = matchPattern.length;
  //const inputLength = input.length;
  // kan sikkert ikke bruke input.length

  let finished = false;

  let response = input;
  //--------------------------------------------------------------------------

  const commentControll = (i) => {
    let temp;
    if (response[i] === "/" || response[i] === "*") {
      temp = response[i] + response[i + 1];
      console.log("temp here: " +  temp);
    } else {
      temp = response[i];
    }

    

    // console.log(temp);
    /*
    if (commentList.includes(temp)) {
      
      if (commentStack.length > 0) {
        if (commentStack[0] === temp) {
          commentStack.pop();
        }
      } else {
        commentStack.push(temp);
      }
    }
    */
    if (commentListBackslash.includes(temp)) {
      if (temp === "\t"){
        console.log("<<<<<<");
        console.log(commentStack);
        console.log(temp);
        console.log(">>>>>>")
      }

      if (commentStack.length > 0) {
        if (commentStack[0] === temp) {
          commentStack.pop();
        } else if (temp === "*/" && commentStack[0] === "/*") {
          // console.log("i pop");
          commentStack.pop();
        } else if (temp === "\t" && commentStack[0] === "//" || temp === "\n" && commentStack[0] === "//") {
          console.log("i pop");
          console.log(commentStack)
          commentStack.pop();
          console.log(commentStack)
        } 
      } else {
        if ( temp !== "\t" && temp !== "\n"){

          commentStack.push(temp);
        }
      }
    }
  };

  const commentedOutChecker = (type) => {
    if (commentStack.length > 0) {
      return true;
    }
    return false;
  };

  const checkRemainingLength = (i, matchPaternLength, inputLength) => {
    if (i + matchPaternLength <= inputLength) {
      return true;
    }
    return false;
  };

  const removeFunction = (i) => {
    const beforeText = response.substring(0, i);
    const afterText = response.substring(i + matchPaternLength + 1);

    const afterTextWithArrow = insertArrow(i, afterText);
    return beforeText + afterTextWithArrow;
  };

  const insertArrow = (i, rem) => {
    const regExp = /(\([^]*?\)) /;
    const regLetters = /[a-zA-Z]/;
    const regMulti = /[a-zA-Z0-9]*, [a-zA-Z0-9]*/;

    let match = rem.replace(regExp, "$1 => ");
    match = parameterCheck(match);
    const temp = /\(([^]*?)\)/.exec(match);
    if (temp !== null) {
      if (regLetters.test(temp[0]) && !regMulti.test(temp[0])) {
        console.log("contains more than one");
        match = match.replace(/\(([^]*?)\)/, "$1");
      }
    }

    return match;
  };

  const parameterCheck = (text) => {
    const regExp = /(\{[^]*?\})/;
    const regSemi = /;/g;
    const temp = regExp.exec(text);

    const count = (temp[0].match(regSemi) || []).length;

    if (count === 1) {
      const statement = /\t([^]*?);/.exec(temp[0]);

      let pure;
      if (statement[0].match("\treturn ")) {
        pure = statement[0].replace("\treturn ", "");
      } else {
        pure = statement[0].replace("\t", "");
      }

      pure = pure.replace(";", "");

      return text.replace(temp[0], pure);
    }
  };

  // ------------------------------------------------------------------------

  for (let i = 0; i < response.length; i++) {
    commentControll(i);

    if (oldLength === 0) {
      oldLength = response.length;
    }

    if (response [i -1] === "z") {
      console.log("hmhmhmh")
      console.log(!commentedOutChecker());
      console.log(commentStack);
      if (response[i] === "\t"){
        console.log("contains newline");
      }
      if (response[i] === "\r"){
        console.log("contains r");
      }
      if (response[i] === "\n"){
        console.log("contains n");
      }
    }
    
    if (response[i] === matchPattern[0] && !commentedOutChecker()) {
      if (checkRemainingLength(i, matchPaternLength, response.length)) {
        if (
          response[i + matchPaternLength - 1] ===
          matchPattern[matchPaternLength - 1]
        ) {
          response = removeFunction(i);
          if (oldLength !== response.length) {
            
            console.log("<<<<<")
            console.log(i);
            // console.log(oldLength - response.length);
            // console.log(i - (oldLength - response.length));
            console.log(response[i])
            //console.log(response[i - (oldLength - response.length)])
            console.log(commentStack);

            console.log(">>>>>")
            
            i = i - (oldLength - response.length);
            i = 0;
            commentStack = []; // kan hende at jeg trenger  aa sette i til 0 for denne loesningen
            oldLength = response.length;
          }
        }
      } else {
        finished = true;
        console.log("string to short to contain function");
        break;
      }
    }
  }
  return response;
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const input = req.body.input.text;
    const response = functionConverter(input);
    res.status(200).json({ result: `${response}` });
  }
}
