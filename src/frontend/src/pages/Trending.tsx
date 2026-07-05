import { Skeleton } from "@/components/ui/skeleton";
import { useComics } from "@/hooks/useComics";
import { useTrending } from "@/hooks/useTrending";
import { Link } from "@tanstack/react-router";
import { Flame, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

function TrendingCardSkeleton() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '0px',
      border: '2px solid #111111',
      boxShadow: '3px 3px 0px #111111',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', aspectRatio: '9/14', backgroundColor: 'rgba(17, 17, 17, 0.08)', position: 'relative' }}>
        <Skeleton className="w-full h-full" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
      </div>
      <div style={{ padding: '12px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton className="h-4 w-3/4" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
        <Skeleton className="h-3 w-1/2" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
      </div>
    </div>
  );
}

function TrendingCard({
  comic,
  rank,
}: {
  comic: import("@/types/index").Comic;
  rank: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(rank * 0.06, 0.4), duration: 0.2 }}
      data-ocid={`trending.item.${rank}`}
      style={{ boxSizing: 'border-box' }}
    >
      <Link
        to="/comics/$comicId"
        params={{ comicId: comic.id }}
        data-ocid={`trending.card_link.${rank}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '0px',
          border: '2px solid #111111',
          boxShadow: '3px 3px 0px #111111',
          overflow: 'hidden',
          textDecoration: 'none',
          color: '#111111',
          boxSizing: 'border-box',
          height: '100%',
          transition: 'box-shadow 0.15s ease'
        }}
      >
        {/* Cover Canvas Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9/14',
          overflow: 'hidden',
          backgroundColor: '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          <img
            src={comic.cover_url ?? ""}
            alt={comic.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              boxSizing: 'border-box'
            }}
          />
          
          {/* Rank Badge - Sharp Red Manga Block */}
          <div style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            backgroundColor: '#cc0000',
            color: '#ffffff',
            borderRight: '2px solid #111111',
            borderBottom: '2px solid #111111',
            fontFamily: 'monospace, sans-serif',
            fontWeight: '900',
            fontSize: '13px',
            padding: '4px 10px',
            boxSizing: 'border-box',
            zIndex: 2
          }}>
            #{rank}
          </div>

          {/* Views Score Tag */}
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            backgroundColor: '#111111',
            border: '1px solid #fbbf24',
            borderRadius: '0px',
            boxSizing: 'border-box',
            zIndex: 2
          }}>
            <Flame style={{ width: '12px', height: '12px', color: '#fbbf24' }} />
            <span style={{
              fontSize: '11px',
              fontFamily: 'monospace, sans-serif',
              fontWeight: 'bold',
              color: '#fbbf24'
            }}>
              {comic.view_count ?? 0}
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div style={{
          padding: '10px',
          backgroundColor: '#ffffff',
          borderTop: '2px solid #111111',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontFamily: 'serif',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#111111',
            margin: '0 0 4px 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box'
          }}>
            {comic.title}
          </h3>
          <p style={{
            margin: '0',
            fontFamily: 'monospace, sans-serif',
            fontSize: '11px',
            color: '#555555',
            textTransform: 'uppercase',
            boxSizing: 'border-box'
          }}>
            {comic.view_count ?? 0} VIEWS
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrendingPage() {
  const { data: trendingEntries, isLoading: trendingLoading } = useTrending(24);

  const trendingComics = (trendingEntries ?? []).map((comic, idx) => ({
    comic,
    rank: idx + 1,
  }));

  return (
    <div 
      data-ocid="trending.page"
      style={{
        backgroundColor: '#f5f0e8',
        backgroundImage: 'radial-gradient(#fbbf24 1.2px, transparent 1.2px)',
        backgroundSize: '12px 12px',
        minHeight: '100vh',
        padding: '32px 16px',
        boxSizing: 'border-box',
        color: '#111111'
      }}
    >
      {/* Newspaper Style Page Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '32px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            backgroundColor: '#fbbf24',
            border: '2px solid #111111',
            boxShadow: '2px 2px 0px #111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}>
            <TrendingUp style={{ width: '18px', height: '18px', color: '#111111' }} />
          </div>
          <h1 style={{
            fontFamily: 'monospace, sans-serif',
            fontSize: '28px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            margin: '0',
            color: '#111111',
            boxSizing: 'border-box'
          }}>
            Trending Now
          </h1>
        </div>
        
        <p style={{
          margin: '6px 0 0 0',
          fontFamily: 'serif',
          fontSize: '14px',
          fontStyle: 'italic',
          color: '#444444',
          boxSizing: 'border-box'
        }}>
          Ranked by reads and views in the last 24 hours
        </p>

        {/* Thick Comic Ink Lines Divider */}
        <div style={{
          marginTop: '16px',
          width: '100%',
          height: '4px',
          backgroundColor: '#111111',
          boxSizing: 'border-box'
        }} />
        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#111111',
          marginTop: '2px',
          boxSizing: 'border-box'
        }} />
      </div>

      {/* Grid Layout Canvas */}
      {trendingLoading ? (
        <div
          data-ocid="trending.loading_state"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <TrendingCardSkeleton key={i} />
          ))}
        </div>
      ) : trendingComics.length === 0 ? (
        <div
          data-ocid="trending.empty_state"
          style={{
            textAlign: 'center',
            padding: '64px 16px',
            backgroundColor: '#ffffff',
            border: '3px solid #111111',
            boxShadow: '4px 4px 0px #111111',
            boxSizing: 'border-box',
            maxWidth: '500px',
            margin: '40px auto'
          }}
        >
          <Flame style={{ width: '44px', height: '44px', margin: '0 auto 16px auto', color: '#cc0000' }} />
          <p style={{
            fontFamily: 'monospace, sans-serif',
            fontSize: '18px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            margin: '0 0 8px 0',
            color: '#111111'
          }}>
            Nothing trending yet
          </p>
          <p style={{
            fontFamily: 'serif',
            fontSize: '14px',
            color: '#444444',
            margin: '0 0 24px 0'
          }}>
            Be the first to start reading and make something popular!
          </p>
          <Link
            to="/"
            data-ocid="trending.browse_link"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#fbbf24',
              color: '#111111',
              fontFamily: 'monospace, sans-serif',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '2px solid #111111',
              boxShadow: '2px 2px 0px #111111',
              boxSizing: 'border-box'
            }}
          >
            Browse All Comics
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {trendingComics.map(({ comic, rank }) => (
            <TrendingCard key={comic.id} comic={comic} rank={rank} />
          ))}
        </div>
      )}
    </div>
  );
        }
              
