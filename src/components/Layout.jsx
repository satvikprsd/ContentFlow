import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "../components/ui/dropdown-menu"
import { LayoutDashboard, Users, FolderOpen, FileText, CheckSquare, Settings, LogOut, Menu, X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ThemeProvider } from "./themeProvider"
import { ModeToggle } from "./mode-toggle"
import { useLogout } from "react-admin"
import { useTheme } from "next-themes"

export function Layout({ children }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useLogout();
  const { theme } = useTheme()
  const d = new Date('2025-10-23');
  console.log(d.toLocaleDateString('en-US'),'qweqweqw')
  const formatted = `${d.toLocaleDateString('en-US', { weekday: 'long' })}, ${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'long' })}, ${d.getFullYear()}`;
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    console.log(currentUser)
    if (!currentUser) {
      navigate("/login")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [navigate])

  const handleLogout = () => {
    logout();
  }

  const navigation = [
    { name: "Dashboard",href: "/",icon: LayoutDashboard,roles: ["admin", "strategist", "editor", "writer"],},
    { name: "Clients", href: "/clients", icon: Users, roles: ["admin", "strategist"] },
    { name: "Projects", href: "/projects", icon: FolderOpen, roles: ["admin", "strategist", "editor"] },
    { name: "Content", href: "/content", icon: FileText, roles: ["admin", "strategist", "editor", "writer"] },
    { name: "Tasks", href: "/tasks", icon: CheckSquare, roles: ["admin", "strategist", "editor", "writer"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
  ]

  const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  if (!user) {
    console.log(user)
    return <div>Loading...</div>
  }

  return (
      <div className="min-h-screen bg-background flex">
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-background border-r">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-foreground">Content Portal</h1>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-1 px-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link onClick={()=>setSidebarOpen(false)} className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${location.pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`} key={item.name} to={item.href}>
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="hidden min-w-[265px] lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className={`flex flex-col flex-grow ${theme=='dark' ? 'bg-[#0b0c0e]' : 'bg-[#ecf0f5]'}`}>
            <div className="flex h-16 items-center px-6">
              <h1 className="text-xl font-bold text-foreground">Content Portal</h1>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${location.pathname === item.href? "bg-primary text-primary-foreground": "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`} key={item.name} to={item.href}>
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
        <div className={`w-full p-5 h-screen ${theme=='dark' ? 'bg-[#0b0c0e]' : 'bg-[#ecf0f5]'}`}>
          <div className="rounded-4xl shadow-[0_0_8px_rgba(0,0,0,0.1)] shadow-foreground h-full bg-background pt-2 flex flex-col overflow-hidden">
            <div className="rounded-t-4xl sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-foreground text-xl">Hey, {user.name}!</h1>
                <h1 className="text-foreground text-sm hidden sm:block">{formatted}</h1>
              </div>
              <Button variant="ghost" size="sm" className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1"></div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <ModeToggle />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className='text-foreground'>
                            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <main className="py-5 overflow-y-auto flex-1">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </div>
  )
}
