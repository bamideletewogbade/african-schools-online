
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Link, useNavigate } from "react-router-dom"
import {
  Home,
  BookOpen,
  GraduationCap,
  Search,
  Settings,
  LogOut,
  User,
} from "lucide-react"

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "School Finder",
    href: "/school-finder",
    icon: Search,
  },
  {
    title: "Course Match",
    href: "/course-match",
    icon: BookOpen,
  },
]

export function Navigation() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleGetStarted = () => {
    if (user && profile?.onboarding_completed) {
      navigate('/dashboard');
    } else if (user) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-primary/10 shadow-soft">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 flex h-8 w-8 items-center justify-center sm:hidden hover:bg-primary/10"
            >
              <MenuIcon className="h-4 w-4" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-white/95 backdrop-blur-md">
            <SheetHeader className="pl-10 pb-4 pt-6">
              <SheetTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Menu</SheetTitle>
              <SheetDescription>
                Navigate through the app and manage your profile.
              </SheetDescription>
            </SheetHeader>
            <div className="pl-10">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Button variant="ghost" className="justify-start hover:bg-primary/10">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                ))}
                {user ? (
                  <Button variant="ghost" className="justify-start hover:bg-destructive/10" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth">
                    <Button variant="ghost" className="justify-start hover:bg-primary/10">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Link to="/" className="mr-auto font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Africa Schools Online
        </Link>
        
        <NavigationMenu className="hidden sm:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link to={item.href} className="outline-none">
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} hover:bg-primary/10 hover:text-primary transition-all duration-300`}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary/10">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border-primary/20">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="hover:bg-primary/10">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="hover:bg-primary/10">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-card hover:shadow-soft transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
        )}
      </div>
    </header>
  )
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}
