import React, { FormEvent, useState } from 'react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';

export default function Game(): JSX.Element {
 
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const router = useRouter();

  let loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    let fetchPromise = fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({username, password})
    })
    let response = await fetchPromise;
    let data = await response.json();
    
    if(!data.error){
      router.push('/');
    }
  }

  return (
    <div className={styles.gameContainer}>
        <form className={styles.form} action="/login" method="POST" onSubmit={loginHandler}>
            <input type="text" name="username" onChange={ (e) => setUsername(e.target.value) } />
            <input type="password" name="password" onChange={ (e) => setPassword(e.target.value) } />
            <input type="submit" value="Login" className={styles.button} />
        </form>
    </div>
  );
}
