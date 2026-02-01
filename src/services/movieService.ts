import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const token = import.meta.env.VITE_TMDB_TOKEN as string;

if (!token) {
  throw new Error('VITE_TMDB_TOKEN is missing. Add it to .env / Vercel env.');
}

export async function fetchMovies(
  query: string,
  page: number,
): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>(BASE_URL, {
    params: {
      query,
      page,
      include_adult: false,
      language: 'en-US',
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
