import { Link } from "wouter";

function getAverageRating(movie) {
  const ratings = movie.ratings || [];
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((acc, r) => acc + r.score, 0);
  return sum / ratings.length;
}

export default function MovieCard({ movie }) {
  const avg = getAverageRating(movie);
  const genreNames = (movie.genres || []).map((g) => g.genreName).join(", ");

  return (
    <Link
      href={`/elementos/${movie.id}`}
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "2 / 3",
          background: "var(--surface-2)",
        }}
      >
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`Póster de ${movie.title}`}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              padding: 12,
              textAlign: "center",
            }}
          >
            {movie.title}
          </div>
        )}
        {avg !== null && (
          <span
            className="badge"
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "rgba(13,14,19,0.85)",
            }}
          >
            ★ {avg.toFixed(1)}/5
          </span>
        )}
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--gold)",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {genreNames || "Sin género"} · {movie.year}
        </div>
        <h3 style={{ fontSize: "1.15rem", margin: 0, lineHeight: 1.1 }}>
          {movie.title}
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            margin: "6px 0 0",
          }}
        >
          #{movie.id} · Dir. {movie.director}
        </p>
      </div>
    </Link>
  );
}
