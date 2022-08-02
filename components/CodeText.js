import React from 'react'

const CodeText = (props) => {
    const text = props.text;
    const tabText = text.replace('\t', '    '); 

    const splitText = tabText.split('\n'); 


  return (
    <div className="whiteSpacesFix">
        {splitText.map((str, i) => <p key={i}>{str}</p>)}
    </div>
  )
}

export default CodeText