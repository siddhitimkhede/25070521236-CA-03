import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'rossele_skin_luxury_super_secret_jwt_key_2026_flexi',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};
