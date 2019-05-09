import { join } from 'path'
// tslint:disable-next-line:no-var-requires
require('dotenv').config({ path: join(__dirname, './.env.test') })
import { Server } from 'http'
import Koa from 'koa'
import bodyParser = require('koa-bodyparser')
import supertest = require('supertest')
import { Logger } from '../logger'
import { createRoutes } from '../routes'

let server: Server

function mockJWTModule() {
  return {
    sign: () => 'mocked-jwt',
    verify: (jwt: string) => {
      if (!jwt || jwt !== 'mocked-jwt') {
        throw new Error('<mocked> jsonwebtoken could not verify jwt') }
      return ({ iat: 'a while ago' })
    }
  }
}

const setup = () => {
  const app = new Koa()
  const logger = new Logger(0)
  app.use(bodyParser({ onerror: (err) => console.error(err) }))
  app.use(createRoutes(logger))
  server = app.listen(3000)
  const req = supertest(server)
  return { req, app }
}

afterEach(() => server.close())

describe('/login', () => {
  it('400s malformed request', async () => {
    const { req } = setup()
    await req
      .post('/login')
      .send({ username: 'junk', passwd: 'bonds' })
      .expect(400)
  })

  it('401s to bad creds', async () => {
    const { req } = setup()
    await req
      .post('/login')
      .send({ login: 'junk', password: 'bonds' })
      .expect(401)
  })

  it('returns a flag to good creds', async () => {
    const { req } = setup()
    await req
      .post('/login')
      .send({ login: 'test-user', password: 'test-password' })
      .expect(
        'Set-Cookie',
        'bouncer-auth-flag=foobar; path=/; samesite=strict; httponly'
      )
      .expect(200)
  })
})
