import { FolderIcon, HomeIcon, PlusIcon } from "lucide-react"
import { SidebarGroupLabel, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "~/components/ui/sidebar"
import { Link, Links, Meta, Outlet, Scripts } from "react-router"
import { Button } from "../components/ui/button"
  
export default function SidebarLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
        </SidebarProvider>       
        <Scripts />
      </body>
    </html>
  )
}

function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <Button variant="outline" size="lg" asChild>
                <Link to="/integration">
                  <PlusIcon /> Integration Apps
                </Link>
            </Button>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenuButton size="lg">
                <HomeIcon /> 
                <Link to="/">
                    Home
                </Link>
            </SidebarMenuButton>
            <SidebarMenuButton size="lg">
                <FolderIcon /> 
                <Link to="/apps">
                    Apps
                </Link>
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }