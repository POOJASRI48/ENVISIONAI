import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomPrompt } from '../utils';
import { Loader } from '../components';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const presets = [
  { label: 'Realistic', suffix: 'photorealistic, natural lighting, highly detailed' },
  { label: 'Cinematic', suffix: 'cinematic composition, dramatic lighting, film still' },
  { label: '3D', suffix: 'high quality 3D render, polished materials, studio lighting' },
  { label: 'Anime', suffix: 'detailed anime illustration, expressive, clean linework' },
  { label: 'Fantasy', suffix: 'fantasy concept art, atmospheric, richly detailed' },
];

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('');

  useEffect(() => {
    const count = localStorage.getItem('imageCount');
    if (count) setImageCount(parseInt(count, 10));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSurpriseMe = () => {
    setForm((prev) => ({
      ...prev,
      prompt: getRandomPrompt(prev.prompt),
      photo: '',
    }));
    setSelectedPreset('');
  };

  const handlePreset = (preset) => {
    setSelectedPreset(preset.label);

    const current = form.prompt
      .replace(
        /,\s*(photorealistic.*|cinematic composition.*|high quality 3D render.*|detailed anime illustration.*|fantasy concept art.*)$/i,
        ''
      )
      .trim();

    setForm((prev) => ({
      ...prev,
      prompt: current ? `${current}, ${preset.suffix}` : preset.suffix,
      photo: '',
    }));
  };

  const generateImage = async () => {
    if (!form.prompt.trim()) {
      alert('Please provide a prompt.');
      return;
    }

    if (imageCount >= 1000000) {
      alert('You have reached the image limit.');
      return;
    }

    try {
      setGeneratingImg(true);

      const response = await fetch(`${API_URL}/api/v1/imgGenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Image generation failed.');
      }

      setForm((prev) => ({
        ...prev,
        photo: `data:${data.mimeType};base64,${data.photo}`,
      }));

      const nextCount = imageCount + 1;
      setImageCount(nextCount);
      localStorage.setItem('imageCount', nextCount);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Something went wrong while generating.');
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (!form.prompt.trim() || !form.photo) {
      alert('Enter a prompt and generate an image first.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Unable to share the creation.');
      }

      await response.json();
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Something went wrong while sharing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="im-page im-create">
      <div className="im-create-head">
        <div className="im-kicker">Create something new</div>
        <h1 className="im-display">
         Turn your ideas<br /> into visuals.
        </h1>
   <p className="im-body">
          {/* Describe what you imagine.Let ENVISIONAI turn the words into an image. */}
          DESCRIBE WHAT YOU IMAGINE.LET ENVISIONAI TURN THE WORDS INTO AN IMAGE.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="im-create-layout">
        <div className="im-form-panel">
          <div className="im-field">
            <div className="im-label-row">
              <label className="im-label" htmlFor="name">Your name</label>
            </div>
            <input
              className="im-input"
              id="name"
              name="name"
              type="text"
              placeholder="Ex. Pooja Sri"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="im-field">
            <div className="im-label-row">
              <label className="im-label" htmlFor="prompt">Describe your image</label>
              <div>
                <span className="im-char-count">{form.prompt.length}/500</span>
                {' '}
                <button type="button" className="im-surprise" onClick={handleSurpriseMe}>
                  Surprise me
                </button>
              </div>
            </div>

            <textarea
              className="im-textarea"
              id="prompt"
              name="prompt"
              maxLength={500}
              placeholder="A tiny bookstore floating above the clouds at sunset..."
              value={form.prompt}
              onChange={handleChange}
              required
            />

            <div className="im-presets">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`im-preset ${selectedPreset === preset.label ? 'active' : ''}`}
                  onClick={() => handlePreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="im-generate"
            onClick={generateImage}
            disabled={generatingImg}
          >
            {generatingImg ? 'Creating…' : 'Generate image  →'}
          </button>

          <div className="im-share-block">
            <p className="im-share-title">Like what you made?</p>
            <p className="im-share-copy">
              Add your creation to the community gallery so others can discover
              the idea behind it.
            </p>
            <button
              type="submit"
              className="im-share"
              disabled={loading || !form.photo}
            >
              {loading ? 'Sharing…' : 'Share with the community  ↗'}
            </button>
          </div>
        </div>

        <div className="im-preview-wrap">
          <div className="im-preview-label">
            <span>Preview</span>
            {form.photo && <span>Ready</span>}
          </div>

          <div className="im-preview">
            {form.photo ? (
              <img src={form.photo} alt={form.prompt} />
            ) : (
              <div className="im-preview-empty">
                <div className="preview-icon">✦</div>
                <strong>Your image will appear here</strong>
                <p>Write a prompt and click Generate image.</p>
              </div>
            )}

            {generatingImg && (
              <div className="im-preview-loader">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
