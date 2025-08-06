import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'


/* Optional: raise JSON body limit to 10 MB */
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

/* ---------- POST /api/upload/photo/[userid]/[name] ---------- */
export async function POST(
  request: NextRequest,
  { params }: { params: { userid: string; name: string } }
) {
  try {
    /* --- auth --- */
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    /* --- body --- */
    const { image, title, contentType, size } = await request.json()
    if (!image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }

    /* --- extract base64 data --- */
    const { userid, name: username } = params
    
    // Remove data:image/...;base64, prefix if present
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '')
    const detectedContentType = image.match(/^data:image\/([a-zA-Z0-9+]+);/)?.[1] || contentType || 'jpeg'

    /* --- MongoDB: store multiple photos in one document --- */
    const db = await getDatabase()
    
    // Find existing document
    const existingDoc = await db.collection('photos').findOne({
      userId: userid,
      name: username
    })

    const newPhoto = {
      imageData: base64Data,
      contentType: detectedContentType,
      title: title || `Photo ${Date.now()}`,
      size: size || null,
      uploadDate: new Date()
    }

    if (existingDoc) {
      // Add new photo to existing photos array
      const photoCount = Object.keys(existingDoc.photos || {}).length + 1
      const photoKey = `photo${photoCount}`
      
      await db.collection('photos').updateOne(
        { userId: userid, name: username },
        { 
          $set: { 
            [`photos.${photoKey}`]: newPhoto,
            updatedAt: new Date()
          }
        }
      )
      
      return NextResponse.json({ 
        message: `Photo added successfully as ${photoKey}`,
        photoKey: photoKey,
        totalPhotos: photoCount
      }, { status: 200 })
      
    } else {
      // Create new document with first photo
      const doc = {
        userId: userid,
        name: username,
        photos: {
          photo1: newPhoto
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.collection('photos').insertOne(doc)
      
      return NextResponse.json({ 
        message: 'Photo saved successfully as photo1',
        photoKey: 'photo1',
        totalPhotos: 1
      }, { status: 200 })
    }
    
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userid: string; name: string }> }
) {
  try {
    // Await params FIRST!
    const { userid, name } = await params
    const { searchParams } = new URL(request.url)
    const photoKey = searchParams.get('photo') // Optionally get specific photo

    const db = await getDatabase()
    const doc = await db.collection('photos').findOne({
      userId: userid,
      name: name
    })

    if (!doc) {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 })
    }

    // If specific photo requested
    if (photoKey && doc.photos?.[photoKey]) {
      return NextResponse.json({
        photoKey: photoKey,
        ...doc.photos[photoKey],
        userId: doc.userId,
        name: doc.name
      })
    }

    // Return all photos
    return NextResponse.json({
      userId: doc.userId,
      name: doc.name,
      photos: doc.photos,
      totalPhotos: Object.keys(doc.photos || {}).length,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    })

  } catch (err) {
    console.error('Get photo error:', err)
    return NextResponse.json({ error: 'Failed to retrieve photos' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userid: string; name: string }> }
) {
  try {
    // Await params FIRST!
    const { userid, name } = await params
    const { searchParams } = new URL(request.url)
    const photoKey = searchParams.get('photo')

    if (!photoKey) {
      return NextResponse.json({ error: 'Photo key required' }, { status: 400 })
    }

    const db = await getDatabase()

    await db.collection('photos').updateOne(
      { userId: userid, name: name },
      {
        $unset: { [`photos.${photoKey}`]: 1 },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      message: `${photoKey} deleted successfully`
    }, { status: 200 })

  } catch (err) {
    console.error('Delete photo error:', err)
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}
