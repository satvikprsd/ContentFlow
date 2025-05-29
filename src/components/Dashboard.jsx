import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, FileText, CheckCircle, Clock } from "lucide-react"

import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({totalClients:0,activeProjects:0,completedContent:0,pendingTasks: 0})
  const [recentActivity, setRecentActivity] = useState([])
  const [projectData, setProjectData] = useState([])
  const [contentData, setContentData] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      navigate("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    initializeDemoData()
    loadDashboardData()
  }, [navigate])

  const initializeDemoData = () => {
    if (!localStorage.getItem("clients")) {
      const demoClients = [
        {
          id: 1,
          name: "TechCorp Inc",
          industry: "Technology",
          goals: "Increase brand awareness",
          strategist: "Content Strategist",
          status: "active",
        },
        {
          id: 2,
          name: "HealthPlus",
          industry: "Healthcare",
          goals: "Lead generation",
          strategist: "Content Strategist",
          status: "active",
        },
        {
          id: 3,
          name: "EcoGreen",
          industry: "Environmental",
          goals: "Thought leadership",
          strategist: "Content Strategist",
          status: "active",
        },
      ]
      localStorage.setItem("clients", JSON.stringify(demoClients))
    }

    if (!localStorage.getItem("projects")) {
      const demoProjects = [
        {
          id: 1,
          title: "Q1 Content Strategy",
          clientId: 1,
          status: "in-progress",
          dueDate: "2024-03-31",
          assignedTo: "Content Strategist",
        },
        {
          id: 2,
          title: "Blog Series Launch",
          clientId: 2,
          status: "pending",
          dueDate: "2024-02-15",
          assignedTo: "Writer",
        },
        {
          id: 3,
          title: "Social Media Campaign",
          clientId: 3,
          status: "completed",
          dueDate: "2024-01-30",
          assignedTo: "Editor",
        },
      ]
      localStorage.setItem("projects", JSON.stringify(demoProjects))
    }

    if (!localStorage.getItem("content")) {
      const demoContent = [
        {
          id: 1,
          title: "AI in Healthcare",
          type: "blog",
          status: "published",
          projectId: 1,
          author: "Writer",
          createdAt: "2024-01-15",
        },
        {
          id: 2,
          title: "Sustainable Tech Trends",
          type: "article",
          status: "review",
          projectId: 2,
          author: "Writer",
          createdAt: "2024-01-20",
        },
        {
          id: 3,
          title: "Social Media Post #1",
          type: "social",
          status: "draft",
          projectId: 3,
          author: "Writer",
          createdAt: "2024-01-25",
        },
      ]
      localStorage.setItem("content", JSON.stringify(demoContent))
    }
  }

  const loadDashboardData = () => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]")
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const content = JSON.parse(localStorage.getItem("content") || "[]")

    setStats({totalClients: clients.length,activeProjects: projects.filter((p) => p.status === "in-progress").length,completedContent: content.filter((c) => c.status === "published").length,pendingTasks: content.filter((c) => c.status === "draft" || c.status === "review").length})

    const projectStatusData = [
      { name: "Pending", value: projects.filter((p) => p.status === "pending").length, fill: "#fbbf24" },
      { name: "In Progress", value: projects.filter((p) => p.status === "in-progress").length, fill: "#3b82f6" },
      { name: "Completed", value: projects.filter((p) => p.status === "completed").length, fill: "#10b981" },
      { name: "PUBLISHED", value: projects.filter((p) => p.status === "published").length, fill: "#9810fa" },
    ]
    setProjectData(projectStatusData)

    const contentTypeData = [
      { name: "Blog", count: content.filter((c) => c.type === "blog").length },
      { name: "Article", count: content.filter((c) => c.type === "article").length },
      { name: "Social", count: content.filter((c) => c.type === "social").length },
    ]
    setContentData(contentTypeData)

    const activity = [
      { id: 1, action: "New content submitted", user: "Writer", time: "2 hours ago", type: "content" },
      { id: 2, action: "Project completed", user: "Editor", time: "1 day ago", type: "project" },
      { id: 3, action: "Client added", user: "Admin", time: "2 days ago", type: "client" },
    ]
    
    setRecentActivity(activity)
  }

  if (!user) {
    console.log(user)
    return <div>Loading...</div>
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Content</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedContent}</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">-2 from yesterday</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="w-[100%]">
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ChartContainer className="w-[100%] h-[150%]" config={{pending: { label: "Pending", color: "#fbbf24" },inProgress: { label: "In Progress", color: "#3b82f6" },completed: { label: "Completed", color: "#10b981" },}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={projectData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                          {projectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="w-[100%]">
                <CardHeader>
                  <CardTitle>Content by Type</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <ChartContainer config={{ count: { label: "Count", color: "#3b82f6" },}} className="h-[100%] w-[100%]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for the agency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Project Completion Rate</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Content Approval Rate</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Satisfaction</span>
                    <span>96%</span>
                  </div>
                  <Progress value={96} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          by {activity.user} • {activity.time}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
