import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {useLogin } from "react-admin"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const login = useLogin();

  useEffect(() => {

    const users = localStorage.getItem("users")
    if (!users) {
      const demoUsers = [
        { id: 1, email: "admin@example.com", password: "admin123", role: "admin", name: "Admin User" },
        {
          id: 2,
          email: "strategist@example.com",
          password: "strategist123",
          role: "strategist",
          name: "Content Strategist",
        },
        { id: 3, email: "editor@example.com", password: "editor123", role: "editor", name: "Editor" },
        { id: 4, email: "writer@example.com", password: "writer123", role: "writer", name: "Writer" },
      ]
      localStorage.setItem("users", JSON.stringify(demoUsers))
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try{
      await login({ email, password }).catch(() => toast.error("Invalid credentials"))
    }
    catch(e){
      toast.error(e);
    }
    finally{
      navigate('/')
    }
  }

  const handleDemoLogin = (demoRole) => {
    const demoCredentials = {
      admin: { email: "admin@example.com", password: "admin123" },
      strategist: { email: "strategist@example.com", password: "strategist123" },
      editor: { email: "editor@example.com", password: "editor123" },
      writer: { email: "writer@example.com", password: "writer123" },
    }

    const creds = demoCredentials[demoRole]
    setEmail(creds.email)
    setPassword(creds.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Marketing Portal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required/>
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Demo Accounts:</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("admin")}>
                  Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("strategist")}>
                  Strategist
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("editor")}>
                  Editor
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("writer")}>
                  Writer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
