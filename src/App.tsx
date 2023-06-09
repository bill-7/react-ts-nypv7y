import * as React from "react";
import { useState, useEffect } from "react";
import "./App.css";

interface Article {
  title: string;
  linkshere: LinksHere[];
  fullurl: string;
  extract: string;
}

interface LinksHere {
  ns: number;
}

export default function App() {
  const [article, setArticle] = useState<Article>();
  const [minLinks, setMinLinks] = useState(10);
  const [maxLinks, setMaxLinks] = useState(50);

  const fetchRandomArticle = async () => {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*`
    );
    const data = await response.json();
    const pageId = data.query.random[0].id;

    const articleResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info|linkshere|extracts&inprop=url&exintro&explaintext&pageids=${pageId}&lhlimit=${maxLinks}&origin=*`
    );
    const articleData = await articleResponse.json();
    const fetchedArticle = articleData.query.pages[pageId] as Article;

    const validLinksHere = fetchedArticle.linkshere.filter((lh) => lh.ns === 0);

    if (
      validLinksHere &&
      validLinksHere.length >= minLinks &&
      validLinksHere.length <= maxLinks
    ) {
      fetchedArticle.linkshere = validLinksHere;
      console.log(fetchedArticle);
      setArticle(fetchedArticle);
    } else {
      fetchRandomArticle();
    }
  };

  useEffect(() => {
    fetchRandomArticle();
  }, []);

  const handleMinLinksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinLinks(Number(event.target.value));
  };

  const handleMaxLinksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxLinks(Number(event.target.value));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Wikipedia Article</h1>
        <div>
          <label htmlFor="minLinks">Min links here</label>
          <input
            type="number"
            id="minLinks"
            name="minLinks"
            min="1"
            max="500"
            value={minLinks}
            onChange={handleMinLinksChange}
          />
        </div>
        <div>
          <label htmlFor="maxLinks">Max links here</label>
          <input
            type="number"
            id="maxLinks"
            name="maxLinks"
            min="1"
            max="500"
            value={maxLinks}
            onChange={handleMaxLinksChange}
          />
        </div>
        <button onClick={fetchRandomArticle}>Fetch New Article</button>
      </header>
      {article && (
        <div className="Article">
          <h2>{article.title}</h2>
          <h3>Links here: {article.linkshere.length}</h3>
          <p>{article.extract}</p>
          <a href={article.fullurl} target="_blank" rel="noreferrer">
            Read on Wikipedia
          </a>
        </div>
      )}
    </div>
  );
}
