import React, { useEffect, useState, useRef } from 'react';
import './styling/App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const layoutToColumns = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 4,
};

const POSTS_PER_PAGE = 12;
const SUBREDDIT = 'data';

// Add this constant at the top of your file
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function RDataFeed() {
  useEffect(() => {
    document.title = 'Protegrity Feed - Latest Data Posts';
  }, []);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [after, setAfter] = useState(null);
  const [beforeStack, setBeforeStack] = useState([]);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [layoutVariant, setLayoutVariant] = useState('desktop');
  const [chatOpen, setChatOpen] = useState(false);

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    async function fetchLayout(screenWidth) {
      try {
        const res = await fetch(`${API_BASE}/api/layout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screenWidth }),
        });
        if (!res.ok) throw new Error('Failed to fetch layout');
        const data = await res.json();
        if (mountedRef.current && data.layout) {
          setLayoutVariant(data.layout);
        }
      } catch {
        if (mountedRef.current) setLayoutVariant('desktop');
      }
    }

    fetchLayout(window.innerWidth);
    fetchPage();

    const onResize = () => fetchLayout(window.innerWidth);
    window.addEventListener('resize', onResize);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', onResize);
    };
  }, []);

  async function fetchPage(token = null) {
    setLoading(true);
    setError(null);
    try {
      const url = token 
        ? `${API_BASE}/api/reddit-posts?after=${token}` 
        : `${API_BASE}/api/reddit-posts`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
      const data = await res.json();

      const items = (data?.data?.children || []).map(c => {
        const previewImage = c.data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&');
        return {
          id: c.data.id,
          title: c.data.title,
          selftext: c.data.selftext || '',
          author: c.data.author,
          num_comments: c.data.num_comments,
          permalink: `https://reddit.com${c.data.permalink}`,
          thumbnail: previewImage || (c.data.thumbnail && c.data.thumbnail.startsWith('http') ? c.data.thumbnail : null),
        };
      });

      if (mountedRef.current) {
        setPosts(items);
        setAfter(data?.data?.after || null);
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  async function handleNext() {
    if (!after) return;
    setBeforeStack(s => [...s, after]);
    await fetchPage(after);
  }

  async function handlePrev() {
    const stack = [...beforeStack];
    if (stack.length <= 1) {
      setBeforeStack([]);
      await fetchPage(null);
      return;
    }
    stack.pop();
    const prevToken = stack[stack.length - 1] || null;
    setBeforeStack(stack);
    await fetchPage(prevToken);
  }

  async function sendMessage() {
    if (!chatInput.trim()) return;

    setChatMessages(msgs => [...msgs, { sender: 'user', text: chatInput }]);
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await response.json();
      setChatMessages(msgs => [...msgs, { sender: 'bot', text: data.reply || 'Sorry, no response.' }]);
    } catch {
      setChatMessages(msgs => [...msgs, { sender: 'bot', text: 'Error communicating with server.' }]);
    } finally {
      setChatInput('');
      setIsSending(false);
    }
  }
  
  function handleLogoClick(e) {
    e.preventDefault();
    setBeforeStack([]);
  }

  return (
    <main className={`app layout-${layoutVariant}`}>
      {/* NAV */}
      <Navbar onLogoClick={handleLogoClick} />

      {/* POSTS FEED */}
      <section className="feed-section">
        <div className="banner">
        <h2 className="description">
          Showing the latest posts from /r/data. Click a post to open the full Reddit thread in a new tab.
        </h2>
        </div>

        <div
          className="posts-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layoutToColumns[layoutVariant] || 4}, 1fr)`,
            gap: '1rem',
          }}
        >
          {loading && <div className="loading">Loading posts…</div>}
          {error && <div className="error">{error}</div>}

          {posts.map(post => (
            <article key={post.id} className="post-card" tabIndex={0}>
              <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                <h3>{post.title}</h3>
                {post.thumbnail && <img src={post.thumbnail} alt="post thumbnail" />}
                <p>
                  {post.selftext
                    ? post.selftext.length > 150
                      ? post.selftext.slice(0, 150) + '…'
                      : post.selftext
                    : ''}
                </p>
                <div className="meta">
                  <span>By u/{post.author}</span>
                  <span>{post.num_comments} comments</span>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button onClick={handlePrev} disabled={loading || beforeStack.length === 0} aria-label="Previous posts"><b>← Previous</b></button>
          <div>Page {beforeStack.length + 1}</div>
          <button onClick={handleNext} disabled={!after || loading} aria-label="Next posts"><b>Next →</b></button>
        </div>
      </section>

      {/* Floating Chat Icon */}
      <button
        className="chat-toggle-btn"
        onClick={() => setChatOpen(open => !open)}
        aria-label="Toggle chat"
      >
        <img src="/chat.png" alt="Chat Icon" className="chat-icon" />
      </button>
      

      {/* Chatbot panel */}
      {chatOpen && (
        <section className="chatbot-section" aria-label="Chatbot panel">
          <div id="chat-container">
            <div id="chat-messages" className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
              {chatMessages.map((msg, i) => (
                <p key={i} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
                  <strong>{msg.sender === 'user' ? 'You:' : 'Bot:'}</strong> {msg.text}
                </p>
              ))}
            </div>
            <div className="chat-input-area">
              <input
                id="chat-input"
                type="text"
                placeholder="Ask me about posts..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                aria-label="Chat input"
              />
              <button
                id="chat-send"
                onClick={sendMessage}
                disabled={isSending || !chatInput.trim()}
                aria-label="Send chat message"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
