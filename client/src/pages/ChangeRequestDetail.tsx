import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ExternalLink, Calendar, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";

export default function ChangeRequestDetail() {
  const [, params] = useRoute("/change-requests/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const crId = params?.id ? parseInt(params.id) : 0;
  const { data: cr, isLoading } = trpc.changeRequests.getById.useQuery({ id: crId });
  const { data: users } = trpc.users.list.useQuery();

  const [newStatus, setNewStatus] = useState<string>("");

  const updateMutation = trpc.changeRequests.update.useMutation({
    onSuccess: () => {
      toast.success("Change request updated successfully!");
      utils.changeRequests.getById.invalidate({ id: crId });
      utils.changeRequests.list.invalidate();
      utils.changeRequests.stats.invalidate();
      setNewStatus("");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      draft: { variant: "secondary", label: "Draft" },
      pending: { variant: "outline", label: "Pending" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      implemented: { variant: "default", label: "Implemented" },
      rolled_back: { variant: "outline", label: "Rolled Back" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 border-blue-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <Badge variant="outline" className={colors[priority] || colors.low}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getUserName = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    return user?.name || user?.email || `User ${userId}`;
  };

  const canChangeStatus = () => {
    if (!user || !cr) return false;
    // Admin can change any status
    if (user.role === "admin") return true;
    // Assignee can approve or reject
    if (user.id === cr.assigneeId) return true;
    return false;
  };

  const handleStatusChange = () => {
    if (!newStatus || !cr) return;
    
    updateMutation.mutate({
      id: cr.id,
      status: newStatus as any,
      implementedAt: newStatus === "implemented" ? new Date() : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cr) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Change Request Not Found</h2>
        <Button onClick={() => setLocation("/change-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Change Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/change-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">CR #{cr.id}</h1>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(cr.status)}
          {getPriorityBadge(cr.priority)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{cr.title}</CardTitle>
          <CardDescription className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Created by {getUserName(cr.createdById)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(cr.createdAt).toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Reason</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{cr.reason}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Affected Resources/Services</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{cr.affectedResources}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Assignee</h3>
              <p className="text-muted-foreground">{getUserName(cr.assigneeId)}</p>
            </div>

            {cr.scheduledDate && (
              <div>
                <h3 className="font-semibold mb-2">Scheduled Date</h3>
                <p className="text-muted-foreground">{new Date(cr.scheduledDate).toLocaleString()}</p>
              </div>
            )}
          </div>

          {cr.prLink && (
            <div>
              <h3 className="font-semibold mb-2">Pull Request</h3>
              <a
                href={cr.prLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {cr.prLink}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Rollback Plan</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{cr.rollbackPlan}</p>
          </div>

          {cr.implementedAt && (
            <div>
              <h3 className="font-semibold mb-2">Implemented At</h3>
              <p className="text-muted-foreground">{new Date(cr.implementedAt).toLocaleString()}</p>
            </div>
          )}

          {canChangeStatus() && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Update Status</h3>
              <div className="flex gap-3">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="rolled_back">Rolled Back</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleStatusChange} 
                  disabled={!newStatus || updateMutation.isPending}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
