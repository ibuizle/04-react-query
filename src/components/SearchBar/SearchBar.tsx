import { useRef } from 'react';
import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

export interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  // Form Actions (React): handler receives FormData
  const handleAction = (formData: FormData) => {
    const raw = formData.get('query');
    const query = typeof raw === 'string' ? raw.trim() : '';

    if (!query) {
      toast.error('Please enter your search query.');
      return;
    }

    onSubmit(query);
    formRef.current?.reset();
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form ref={formRef} className={css.form} action={handleAction}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;
