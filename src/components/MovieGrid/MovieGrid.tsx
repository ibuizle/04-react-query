import type { FC, MouseEvent } from 'react';
import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
// ✅ більш надійний placeholder, ніж via.placeholder.com
const FALLBACK_POSTER = 'https://placehold.co/500x750?text=No+Poster';

const MovieGrid: FC<MovieGridProps> = ({ movies, onSelect }) => {
  if (movies.length === 0) return null;

  const handleClick = (movie: Movie) => (_e: MouseEvent) => {
    onSelect(movie);
  };

  const handleImgError = (e: MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_POSTER) {
      img.src = FALLBACK_POSTER;
    }
  };

  return (
    <ul className={css.grid}>
      {movies.map(movie => {
        const src =
          movie.poster_path && movie.poster_path.trim() !== ''
            ? `${IMAGE_BASE}${movie.poster_path}`
            : FALLBACK_POSTER;

        return (
          <li key={movie.id}>
            <div className={css.card}>
              <img
                className={css.image}
                src={src}
                alt={movie.title}
                loading="lazy"
                onClick={handleClick(movie)}
                onError={handleImgError}
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MovieGrid;
