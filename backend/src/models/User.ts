import db from '../../config/db.js'

class User {
  static async findByUsername(username: string) {
    const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [
      username,
    ])
    return rows[0]
  }

  // static async create(username, password) {
  //   const [result] = await db.query(
  //     'INSERT INTO user (username, password) VALUES (?, ?)',
  //     [username, password]
  //   )
  //   return result.insertId
  // }
}

export default User
