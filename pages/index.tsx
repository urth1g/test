import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Game from "../components/Game";
import styles from '../styles/Home.module.css'
import { IncomingMessage } from 'http';
import { redirect } from 'next/dist/server/api-utils';

type User = {
  user: {
    id: number,
    username: string,
    credits: number,
    creditsSession: number
  }
}

const Home: NextPage<User> = ({user}) => {
  return (
    <div>
      <Head>
        <title>Test Your Luck! | Casino Royale Playground</title>
        <meta name="description" content="Bored in time of covid? Make most of your lockdown time and earn with us!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Game user={user} />
      </main>
    </div>
  )
}

interface IncomingMessageSession extends IncomingMessage{
  session? : {
    credits: number
  }
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

  if(!user.id){
    return {
      redirect: {
        destination: '/login',
      }
    }
  }
  return { props: {user}}

}

export default Home;
