import axios, { type AxiosResponse } from 'axios';
import type { Movie } from '../types/movie';

interface TMDBSearchResponse {
  results: Movie[];
}

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

export async function fetchMovies(query: string): Promise<Movie[]> {
  const token = import.meta.env.VITE_TMDB_TOKEN as string;

  if (!token) {
    throw new Error('VITE_TMDB_TOKEN is missing. Add it to your .env / Vercel env.');
  }

  const config = {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res: AxiosResponse<TMDBSearchResponse> = await axios.get(BASE_URL, config);

  return res.data.results;
}
