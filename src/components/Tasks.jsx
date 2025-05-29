import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,  DialogTitle, DialogTrigger} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react"
import { toast } from "sonner"

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({title: "",description: "",priority: "medium",status: "pending",assignedTo: "",projectId: "",dueDate: "",type: "content",})

  useEffect(() => {
    loadTasks()
    loadProjects()
    loadUsers()
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const loadTasks = () => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      const demoTasks = [
        {
          id: 1,
          title: "Review blog post draft",
          description: "Review and provide feedback on AI healthcare blog post",
          priority: "high",
          status: "pending",
          assignedTo: "Editor",
          projectId: 1,
          dueDate: "2024-02-15",
          type: "review",
          createdAt: "2024-01-20",
        },
        {
          id: 2,
          title: "Write social media content",
          description: "Create 5 social media posts for EcoGreen campaign",
          priority: "medium",
          status: "in-progress",
          assignedTo: "Writer",
          projectId: 3,
          dueDate: "2024-02-10",
          type: "content",
          createdAt: "2024-01-18",
        },
        {
          id: 3,
          title: "Client strategy meeting",
          description: "Prepare presentation for TechCorp quarterly review",
          priority: "high",
          status: "completed",
          assignedTo: "Content Strategist",
          projectId: 1,
          dueDate: "2024-01-25",
          type: "meeting",
          createdAt: "2024-01-15",
        },
      ]
      localStorage.setItem("tasks", JSON.stringify(demoTasks))
      setTasks(demoTasks)
    }
  }

  const loadProjects = () => {
    const storedProjects = localStorage.getItem("projects")
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    }
  }

  const loadUsers = () => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }

  const saveTasks = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? { ...task, ...formData, updatedAt: new Date().toISOString().split("T")[0] } : task,
      )
      saveTasks(updatedTasks)
      toast.success("Task updated")
    } else {
      const newTask = {id: Date.now(),...formData,createdAt: new Date().toISOString().split("T")[0],updatedAt: new Date().toISOString().split("T")[0]}
      const updatedTasks = [...tasks, newTask]
      saveTasks(updatedTasks)
      toast.success("Task created")
    }

    resetForm()
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({title: task.title,description: task.description,priority: task.priority,status: task.status,assignedTo: task.assignedTo,projectId: task.projectId.toString(),dueDate: task.dueDate,type: task.type})
    setIsDialogOpen(true)
  }

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    saveTasks(updatedTasks)
    toast.success("Task deleted")
  }

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] } : task,
    )
    saveTasks(updatedTasks)
    toast.success("Status updated")
  }

  const resetForm = () => {
    setFormData({title: "",description: "",priority: "medium",status: "pending",assignedTo: "",projectId: "", dueDate: "",type: "content"})
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: "outline",
      "in-progress": "default",
      completed: "secondary",
      overdue: "destructive",
    }
    const icons = {
      pending: Clock,
      "in-progress": AlertCircle,
      completed: CheckCircle,
      overdue: AlertCircle,
    }
    const Icon = icons[status] || Clock
    return (
      <Badge variant={variants[status] || "default"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status?.toUpperCase()  }
      </Badge>
    )
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      low: "text-green-600 bg-green-50",
      medium: "text-yellow-600 bg-yellow-50",
      high: "text-red-600 bg-red-50",
    }
    return (
      <Badge variant="outline" className={colors[priority]}>
        {priority?.toUpperCase()}
      </Badge>
    )
  }

  const getProjectTitle = (projectId) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.title : "No Project"
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate !== ""
  }

  const filteredTasks = tasks.filter((task) => {
    if (currentUser?.role === "writer") {
      return task.assignedTo === currentUser.name
    }
    if (currentUser?.role === "editor") {
      return task.type === "review" || task.assignedTo === currentUser.name
    }
    return true
  })

  const getTaskStats = () => {
    const userTasks = currentUser?.role === "admin" ? tasks : filteredTasks
    return {
      total: userTasks.length,
      pending: userTasks.filter((t) => t.status === "pending").length,
      inProgress: userTasks.filter((t) => t.status === "in-progress").length,
      completed: userTasks.filter((t) => t.status === "completed").length,
      overdue: userTasks.filter((t) => isOverdue(t.dueDate) && t.status !== "completed").length,
    }
  }

  const stats = getTaskStats()

  return (
      <div className="space-y-6 text-foreground">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">Manage and track team tasks and deadlines</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] text-foreground">
              <DialogHeader>
                <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                <DialogDescription>
                  {editingTask ? "Update task information" : "Create a new task for team members"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter task title" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the task" required/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="content">Content Creation</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="strategy">Strategy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.name}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project</Label>
                    <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Project</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}/>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingTask ? "Update Task" : "Create Task"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          {["all", "pending", "in-progress", "completed", "overdue"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {status === "all" ? "All Tasks" : `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks`}
                  </CardTitle>
                  <CardDescription>
                    {status === "all" ? "All tasks assigned to team members" : `Tasks with ${status} status`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks
                        .filter((task) => {
                          if (status === "all") return true
                          if (status === "overdue") return isOverdue(task.dueDate) && task.status !== "completed"
                          return task.status === status
                        })
                        .map((task) => (
                          <TableRow key={task.id} className={`isOverdue(task.dueDate) && task.status !== "completed" ? "bg-red-50" : ""`} >
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.type}</TableCell>
                            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                            <TableCell>{task.assignedTo}</TableCell>
                            <TableCell>{getProjectTitle(task.projectId)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span
                                  className={
                                    isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-600" : ""
                                  }
                                >
                                  {task.dueDate || "No due date"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {currentUser?.role === "admin" || task.assignedTo === currentUser?.name ? (
                                <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                                  <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                getStatusBadge(task.status)
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {(currentUser?.role === "admin" || task.assignedTo === currentUser?.name) && (
                                  <Button variant="outline" size="sm" onClick={() => handleEdit(task)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                {currentUser?.role === "admin" && (
                                  <Button variant="outline" size="sm" onClick={() => handleDelete(task.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
  )
}
