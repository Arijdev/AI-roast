import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { getDatabase } from "./mongodb"

// Secure JWT secret handling with proper typing
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required")
  }
  return secret
}

const JWT_SECRET = getJWTSecret()

export interface User {
  _id?: string
  name: string
  email: string
  password?: string
  joinDate: Date
  profileImage?: string
  totalRoasts: number
  favoriteStyle: string
  level: string
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
function isValidPassword(password: string): boolean {
  return password.length >= 8
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Type guard to check if decoded has userId property
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      return decoded as { userId: string }
    }
    console.log("Invalid token structure:", decoded)
    // If the structure is not as expected, return null
    return null
  } catch {
    return null
  }
}

// User management functions
export async function createUser(userData: {
  name: string
  email: string
  password: string
}): Promise<User> {
  try {
    // Input validation
    if (!userData.name?.trim()) {
      throw new Error("Name is required")
    }
    if (!userData.email?.trim()) {
      throw new Error("Email is required")
    }
    if (!isValidEmail(userData.email)) {
      throw new Error("Invalid email format")
    }
    if (!isValidPassword(userData.password)) {
      throw new Error("Password must be at least 8 characters long")
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Check if user already exists (normalize email)
    const existingUser = await users.findOne({ email: userData.email.toLowerCase() })
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user (normalize and sanitize data)
    const newUser = {
      name: userData.name.trim(),
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      joinDate: new Date(),
      totalRoasts: 0,
      favoriteStyle: "savage",
      level: "beginner",
    }

    const result = await users.insertOne(newUser)

    // Return user without password
    const { password, ...userWithoutPassword } = newUser
    return {
      ...userWithoutPassword,
      _id: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    // Input validation
    if (!email || !password) {
      return null
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Find user (normalize email)
    const user = await users.findOne({ email: email.toLowerCase() })
    if (!user) {
      return null
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return null
    }

    // Return user without password with explicit property mapping
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      joinDate: user.joinDate,
      profileImage: user.profileImage,
      totalRoasts: user.totalRoasts,
      favoriteStyle: user.favoriteStyle,
      level: user.level,
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    // Input validation
    if (!userId) {
      return null
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return null
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Find user by ObjectId
    const user = await users.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return null
    }

    // Return user without password with explicit property mapping
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      joinDate: user.joinDate,
      profileImage: user.profileImage,
      totalRoasts: user.totalRoasts,
      favoriteStyle: user.favoriteStyle,
      level: user.level,
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
  try {
    // Input validation
    if (!userId || !ObjectId.isValid(userId)) {
      return null
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Remove fields that shouldn't be updated directly
    const { _id, password, joinDate, ...allowedUpdates } = updateData

    // Normalize email if being updated
    if (allowedUpdates.email) {
      if (!isValidEmail(allowedUpdates.email)) {
        throw new Error("Invalid email format")
      }
      allowedUpdates.email = allowedUpdates.email.toLowerCase()
    }

    // Trim name if being updated
    if (allowedUpdates.name) {
      allowedUpdates.name = allowedUpdates.name.trim()
      if (!allowedUpdates.name) {
        throw new Error("Name cannot be empty")
      }
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return getUserById(userId)
    }

    // Check for email uniqueness if email is being updated
    if (allowedUpdates.email) {
      const existingUser = await users.findOne({ 
        email: allowedUpdates.email,
        _id: { $ne: new ObjectId(userId) }
      })
      if (existingUser) {
        throw new Error("Email already exists")
      }
    }

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: allowedUpdates }
    )

    if (result.matchedCount === 0) {
      return null
    }

    return getUserById(userId)
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    // Input validation
    if (!userId || !ObjectId.isValid(userId)) {
      return false
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const result = await users.deleteOne({ _id: new ObjectId(userId) })
    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    // Input validation
    if (!userId || !ObjectId.isValid(userId)) {
      return false
    }
    if (!isValidPassword(newPassword)) {
      throw new Error("New password must be at least 8 characters long")
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Get current user
    const user = await users.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return false
    }

    // Verify current password
    const isValidCurrent = await verifyPassword(currentPassword, user.password)
    if (!isValidCurrent) {
      return false
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedNewPassword } }
    )

    return result.modifiedCount === 1
  } catch (error) {
    console.error("Error updating password:", error)
    return false
  }
}
