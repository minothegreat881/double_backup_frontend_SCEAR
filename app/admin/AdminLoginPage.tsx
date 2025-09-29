"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import AdminLogo from "@/components/admin/admin-logo"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem("scear-admin-auth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple password check - in a real app, this would be a secure API call
    // For demo purposes, the password is "roman-auxiliary"
    setTimeout(() => {
      if (password === "roman-auxiliary") {
        localStorage.setItem("scear-admin-auth", "authenticated")
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
          variant: "default",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Authentication failed",
          description: "The password you entered is incorrect",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1000) // Simulate API delay
  }

  if (isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <AdminLogo size="lg" showText={false} className="mx-auto mb-2" />
          <h1 className="text-xl sm:text-2xl font-bold">S.C.E.A.R. Admin</h1>
          <p className="text-stone-600 text-sm sm:text-base">Rímska armáda a pomocné zbory</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your password to access the admin dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-9 h-12 text-base touch-manipulation"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 h-12 text-base touch-manipulation" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Logging in</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
