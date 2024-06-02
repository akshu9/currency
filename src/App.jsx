import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Currency from './components/CurrencyConverter'

function App() {
  const apiKey=import.meta.env.VITE_REACT_CURRENCY

  return (
    <>
      <Currency apiKey={apiKey}/>
    </>
  )
}

export default App
