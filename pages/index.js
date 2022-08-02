import axios from 'axios';
import { setRevalidateHeaders } from 'next/dist/server/send-payload';
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import CodeText from '../components/CodeText';
import styles from '../styles/Home.module.css'
export default function Home() {

  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  const handleCopy =  async() => {
    return await navigator.clipboard.writeText(after);
  }

  const handleClick = () => {

      //const matchNewline = /\r|\n/.exec(before);
      const matchNewline = before.replace(/\r|\n/, '\n');
      
      //console.log(matchNewline)

      const input = { text: matchNewline };

      axios.post('/api/converter', { input })
      .then((res) => setAfter(res.data.result))
      const matchNewlineAfter = after.replace(/\r|\n/, '***');
      
      console.log(matchNewlineAfter)
  }

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
          <code >Paste your oldschool JavaScript functions on the left and push the convert button</code>
        </p>
        <button className={styles.convert_button} onClick={handleClick}>Convert</button>
        <div className={styles.grid}>
          <div className={styles.card}>
            
            <textarea className={styles.code} onChange={(e) => setBefore(e.target.value)}></textarea>
          </div>

          <div className={styles.card}>
           <div className={[styles.after_container]}>
           <button onClick={handleCopy} >Copy</button>
             
             <CodeText text={after} />
           </div>

          </div>
          


        </div>
      </main>


    </div>
  )
}


