import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { Plus, Search, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChangeRequests() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: allCRs, isLoading } = trpc.changeRequests.list.useQuery();
  const { data: users } = trpc.users.list.useQuery();

  const filteredCRs = useMemo(() => {
    if (!allCRs) return [];
    
    let filtered = allCRs;

    if (statusFilter !== "all") {
      filtered = filtered.filter(cr => cr.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cr =>
        cr.title.toLowerCase().includes(term) ||
        cr.reason.toLowerCase().includes(term) ||
        cr.affectedResources.toLowerCase().includes(term) ||
        cr.id.toString().includes(term)
      );
    }

    return filtered;
  }, [allCRs, searchTerm, statusFilter]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Change Requests</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all change requests
          </p>
        </div>
        <Button onClick={() => setLocation("/new-change-request")}>
          <Plus className="mr-2 h-4 w-4" />
          New Change Request
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific change requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, reason, resources, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="rolled_back">Rolled Back</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Change Requests ({filteredCRs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredCRs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCRs.map((cr) => (
                    <TableRow key={cr.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">#{cr.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{cr.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {cr.reason}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(cr.status)}</TableCell>
                      <TableCell>{getPriorityBadge(cr.priority)}</TableCell>
                      <TableCell className="text-sm">{getUserName(cr.assigneeId)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(cr.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {cr.prLink && (
                          <a
                            href={cr.prLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No change requests found</p>
              <p className="text-sm mt-1">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first change request to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
