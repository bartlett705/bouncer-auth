import * as React from 'react'
import { RouterProps } from 'react-router'

(window as any).testing = true

interface State {
  fetchError?: string
  inputError: boolean
  working: boolean
  usernameValue: string
  passwordValue: string
}

export class LoginForm extends React.Component<RouterProps> {
  public state: State = {
    inputError: false,
    passwordValue: '',
    usernameValue: '',
    working: false
  }

  public render() {
    return (
      <>
        <form onSubmit={this.login}>
          <label>
            Username
            <input
              value={this.state.usernameValue}
              onChange={(e) =>
                this.setState({ usernameValue: e.currentTarget.value })
              }
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={this.state.passwordValue}
              onChange={(e) =>
                this.setState({ passwordValue: e.currentTarget.value })
              }
            />
          </label>
          <button>Log In</button>
        </form>
        {(this.state.inputError || this.state.fetchError) && (
          <div className="errors">
            {this.state.fetchError}
            {this.state.inputError && 'Username and Password cannot be blank.'}
          </div>
        )}
        {this.state.working && (
          <span role="img" className="loading">
            🔏
          </span>
        )}
      </>
    )
  }

  private redirectToFlagPage() {
    this.props.history.push('/bouncer/secret')
  }

  private login = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.setState({ fetchError: undefined })
    if (
      this.state.usernameValue.length < 1 ||
      this.state.passwordValue.length < 1
    ) {
      this.setState({ inputError: true })
      return
    }

    this.setState({ inputError: false, working: true })
    let fetchError = 'Error Authorizing 😭'
    try {
      const res = await requestLogin({
        login: this.state.usernameValue,
        password: this.state.passwordValue
      })
      if (res.status === 200) {
        this.redirectToFlagPage()
        return
      } else if (res.status === 429) {
        fetchError = 'Slow down, cowboy 😜'
      } else if (res.status === 401) {
        fetchError =
          "Invalid Authorization. Are you sure you're supposed to be here? 🤔"
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err)
    } finally {
      this.setState({ fetchError, working: false })
    }
  }
}

const requestLogin = async ({
  login,
  password
}: {
  login: string
  password: string
}) => {
  return fetch('/api/login', {
    body: JSON.stringify({ login, password }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}
