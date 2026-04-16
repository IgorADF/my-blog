import { supabase } from "@/db/supabase";
import { useEffect, useState } from "react";
import { Eye, Heart, Loader2 } from "lucide-react";

type PostCounts = {
  likes_count: number;
  views_count: number;
};

export function PostStats({ slug }: { slug: string }) {
  const [postCounts, setPostCounts] = useState<PostCounts | null>(null);

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
  }, [slug]);

  if (!postCounts) {
    return (
      <div
        className="flex items-center gap-2 text-sm text-muted-foreground"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        <span>Loading stats...</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-4 text-sm text-muted-foreground"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1.5">
        <Eye className="size-4" aria-hidden="true" />
        <span>
          {postCounts.views_count}{" "}
          {postCounts.views_count === 1 ? "view" : "views"}
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Heart className="size-4" aria-hidden="true" />
        <span>
          {postCounts.likes_count}{" "}
          {postCounts.likes_count === 1 ? "like" : "likes"}
        </span>
      </span>
    </div>
  );
}
