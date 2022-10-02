import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import MovingButton from './MovingButton';
import { useRouter } from 'next/router';

type User = {
  user: {
    id: number,
    username: string,
    credits: number,
    creditsSession: number
  }
}

async function timer(ms: number){
  return new Promise(res => setTimeout(res, ms));
}

export default function Game({user} : User): JSX.Element {

  let [ gameState, setGameState ] = useState(['','','']);
  let [ sessionCredits, setSessionCredits ] = useState(user.creditsSession);
  let [ buttonDisabled, setButtonDisabled ] = useState(false)
  let [ totalCredits, setTotalCredits ] = useState(user.credits);
  let router = useRouter();

   async function setGameStateAsync(state: string[]): Promise<void> {
    for(let i = 0; i < state.length; i++){  
      await timer(1000);

      setGameState(oldState => {
        let newState = [...oldState];
        newState[i] = state[i];
        return newState;
      })

    }

    setButtonDisabled(false);

  }

  async function spinButtonHandler(): Promise<void>{
    setGameState(['X','X','X']);
    setButtonDisabled(true);
    try{
      let spinFetch = await fetch('http://localhost:8000/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      let { newState, credits } = await spinFetch.json();

      setGameStateAsync([...newState]);
      setSessionCredits(credits);
    }catch(e){
      alert("Error occured while spinning. Please try again later.");
    }
  }

  async function cashOutButtonHandler(): Promise<void>{
    try{
      let cashOutFetch = await fetch('http://localhost:8000/cash-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      let { credits } = await cashOutFetch.json();

      setSessionCredits(0);
      setTotalCredits(credits)
      router.push('/login')
    }catch(e){
      alert("Error occured while cashing out. Please try again later.");
    }
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameInformation}>
        <p>Total credits: {totalCredits}</p>
        <p>Session credits: {sessionCredits}</p>
      </div>

      <table cellSpacing="15px">
        <tbody>
          <tr>
            {gameState.map((value, index) => {

              return (
                <td key={index} className={styles.gameCell}>
                  <div className={value === 'X' ? styles.gameCellValueContainer : undefined}>{value}</div>
                </td>
              );

            })}

            <td>
              <button 
                className={buttonDisabled ? styles.spinButtonDisabled : styles.spinButton}
                onClick={spinButtonHandler}  
                disabled={buttonDisabled}
              >{buttonDisabled ? 'Spinning...' : 'Spin!'}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <MovingButton 
        className={styles.cashOutButton} 
        onClick={cashOutButtonHandler}>Cash out</MovingButton>
    </div>
  );
}
