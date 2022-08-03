import React, { useState, useEffect, useRef } from "react";

const FilePage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const inputFile = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  /*
    const uploadFile = (e) => {
        setSelectedFile(e)
        console.log('clicked')
        console.log(selectedFile);

    } */
  /*
    fetch('filePage.js')
    .then(response => response.text())
    .then(text => console.log(text))
    */

  //<input type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
  const readFile = (event) => {
    const fileReader = new FileReader();
    const  { files }  = event.target;
    
    console.log(typeof files)
    
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      const content = e.target.result;
      console.log(content);
      //setFileContent(JSON.parse(content));
    };
    
    //console.log(inputFile.current.files[0]);
  };

  return (
    <div>
      filePage
      <input
        type="file"
        value={selectedFile}
        ref={inputFile}
        onChange={readFile}
      />
      <button onClick={() => inputFile.current.click()}>upload</button>
    </div>
  );
};

export default FilePage;
