import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { updateRoastReaction } from "@/lib/roasts"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { reactionType } = await request.json()

    if (!["fire", "laugh", "cry"].includes(reactionType)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 })
    }

    await updateRoastReaction(params.id, reactionType)

    return NextResponse.json({
      message: "Reaction updated successfully",
    })
  } catch (error) {
    console.error("Update reaction error:", error)
    return NextResponse.json({ error: "Failed to update reaction" }, { status: 500 })
  }
}
