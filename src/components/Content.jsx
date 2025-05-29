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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus, Edit, Trash2, FileText, Eye } from "lucide-react"
import { toast } from "sonner"

export default function ContentPage() {
  const [content, setContent] = useState([])
  const [projects, setProjects] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [viewingContent, setViewingContent] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({title: "",type: "",status: "draft",projectId: "",content: ""})

  useEffect(() => {
    loadContent()
    loadProjects()
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const loadContent = () => {
    const storedContent = localStorage.getItem("content")
    if (storedContent) {
      setContent(JSON.parse(storedContent))
    }
  }

  const loadProjects = () => {
    const storedProjects = localStorage.getItem("projects")
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    }
  }

  const saveContent = (updatedContent) => {
    localStorage.setItem("content", JSON.stringify(updatedContent))
    setContent(updatedContent)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingContent) {
      const updatedContent = content.map((item) =>
        item.id === editingContent.id
          ? { ...item, ...formData, updatedAt: new Date().toISOString().split("T")[0] }
          : item,
      )
      saveContent(updatedContent)
      toast.success("Content updated")
    } else {
      const newContent = {id: Date.now(),...formData,author: currentUser?.name || "Unknown",createdAt: new Date().toISOString().split("T")[0],updatedAt: new Date().toISOString().split("T")[0]}
      const updatedContent = [...content, newContent]
      saveContent(updatedContent)
      toast.success("Content created")
    }
    resetForm()
  }

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem)
    setFormData({title: contentItem.title,type: contentItem.type,status: contentItem.status, projectId: contentItem.projectId.toString(),content: contentItem.content || ""})
    setIsDialogOpen(true)
  }

  const handleView = (contentItem) => {
    setViewingContent(contentItem)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (contentId) => {
    const updatedContent = content.filter((item) => item.id !== contentId)
    saveContent(updatedContent)
    toast.success("Content deleted")
  }

  const handleStatusChange = (contentId, newStatus) => {
    const updatedContent = content.map((item) =>
      item.id === contentId ? { ...item, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] } : item,
    )
    saveContent(updatedContent)
    toast.success("Status updated")
  }

  const resetForm = () => {
    setFormData({title: "",type: "",status: "draft",projectId: "",content: ""})
    setEditingContent(null)
    setIsDialogOpen(false)
  }

  const getStatusBadge = (status) => {
    const variants = {
      draft: "outline",
      review: "secondary",
      approved: "secondary",
      published: "secondary",
    }
    const colors = {
      draft: "text-gray-600",
      review: "text-yellow-600",
      approved: "text-green-600",
      published: "text-blue-600",
    }
    return (
      <Badge variant={variants[status] || "default"} className={colors[status]}>
        {status?.toUpperCase()}
      </Badge>
    )
  }

  const getProjectTitle = (projectId) => {
    const project = projects.find((p) => p.id == projectId)
    return project ? project.title : "Unknown Project"
  }

  const canEdit = (contentItem) => {
    if (!currentUser) return false
    if (currentUser.role === "admin") return true
    if (currentUser.role === "editor" && contentItem.status !== "published") return true
    if (currentUser.role === "writer" && contentItem.author === currentUser.name && contentItem.status === "draft")
      return true
    return false
  }

  const canChangeStatus = (contentItem) => {
    if (!currentUser) return false
    if (currentUser.role === "admin") return true
    if (currentUser.role === "editor") return true
    return false
  }

  const filteredContent = content.filter((item) => {
    if (currentUser?.role === "writer") {
      return item.author === currentUser.name
    }
    return true
  })

  return (
      <div className="space-y-6 text-foreground">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage content pieces</p>
          </div>
          {(currentUser?.role === "writer" || currentUser?.role === "admin") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] text-foreground">
                <DialogHeader>
                  <DialogTitle>{editingContent ? "Edit Content" : "Create New Content"}</DialogTitle>
                  <DialogDescription>
                    {editingContent ? "Update content information" : "Create a new content piece"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter content title" required/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Content Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="social">Social Media Post</SelectItem>
                          <SelectItem value="email">Email Newsletter</SelectItem>
                          <SelectItem value="whitepaper">Whitepaper</SelectItem>
                          <SelectItem value="case-study">Case Study</SelectItem>
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
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your content here..." className="min-h-[200px]" required/>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingContent ? "Update Content" : "Create Content"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="review">In Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>

          {["all", "draft", "review", "approved", "published"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {status === "all" ? "All Content" : `${status.charAt(0).toUpperCase() + status.slice(1)} Content`}
                  </CardTitle>
                  <CardDescription>
                    {status === "all"
                      ? "All content pieces across all projects"
                      : `Content pieces with ${status} status`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-y-auto max-h-[200px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContent
                        .filter((item) => status === "all" || item.status === status)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{item.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{getProjectTitle(item.projectId)}</TableCell>
                            <TableCell>{item.author}</TableCell>
                            <TableCell>
                              {canChangeStatus(item) ? (
                                <Select
                                  value={item.status}
                                  onValueChange={(value) => handleStatusChange(item.id, value)}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                getStatusBadge(item.status)
                              )}
                            </TableCell>
                            <TableCell>{item.createdAt}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleView(item)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {canEdit(item) && (
                                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                {(currentUser?.role === "admin" || item.author === currentUser?.name) && (
                                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
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
          ))}
        </Tabs>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] text-foreground">
            <DialogHeader>
              <DialogTitle>{viewingContent?.title}</DialogTitle>
              <DialogDescription>
                {viewingContent?.type} • {getStatusBadge(viewingContent?.status)} • by {viewingContent?.author}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto space-y-4">
              <div>
                <Label>Content</Label>
                <div className="mt-2 p-4 border rounded-md bg-muted/50">
                  <p className="whitespace-pre-wrap">{viewingContent?.content}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
