// eslint-disable-next-line
import React from 'react'
import './App.scss'

import AppBar from 'components/AppBar/AppBar'
import BoardBar from 'components/BoardBar/BoardBar'
import BoardContent from 'components/BoardContent/BoardContent'

function App() {
  return (
    <div className="trello-master">
      <nav><AppBar/></nav>
      <nav><BoardBar/></nav>
      <div><BoardContent/></div>
    </div>
  );
}

export default App
