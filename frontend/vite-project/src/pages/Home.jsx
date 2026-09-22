import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosCalls/axios";

const stories = [
  { name: "Your Story", initials: "You", tone: "from-indigo-500 to-violet-500" },
  { name: "Ananya", initials: "AN", tone: "from-pink-500 to-rose-500" },
  { name: "Rohan", initials: "RO", tone: "from-cyan-500 to-blue-500" },
  { name: "Priya", initials: "PR", tone: "from-amber-400 to-orange-500" },
  { name: "Arjun", initials: "AR", tone: "from-emerald-400 to-teal-500" },
];

function Avatar({ initials, tone = "from-slate-700 to-slate-900", size = "h-11 w-11" }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-xs font-bold text-white ring-2 ring-white`}>
      {initials}
    </div>
  );
}

function Home() {
  const { user: loggedInUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const getInitials = (name) =>
    name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

  const openCreateModal = (type) => {
    setCreateType(type);
    setSelectedMedia(null);
    setCaption("");
    setCreateError("");
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    if (createLoading) return;
    setIsCreateOpen(false);
    setCreateType(null);
    setSelectedMedia(null);
    setCaption("");
    setCreateError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = createType === "post"
      ? file.type.startsWith("image/")
      : file.type.startsWith("video/");

    if (!isValidType) {
      setCreateError(`Please choose a valid ${createType === "post" ? "image" : "video"} file.`);
      event.target.value = "";
      return;
    }

    setSelectedMedia(file);
    setCreateError("");
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    if (!selectedMedia) {
      setCreateError(`Please select a ${createType === "post" ? "image" : "video"} first.`);
      return;
    }

    if (caption.length > 500) {
      setCreateError("Caption cannot be more than 500 characters.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption.trim());
    formData.append(createType === "post" ? "image" : "video", selectedMedia);

    try {
      setCreateLoading(true);
      await axiosInstance.post(
        createType === "post" ? "/post/create" : "/reel/createReel",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      closeCreateModal();
    } catch (error) {
      setCreateError(error.response?.data?.message || "Unable to publish. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => navigate("/home")} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-black text-white shadow-sm">
              S
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-base font-black tracking-tight">SST Social</p>
              <p className="text-[11px] text-slate-500">Your circle, your feed.</p>
            </div>
          </button>

          <div className="hidden w-72 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 md:flex">
            <span className="text-base">⌕</span>
            <span>Search people or posts</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100" aria-label="Notifications">♡</button>
            <button
              onClick={() => navigate(`/profile/${loggedInUser?.username}`)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-slate-300 hover:shadow-sm"
            >
              <Avatar initials={getInitials(loggedInUser?.name)} tone="from-indigo-500 to-violet-500" size="h-8 w-8" />
              <span className="hidden text-sm font-semibold sm:block">{loggedInUser?.name || "You"}</span>
            </button>
            <button onClick={handleLogout} className="hidden rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:block">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <button className="flex w-full items-center gap-3 rounded-2xl bg-indigo-50 px-4 py-3 text-left">
                <span className="text-lg">⌂</span>
                <span className="text-sm font-bold text-indigo-700">Home Feed</span>
              </button>
              <button onClick={() => navigate(`/profile/${loggedInUser?.username}`)} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50">
                <span className="text-lg">◉</span>
                <span className="text-sm font-semibold">My Profile</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50">
                <span className="text-lg">♡</span>
                <span className="text-sm font-semibold">Notifications</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50">
                <span className="text-lg">⌁</span>
                <span className="text-sm font-semibold">Explore</span>
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h1 className="text-xl font-black tracking-tight">Your Feed</h1>
                <p className="mt-1 text-xs text-slate-500">See what your circle is up to.</p>
              </div>
              <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Latest ↓</button>
            </div>
            <div className="flex gap-4 overflow-x-auto border-t border-slate-100 px-5 py-4 scrollbar-hide">
              {stories.map((story, index) => (
                <button key={story.name} className="group flex w-[76px] shrink-0 flex-col items-center gap-2">
                  <div className={`rounded-full bg-gradient-to-br ${story.tone} p-[3px] transition group-hover:scale-105`}>
                    <div className="rounded-full bg-white p-[2px]">
                      <Avatar initials={index === 0 ? getInitials(loggedInUser?.name) : story.initials} tone={story.tone} size="h-12 w-12" />
                    </div>
                  </div>
                  <span className="w-full truncate text-center text-[11px] font-semibold text-slate-600">{index === 0 ? "Your Story" : story.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar initials={getInitials(loggedInUser?.name)} tone="from-indigo-500 to-violet-500" />
              <button className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-100">
                What’s on your mind, {loggedInUser?.name?.split(" ")[0] || "there"}?
              </button>
              <button onClick={() => openCreateModal("post")} className="hidden rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 sm:block">+ Post</button>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => openCreateModal("post")} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">▧ Add Image</button>
              <button onClick={() => openCreateModal("reel")} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">▶ Add Reel</button>
            </div>
          </div>

          {isCreateOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="composer-title">
              <form onSubmit={handleCreateSubmit} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 id="composer-title" className="text-lg font-black">Create {createType === "post" ? "post" : "reel"}</h2>
                  <button type="button" onClick={closeCreateModal} className="rounded-full px-2 py-1 text-xl text-slate-400 hover:bg-slate-100" aria-label="Close">×</button>
                </div>
                <input
                  ref={fileInputRef}
                  id="composer-file"
                  type="file"
                  accept={createType === "post" ? "image/*" : "video/*"}
                  onChange={handleMediaChange}
                  className="hidden"
                />
                <label htmlFor="composer-file" className="mt-5 inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md">
                  Choose file
                </label>
                <p className="mt-2 min-h-4 text-xs text-slate-500">{selectedMedia?.name || "No file selected"}</p>
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Write a caption..."
                  className="mt-4 w-full resize-none rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{caption.length}/500</span>
                </div>
                {createError && <p className="mt-3 text-sm font-semibold text-red-600">{createError}</p>}
                <button type="submit" disabled={createLoading} className="mt-5 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {createLoading ? "Publishing..." : `Publish ${createType === "post" ? "post" : "reel"}`}
                </button>
              </form>
            </div>
          )}

          <div className="space-y-5">
            {[1, 2].map((item) => (
              <article key={item} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={item === 1 ? "AN" : "RO"} tone={item === 1 ? "from-pink-500 to-violet-500" : "from-cyan-500 to-blue-500"} />
                    <div>
                      <p className="text-sm font-bold">{item === 1 ? "Ananya Sharma" : "Rohan Das"}</p>
                      <p className="text-xs text-slate-400">@{item === 1 ? "ananya" : "rohan"} · 2h ago</p>
                    </div>
                  </div>
                  <button className="rounded-full px-2 py-1 text-lg leading-none text-slate-400 hover:bg-slate-50">•••</button>
                </div>

                {item === 1 ? (
                  <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-violet-100 text-sm font-semibold text-slate-400">
                    Image preview
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-slate-950 text-sm font-semibold text-white/50">
                    Video preview
                  </div>
                )}

                <div className="px-5 pb-5 pt-4">
                  <p className="text-sm leading-6 text-slate-700">{item === 1 ? "Building something cool today 🚀" : "A tiny break between classes."}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>24 likes</span>
                    <span>6 comments</span>
                  </div>
                  <div className="mt-4 flex border-t border-slate-100 pt-3">
                    <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">♡ Like</button>
                    <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">◌ Comment</button>
                    <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">↗ Share</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black">People to follow</h2>
                <button className="text-xs font-bold text-indigo-600">See all</button>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  ["Priya Nair", "priyanair", "PN", "from-amber-400 to-orange-500"],
                  ["Arjun Kapoor", "arjunk", "AK", "from-emerald-400 to-teal-500"],
                  ["Meera Das", "meerad", "MD", "from-fuchsia-500 to-purple-500"],
                ].map(([name, handle, initials, tone]) => (
                  <div key={handle} className="flex items-center gap-3">
                    <Avatar initials={initials} tone={tone} size="h-10 w-10" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{name}</p>
                      <p className="truncate text-xs text-slate-400">@{handle}</p>
                    </div>
                    <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Home;
