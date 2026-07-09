import React from 'react'
import { Route, Switch } from 'wouter'
import Navbar from './components/Navbar'
import Page404 from './pages/Page404'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Movies from './pages/Movies'

export default function AppRouter() {
  return (
    <>
      <Navbar />

      <main className="container-fluid">
        <Switch>
          <Route path="/">
            <Home />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/movies">
            <Movies />
          </Route>

          <Route>
            <Page404 />
          </Route>
        </Switch>
      </main>
    </>
  )
}
