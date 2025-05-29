import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,  DialogTitle, DialogTrigger} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Plus, Edit, Trash2, FolderOpen, Calendar, User } from "lucide-react"
import { toast } from "sonner"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({title: "",clientId: "",status: "pending", dueDate: "",assignedTo: "",description: ""})

  useEffect(() => {
    loadProjects()
    loadClients()
  }, [])

  const loadProjects = () => {
    const storedProjects = localStorage.getItem("projects")
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    }
  }

  const loadClients = () => {
    const storedClients = localStorage.getItem("clients")
    if (storedClients) {
      setClients(JSON.parse(storedClients))
    }
  }

  const saveProjects = (updatedProjects) => {
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
    setProjects(updatedProjects)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingProject) {
      const updatedProjects = projects.map((project) =>
        project.id === editingProject.id ? { ...project, ...formData } : project,
      )
      saveProjects(updatedProjects)
      toast.success("Project updated")
    } else {
      const newProject = {id: Date.now(),...formData,createdAt: new Date().toISOString().split("T")[0]}
      const updatedProjects = [...projects, newProject]
      saveProjects(updatedProjects)
      toast.success("Project created")
    }

    resetForm()
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({title: project.title,clientId: project.clientId.toString(),status: project.status,dueDate: project.dueDate,assignedTo: project.assignedTo,description: project.description || ""})
    setIsDialogOpen(true)
  }

  const handleDelete = (projectId) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId)
    saveProjects(updatedProjects)
    toast.success("Project deleted")
  }

  const resetForm = () => {
    setFormData({ title: "", clientId: "", status: "pending", dueDate: "", assignedTo: "", description: ""})
    setEditingProject(null)
    setIsDialogOpen(false)
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: "outline",
      "in-progress": "secondary",
      completed: "secondary",
      published: "secondary",
    }
    const colors = {
      pending: "text-yellow-600",
      "in-progress": "text-yellow-600",
      completed: "text-green-600",
      published: "text-purple-600",
    }
    return (
      <Badge variant={variants[status] || "default"} className={colors[status]}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id == clientId)
    return client ? client.name : "Unknown Client"
  }

  return (
      <div className="space-y-6 text-foreground">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage client projects and campaigns</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] text-foreground">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
                <DialogDescription>
                  {editingProject ? "Update project information" : "Create a new project for a client"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter project title" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client</Label>
                    <Select value={formData.clientId} onValueChange={(value) => {setFormData({ ...formData, clientId: value })}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Content Strategist">Content Strategist</SelectItem>
                        <SelectItem value="Writer">Writer</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Project description and requirements"/>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingProject ? "Update Project" : "Create Project"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project List</CardTitle>
            <CardDescription>All active and completed projects</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="overflow-y-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{project.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getClientName(project.clientId)}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{project.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{project.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
