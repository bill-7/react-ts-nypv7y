import * as React from "react"
import { useState, useEffect } from "react"
import "./App.css"

export default function App() {
  const [article, setArticle] = useState(null)

  const fetchRandomArticle = async () => {
    const response = await fetch(
      "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*"
    )
    const data = await response.json()
    const pageId = data.query.random[0].id

    const articleResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info|links&inprop=url&pageids=${pageId}&pllimit=500&origin=*`
    )
    const articleData = await articleResponse.json()
    const fetchedArticle = articleData.query.pages[pageId]

    if (fetchedArticle.links && fetchedArticle.links.length >= 10) {
      setArticle(fetchedArticle)
    } else {
      fetchRandomArticle()
    }
  }

  useEffect(() => {
    fetchRandomArticle()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Wikipedia Article</h1>
        <button onClick={fetchRandomArticle}>Fetch New Article</button>
      </header>
      {article && (
        <div className="Article">
          {/* <h2>{article.title}</h2>
          <h3>Links: {article.links.length}</h3>
          <a href={article.fullurl} target="_blank" rel="noreferrer">
            Read on Wikipedia
          </a> */}
        </div>
      )}
    </div>
  )
}
