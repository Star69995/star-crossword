import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Block from './components/block'
// import Grid from './components/Grid'
import MakeGrid from './providers/MakeGrid'
import definitions from './assets/definitions.json';
import Crossword from './components/Crossword'
import { CrosswordProvider } from './providers/CrosswordContext'

import React from 'react';




function App() {
  // const [showGrid, setShowGrid] = useState(false);

  // const crossword = generateCrossword(definitions);

  return (
    <CrosswordProvider>
      <Crossword />
    </CrosswordProvider>
  );
}

export default App
