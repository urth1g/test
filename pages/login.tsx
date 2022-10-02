import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Form from "../components/Form";
import styles from '../styles/Home.module.css'
import { IncomingMessage } from 'http';
import { redirect } from 'next/dist/server/api-utils';
import { useEffect } from 'react';

const Login: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Login | Casino Royale Playground</title>
        <meta name="description" content="Bored in time of covid? Make most of your lockdown time and earn with us!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Login</h1>

        <Form />
      </main>
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

  let userFetch = await fetch('http://localhost:8000/get-user-from-session', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': context.req.headers.cookie || ''
    },
    credentials: 'include'
  });

  let user = await userFetch.json();

  if(user.id){
    return {
      redirect: {
        destination: '/',
      }
    }
  }
  return { props: {}}
}

export default Login;
