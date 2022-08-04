import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

const FilePage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const inputFile = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("yourfile");
  const [convertedContent, setConvertedContent] = useState("");

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
    const { files } = event.target;

    console.log(typeof files);

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      const content = e.target.result;
      setFileName(files[0].name);
      console.log(content);
      setFileContent(content);
      //setFileContent(JSON.parse(content));
    };

    //console.log(inputFile.current.files[0]);
  };

  const convertFileContent = () => {
    //const matchNewline = fileContent.replace(/\r|\n/, "\n");
    const input = { text: fileContent };
    axios
      .post("/api/converter", { input })
      .then((res) => setConvertedContent(res.data.result));

    console.log(convertedContent);
  }

  const downloadTxtFile = () => {
    convertFileContent();
    const element = document.createElement("a");
    const file = new Blob([convertedContent], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);

    element.download = `${fileName}`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Turn your old functions in to arrow functions
        </h1>
        <p className={styles.description}>
          <code>
            Upload a file and push the
            convert button
          </code>
        </p>
        
        <input
          type="file"
          value={selectedFile}
          ref={inputFile}
          onChange={readFile}
        />
        {/*<button onClick={() => inputFile.current.click()}>upload</button>*/}
        {fileContent !== "" ? <button onClick={downloadTxtFile}>Convert</button> :<></>}
        
      </main>
    </div>
  );
};

export default FilePage;
