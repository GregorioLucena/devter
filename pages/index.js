import { usestate, useEffect, useState } from 'react'
import Head from 'next/head'
import AppLayout from '../components/AppLayout'
import { colors } from '../styles/theme'
import Button from '../components/Button'
import GitHub from '../components/Icons/GitHun'

import { loginWithGitHub, onAuthStateChanged } from '../firebase/client'

export default function Home () {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    onAuthStateChanged(setUser)
  }, [])

  const handleClick = () => {
    loginWithGitHub().then(user => {
      const { avatar, username, url } = user
      setUser(user)
      console.log(user)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      <Head>
        <title>devter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <section>
          <img src = '/devter-logo.png' alt='logo' />
          <h1>DEVTER</h1>
          <h2>Talk about development <br /> with developers </h2>

          <div>
            {
              user == null &&
              <Button onClick={handleClick}>
                <GitHub fill='#fff' width={24} height={24}/>
                Login with GitHub
              </Button>
            }
            {
              user && user.avatar && <div>
                <img src={user.avatar}/>
                <strong>{user.username}</strong>
              </div>
            }

          </div>
        </section>
      </AppLayout>

      <style jsx>{` 
        img{
          width: 200px;
          border-radius: 50px;
        
        }   

        div{
          margin-top: 16px;
        }

        section{
          display: grid;
          height: 100%;
          place-content: center;
          place-items: center;

        }  
        h1{
          color: ${colors.secundary};
          font-weight: 800;
          margin-bottom: 16px;
        } 
        h2{
          color: ${colors.primary};
          font-size: 21px;
          margin: 0;
        }

      `}</style>

    </>
  )
}
