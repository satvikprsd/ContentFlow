import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes } from 'react-admin';
import { authProvider } from './providers/authProvider';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { Layout } from './components/Layout';
import { BrowserRouter, Route } from 'react-router-dom';
import ClientsPage from './components/Clients';
import ProjectsPage from './components/Project';
import ContentPage from './components/Content';
import TasksPage from './components/Tasks';
import SettingsPage from './components/Settings';
import { ThemeProvider } from './components/themeProvider';

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
        <Admin layout={Layout} dashboard={Dashboard} loginPage={LoginPage} authProvider={authProvider}>
            <CustomRoutes>
              <Route path="/clients" element={<ClientsPage />} />
            </CustomRoutes>
            <CustomRoutes>
              <Route path="/projects" element={<ProjectsPage />} />
            </CustomRoutes>
            <CustomRoutes>
              <Route path="/content" element={<ContentPage />} />
            </CustomRoutes>
            <CustomRoutes>
              <Route path="/tasks" element={<TasksPage />} />
            </CustomRoutes>
            <CustomRoutes>
              <Route path="/settings" element={<SettingsPage />} />
            </CustomRoutes>
        </Admin>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
