import React from 'react'
import AppRouter from './AppRouter'

import { useEffect } from "react";
import api from "./services/api";

function App() {

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;