import * as React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
  } from 'react-router-dom'
import './index.scss'
import { LoginForm } from './login-page'

export const App = () => (
    <Router>
      <header>
        <h1>Bouncer - Keep Out</h1>
      </header>
      <main>
        <Switch>
          <Route path="/" exact component={LoginForm} />
          <Route path="/secret" component={SecretRoot} />
        </Switch>
      </main>
      <footer>
        <div>
          [ ©️ 2019 <a href="https://github.com/bartlett705">Ahmad K, KNS</a> ]
        </div>
      </footer>
    </Router>
  )

export const SecretRoot: React.FunctionComponent = () => (
    <>
      <h1>Congrats, you got the flag! 🎉</h1>
      You totally pwned my shoddy auth system.
      Submit the proof in your `bouncer-auth-flag` cookie to @moseycode on Twitter for my everlasting respek.
    </>
  )
