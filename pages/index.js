import axios from "axios";
import { setRevalidateHeaders } from "next/dist/server/send-payload";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import CodeText from "../components/CodeText";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  const handleCopy = async () => {
    return await navigator.clipboard.writeText(after);
  };

  const handleTab = (e) => {
    console.log(e.target.selectionEnd);
    console.log(e.target.selectionStart);

    if (e.key == "Tab") {
      e.preventDefault();
      const start = before.substring(0, e.target.selectionStart);
      const end = before.substring(e.target.selectionEnd);

      const insertTab = start + "\t" + end;
      setBefore(insertTab);
    }
  };

  const handleClick = () => {
    const matchNewline = before.replace(/\r|\n/, "\n");
    const input = { text: matchNewline };
    axios
      .post("/api/converter", { input })
      .then((res) => setAfter(res.data.result));
  };

  useEffect(() => {
    console.log("changeed before");
  }, [before]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta charset="utf-8"></meta>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Turn your old functions in to arrow functions
        </h1>

        <p className={styles.description}>
          <code>
            Paste your oldschool JavaScript functions on the left and push the
            convert button
          </code>
        </p>
        <button className={styles.convert_button} onClick={handleClick}>
          Convert
        </button>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className="whiteSpacesFix">
              <textarea
                className={styles.code}
                value={before}
                onKeyDown={(e) => handleTab(e)}
                onChange={(e) => setBefore(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className={styles.card}>
            <div className={[styles.after_container]}>
              <button onClick={handleCopy}>Copy</button>

              <CodeText text={after} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
