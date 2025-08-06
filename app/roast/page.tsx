"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Flame,
  Upload,
  Camera,
  Type,
  Zap,
  Skull,
  Heart,
  Volume2,
  VolumeX,
  Share2,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Roast Styles
const roastStyles = [
  {
    id: "savage",
    name: "Savage",
    icon: Flame,
    color: "from-red-500 to-red-600",
    description: "Absolutely merciless",
  },
  {
    id: "witty",
    name: "Witty",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    description: "Smart but deadly",
  },
  {
    id: "brutal",
    name: "Brutal",
    icon: Skull,
    color: "from-gray-600 to-gray-800",
    description: "Warning: Contains profanity",
  },
  {
    id: "playful",
    name: "Playful",
    icon: Heart,
    color: "from-pink-500 to-purple-500",
    description: "Cute but cuts deep",
  },
]

// Language Options
const languageOptions = [
  { id: "english", name: "English", flag: "🇺🇸", code: "en-US" },
  { id: "hindi", name: "हिंदी", flag: "🇮🇳", code: "hi-IN" },
  { id: "bengali", name: "বাংলা", flag: "🇧🇩", code: "hi-IN" }, // If you want Bengali TTS, use bn-IN or bn-BD if available
]

// --- AI API Integration ---
async function generateAIRoast(input: string, style: string, language: string) {
  try {
    const response = await fetch("/api/generate-roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ input, style, language }),
    })
    if (!response.ok) throw new Error("Failed to generate roast")
    const data = await response.json()
    return data.roast
  } catch (error) {
    console.error("AI API Error:", error)
    return getSampleRoast(style, language)
  }
}

// --- Sample Roasts Fallback ---
function getSampleRoast(style: string, language: string) {
  const sampleRoasts = {
    english: {
      savage: [
        "Holy shit, looking at your photo made my AI crash twice. Even my algorithms are trying to unsee this disaster.",
        "Damn, you're so basic that even vanilla ice cream has more personality than your entire existence.",
        "Your face is the reason why aliens haven't visited Earth yet. They saw you and noped the fuck out.",
      ],
      witty: [
        "You're like Internet Explorer - slow, outdated, and everyone's trying to replace you with something better.",
        "If stupidity was a superpower, you'd be fucking Superman flying around saving nobody.",
        "You're proof that evolution sometimes takes a coffee break and forgets what it's doing.",
      ],
      brutal: [
        "Jesus fucking Christ, what happened to your face? Did you lose a fight with a blender?",
        "You're so ugly, when you were born the doctor slapped your parents instead of you.",
        "Damn bro, you look like you were assembled by someone who had never seen a human before.",
      ],
      playful: [
        "Aww, you're like a participation trophy - nobody really wanted you, but here you are anyway!",
        "You're so cute! Like a pug - ugly but in an endearing way that makes people feel sorry for you.",
        "Bless your heart, you're trying so hard! It's like watching a penguin try to fly - hilarious but sad.",
      ],
    },
    hindi: {
      savage: [
        "भाई तेरी शक्ल देखकर मेरा AI भी हैंग हो गया। भगवान ने तुझे बनाते वक्त जरूर कोई गलती की है।",
        "तू इतना बेकार है कि तेरे सामने प्याज भी रोना बंद कर देता है।",
        "तेरी फोटो देखकर लगता है जैसे भगवान ने नशे में तुझे बनाया हो।",
      ],
      witty: [
        "तू बिल्कुल Internet Explorer की तरह है - धीमा, पुराना, और सबको तुझसे छुटकारा चाहिए।",
        "अगर बेवकूफी Olympic sport होती तो तू gold medal जीत जाता।",
        "तेरा दिमाग इतना खाली है कि उसमें echo सुनाई देती है।",
      ],
      brutal: [
        "भोसड़ी के, तेरी शक्ल देखकर लगता है जैसे तुझे mixer में डालकर बनाया हो।",
        "मादरचोद, तू इतना गंदा दिखता है कि कुत्ते भी तुझसे दूर भागते हैं।",
        "बहनचोद, तेरी शक्ल देखकर contraceptive ads बनाने चाहिए।",
      ],
      playful: [
        "अरे यार, तू बिल्कुल golden retriever की तरह है - प्यारा लेकिन दिमाग जीरो!",
        "तू वो दोस्त है जिसे सब हंसी-मजाक के लिए रखते हैं। Thanks for entertainment!",
        "भगवान तेरा भला करे, तू कितनी कोशिश करता है! Penguin को उड़ते देखने जैसा है।",
      ],
    },
    bengali: {
      savage: [
        "ওরে ভাই, তোর মুখ দেখে আমার AI-ও crash করে গেছে। ভগবান তোকে বানানোর সময় নিশ্চয়ই ভুল করেছেন।",
        "তুই এত বাজে যে তোর সামনে পেঁয়াজও কাঁদা বন্ধ করে দেয়।",
        "তোর ছবি দেখে মনে হচ্ছে ভগবান নেশা করে তোকে বানিয়েছেন।",
      ],
      witty: [
        "তুই একদম Internet Explorer এর মতো - ধীর, পুরানো, আর সবাই তোর থেকে মুক্তি চায়।",
        "যদি বোকামি Olympic sport হতো তাহলে তুই gold medal জিতে যেতিস।",
        "তোর মাথা এত খালি যে ওখানে echo শোনা যায়।",
      ],
      brutal: [
        "শালার বাচ্চা, তোর মুখ দেখে মনে হচ্ছে তোকে mixer-এ ফেলে বানানো হয়েছে।",
        "হারামজাদা, তুই এত নোংরা দেখতে যে কুকুরেরাও তোর থেকে দূরে পালায়।",
        "বেশ্যার পোলা, তোর মুখ দেখে contraceptive ads বানানো উচিত।",
      ],
      playful: [
        "অরে ইয়ার, তুই একদম golden retriever এর মতো - মিষ্টি কিন্তু বুদ্ধি জিরো!",
        "তুই সেই বন্ধু যাকে সবাই হাসি-তামাশার জন্য রাখে। Thanks for entertainment!",
        "আল্লাহ তোর মঙ্গল করুক, তুই কত চেষ্টা করিস! Penguin কে উড়তে দেখার মতো।",
      ],
    },
  }
  const languageRoasts = sampleRoasts[language as keyof typeof sampleRoasts]
  const styleRoasts = languageRoasts[style as keyof typeof languageRoasts]
  return styleRoasts[Math.floor(Math.random() * styleRoasts.length)]
}

