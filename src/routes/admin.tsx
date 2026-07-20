import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CATEGORIES } from "@/components/products";
import type { DbProduct } from "@/hooks/useDbProducts";
import { useDbCategories, type DbCategory } from "@/hooks/useDbCategories";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Elite Jewellery Gallery" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Editable = Partial<DbProduct> & { id?: string };

const emptyForm: Editable = {
  name: "",
  category: "Rings",
  price: 0,
  description: "",
  image: "",
  gallery: [],
  weight: "",
  metal: "",
  is_new: false,
};

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [editing, setEditing] = useState<Editable | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"products" | "categories">("products");
  const { categories: dbCategories, refetch: refetchCategories } = useDbCategories();
  const [newCategoryName, setNewCategoryName] = useState("");

  const categoryOptions = dbCategories.length
    ? dbCategories.map((c) => c.name)
    : (CATEGORIES as readonly string[]);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });
    setProducts((data as DbProduct[]) ?? []);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      setUserEmail(session.user.email ?? null);
      setUserId(session.user.id);
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roleRow);
      setChecking(false);
      if (roleRow) load();
    });
    return () => {
      mounted = false;
    };
  }, [navigate, load]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      return data.publicUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.category) {
      toast.error("Name and category are required.");
      return;
    }
    const payload = {
      name: editing.name!,
      category: editing.category!,
      price: Number(editing.price ?? 0),
      description: editing.description ?? "",
      image: editing.image ?? "",
      gallery: editing.gallery ?? [],
      weight: editing.weight || null,
      metal: editing.metal || null,
      is_new: !!editing.is_new,
    };
    if (editing.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Product updated");
    } else {
      const maxOrder = products.reduce((m, p) => Math.max(m, p.display_order), 0);
      const { error } = await supabase
        .from("products")
        .insert({ ...payload, display_order: maxOrder + 1 });
      if (error) return toast.error(error.message);
      toast.success("Product created");
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = products.findIndex((p) => p.id === id);
    const swap = products[idx + dir];
    if (!swap) return;
    const cur = products[idx];
    await supabase.from("products").update({ display_order: swap.display_order }).eq("id", cur.id);
    await supabase.from("products").update({ display_order: cur.display_order }).eq("id", swap.id);
    load();
  }

  async function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const maxOrder = dbCategories.reduce((m, c) => Math.max(m, c.display_order), 0);
    const { error } = await supabase
      .from("categories")
      .insert({ name, display_order: maxOrder + 1, visible: true });
    if (error) return toast.error(error.message);
    toast.success("Category added");
    setNewCategoryName("");
    refetchCategories();
  }

  async function renameCategory(c: DbCategory, name: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed === c.name) return;
    const { error } = await supabase.from("categories").update({ name: trimmed }).eq("id", c.id);
    if (error) return toast.error(error.message);
    // Keep products in sync so the join by string still works.
    await supabase.from("products").update({ category: trimmed }).eq("category", c.name);
    toast.success("Category renamed");
    refetchCategories();
    load();
  }

  async function toggleCategoryVisible(c: DbCategory) {
    const { error } = await supabase
      .from("categories")
      .update({ visible: !c.visible })
      .eq("id", c.id);
    if (error) return toast.error(error.message);
    refetchCategories();
  }

  async function moveCategory(id: string, dir: -1 | 1) {
    const idx = dbCategories.findIndex((c) => c.id === id);
    const swap = dbCategories[idx + dir];
    if (!swap) return;
    const cur = dbCategories[idx];
    await supabase.from("categories").update({ display_order: swap.display_order }).eq("id", cur.id);
    await supabase.from("categories").update({ display_order: cur.display_order }).eq("id", swap.id);
    refetchCategories();
  }

  async function deleteCategory(c: DbCategory) {
    const inUse = products.some((p) => p.category === c.name);
    if (inUse) {
      toast.error(`Cannot delete "${c.name}" — it's used by existing products.`);
      return;
    }
    if (!confirm(`Delete category "${c.name}"?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Category deleted");
    refetchCategories();
  }

  async function grantSelfAdmin() {
    if (!userId) return;
    // Bootstrap: only works if no admin exists yet (uses INSERT under RLS which requires admin)
    // For first admin, use a server-side approach: check if any admin exists via SQL RPC
    // Simple bootstrap workflow: attempt insert; if it fails, tell user.
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) {
      toast.error(
        "Cannot self-grant admin (existing admin required). Ask an existing admin, or use the SQL bootstrap in the Cloud dashboard."
      );
      return;
    }
    toast.success("Admin role granted");
    setIsAdmin(true);
    load();
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-16">
        <div className="max-w-md rounded-2xl bg-background p-8 shadow-luxe text-center">
          <h1 className="font-serif text-2xl">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in as <strong>{userEmail}</strong> but don't have the admin role yet.
          </p>
          <button
            onClick={grantSelfAdmin}
            className="mt-6 w-full rounded-full bg-gradient-gold py-3 text-sm font-medium text-white"
          >
            Try to bootstrap myself as admin
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            (Only works if no admin exists yet. Otherwise ask an existing admin to grant your role.)
          </p>
          <div className="mt-6 flex gap-2">
            <Link to="/" className="flex-1 rounded-full border border-border py-2 text-sm">Home</Link>
            <button onClick={signOut} className="flex-1 rounded-full border border-border py-2 text-sm">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <div>
            <h1 className="font-serif text-xl">Product Admin</h1>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="rounded-full border border-border px-4 py-2 text-sm">View site</Link>
            <button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("products")}
              className={`rounded-full px-5 py-2 text-sm ${tab === "products" ? "bg-gradient-gold text-white" : "border border-border"}`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setTab("categories")}
              className={`rounded-full px-5 py-2 text-sm ${tab === "categories" ? "bg-gradient-gold text-white" : "border border-border"}`}
            >
              Categories ({dbCategories.length})
            </button>
          </div>
          {tab === "products" && (
            <button
              onClick={() => setEditing({ ...emptyForm })}
              className="rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-medium text-white"
            >
              + New Product
            </button>
          )}
        </div>

        {tab === "categories" && (
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                placeholder="New category name (e.g. Pendants)"
                className="flex-1 min-w-[220px] rounded-lg border border-border px-3 py-2 text-sm"
              />
              <button
                onClick={addCategory}
                className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-medium text-white"
              >
                + Add Category
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-cream/50 text-left text-xs tracking-luxe text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">ORDER</th>
                  <th className="px-4 py-3">NAME</th>
                  <th className="px-4 py-3">VISIBLE ON SITE</th>
                  <th className="px-4 py-3">PRODUCTS</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {dbCategories.map((c, i) => {
                  const count = products.filter((p) => p.category === c.name).length;
                  return (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveCategory(c.id, -1)}
                            disabled={i === 0}
                            className="text-xs disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <span className="text-xs text-muted-foreground">{c.display_order}</span>
                          <button
                            onClick={() => moveCategory(c.id, 1)}
                            disabled={i === dbCategories.length - 1}
                            className="text-xs disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          defaultValue={c.name}
                          onBlur={(e) => renameCategory(c, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          }}
                          className="rounded border border-transparent px-2 py-1 font-medium hover:border-border focus:border-[var(--gold)] focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleCategoryVisible(c)}
                          className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.visible ? "bg-gradient-gold" : "bg-muted"}`}
                          aria-label={c.visible ? "Hide from site" : "Show on site"}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${c.visible ? "translate-x-5" : "translate-x-1"}`}
                          />
                        </button>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {c.visible ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{count}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteCategory(c)}
                          disabled={count > 0}
                          title={count > 0 ? "Reassign products before deleting" : "Delete category"}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {dbCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No categories yet. Add one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="border-t border-border p-4 text-xs text-muted-foreground">
              Hidden categories (and their products) won't appear on the public site. Renaming a category auto-updates all its products.
            </p>
          </div>
        )}

        {tab === "products" && (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 text-left text-xs tracking-luxe text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ORDER</th>
                <th className="px-4 py-3">IMAGE</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">PRICE</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => move(p.id, -1)}
                        disabled={i === 0}
                        className="text-xs disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <span className="text-xs text-muted-foreground">{p.display_order}</span>
                      <button
                        onClick={() => move(p.id, 1)}
                        disabled={i === products.length - 1}
                        className="text-xs disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded bg-cream" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(p)}
                      className="mr-2 rounded-full border border-border px-3 py-1 text-xs hover:border-[var(--gold)]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No products yet. Click <strong>+ New Product</strong> to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl">{editing.id ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setEditing(null)} className="text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <Field label="Name">
                <input
                  value={editing.name ?? ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full rounded-lg border border-border px-3 py-2"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select
                    value={editing.category ?? "Rings"}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Price (₹)">
                  <input
                    type="number"
                    value={editing.price ?? 0}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-border px-3 py-2"
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-lg border border-border px-3 py-2"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Weight (optional)">
                  <input
                    value={editing.weight ?? ""}
                    onChange={(e) => setEditing({ ...editing, weight: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2"
                  />
                </Field>
                <Field label="Metal (optional)">
                  <input
                    value={editing.metal ?? ""}
                    onChange={(e) => setEditing({ ...editing, metal: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!editing.is_new}
                  onChange={(e) => setEditing({ ...editing, is_new: e.target.checked })}
                />
                Show "NEW" badge
              </label>

              <Field label="Main Image">
                <div className="flex items-center gap-3">
                  {editing.image && (
                    <img src={editing.image} alt="" className="h-16 w-16 rounded object-cover" />
                  )}
                  <label className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm hover:border-[var(--gold)]">
                    {uploading ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const url = await uploadImage(f);
                        if (url) setEditing({ ...editing, image: url });
                      }}
                    />
                  </label>
                  {editing.image && (
                    <button
                      onClick={() => setEditing({ ...editing, image: "" })}
                      className="text-xs text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  value={editing.image ?? ""}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="or paste an image URL"
                  className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-xs"
                />
              </Field>

              <Field label={`Gallery (${editing.gallery?.length ?? 0} images)`}>
                <div className="flex flex-wrap gap-2">
                  {(editing.gallery ?? []).map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="h-16 w-16 rounded object-cover" />
                      <button
                        onClick={() =>
                          setEditing({
                            ...editing,
                            gallery: (editing.gallery ?? []).filter((_, x) => x !== i),
                          })
                        }
                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded border border-dashed border-border text-xs hover:border-[var(--gold)]">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const url = await uploadImage(f);
                        if (url)
                          setEditing({
                            ...editing,
                            gallery: [...(editing.gallery ?? []), url],
                          });
                      }}
                    />
                  </label>
                </div>
              </Field>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-border px-5 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={uploading}
                  className="rounded-full bg-gradient-gold px-5 py-2 text-sm text-white disabled:opacity-60"
                >
                  {editing.id ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs tracking-luxe text-muted-foreground">{label.toUpperCase()}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}