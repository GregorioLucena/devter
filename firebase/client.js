import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyBDa88JyqcW-RxcA3fJhzg0Gm1fzT4zPms',
  authDomain: 'devter-99fc0.firebaseapp.com',
  databaseURL: 'https://devter-99fc0.firebaseio.com',
  projectId: 'devter-99fc0',
  storageBucket: 'devter-99fc0.appspot.com',
  messagingSenderId: '497697811787',
  appId: '1:497697811787:web:0f681bc56cf3d1a31f4cce',
  measurementId: 'G-805H54Y1C3'
}

!firebase.apps.length && firebase.initializeApp(firebaseConfig)

const mapUserFromFirebaseAuthToUser = (user) => {
  console.log(user)
  const { displayName, email, photoURL } = user

  return {
    avatar: photoURL,
    username: displayName,
    email
  }
}

export const onAuthStateChanged = (onChange) => {
  return firebase
    .auth()
    .onAuthStateChanged(user => {
      const normalizedUser = mapUserFromFirebaseAuthToUser(user)
      onChange(normalizedUser)
    })
}

export const loginWithGitHub = () => {
  const githubProvider = new firebase.auth.GithubAuthProvider()
  return firebase
    .auth()
    .signInWithPopup(githubProvider)
}
