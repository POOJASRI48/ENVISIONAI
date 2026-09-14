import React, { useEffect, useState } from 'react';
import { Card, Loader } from '../components';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/v1/post`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Unable to load community posts.');
        }

        const result = await response.json();
        setAllPosts(Array.isArray(result.data) ? [...result.data].reverse() : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const normalizedSearch = searchText.trim().toLowerCase();

  const filteredPosts = normalizedSearch
    ? allPosts.filter(
        (item) =>
          item?.name?.toLowerCase().includes(normalizedSearch) ||
          item?.prompt?.toLowerCase().includes(normalizedSearch)
      )
    : allPosts;

  return (
    <section className="im-page im-home">
      <div className="im-home-top">
        <div className="im-home-copy">
          <div className="im-kicker">Community gallery</div>
          <h1 className="im-display">
            Ideas made
            <br />
            visible.
          </h1>
          <p className="im-body">
            Explore images created by the ENVISIONAI community. Find a prompt
            that sparks something — then make it your own.
          </p>
        </div>

        <div className="im-home-search">
          <div className="im-search-wrap">
            <span className="im-search-icon" aria-hidden="true">⌕</span>
            <input
              className="im-search"
              type="text"
              placeholder="Search creations or prompts..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Search community posts"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="im-empty">
          <Loader />
        </div>
      ) : filteredPosts.length > 0 ? (
        <>
          {normalizedSearch && (
            <p className="im-results">
              Showing <strong>{filteredPosts.length}</strong> result
              {filteredPosts.length !== 1 ? 's' : ''} for{' '}
              <strong>“{searchText}”</strong>
            </p>
          )}

          <div className="im-gallery">
            {filteredPosts.map((post) => (
              <div className="im-gallery-card" key={post._id}>
                <Card {...post} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="im-empty">
          {normalizedSearch
            ? `No creations found for “${searchText}”.`
            : 'No creations yet. Be the first to make one.'}
        </div>
      )}
    </section>
  );
};

export default Home;