export default function RoastPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState("savage")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [textInput, setTextInput] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentRoast, setCurrentRoast] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeTab, setActiveTab] = useState("photo")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Auth check
  useEffect(() => { checkAuth() }, [])
  useEffect(() => {
    const checkAvailableVoices = () => {
      const voices = speechSynthesis.getVoices()
      console.log("Available voices:", voices)
      const bengaliVoices = voices.filter(voice =>
        voice.lang.toLowerCase().includes('bn') || voice.name.toLowerCase().includes('bengali'))
      console.log("Bengali voices:", bengaliVoices)
      if (bengaliVoices.length === 0) {
        console.log("No Bengali voices found. Available languages:",
          [...new Set(voices.map(v => v.lang))].sort())
      }
    }
    speechSynthesis.onvoiceschanged = () => { checkAvailableVoices() }
    checkAvailableVoices()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' })
      if (response.ok) {
        const result = await response.json()
        setUser(result.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return }
    if (file.size > 10 * 1024 * 1024) { alert('Image must be 10 MB or smaller.'); return }
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string
      setUploadedImage(base64Image)
      setIsUploading(true)
      try {
        const userid = user?._id || 'default-user'
        const username = user?.name || user?.username || 'default-name'
        const response = await fetch(`/api/upload/photo/${userid}/${username}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            image: base64Image,
            title: `Photo by ${username}`, contentType: file.type.split('/')[1] || 'jpeg', size: file.size
          })
        })
        if (!response.ok) throw new Error('Failed to save photo')
        const data = await response.json()
        console.log('Photo saved successfully to MongoDB', data)
      } catch (error) {
        console.error('Error saving photo:', error)
        alert('Failed to save photo. Please try again.')
      } finally { setIsUploading(false) }
    }
    reader.readAsDataURL(file)
  }

  const generateRoast = async () => {
    if (!textInput && !uploadedImage) {
      alert("Upload something or write about yourself!")
      return
    }
    setIsGenerating(true)
    setCurrentRoast("")
    try {
      const input = textInput || "User uploaded a photo for roasting"
      const aiRoast = await generateAIRoast(input, selectedStyle, selectedLanguage)
      setCurrentRoast(aiRoast)
      try {
        const saveResponse = await fetch('/api/roast', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({
            content: aiRoast, style: selectedStyle, language: selectedLanguage, imageUrl: uploadedImage, userInput: textInput
          })
        })
      } catch (saveError) {
        console.error("Error saving roast:", saveError)
      }
    } catch (error) {
      console.error("Error generating roast:", error)
      const fallbackRoast = getSampleRoast(selectedStyle, selectedLanguage)
      setCurrentRoast(fallbackRoast)
    } finally { setIsGenerating(false) }
  }

  const speakRoast = () => {
    if (!currentRoast) return
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(currentRoast)
    if (selectedLanguage === "bengali") {
      const voices = speechSynthesis.getVoices()
      const hindiVoice = voices.find(v => v.lang === 'hi-IN') ?? null
      utterance.voice = hindiVoice
      utterance.lang = "hi-IN"
      utterance.rate = 0.5
      utterance.pitch = 1.1
      utterance.volume = 1
    } else {
      const selectedLang = languageOptions.find((lang) => lang.id === selectedLanguage)
      utterance.lang = selectedLang?.code || "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1
    }
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    speechSynthesis.speak(utterance)
  }

  const shareRoast = () => {
    if (navigator.share) {
      navigator.share({
        title: "I got destroyed by AI Roast You!", text: currentRoast, url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(currentRoast)
      alert("Roast copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Roast You</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Ready to get{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">destroyed</span>
            ?
          </h1>
          <p className="text-xl text-gray-300">Hey {user.name}, choose your style and prepare for annihilation!</p>
        </div>

        {/* Style Selection */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">Choose Your Destruction Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {roastStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedStyle === style.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${style.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}
                  >
                    <style.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{style.name}</h3>
                  <p className="text-gray-400 text-sm">{style.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language Selection */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">Choose Your Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {languageOptions.map((language) => (
                <button
                  key={language.id}
                  onClick={() => setSelectedLanguage(language.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                    selectedLanguage === language.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-3xl">{language.flag}</span>
                  <span className="text-white font-semibold text-lg">{language.name}</span>
                </button>
              ))}
            </div>
            {/* Bengali TTS notice */}
            {selectedLanguage === "bengali" && (
              <p className="text-xs text-gray-400 mt-4 text-center">
                📢 Bengali voice may not be available on all devices. 
                Hindi or English alternatives will be used if needed.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Input Method */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("photo")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === "photo" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === "text" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Describe Yourself</span>
                </button>
              </div>
            </div>

            {activeTab === "photo" ? (
              <div className="text-center">
                {uploadedImage ? (
                  <div className="mb-6">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Your photo"
                      className="max-w-sm mx-auto rounded-xl shadow-lg border-2 border-white/20"
                    />
                    <Button
                      variant="outline"
                      className="mt-4 border-white/20 text-white hover:bg-white/10 bg-transparent"
                      onClick={() => setUploadedImage(null)}
                    >
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-white/40 rounded-xl p-12 cursor-pointer hover:border-orange-500 transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <p className="text-white text-lg font-semibold mb-2">Click to upload your photo</p>
                    <p className="text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <Textarea
                placeholder="Tell us about yourself... your hobbies, your style, your life choices. The more details, the better the roast!"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32 bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4 rounded-xl focus:border-orange-500 transition-colors"
              />
            )}
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button
            onClick={generateRoast}
            disabled={isGenerating || (!textInput && !uploadedImage)}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-xl px-12 py-4 rounded-xl border-0 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 mr-3" />
                Generating Your Destruction...
              </>
            ) : (
              <>
                <Skull className="w-6 h-6 mr-3" />
                Roast Me Now!
              </>
            )}
          </Button>
        </div>

        {/* Roast Result */}
        {currentRoast && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-white text-xl">Your Destruction is Complete!</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {roastStyles.find((s) => s.id === selectedStyle)?.name}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {languageOptions.find((l) => l.id === selectedLanguage)?.flag}{" "}
                    {languageOptions.find((l) => l.id === selectedLanguage)?.name}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/40 p-6 rounded-xl mb-6 border border-white/10">
                <p className="text-white text-lg leading-relaxed">{currentRoast}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={speakRoast}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  {isSpeaking ? "Stop" : "Listen"}
                </Button>
                <Button
                  onClick={shareRoast}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={generateRoast}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Roast Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
