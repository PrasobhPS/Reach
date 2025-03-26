import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import "./searchbox.scss";

interface searchBarProps {
  onSearch?: (text: string) => void;
}

const SearchBar = ({ onSearch }: searchBarProps) => {
  const [query, setQuery] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log('Search query:', query);
  };

  return (
    <form>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search Members"
      />
      <button type="submit" className='btn btn-search'>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
};
export default SearchBar;
