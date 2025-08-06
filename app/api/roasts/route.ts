import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { saveRoast, getUserRoasts } from "@/lib/roasts"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { content, style, language, imageUrl, userInput } = await request.json()

    if (!content || !style || !language) {
      return NextResponse.json({ error: "Content, style, and language are required" }, { status: 400 })
    }

    // Save roast to database
    const roast = await saveRoast({
      userId: decoded.userId,
      content,
      style,
      language,
      imageUrl,
      userInput,
    })

    return NextResponse.json({
      message: "Roast saved successfully",
      roast: {
        id: roast._id,
        content: roast.content,
        style: roast.style,
        language: roast.language,
        imageUrl: roast.imageUrl,
        rating: roast.rating,
        createdAt: roast.createdAt,
        reactions: roast.reactions,
      },
    })
  } catch (error) {
    console.error("Save roast error:", error)
    return NextResponse.json({ error: "Failed to save roast" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get user's roasts
    const roasts = await getUserRoasts(decoded.userId, limit)

    return NextResponse.json({
      roasts: roasts.map((roast) => ({
        id: roast._id,
        content: roast.content,
        style: roast.style,
        language: roast.language,
        imageUrl: roast.imageUrl,
        rating: roast.rating,
        createdAt: roast.createdAt,
        reactions: roast.reactions,
      })),
    })
  } catch (error) {
    console.error("Get roasts error:", error)
    return NextResponse.json({ error: "Failed to get roasts" }, { status: 500 })
  }
}
