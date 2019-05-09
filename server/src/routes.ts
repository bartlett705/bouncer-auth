import Koa from 'koa'
import Router from 'koa-router'
import { Logger } from './logger'

enum Role {
  Admin = 'admin',
  Pleb = 'pleb'
}

const JWT_COOKIE = 'bouncer-auth-flag'

export const createRoutes = (logger: Logger) => {
  const passphrase = process.env.KEY_PASS
  if (!process.env.AUTH_LOGIN || !process.env.AUTH_PASSWORD || !process.env.FLAG) {
    throw new Error('Missing auth config 😭')
  }

  const router = new Router()
  router.post('/login', async (ctx: Koa.Context) => {
    const { request } = ctx
    if (!request.body) {
      ctx.status = 400
      return
    }

    const { login, password } = request.body as any
    if (!login || !password) {
      ctx.status = 400
      return
    }

    logger.debug('login request from:', login)

    if (
      login === process.env.AUTH_LOGIN &&
      password === process.env.AUTH_PASSWORD
    ) {
      logger.info('OH SNAP! Somebody got a flag cookie at ', new Date().toISOString())
      ctx.cookies.set(JWT_COOKIE, process.env.FLAG, { httpOnly: true, sameSite: true })
      ctx.status = 200
      ctx.body = 'Cool Beans 👍'
      return
    } else {
      logger.info('Auth rejected.')
      ctx.status = 401
      ctx.body = 'Nope 👎'
      return
    }
  })

  return router.routes()
}
