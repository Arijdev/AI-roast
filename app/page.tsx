"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Zap, Skull, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
  try {
    
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    if (response.ok) {
      const result = await response.json()
      setIsLoggedIn(true)
    } else {
      const errorText = await response.text()
      setIsLoggedIn(false)
    }
  } catch (error) {
    console.error("💥 Auth check network error:", error)
    setIsLoggedIn(false)
  } finally {
    setLoading(false)
  }
}

  // Add debug for button clicks
  const handleDashboard = () => {
    console.log("🎯 Dashboard button clicked. isLoggedIn:", isLoggedIn)
    router.push("/dashboard")
  }

  const handleRoast = () => {
    console.log("🎯 Roast button clicked. isLoggedIn:", isLoggedIn)
    router.push("/roast")
  }

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered",
      description: "Advanced AI creates personalized roasts just for you",
    },
    {
      icon: "🌍",
      title: "Multi-Language",
      description: "Get roasted in English, Hindi, and Bengali",
    },
    {
      icon: "🔊",
      title: "Voice Output",
      description: "Hear your destruction with realistic text-to-speech",
    },
    {
      icon: "🎭",
      title: "Multiple Styles",
      description: "Choose from Savage, Witty, Brutal, or Playful",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Roast You</span>
            </div>
            <div className="flex items-center space-x-4">              
              {isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleDashboard}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleRoast}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0"
                  >
                    Get Roasted
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Get Absolutely
                <span className="block bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Destroyed
                </span>
                by AI
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Upload your photo or describe yourself and let our savage AI create the most brutal roasts you've ever
                heard
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isLoggedIn ? (
                <Button
                  onClick={handleRoast}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg px-8 py-4 rounded-xl border-0 group"
                >
                  Start Roasting
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg px-8 py-4 rounded-xl border-0 group"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl bg-transparent"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Roast Styles Preview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
              {[
                { name: "Savage", icon: Flame, color: "from-red-500 to-red-600" },
                { name: "Witty", icon: Zap, color: "from-yellow-500 to-orange-500" },
                { name: "Brutal", icon: Skull, color: "from-gray-600 to-gray-800" },
                { name: "Playful", icon: Heart, color: "from-pink-500 to-purple-500" },
              ].map((style) => (
                <div
                  key={style.name}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${style.color} rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
                  >
                    <style.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{style.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose AI Roast You?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the most advanced AI roasting technology with features designed to destroy your ego
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="py-16 sm:py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Multilingual Destruction</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get roasted in your native language for maximum emotional damage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { flag: "🇺🇸", name: "English", desc: "Classic savage burns" },
              { flag: "🇮🇳", name: "हिंदी", desc: "देसी गालियों के साथ" },
              { flag: "🇧🇩", name: "বাংলা", desc: "বাংলা গালাগালি সহ" },
            ].map((lang, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">{lang.flag}</div>
                  <h3 className="text-white font-semibold text-xl mb-2">{lang.name}</h3>
                  <p className="text-gray-300">{lang.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Souls Destroyed" },
              { value: "∞", label: "Therapy Sessions" },
              { value: "25K+", label: "Egos Crushed" },
              { value: "1M+", label: "Savage Moments" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl sm:text-5xl font-black text-white mb-2 group-hover:text-orange-500 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Destroyed?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have experienced the ultimate AI roasting experience
          </p>
          {!isLoggedIn && (
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg px-8 py-4 rounded-xl border-0 group"
              >
                Start Your Destruction
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Roast You</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 AI Roast You. Destroying egos since day one.</p>
          </div>
         </div>
        </footer>
      </div>
    )
  
}
