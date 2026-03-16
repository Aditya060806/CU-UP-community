"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Plus, Save, Trash2, Users, X } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Club } from "@/types/portal";

interface ClubForm {
  name: string; college: string; description: string; website: string; logo: string;
}

const EMPTY_FORM: ClubForm = {
  name: "", college: "Chandigarh University, Uttar Pradesh", description: "", website: "", logo: "",
};

export default function StaffClubs() {
  const { authenticated, loading, name, email, logout } = useAuth("staff");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClubForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchClubs = useCallback(async () => {
    const res = await fetch("/api/portal/clubs");
    if (res.ok) setClubs(await res.json());
  }, []);

  useEffect(() => { if (authenticated) fetchClubs(); }, [authenticated, fetchClubs]);

  const handleSave = async () => {
    setSaving(true);
    if (editingId) {
      // Edit mode
      const res = await fetch("/api/portal/clubs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      if (res.ok) {
        const updated = await res.json();
        setClubs((prev) => prev.map((c) => (String(c.id) === String(editingId) ? updated : c)));
      }
    } else {
      // Create mode
      const res = await fetch("/api/portal/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setClubs((prev) => [...prev, created]);
      }
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const startEdit = (club: Club) => {
    setEditingId(String(club.id));
    setForm({
      name: club.name, college: club.college,
      description: club.description ?? "", website: club.website ?? "", logo: club.logo ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this club? This will remove it from the public clubs page.")) return;
    setDeleting(String(id));
    const res = await fetch("/api/portal/clubs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setClubs((prev) => prev.filter((c) => String(c.id) !== String(id)));
    setDeleting(null);
  };

  if (loading) return null;
  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav role="staff" name={name} email={email} onLogout={logout} />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Manage Clubs</h1>
                <p className="text-sm text-zinc-500">Changes sync instantly to the public Clubs page</p>
              </div>
            </div>
            <Button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
              className="bg-red-700 hover:bg-red-800 text-white gap-2"
            >
              <Plus className="h-4 w-4" /> Add Club
            </Button>
          </div>

          {/* Add / Edit Form */}
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Card className="border-red-200 dark:border-red-800 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{editingId ? "Edit Club" : "Add New Club"}</CardTitle>
                    <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-zinc-400 hover:text-zinc-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Club Name *</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. CU Robotics Club" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>College/University *</Label>
                      <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Website URL</Label>
                      <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Logo URL</Label>
                      <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="/community-logos/club.png" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="resize-none" placeholder="What this club does..." />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!form.name || !form.college || saving} className="bg-red-700 hover:bg-red-800 text-white gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving…" : editingId ? "Save Changes" : "Add Club"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => (
              <Card key={String(club.id)} className="border-0 shadow-sm group hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base leading-tight">{club.name}</CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => startEdit(club)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-blue-600">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => handleDelete(club.id)} disabled={deleting === String(club.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">{club.college}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{club.description}</p>
                  {club.website && (
                    <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-2 block truncate">{club.website}</a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
