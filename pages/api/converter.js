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

  const commentedOutChecker = () => {
    if (doubleQuoteStack.length > 0) {
      return true;
    }
    return false;
  };
  const commentedOutChecker2 = (type) => {
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
    const regExp = /(\([^]+?\)) {/;
    const match = rem.replace(regExp, "$1 =>");
    return match;
  };
  // ------------------------------------------------------------------------

  for (let i = 0; i < response.length; i++) {
    commentControll(i);
    /*
    if (response[i] === matchDoubleQuote) {
      if (commentedOutChecker(doubleQuoteStack)) {
        doubleQuoteStack.pop();
      } else {
        doubleQuoteStack.push('"');
      }
    }
    */
    if (response[i] === matchPattern[0] && !commentedOutChecker2()) {
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
