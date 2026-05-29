import { useState } from 'react'
import Dashboard from './Dashboard.jsx'
import Settings from './Settings.jsx'
import Login from './UsersManager/Login.jsx'
import Register from './UsersManager/Register.jsx'

function App() {
  const [currentScreen, setCurrentScreen] = useState('login')

  if (currentScreen === 'login') {
    return <Login setScreen={setCurrentScreen} />
  }

  if (currentScreen === 'register') {
    return <Register setScreen={setCurrentScreen} />
  }

  if (currentScreen === 'settings') {
    return <Settings setScreen={setCurrentScreen} />
  }

  return <Dashboard setScreen={setCurrentScreen} />
}

export default App
