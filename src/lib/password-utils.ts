import crypto from 'crypto'

const ENCODING_KEY = process.env.PASSWORD_ENCODING_KEY || 'default-key-change-in-production'
const algorithm = 'aes-256-cbc'

/**
 * Encode a password for additional security layer
 * Uses a deterministic approach to ensure consistent encoding
 */
export function encodePassword(password: string): string {
  try {
    // Create a deterministic IV from the password and key
    const hash = crypto.createHash('sha256')
    hash.update(password + ENCODING_KEY)
    const deterministicSeed = hash.digest()
    const iv = deterministicSeed.slice(0, 16) // Use first 16 bytes as IV
    
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCODING_KEY.slice(0, 32).padEnd(32, '0')), iv)
    let encrypted = cipher.update(password, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Password encoding error:', error)
    // Return original password if encoding fails (for backward compatibility)
    return password
  }
}

/**
 * Decode a password from encoded format
 */
export function decodePassword(encodedPassword: string): string {
  try {
    if (!encodedPassword.includes(':')) {
      // Not encoded, return as-is (backward compatibility)
      return encodedPassword
    }

    const [ivHex, encrypted] = encodedPassword.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCODING_KEY.slice(0, 32).padEnd(32, '0')), iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error('Password decoding error:', error)
    // Return encoded password if decoding fails (fallback)
    return encodedPassword
  }
}

/**
 * Validate if a password matches the encoded version
 */
export function validateEncodedPassword(plainPassword: string, encodedPassword: string): boolean {
  try {
    const decodedPassword = decodePassword(encodedPassword)
    return plainPassword === decodedPassword
  } catch (error) {
    console.error('Password validation error:', error)
    return false
  }
}

/**
 * Get admin credentials from environment variables
 */
export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME || 'System Administrator'
  }
}