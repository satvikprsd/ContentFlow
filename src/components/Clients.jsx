import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,  DialogTitle, DialogTrigger} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Plus, Edit, Trash2, Building } from "lucide-react"
import { toast } from "sonner"
export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({name: "",industry: "",goals: "",strategist: ""})

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = () => {
    const storedClients = localStorage.getItem("clients")
    if (storedClients) {
      setClients(JSON.parse(storedClients))
    }
  }

  const saveClients = (updatedClients) => {
    localStorage.setItem("clients", JSON.stringify(updatedClients))
    setClients(updatedClients)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingClient) {
      const updatedClients = clients.map((client) =>
        client.id === editingClient.id ? { ...client, ...formData } : client,
      )
      saveClients(updatedClients)
      toast.success("Client updated")
    } else {
      const newClient = {id: Date.now(),...formData}
      const updatedClients = [...clients, newClient]
      saveClients(updatedClients)
      toast.success("Client added")
    }

    resetForm()
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({name: client.name,industry: client.industry,goals: client.goals,strategist: client.strategist})
    setIsDialogOpen(true)
  }

  const handleDelete = (clientId) => {
    const updatedClients = clients.filter((client) => client.id !== clientId)
    saveClients(updatedClients)
    toast.success("Client deleted")
  }

  const resetForm = () => {
    setFormData({name: "",industry: "",goals: "",strategist: ""})
    setEditingClient(null)
    setIsDialogOpen(false)
  }


  return (
      <div className="space-y-6 text-foreground">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-muted-foreground">Manage your agency clients</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] text-foreground">
              <DialogHeader>
                <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
                <DialogDescription>
                  {editingClient ? "Update client information" : "Add a new client to your agency"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter client name" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="environmental">Environmental</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea id="goals" value={formData.goals} onChange={(e) => setFormData({ ...formData, goals: e.target.value })} placeholder="Describe client goals and objectives" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strategist">Assigned Strategist</Label>
                    <Select value={formData.strategist} onValueChange={(value) => setFormData({ ...formData, strategist: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Content Strategist">Content Strategist</SelectItem>
                        <SelectItem value="Senior Strategist">Senior Strategist</SelectItem>
                        <SelectItem value="Lead Strategist">Lead Strategist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingClient ? "Update Client" : "Add Client"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>All clients managed by your agency</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="overflow-y-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Strategist</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{client.industry}</TableCell>
                    <TableCell className="max-w-xs truncate">{client.goals}</TableCell>
                    <TableCell>{client.strategist}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(client.id)}>
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
