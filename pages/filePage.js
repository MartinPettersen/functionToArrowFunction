import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/FilePage.module.css";
import axios from "axios";

const FilePage = () => {
  const inputFile = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("yourfile");
  const [oldSize, setOldSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [savedBytes, setSavedBytes] = useState(0);

  const readFile = (event) => {
    const fileReader = new FileReader();
    const { files } = event.target;

    

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      const content = e.target.result;
      setFileName(files[0].name);
      setOldSize(files[0].size);
      setFileContent(content);
    };
  };

  const downloadTxtFile = async () => {
    const element = document.createElement("a");
    let file;
    const input = { text: fileContent };
    axios.post("/api/converter", { input }).then((res) => {
      file = new Blob([res.data.result], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      setNewSize(file.size);
      setSavedBytes(oldSize - file.size);
      element.download = `${fileName}`;
      document.body.appendChild(element);
      element.click();
    });
  };
  useEffect(()=> {

  },[savedBytes]);
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Turn your old functions in to arrow functions
        </h1>
        <p className={styles.description}>
          <code>Upload a file and push the convert button</code>
        </p>
        <div className={styles.bytes}>{savedBytes !== 0 ? <p>You saved {savedBytes} bytes</p>: <></>}</div>
        <label className={styles.upload}>
          Upload
        <input className={styles.file}
          type="file"
          value={selectedFile}
          ref={inputFile}
          onChange={readFile}
        />
        </label>
        {fileContent !== "" ? (
          <button className={styles.download} onClick={downloadTxtFile}>Convert</button>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
};

export default FilePage;
