import React from 'react'
import AppRouter from './AppRouter'

import { useEffect } from "react";
import api from "./services/api";

function App() {

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await api.get("/movies");
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getMovies();
  }, []);

  return (
    <>
      <AppRouter />
      <h1>Probando API</h1>
    </>
  );
}

export default App;