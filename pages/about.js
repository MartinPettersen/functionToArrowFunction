import React from "react";
import styles from "../styles/About.module.css";

const About = () => {
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          This page allows you to turn your old regular functions into arrow
          functions
        </h1>
        <div className={styles.description}>
          <code>Upload a file and push the convert button</code>
       
        <h3>It can not deal with all edge cases</h3>
        <h3>
          Currently you have to use a semicolon if you want the convertion to
          not have return or curly braces in the case of there only being one
          statement
        </h3>
        <h3>
          Due to time limitations I have no plans to find a way to detect
          offending tokens
        </h3>
        <h3>
          You should in any case use semicolons since the automatic semicolon
          insertion is not perfect and can lead to hard to find errors
        </h3>
        <h3>And semicolons after every function</h3>

        <h1>Need to deal with double slash comments</h1>
        <h1>Need to deal with tab in textarea</h1>

        </div>
      </main>
    </div>
  );
}; // https://lucumr.pocoo.org/2011/2/6/automatic-semicolon-insertion/
//https://www.javascripttutorial.net/es6/javascript-arrow-function/
export default About;
