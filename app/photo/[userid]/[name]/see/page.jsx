"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Download, ArrowLeft } from "lucide-react"

export default function PhotoView() {
  const params = useParams()
  // If using /see/[userid]/[name] route, params is an object with { userid, name }
  // If your route is different, adjust accordingly!
  const router = useRouter()
  const userid = params?.userid
  const name = params?.name

  const [photoData, setPhotoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/upload/photo/${userid}/${name}`)
        if (!response.ok) {
          throw new Error('Failed to fetch photos')
        }
        const data = await response.json()
        setPhotoData(data)
        const firstKey = data?.photos ? Object.keys(data.photos)[0] : null
        if (firstKey) {
          setSelectedPhoto(firstKey)
        }
      } catch (err) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    if (userid && name) {
      fetchPhotos()
    }
  }, [userid, name])

  const photoKeys = photoData?.photos ? Object.keys(photoData.photos) : []
  const currentPhoto = selectedPhoto && photoData?.photos?.[selectedPhoto]
  const currentIndex = photoKeys.indexOf(selectedPhoto)

  const nextPhoto = () => {
    if (photoKeys.length < 2) return
    const nextIndex = (currentIndex + 1) % photoKeys.length
    setSelectedPhoto(photoKeys[nextIndex])
  }

  const prevPhoto = () => {
    if (photoKeys.length < 2) return
    const prevIndex = (currentIndex - 1 + photoKeys.length) % photoKeys.length
    setSelectedPhoto(photoKeys[prevIndex])
  }

  const downloadPhoto = () => {
    if (currentPhoto) {
      const link = document.createElement('a')
      link.href = `data:image/${currentPhoto.contentType || 'jpeg'};base64,${currentPhoto.imageData}`
      link.download = `${selectedPhoto}_${name}.${currentPhoto.contentType || 'jpg'}`
      link.click()
    }
  }

  const deletePhoto = async (photoKey) => {
    if (!confirm(`Are you sure you want to delete photo "${photoKey}"?`)) return
    try {
      const response = await fetch(
        `/api/upload/photo/${userid}/${name}?photo=${encodeURIComponent(photoKey)}`,
        { method: 'DELETE' }
      )
      if (response.ok) {
        const updatedPhotos = { ...photoData.photos }
        delete updatedPhotos[photoKey]
        setPhotoData({ ...photoData, photos: updatedPhotos })
        const keys = Object.keys(updatedPhotos)
        setSelectedPhoto(keys[0] || null)
      } else {
        alert('Failed to delete photo')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete photo')
    }
  }

  // --- Loading and Error UI ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!photoData?.photos || photoKeys.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Photos Found</h1>
          <p className="text-gray-600">No photos found for this user.</p>
        </div>
      </div>
    )
  }

  // --- Main Gallery UI ---
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Photo Gallery - {name}
            </h1>
            <p className="text-gray-600">
              User: <span className="font-medium">{userid}</span> | 
              Total Photos: <span className="font-medium">{photoKeys.length}</span>
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Thumbnails */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">All Photos</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {photoKeys.map((photoKey) => (
                <button
                  key={photoKey}
                  onClick={() => setSelectedPhoto(photoKey)}
                  className={`w-full p-2 rounded-lg border-2 transition-all ${
                    selectedPhoto === photoKey
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={`data:image/${photoData.photos[photoKey].contentType || 'jpeg'};base64,${photoData.photos[photoKey].imageData}`}
                    alt={photoKey}
                    className="w-full h-20 object-cover rounded"
                  />
                  <p className="text-xs mt-1 font-medium text-gray-700">{photoKey}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Photo Display */}
          <div className="lg:col-span-3">
            {currentPhoto && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Navigation Controls */}
                {photoKeys.length > 1 && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                    <button
                      onClick={prevPhoto}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <span className="text-gray-600 font-medium">
                      {selectedPhoto} ({currentIndex + 1} of {photoKeys.length})
                    </span>
                    
                    <button
                      onClick={nextPhoto}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Photo Display */}
                <div className="relative" style={{ minHeight: '500px' }}>
                  <img
                    src={`data:image/${currentPhoto.contentType || 'jpeg'};base64,${currentPhoto.imageData}`}
                    alt={currentPhoto.title || selectedPhoto}
                    className="w-full h-auto object-contain max-h-[70vh]"
                  />
                </div>
                
                {/* Photo Metadata */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {currentPhoto.title || selectedPhoto}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadPhoto}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => deletePhoto(selectedPhoto)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Upload Date:</span>
                      <p className="text-gray-600">
                        {currentPhoto.uploadDate ? new Date(currentPhoto.uploadDate).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    {currentPhoto.size && (
                      <div>
                        <span className="font-medium text-gray-700">File Size:</span>
                        <p className="text-gray-600">
                          {Math.round(currentPhoto.size / 1024)} KB
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Format:</span>
                      <p className="text-gray-600 uppercase">
                        {currentPhoto.contentType || 'JPEG'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
