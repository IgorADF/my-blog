import { supabase } from "@/db/supabase";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type PostCounts = {
  likes_count: number;
  views_count: number;
};

const likedStorageKey = (slug: string) => `post-liked:${slug}`;

export function PostStats({ slug }: { slug: string }) {
  const [postCounts, setPostCounts] = useState<PostCounts | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(likedStorageKey(slug)) === "1");
  }, [slug]);

  async function handleLike() {
    if (liked || !postCounts) return;

    setLiked(true);
    localStorage.setItem(likedStorageKey(slug), "1");

    setPostCounts({
      ...postCounts,
      likes_count: postCounts.likes_count + 1,
    });

    const { error } = await supabase.rpc("increment_likes", { p_slug: slug });
    if (error) {
      setLiked(false);
      localStorage.removeItem(likedStorageKey(slug));
      setPostCounts(postCounts);
    }
  }

  useEffect(() => {
    async function loadPostCountsFromDb() {
      const { data, error } = await supabase
        .rpc("get_post_stats", {
          p_slug: slug,
        })
        .single();

      if (error) {
        return;
      }

      setPostCounts({
        likes_count: (data as any)?.likes_count,
        views_count: (data as any)?.views_count,
      });
    }

    loadPostCountsFromDb();

    const timeoutId = setTimeout(async () => {
      await supabase.rpc("increment_views", { p_slug: slug });
    }, 10_000);

    return () => clearTimeout(timeoutId);
  }, [slug]);

  if (!postCounts) {
    return (
      <div
        className="flex justify-between items-center gap-4 text-sm text-muted-foreground"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading stats"
      >
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-4 opacity-40" aria-hidden="true" />
          <span className="inline-block h-5 w-14 rounded bg-muted animate-pulse" />
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2 py-1">
          <Heart className="size-4 opacity-40" aria-hidden="true" />
          <span className="inline-block h-5 w-12 rounded bg-muted animate-pulse" />
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex justify-between items-center gap-4 text-sm text-muted-foreground"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1.5">
        <Eye className="size-4" aria-hidden="true" />
        <span>
          {postCounts.views_count}{" "}
          {postCounts.views_count === 1 ? "view" : "views"}
        </span>
      </span>

      <div className="relative">
        {!liked && (
          <div
            className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-1 flex items-center gap-1 animate-[bounce_1s_ease-in-out_infinite]"
            aria-hidden="true"
          >
            <span className="whitespace-nowrap rounded-md bg-red-500 px-2 py-0.5 text-xs font-medium text-white shadow-sm leading-tight">
              Like it!
            </span>
            <ArrowRight className="size-3 text-red-500" />
          </div>
        )}
        <button
          type="button"
          onClick={handleLike}
          disabled={liked}
          aria-pressed={liked}
          aria-label={liked ? "You liked this post" : "Like this post"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2 py-1 transition-all cursor-pointer hover:border-red-500 hover:bg-red-500/10 hover:text-red-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-default disabled:hover:scale-100 disabled:hover:bg-transparent",
            liked &&
              "border-red-500 text-red-500 hover:text-red-500 hover:border-red-500",
          )}
        >
          <Heart
            className={cn("size-4 transition-colors", liked && "fill-red-500")}
            aria-hidden="true"
          />
          <span>
            {postCounts.likes_count}{" "}
            {postCounts.likes_count === 1 ? "like" : "likes"}
          </span>
        </button>
      </div>
    </div>
  );
}
