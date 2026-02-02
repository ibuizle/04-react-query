import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from '../../services/movieService';
import type { MoviesResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';

import css from './App.module.css';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [previousData, setPreviousData] = useState<MoviesResponse | undefined>(undefined);

  const { data, isLoading, isError }: UseQueryResult<MoviesResponse, Error> = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== '',
    placeholderData: previousData, // використовуємо попередні дані для безшовної пагінації
  });

  // зберігаємо попередні дані при завантаженні нових
  useEffect(() => {
    if (data) setPreviousData(data);
  }, [data]);

  const movies: Movie[] = data?.results ?? [];
  const totalPages: number = data?.total_pages ?? 0;

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      toast.error('Please enter a search query.');
      return;
    }

    if (trimmed !== query) {
      setQuery(trimmed);
      setPage(1);
      setSelectedMovie(null);
      setPreviousData(undefined); // очищаємо попередні дані при новому пошуку
    }
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  useEffect(() => {
    if (!isLoading && !isError && movies.length === 0 && query) {
      toast.error('No movies found for your request.');
    }
  }, [isLoading, isError, movies.length, query]);

  return (
    <div className={css.appContainer}>
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
          renderOnZeroPageCount={null}
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
