import { findUserByCredentials } from '../services/userService.js';

export function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const user = findUserByCredentials(username, password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  return res.json({
    success: true,
    role: user.role,
    user: {
      id: user.id,
      username: user.username
    }
  });
}
