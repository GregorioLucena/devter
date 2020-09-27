import AppLayout from "components/AppLayout"
import { useState, useEffect } from "react"
import Devit from "components/Devit"
import useUser from "hooks/useUser"
import { fetchLatesDevits } from "firebase/client"
import Create from "components/Icons/Create"
import Link from "next/link"
import Home from "components/Icons/Home"
import Search from "components/Icons/Search"
import { colors } from "styles/theme"
import Head from "next/head"

export default function HomePage() {
  const [timeline, setTimeline] = useState([])
  const user = useUser()

  useEffect(() => {
    user && fetchLatesDevits().then(setTimeline)
  }, [user])

  return (
    <>
      <AppLayout>
        <Head>
          <title>Inicio / Devter</title>
        </Head>
        <header>
          <h2>Inicio</h2>
        </header>
        <section>
          {timeline.map(
            ({ id, userName, avatar, content, img, createdAt, userId }) => (
              <Devit
                key={id}
                userName={userName}
                userId={userId}
                avatar={avatar}
                createdAt={createdAt}
                content={content}
                img={img}
                id={id}
              />
            )
          )}
        </section>
        <nav>
          <Link href="/compose/tweet">
            <a>
              <Home width={32} height={32} stroke="#09f" />
            </a>
          </Link>
          <Link href="/compose/tweet">
            <a>
              <Search width={32} height={32} stroke="#09f" />
            </a>
          </Link>
          <Link href="/compose/tweet">
            <a>
              <Create width={32} height={32} stroke="#09f" />
            </a>
          </Link>
        </nav>
      </AppLayout>

      <style jsx>{`
        header {
          align-items: center;
          backgroud: #ffffffaa;
          backdrop-filter: blur(5px);
          border-bottom: 1px solid #eee;
          height: 49px;
          display: flex;
          position: sticky;
          top: 0;
          width: 100%;
        }

        section {
          flex: 1;
        }

        h2 {
          font-size: 21px;
          font-weight: 800;
          padding-left: 15px;
        }

        nav {
          background: #fff;
          bottom: 0;
          border-top: 1px solid #eee;
          display: flex;
          height: 49px;
          position: sticky;
          width: 100%;
        }

        nav a {
          align-items: center;
          display: flex;
          flex: 1 1 auto;
          height: 100%;
          justify-content: center;
        }

        nav a:hover {
          background: radial-gradient(#0099ff44, 15%, transparent 16%);
          background-size: 180px 180px;
          background-position: center;
        }

        nav a:hover > :global(svg) {
          stroke: ${colors.primary};
        }
      `}</style>
    </>
  )
}
