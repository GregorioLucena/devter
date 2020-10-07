import { useEffect, useState } from "react"
import Button from "components/Button"
import { addDevit, upLoadImage } from "firebase/client"
import useUser from "hooks/useUser"
import { useRouter } from "next/router"
import Head from "next/head"
import Avatar from "components/Avatar"

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
}

const DRAG_IMAGES_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
}

export default function ComposeTweet() {
  const user = useUser()
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN)
  const router = useRouter()

  const [drag, setDrag] = useState(DRAG_IMAGES_STATES.NONE)
  const [task, setTask] = useState(null)
  const [imgURL, setImgURL] = useState(null)

  useEffect(() => {
    if (task) {
      const onProgress = () => {}
      const onError = () => {}
      const onComplete = () => {
        task.snapshot.ref.getDownloadURL().then(setImgURL)
      }

      task.on("state_changed", onProgress, onError, onComplete)
    }
  }, [task])

  const handleChange = (event) => {
    const { value } = event.target
    setMessage(value)
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    setDrag(DRAG_IMAGES_STATES.DRAG_OVER)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDrag(DRAG_IMAGES_STATES.NONE)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDrag(DRAG_IMAGES_STATES.NONE)
    const file = event.dataTransfer.files[0]
    const task = upLoadImage(file)
    setTask(task)
  }

  const handleSummit = (event) => {
    event.preventDefault()
    setStatus(COMPOSE_STATES.LOADING)
    addDevit({
      avatar: user.avatar,
      content: message,
      userId: user.uid,
      userName: "gregorio",
      img: imgURL,
    })
      .then(() => {
        router.push("/home")
      })
      .catch((err) => {
        console.log(err)
        setStatus(COMPOSE_STATES.ERROR)
      })
  }

  const isButtonDisabled =
    message.length === 0 || status === COMPOSE_STATES.LOADING

  return (
    <>
      <Head>
        <title>crear un Devit / Devter</title>
      </Head>
      <section className="form-container">
        {user && (
          <section className="avatar-container">
            <Avatar src={user.avatar} />
          </section>
        )}
        <form onSubmit={handleSummit}>
          <textarea
            onChange={handleChange}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            placeholder="¿Qué esta pasando?"
            value={message}
          ></textarea>
          {imgURL && (
            <section className="reove-img">
              <button onClick={() => setImgURL(null)}>x</button>
              <img src={imgURL} />
            </section>
          )}
          <div>
            <Button disabled={isButtonDisabled}>Devitear</Button>
          </div>
        </form>
      </section>

      <style jsx>{`

          div {
            padding: 15px;
          }

          button {
            background: rgba(0, 0, 0, 0.3);
            border: 0;
            border-radius: 999px;
            color: #fff;
            font-size: 24px;
            width: 32px;
            height: 32px;
            top: 10px;
            position: absolute;
            right: 10px
          }

          .remove-img {
            position: relative;
          }

          .form-container {
            align-items:flex-start;
            display:flex;
          }

          .avatar-container {
            padding-top:10px;
            padding-left: 10px;
          }

          form {
            padding: 10px;           
          }

          img {
            border-radius:12px;
            height: auto;
            width: 100%;
          }

            textarea {
            border: ${
              drag === DRAG_IMAGES_STATES.DRAG_OVER
                ? "3px dashed #09f"
                : "3px solid transparent"
            };
            border-radius:10px;
            font-size: 21px;
            min-height: 200px;
            padding: 15px
            outline: 0;
            resize: none;
            width: 100%;
            }
      `}</style>
    </>
  )
}
