import { validateLogin, validateRegistration } from '../validators/authValidation.js'

export function createAuthController(authService) {
  return {
    register: async (request, response, next) => {
      const user = await authService.register(validateRegistration(request.body))
      request.session.regenerate(error => {
        if (error) return next(error)
        request.session.user = user
        request.session.save(saveError => {
          if (saveError) return next(saveError)
          response.status(201).json({ user })
        })
      })
    },

    login: async (request, response, next) => {
      let user
      try {
        user = await authService.login(validateLogin(request.body))
      } catch (error) {
        return next(error)
      }
      request.session.regenerate(error => {
        if (error) return next(error)
        request.session.user = user
        request.session.save(saveError => {
          if (saveError) return next(saveError)
          response.json({ user })
        })
      })
    },

    me: (request, response) => {
      response.json({ user: request.session.user || null })
    },

    logout: (request, response, next) => {
      request.session.destroy(error => {
        if (error) return next(error)
        response.clearCookie('alertaja.sid')
        response.status(204).end()
      })
    }
  }
}
