import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function CreatorDashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [comics, setComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user?.id) {
      navigate({ to: "/" });
      return;
    }

    if (!user?.id) return;

    // Fetch comics directly
    const fetchComics = async () => {
      try {
        const { data, error } = await supabase
          .from("comics")
          .select("*")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching comics:", error);
          setComics([]);
        } else {
          setComics(data || []);
        }
      } catch (err) {
        console.error("Exception fetching comics:", err);
        setComics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();
  }, [authLoading, user?.id, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user?.id) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            Creator Studio
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Manage your comics and chapters
          </p>
        </div>
        <Button
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link to="/creator/comics/new">
            <Plus className="w-4 h-4 mr-2" /> New Comic
          </Link>
        </Button>
      </div>

      {comics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <BookOpen className="w-14 h-14 text-muted-foreground" />
          <p className="font-body text-base text-muted-foreground">
            You haven't created any comics yet.
          </p>
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link to="/creator/comics/new">
              <Plus className="w-4 h-4 mr-2" /> Create your first comic
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className="rounded-xl overflow-hidden bg-card border border-purple-900/40 hover:border-accent/60"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {comic.cover_url && (
                  <img
                    src={comic.cover_url}
                    alt={comic.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-display text-sm text-foreground line-clamp-2">
                  {comic.title}
                </h3>
                <Button
                  asChild
                  size="sm"
                  className="w-full mt-2 bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-accent-foreground text-xs"
                >
                  <Link
                    to="/creator/comics/$comicId"
                    params={{ comicId: comic.id }}
                  >
                    Manage
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
