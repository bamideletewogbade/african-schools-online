
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Users, TrendingUp, Star, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();

  const quickActions = [
    {
      title: 'Find Schools',
      description: 'Discover schools that match your preferences',
      icon: Search,
      href: '/school-finder',
      color: 'bg-blue-500'
    },
    {
      title: 'Course Matching',
      description: 'Get personalized course recommendations',
      icon: BookOpen,
      href: '/course-match',
      color: 'bg-green-500'
    },
    {
      title: 'Mentorship',
      description: 'Connect with mentors and graduates',
      icon: Users,
      href: '/mentorship',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    {
      title: 'Schools Viewed',
      value: '12',
      icon: BookOpen,
      change: '+2 this week'
    },
    {
      title: 'Applications',
      value: '3',
      icon: TrendingUp,
      change: '1 pending'
    },
    {
      title: 'Saved Schools',
      value: '8',
      icon: Star,
      change: '2 new'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.first_name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your educational journey and discover new opportunities
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="hover-scale cursor-pointer transition-all duration-300">
                <Link to={action.href}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Viewed Achimota School</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Completed course matching quiz</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Saved 3 schools to favorites</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Complete Your Profile</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add your interests to get better school recommendations
                  </p>
                  <Button size="sm" variant="outline">Complete Profile</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Explore Science Programs</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Based on your interests, these programs might suit you
                  </p>
                  <Button size="sm" variant="outline">View Programs</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Connect with Alumni</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Get mentorship from graduates in your field
                  </p>
                  <Button size="sm" variant="outline">Find Mentors</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
