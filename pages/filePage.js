import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/FilePage.module.css";
import axios from "axios";

const FilePage = () => {
  const inputFile = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("yourfile");

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

      element.download = `${fileName}`;
      document.body.appendChild(element);
      element.click();
    });
  };

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Turn your old functions in to arrow functions
        </h1>
        <p className={styles.description}>
          <code>Upload a file and push the convert button</code>
        </p>

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
