
const users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [
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

export const authProvider = {
  login: ({ email, password }) => {
    console.log(users)
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      return Promise.resolve()
    }
    return Promise.reject(new Error("Invalid credentials"))
  },

  logout: () => {
    localStorage.removeItem("currentUser")
    return Promise.resolve()
  },

  checkAuth: () => {
    const user = localStorage.getItem("currentUser")
    return user ? Promise.resolve() : Promise.reject()
  }
}
