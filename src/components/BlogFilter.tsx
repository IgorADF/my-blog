import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Post = {
  slug: string;
  title: string;
  resume: string;
  image: string;
  tags: string[];
};

type Props = {
  posts: Post[];
  tags: string[];
};

export function BlogFilter({ posts, tags }: Props) {
  const [draftEnabled, setDraftEnabled] = useState<Set<string>>(
    () => new Set(tags),
  );
  const [draftQuery, setDraftQuery] = useState("");
  const [appliedEnabled, setAppliedEnabled] = useState<Set<string>>(
    () => new Set(tags),
  );
  const [appliedQuery, setAppliedQuery] = useState("");

  const toggleTag = (tag: string) => {
    setDraftEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const handleApply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedEnabled(new Set(draftEnabled));
    setAppliedQuery(draftQuery);
  };

  const handleReset = () => {
    const all = new Set(tags);
    setDraftEnabled(all);
    setDraftQuery("");
    setAppliedEnabled(new Set(all));
    setAppliedQuery("");
  };

  const q = appliedQuery.trim().toLowerCase();
  const visiblePosts = posts.filter((p) => {
    if (q && !p.title.toLowerCase().includes(q)) return false;
    return p.tags.every((t) => appliedEnabled.has(t));
  });

  return (
    <>
      <form
        onSubmit={handleApply}
        className="mx-auto flex max-w-3xl flex-col gap-4 px-4"
      >
        <input
          type="search"
          placeholder="Search by title..."
          value={draftQuery}
          onChange={(e) => setDraftQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag) => {
            const active = draftEnabled.has(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "inline-flex cursor-pointer items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted text-muted-foreground opacity-60 hover:opacity-100",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-2">
          <Button type="submit" size="sm" className={"w-28"}>
            Filter
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={"w-28"}
            onClick={handleReset}
          >
            Reset filter
          </Button>
        </div>
      </form>

      <section className="mx-auto mt-10 max-w-5xl px-4 pb-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <li
              key={post.slug}
              className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground"
            >
              <a href={`/${post.slug}/`} className="block">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-col gap-3 p-4">
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.resume}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
