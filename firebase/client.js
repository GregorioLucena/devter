import * as firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyBDa88JyqcW-RxcA3fJhzg0Gm1fzT4zPms",
  authDomain: "devter-99fc0.firebaseapp.com",
  databaseURL: "https://devter-99fc0.firebaseio.com",
  projectId: "devter-99fc0",
  storageBucket: "devter-99fc0.appspot.com",
  messagingSenderId: "497697811787",
  appId: "1:497697811787:web:0f681bc56cf3d1a31f4cce",
  measurementId: "G-805H54Y1C3",
}

!firebase.apps.length && firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

const mapUserFromFirebaseAuthToUser = (user) => {
  const { displayName, email, photoURL, uid } = user

  return {
    avatar: photoURL,
    username: displayName,
    email,
    uid,
  }
}

export const onAuthStateChanged = (onChange) => {
  return firebase.auth().onAuthStateChanged((user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null
    onChange(normalizedUser)
  })
}

export const loginWithGitHub = () => {
  const githubProvider = new firebase.auth.GithubAuthProvider()
  return firebase.auth().signInWithPopup(githubProvider)
}

export const addDevit = ({ avatar, content, img, userId, userName }) => {
  return db.collection("devits").add({
    avatar,
    content,
    img,
    userId,
    userName,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    likesCount: 0,
    sharedCount: 0,
  })
}

export const fetchLatesDevits = () => {
  return db
    .collection("devits")
    .orderBy("createdAt", "desc")
    .get()
    .then(({ docs }) => {
      return docs.map((doc) => {
        const data = doc.data()
        const id = doc.id
        const { createdAt } = data

        return {
          ...data,
          id,
          createdAt: +createdAt.toDate(),
        }
      })
    })
}

export const upLoadImage = (file) => {
  const ref = firebase.storage().ref(`images/${file.name}`)
  const task = ref.put(file)
  return task
}
