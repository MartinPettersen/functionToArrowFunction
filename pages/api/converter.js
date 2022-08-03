const functionConverter = (input) => {
  let parenthesisStack = [];
  let doubleQuoteStack = [];
  let singleQuoteStack = [];
  let backtickStack = [];

  let commentStack = [];

  const matchPattern = "function";
  const matchDoubleQuote = '"';
  const matchSingleQuote = "'";
  const matchBacktick = "`";
  const matchParenthesis = "(";
  const matchMultiLineComOp = "/*";
  const matchMultiLineComClo = "*/";

  const commentList = ['"', "'", "`", "(", "/*", "*/"];

  const matchPaternLength = matchPattern.length;
  //const inputLength = input.length;
  // kan sikkert ikke bruke input.length

  let finished = false;

  let response = input;
  //--------------------------------------------------------------------------

  const commentControll = (i) => {
    if (commentList.includes(response[i])) {
      if (commentStack.length > 0) {
        if (commentStack[0] === response[i]) {
          commentStack.pop();
        }
      } else {
        commentStack.push(response[i]);
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
    //const regMulti = /,/;
    const regMulti = /[a-zA-Z0-9]*, [a-zA-Z0-9]*/;

    let match = rem.replace(regExp, "$1 => ");
    //console.log(match);
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
    console.log(text);
    console.log(temp[0]);

    const count = (temp[0].match(regSemi) || []).length;

    if ( count === 1) {
      const statement = /\t([^]*?);/.exec(temp[0]);
      console.log("æ")
      //console.log(statement[0])
      let pure = statement[0].replace("\treturn ", "");
      pure = pure.replace(";", "");
      console.log(pure)

      return text.replace(temp[0], pure);
    }
    console.log("number of semi colongs: " + count);
  }

  // ------------------------------------------------------------------------

  for (let i = 0; i < response.length; i++) {
    commentControll(i);
    if (response[i] === matchPattern[0] && !commentedOutChecker()) {
      if (checkRemainingLength(i, matchPaternLength, response.length)) {
        if (
          response[i + matchPaternLength - 1] ===
          matchPattern[matchPaternLength - 1]
        ) {
          console.log(i);
          response = removeFunction(i);
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
