import React = require('react')
import { fireEvent, render } from 'react-testing-library'
import { App } from '../app'

declare var global: any

it('renders a couple inputs and button', () => {
  const { getByLabelText, getByText } = render(<App />)
  getByLabelText(/user/i)
  getByLabelText(/password/i)
  getByText(/log in/i)
})

it('submits on clicking Log In', () => {
  const { getByLabelText, getByText } = render(<App />)
  global.fetch = jest.fn(() => ({ status: 200 }))

  const input = getByLabelText(/user/i)
  fireEvent.change(input, { target: { value: 'test-user' } })
  const passwordInput = getByLabelText(/password/i)
  fireEvent.change(passwordInput, { target: { value: 'test-pass' } })
  const submitButton = getByText(/log in/i)
  fireEvent.click(submitButton)

  expect(global.fetch).toHaveBeenCalledWith('/api/login', {
    body: '{"login":"test-user","password":"test-pass"}',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  })
})
