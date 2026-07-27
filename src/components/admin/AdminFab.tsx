import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { useContent } from "../../lib/content";
import PostForm from "./PostForm";
import ProjectForm from "./ProjectForm";

// Floating action button (bottom-right). Behavior:
//  - auth disabled            → nothing
//  - signed out               → discreet sign-in button
//  - signed in, not admin     → discreet sign-out button
//  - signed in as admin       → "+" with a menu (new post / new project / out)
export default function AdminFab() {
  const { enabled, user, isAdmin, authReady, signIn, signOut } = useAuth();
  const { refreshPosts, refreshProjects } = useContent();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<null | "post" | "project">(null);

  if (!enabled || !authReady) return null;

  if (!user) {
    return (
      <div className="fab-stack">
        <button
          className="fab fab--sm"
          title="Admin sign-in"
          aria-label="Admin sign-in"
          onClick={() => signIn().catch((e) => alert(e.message))}
        >
          ⌂
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fab-stack">
        <button
          className="fab fab--sm"
          title={`Signed in as ${user.email} (not admin) — sign out`}
          aria-label="Sign out"
          onClick={() => signOut()}
        >
          ⇥
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="fab-stack">
        {open && (
          <div className="fab__menu">
            <button className="fab__item" onClick={() => { setModal("post"); setOpen(false); }}>
              ✎ New field note
            </button>
            <button className="fab__item" onClick={() => { setModal("project"); setOpen(false); }}>
              ✎ New project
            </button>
            <button className="fab__item" onClick={() => signOut()}>
              ⇥ Sign out
            </button>
          </div>
        )}
        <button
          className="fab"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ transform: open ? "rotate(45deg)" : "none", transition: "transform 120ms ease" }}
        >
          +
        </button>
      </div>

      {modal === "post" && (
        <PostForm onClose={() => setModal(null)} onSaved={refreshPosts} />
      )}
      {modal === "project" && (
        <ProjectForm onClose={() => setModal(null)} onSaved={refreshProjects} />
      )}
    </>
  );
}
