import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface Roast {
  _id?: string
  userId: string
  content: string
  style: string
  language: string
  imageUrl?: string
  userInput?: string
  rating: number
  createdAt: Date
  reactions: {
    fire: number
    laugh: number
    cry: number
  }
}

export async function saveRoast(roastData: {
  userId: string
  content: string
  style: string
  language: string
  imageUrl?: string
  userInput?: string
}): Promise<Roast> {
  try {
    // Validate userId format
    if (!ObjectId.isValid(roastData.userId)) {
      throw new Error("Invalid user ID format")
    }

    const db = await getDatabase()
    const roasts = db.collection("roasts")

    const newRoast = {
      userId: roastData.userId,
      content: roastData.content,
      style: roastData.style,
      language: roastData.language,
      imageUrl: roastData.imageUrl || null,
      userInput: roastData.userInput || null,
      rating: 0,
      createdAt: new Date(),
      reactions: {
        fire: 0,
        laugh: 0,
        cry: 0,
      },
    }

    const result = await roasts.insertOne(newRoast)

    // Update user's total roasts count
    const users = db.collection("users")
    await users.updateOne(
      { _id: new ObjectId(roastData.userId) }, 
      { $inc: { totalRoasts: 1 } }
    )

    // ✅ Explicit property mapping for return value
    return {
      _id: result.insertedId.toString(),
      userId: newRoast.userId,
      content: newRoast.content,
      style: newRoast.style,
      language: newRoast.language,
      imageUrl: newRoast.imageUrl || undefined,
      userInput: newRoast.userInput || undefined,
      rating: newRoast.rating,
      createdAt: newRoast.createdAt,
      reactions: newRoast.reactions,
    }
  } catch (error) {
    console.error("Error saving roast:", error)
    throw error
  }
}

export async function getUserRoasts(userId: string, limit = 10): Promise<Roast[]> {
  try {
    // Validate userId format
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format")
    }

    const db = await getDatabase()
    const roasts = db.collection("roasts")

    const userRoasts = await roasts
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // ✅ Explicit property mapping instead of spread operator
    return userRoasts.map((roast) => ({
      _id: roast._id.toString(),
      userId: roast.userId,
      content: roast.content,
      style: roast.style,
      language: roast.language,
      imageUrl: roast.imageUrl || undefined,
      userInput: roast.userInput || undefined,
      rating: roast.rating || 0,
      createdAt: roast.createdAt,
      reactions: roast.reactions || {
        fire: 0,
        laugh: 0,
        cry: 0,
      },
    }))
  } catch (error) {
    console.error("Error getting user roasts:", error)
    throw error
  }
}

export async function updateRoastReaction(
  roastId: string, 
  reactionType: "fire" | "laugh" | "cry"
): Promise<boolean> {
  try {
    // Validate roastId format
    if (!ObjectId.isValid(roastId)) {
      throw new Error("Invalid roast ID format")
    }

    const db = await getDatabase()
    const roasts = db.collection("roasts")

    const result = await roasts.updateOne(
      { _id: new ObjectId(roastId) }, 
      { $inc: { [`reactions.${reactionType}`]: 1 } }
    )

    return result.modifiedCount === 1
  } catch (error) {
    console.error("Error updating roast reaction:", error)
    throw error
  }
}

// ✅ Additional useful functions
export async function getRoastById(roastId: string): Promise<Roast | null> {
  try {
    if (!ObjectId.isValid(roastId)) {
      return null
    }

    const db = await getDatabase()
    const roasts = db.collection("roasts")

    const roast = await roasts.findOne({ _id: new ObjectId(roastId) })
    if (!roast) {
      return null
    }

    // ✅ Explicit property mapping
    return {
      _id: roast._id.toString(),
      userId: roast.userId,
      content: roast.content,
      style: roast.style,
      language: roast.language,
      imageUrl: roast.imageUrl || undefined,
      userInput: roast.userInput || undefined,
      rating: roast.rating || 0,
      createdAt: roast.createdAt,
      reactions: roast.reactions || {
        fire: 0,
        laugh: 0,
        cry: 0,
      },
    }
  } catch (error) {
    console.error("Error getting roast by ID:", error)
    return null
  }
}

export async function deleteRoast(roastId: string, userId: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(roastId) || !ObjectId.isValid(userId)) {
      return false
    }

    const db = await getDatabase()
    const roasts = db.collection("roasts")

    // Only allow user to delete their own roasts
    const result = await roasts.deleteOne({ 
      _id: new ObjectId(roastId), 
      userId 
    })

    if (result.deletedCount === 1) {
      // Decrease user's total roasts count
      const users = db.collection("users")
      await users.updateOne(
        { _id: new ObjectId(userId) }, 
        { $inc: { totalRoasts: -1 } }
      )
      return true
    }

    return false
  } catch (error) {
    console.error("Error deleting roast:", error)
    return false
  }
}

export async function updateRoastRating(roastId: string, rating: number): Promise<boolean> {
  try {
    if (!ObjectId.isValid(roastId)) {
      throw new Error("Invalid roast ID format")
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5")
    }

    const db = await getDatabase()
    const roasts = db.collection("roasts")

    const result = await roasts.updateOne(
      { _id: new ObjectId(roastId) },
      { $set: { rating } }
    )

    return result.modifiedCount === 1
  } catch (error) {
    console.error("Error updating roast rating:", error)
    throw error
  }
}

export async function getAllRoasts(limit = 20): Promise<Roast[]> {
  try {
    const db = await getDatabase()
    const roasts = db.collection("roasts")

    const allRoasts = await roasts
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // ✅ Explicit property mapping
    return allRoasts.map((roast) => ({
      _id: roast._id.toString(),
      userId: roast.userId,
      content: roast.content,
      style: roast.style,
      language: roast.language,
      imageUrl: roast.imageUrl || undefined,
      userInput: roast.userInput || undefined,
      rating: roast.rating || 0,
      createdAt: roast.createdAt,
      reactions: roast.reactions || {
        fire: 0,
        laugh: 0,
        cry: 0,
      },
    }))
  } catch (error) {
    console.error("Error getting all roasts:", error)
    throw error
  }
}
