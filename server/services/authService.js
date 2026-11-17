import bcrypt from 'bcryptjs'
import { ApiError } from '../middlewares/errors.js'

export function createAuthService(db) {
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, created_at)
    VALUES (@name, @email, @passwordHash, @createdAt)
  `)
  const findByEmail = db.prepare('SELECT * FROM users WHERE email = ?')

  return {
    async register({ name, email, password }) {
      if (findByEmail.get(email)) {
        throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.')
      }
      const passwordHash = await bcrypt.hash(password, 12)
      const result = insertUser.run({
        name, email, passwordHash, createdAt: Date.now()
      })
      return { id: Number(result.lastInsertRowid), name, email }
    },

    async login({ email, password }) {
      const user = findByEmail.get(email)
      const valid = user && await bcrypt.compare(password, user.password_hash)
      if (!valid) {
        throw new ApiError(401, 'INVALID_LOGIN', 'E-mail ou senha inválidos.')
      }
      return { id: user.id, name: user.name, email: user.email }
    }
  }
}
