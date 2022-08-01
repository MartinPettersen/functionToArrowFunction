import axios from 'axios';
import { setRevalidateHeaders } from 'next/dist/server/send-payload';
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
export default function Home() {

  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  const handleClick = () => {

      //const matchNewline = /\r|\n/.exec(before);
      const matchNewline = before.replace(/\r|\n/, '\n');
      
      //console.log(matchNewline)

      const input = { text: matchNewline };

      axios.post('/api/converter', { input })
      .then((res) => setAfter(res.data.result))
      const matchNewlineAfter = after.replace(/\r|\n/, '\\n');
      
      console.log(matchNewlineAfter)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Turn your old functions in to arrow functions
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>Does this look alright for code</code>
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <textarea className={styles.code} onChange={(e) => setBefore(e.target.value)}></textarea>
          </div>

          <div className={styles.card}>
           <div>
             <p className={[styles.code, styles.after ]}>{after} </p>
           </div>

          </div>
          


        </div>
        <button onClick={handleClick}>Convert</button>
      </main>


    </div>
  )
}
