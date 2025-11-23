import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function NewChangeRequest() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  const [formData, setFormData] = useState({
    title: "",
    reason: "",
    affectedResources: "",
    assigneeId: "",
    prLink: "",
    rollbackPlan: "",
    status: "draft" as const,
    priority: "medium" as const,
    scheduledDate: "",
  });

  const { data: users, isLoading: usersLoading } = trpc.users.list.useQuery();

  const createMutation = trpc.changeRequests.create.useMutation({
    onSuccess: () => {
      toast.success("Change request created successfully!");
      utils.changeRequests.list.invalidate();
      utils.changeRequests.stats.invalidate();
      utils.changeRequests.getRecent.invalidate();
      setLocation("/change-requests");
    },
    onError: (error) => {
      toast.error(`Failed to create change request: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assigneeId) {
      toast.error("Please select an assignee");
      return;
    }

    createMutation.mutate({
      title: formData.title,
      reason: formData.reason,
      affectedResources: formData.affectedResources,
      assigneeId: parseInt(formData.assigneeId),
      prLink: formData.prLink || undefined,
      rollbackPlan: formData.rollbackPlan,
      status: formData.status,
      priority: formData.priority,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Change Request</h1>
        <p className="text-muted-foreground mt-2">
          Create a new change request for tracking and approval
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Change Request Details</CardTitle>
            <CardDescription>Fill in all required information about the change</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the change"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Why is this change needed?"
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affectedResources">Affected Resources/Services *</Label>
              <Textarea
                id="affectedResources"
                placeholder="List all systems, services, or resources affected by this change"
                value={formData.affectedResources}
                onChange={(e) => handleChange("affectedResources", e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee *</Label>
                <Select value={formData.assigneeId} onValueChange={(value) => handleChange("assigneeId", value)}>
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder={usersLoading ? "Loading users..." : "Select assignee"} />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name || user.email || `User ${user.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => handleChange("scheduledDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prLink">Pull Request Link</Label>
              <Input
                id="prLink"
                type="url"
                placeholder="https://github.com/..."
                value={formData.prLink}
                onChange={(e) => handleChange("prLink", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollbackPlan">Rollback Plan *</Label>
              <Textarea
                id="rollbackPlan"
                placeholder="Detailed steps to rollback this change if needed"
                value={formData.rollbackPlan}
                onChange={(e) => handleChange("rollbackPlan", e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/change-requests")}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Change Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
