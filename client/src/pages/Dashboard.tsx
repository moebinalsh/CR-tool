import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, CheckCircle2, Clock, FileText, XCircle, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = trpc.changeRequests.stats.useQuery();
  const { data: recentCRs, isLoading: recentLoading } = trpc.changeRequests.getRecent.useQuery({ limit: 5 });

  const statCards = [
    { title: "Total CRs", value: stats?.total || 0, icon: FileText, color: "text-blue-600" },
    { title: "Pending", value: stats?.pending || 0, icon: Clock, color: "text-yellow-600" },
    { title: "Approved", value: stats?.approved || 0, icon: CheckCircle2, color: "text-green-600" },
    { title: "Rejected", value: stats?.rejected || 0, icon: XCircle, color: "text-red-600" },
    { title: "Implemented", value: stats?.implemented || 0, icon: Activity, color: "text-purple-600" },
    { title: "Rolled Back", value: stats?.rolledBack || 0, icon: AlertTriangle, color: "text-orange-600" },
  ];

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      implemented: "bg-purple-100 text-purple-800",
      rolled_back: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of all change requests and their current status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                onClick={() => setLocation('/change-requests')}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Change Requests</CardTitle>
          <CardDescription>Latest 5 change requests submitted</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentCRs && recentCRs.length > 0 ? (
            <div className="space-y-4">
              {recentCRs.map((cr) => (
                <div key={cr.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">#{cr.id} - {cr.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{cr.reason}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Created {new Date(cr.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(cr.status)}`}>
                      {cr.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(cr.priority)}`}>
                      {cr.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No change requests yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
