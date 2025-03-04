// import { useState, useContext } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import Block from './components/block'
// import Grid from './components/Grid'
// import MakeGrid from './providers/MakeGrid'
// import definitions from './assets/definitions.json';
import Crossword from './components/board/Crossword'
// import { CrosswordProvider } from './providers/CrosswordContext'

// import React from 'react';
import CrosswordSetup from './components/customizeBoard/CrosswordSetup'
import { useCrossword } from './providers/CrosswordContext'




function App() {

  const { showSetup } = useCrossword();

  return (

    <>
      {showSetup ? <CrosswordSetup /> : null}
      <Crossword />
    </>

  );
}

export default App
