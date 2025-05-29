import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,  DialogTitle, DialogTrigger} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus, Edit, Trash2, Users, Shield } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [users, setUsers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({name: "",email: "",password: "",role: "writer"})

  useEffect(() => {
    loadUsers()
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const loadUsers = () => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }

  const saveUsers = (updatedUsers) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingUser) {
      const updatedUsers = users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user))
      saveUsers(updatedUsers)
      toast.success("User updated")
    }else{
      const newUser = {id: Date.now(),...formData}
      const updatedUsers = [...users, newUser]
      saveUsers(updatedUsers)
      toast.success("User created")
    }
    resetForm()
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({name: user.name,email: user.email,password: user.password,role: user.role})
    setIsDialogOpen(true)
  }

  const handleDelete = (userId) => {
    if (userId === currentUser?.id) {
      toast.error("Cannot delete")
      return
    }

    const updatedUsers = users.filter((user) => user.id !== userId)
    saveUsers(updatedUsers)
    toast.success("User deleted")
  }

  const resetForm = () => {
    setFormData({name: "",email: "",password: "",role: "writer"})
    setEditingUser(null)
    setIsDialogOpen(false)
  }

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      strategist: "bg-blue-100 text-blue-800",
      editor: "bg-green-100 text-green-800",
      writer: "bg-yellow-100 text-yellow-800",
    }
    return <Badge className={colors[role]}>{role?.toUpperCase()}</Badge>
  }

  if (currentUser?.role !== "admin") {
    return (
        <div className="flex items-center justify-center h-64 text-foreground">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Access Denied</h3>
            <p className="mt-1 text-sm text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
    )
  }

  return (
      <div className="space-y-6 text-foreground">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage users and system settings</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage team members and their roles</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => resetForm()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] text-foreground">
                      <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                        <DialogDescription>
                          {editingUser ? "Update user information" : "Create a new user account"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" required/>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email address" required/>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={formData.password}  onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" required/>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="strategist">Content Strategist</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="writer">Writer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={resetForm}>
                            Cancel
                          </Button>
                          <Button type="submit">{editingUser ? "Update User" : "Create User"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-y-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{user.name}</span>
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.id !== currentUser?.id && (
                              <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
