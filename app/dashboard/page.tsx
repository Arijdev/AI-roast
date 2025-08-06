"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, User, History, LogOut, Trophy, Target, Calendar, TrendingUp, Star, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  // useEffect(() => {
  //   const currentUser = localStorage.getItem("currentUser")
  //   if (!currentUser) {
  //     router.push("/login")
  //     return
  //   }
  //   setUser(JSON.parse(currentUser))
  // }, [router])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // important to send cookies
        })

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
        // Cleanup or additional logic if needed
      }
    }

    checkAuth()
  }, [router])


  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include", // include cookie to clear it
      })

      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }


  const stats = [
    { label: "Total Roasts", value: "23", icon: Flame, change: "+5 this week" },
    { label: "Favorite Style", value: "Savage", icon: Target, change: "67% of roasts" },
    { label: "Days Active", value: "12", icon: Calendar, change: "3 day streak" },
    { label: "Level", value: "Pro", icon: Trophy, change: "Next: Expert" },
  ]

  const recentRoasts = [
    {
      id: 1,
      date: "Today",
      style: "Savage",
      language: "English",
      flag: "🇺🇸",
      preview: "Looking at your photo, I can see why your camera has trust issues...",
      rating: 5,
    },
    {
      id: 2,
      date: "Yesterday",
      style: "Witty",
      language: "हिंदी",
      flag: "🇮🇳",
      preview: "आप बिल्कुल सॉफ्टवेयर अपडेट की तरह हैं - कोई नहीं चाहता लेकिन...",
      rating: 4,
    },
    {
      id: 3,
      date: "2 days ago",
      style: "Playful",
      language: "বাংলা",
      flag: "🇧🇩",
      preview: "আপনি একদম গোল্ডেন রিট্রিভারের মতো - মিষ্টি, কিন্তু সবাই জানে...",
      rating: 3,
    },
  ]

  const achievements = [
    { name: "First Blood", description: "Survived your first roast", progress: 100, earned: true },
    { name: "Thick Skin", description: "Received 10 roasts", progress: 100, earned: true },
    { name: "Polyglot", description: "Roasted in all languages", progress: 100, earned: true },
    { name: "Masochist", description: "Received 50 roasts", progress: 46, earned: false },
    { name: "Social Butterfly", description: "Shared 5 roasts", progress: 60, earned: false },
    { name: "Voice Lover", description: "Used TTS 25 times", progress: 72, earned: false },
  ]

  if (!user) {
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
              <Button
                onClick={() => router.push("/roast")}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0"
              >
                Get Roasted
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-300 text-lg">Ready for another round of destruction?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-orange-500" />
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-lg p-1">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "history", label: "History", icon: History },
              { id: "achievements", label: "Achievements", icon: Trophy },
              { id: "profile", label: "Profile", icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === tab.id ? "bg-white/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRoasts.slice(0, 3).map((roast) => (
                    <div key={roast.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl">{roast.flag}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{roast.style}</Badge>
                          <span className="text-xs text-gray-400">{roast.date}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{roast.preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Level Progress</span>
                      <span className="text-white">Pro (78%)</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Achievements</span>
                      <span className="text-white">3/6 Unlocked</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Weekly Goal</span>
                      <span className="text-white">5/7 Roasts</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "history" && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Roast History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRoasts.map((roast) => (
                  <div key={roast.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{roast.style}</Badge>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                          {roast.flag} {roast.language}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-400">{roast.date}</span>
                    </div>
                    <p className="text-gray-300 mb-3">{roast.preview}</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Flame key={i} className={`w-4 h-4 ${i < roast.rating ? "text-red-500" : "text-gray-600"}`} />
                      ))}
                      <span className="text-sm text-gray-400 ml-2">Burn Level</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "achievements" && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-300 ${achievement.earned ? "bg-yellow-500/10 border-yellow-500/30" : "bg-white/5 border-white/10"
                      }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${achievement.earned ? "bg-yellow-500/20" : "bg-gray-700/50"}`}>
                        <Trophy className={`w-6 h-6 ${achievement.earned ? "text-yellow-500" : "text-gray-600"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${achievement.earned ? "text-white" : "text-gray-400"}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className={achievement.earned ? "text-green-400" : "text-gray-400"}>
                              {achievement.progress}%
                            </span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "profile" && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-white">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-white">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Member Since</label>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-white">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Level</label>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-white flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Pro Destroyer</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
