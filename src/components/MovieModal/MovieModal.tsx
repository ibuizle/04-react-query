import { useEffect } from 'react';
import type { FC, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

export interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
// ✅ більш надійний placeholder, ніж via.placeholder.com
const FALLBACK_BACKDROP = 'https://placehold.co/1200x675?text=No+Image';

const MovieModal: FC<MovieModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleImgError = (event: MouseEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.src !== FALLBACK_BACKDROP) {
      img.src = FALLBACK_BACKDROP;
    }
  };

  const imgSrc =
    movie.backdrop_path && movie.backdrop_path.trim() !== ''
      ? `${IMAGE_BASE}${movie.backdrop_path}`
      : FALLBACK_BACKDROP;

  const portalRoot = document.getElementById('modal-root');

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          type="button"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          src={imgSrc}
          alt={movie.title}
          className={css.image}
          onError={handleImgError}
        />

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>

          <p>
            <strong>Release Date:</strong> {movie.release_date || '—'}
          </p>

          <p>
            <strong>Rating:</strong>{' '}
            {Number.isFinite(movie.vote_average)
              ? movie.vote_average.toFixed(1)
              : 'N/A'}
            /10
          </p>
        </div>
      </div>
    </div>,
    portalRoot ?? document.body
  );
};

export default MovieModal;
