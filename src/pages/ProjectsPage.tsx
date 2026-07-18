import { useEffect, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";

import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { DataEmptyState } from "@/components/dashboard/DataEmptyState";
import { GettingStarted } from "@/components/dashboard/GettingStarted";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import {
  useWorkspace,
  useWorkspaceActions,
} from "@/components/workspace/WorkspaceProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteProject, getTraces, renameProject } from "@/lib/api";
import { isDesignMode } from "@/lib/design-mode";

export function ProjectsPage() {
  const workspace = useWorkspace();
  const { refreshWorkspace } = useWorkspaceActions();
  const [traceCount, setTraceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"rename" | "delete" | null>(null);
  const [projectName, setProjectName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const orgId = workspace.org_id;
  const orgName = workspace.org_name ?? "Your organization";
  const project = workspace.projects[0];

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const result = await getTraces({ orgId, limit: 50 });
        if (!cancelled) setTraceCount(result.total ?? result.traces.length);
      } catch {
        if (!cancelled) setTraceCount(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  const closeAction = () => {
    if (saving) return;
    setAction(null);
    setActionError(null);
    setDeleteConfirmation("");
  };

  const handleRename = async (event: FormEvent) => {
    event.preventDefault();
    const name = projectName.trim();
    if (!project || !orgId || !name) return;

    setSaving(true);
    setActionError(null);
    try {
      await renameProject(orgId, project.id, name);
      await refreshWorkspace();
      setAction(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not rename project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !orgId || deleteConfirmation !== project.name) return;

    setSaving(true);
    setActionError(null);
    try {
      await deleteProject(orgId, project.id, deleteConfirmation);
      await refreshWorkspace();
      setAction(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not delete project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPage title="Projects">
      {isDesignMode() && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          Design mode — showing mock workspace data.
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-medium text-foreground">{orgName}</h2>
          <Badge variant="secondary" className="gap-1.5">
            <span aria-hidden="true">☁</span>
            Hobby
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {workspace.projects.length} / 1 projects used
          </span>
          <Lock className="h-3.5 w-3.5" />
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-36 w-full max-w-xl rounded-xl" />
      ) : !project ? (
        <DataEmptyState
          title="Your first project is almost ready"
          message="No project data has arrived yet. Follow the setup steps below to create a project and send your first trace."
        />
      ) : (
        <ProjectCard
          name={project.name}
          organization={orgName}
          traceCount={traceCount}
          isNew={traceCount === 0}
          onRename={() => {
            setProjectName(project.name);
            setActionError(null);
            setAction("rename");
          }}
          onRemove={() => {
            setActionError(null);
            setDeleteConfirmation("");
            setAction("delete");
          }}
        />
      )}

      <GettingStarted />

      {project && action && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAction();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-action-title"
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
          >
            {action === "rename" ? (
              <form onSubmit={(event) => void handleRename(event)}>
                <h2 id="project-action-title" className="text-xl font-semibold text-foreground">
                  Rename project
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a clear name for this project.
                </p>
                <Input
                  autoFocus
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  maxLength={200}
                  className="mt-5"
                  aria-label="Project name"
                />
                {actionError && (
                  <p className="mt-3 text-sm text-destructive">{actionError}</p>
                )}
                <div className="mt-6 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={closeAction} disabled={saving}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving || !projectName.trim() || projectName.trim() === project.name}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h2 id="project-action-title" className="text-xl font-semibold text-foreground">
                  Delete project?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This permanently deletes{" "}
                  <strong className="text-foreground">{project.name}</strong> and revokes its API
                  keys. Captured traces are retained. Deleting the project cannot be undone. Do
                  you want to continue?
                </p>
                <div className="mt-5">
                  <label
                    htmlFor="delete-project-confirmation"
                    className="text-sm font-medium text-foreground"
                  >
                    Enter <strong>{project.name}</strong> to confirm
                  </label>
                  <Input
                    id="delete-project-confirmation"
                    autoFocus
                    autoComplete="off"
                    value={deleteConfirmation}
                    onChange={(event) => setDeleteConfirmation(event.target.value)}
                    placeholder={project.name}
                    className="mt-2"
                  />
                </div>
                {actionError && (
                  <p className="mt-3 text-sm text-destructive">{actionError}</p>
                )}
                <div className="mt-6 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={closeAction} disabled={saving}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => void handleDelete()}
                    disabled={saving || deleteConfirmation !== project.name}
                  >
                    {saving ? "Deleting…" : "Delete project"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardPage>
  );
}
