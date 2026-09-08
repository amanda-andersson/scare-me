import './style.css'

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
}

async function getMovies(): Promise<Movie[]> {
  const response = await fetch('/api/movies')

  if (!response.ok) {
    throw new Error(`Movie request failed: ${response.status}`)
  }

  return response.json()
}

async function start() {
  const movies = await getMovies()
  let lastMovieId: number | null = null

  const appElement = document.querySelector<HTMLDivElement>('#app')

  if (!appElement) return

  const app = appElement

  function getRandomMovies(amount: number) {
    return [...movies]
      .sort(() => Math.random() - 0.5)
      .slice(0, amount)
  }

  function showRandomMovie() {
    let movie: Movie

    do {
      const randomIndex = Math.floor(Math.random() * movies.length)
      movie = movies[randomIndex]
    } while (movie.id === lastMovieId)

    lastMovieId = movie.id

    app.innerHTML = `
      <main class="start-screen">
        <section class="hero">

          <h1 class="tagline tagline-result">
            Do you like scary movies?
          </h1>

          <div class="movie-result">
            <img
              class="movie-poster"
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              alt="${movie.title}"
            />

            <div class="movie-info">
              <p class="movie-label">TONIGHT'S PICK</p>

              <h2>${movie.title}</h2>

              <p class="movie-meta">
                ${movie.release_date?.slice(0, 4) ?? ''} · ★ ${movie.vote_average.toFixed(1)}
              </p>

              <p class="movie-overview">
                ${movie.overview}
              </p>

              <button class="scare-button" id="again-button">
                SCARE ME AGAIN
              </button>
            </div>
          </div>

        </section>

        <p class="tmdb-credit">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>

      </main>
    `

    const againButton =
      document.querySelector<HTMLButtonElement>('#again-button')

    againButton?.addEventListener('click', showRandomMovie)
  }

  const deckMovies = getRandomMovies(4)

  app.innerHTML = `
    <main class="start-screen">
      <section class="hero">

        <h1 class="tagline">
          Do you like scary movies?
        </h1>

        <p class="intro">
          Let us pick your next horror movie
        </p>

        <div class="deck">

          ${deckMovies
            .map(
              (movie) => `
                <div
                  class="card poster-card"
                  style="
                    background-image:
                      linear-gradient(
                        rgba(0, 0, 0, 0.5),
                        rgba(0, 0, 0, 0.65)
                      ),
                      url('https://image.tmdb.org/t/p/w500${movie.poster_path}');
                  "
                ></div>
              `
            )
            .join('')}

          <div class="card card-front">
            <span>YOUR NEXT SCARE</span>
          </div>

        </div>

        <button class="scare-button" id="scare-button">
          SCARE ME
        </button>

      </section>

      <p class="tmdb-credit">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>

    </main>
  `

  const scareButton =
    document.querySelector<HTMLButtonElement>('#scare-button')

  scareButton?.addEventListener('click', () => {
    const deck = document.querySelector<HTMLDivElement>('.deck')

    if (!deck) return

    scareButton.disabled = true
    deck.classList.add('is-shuffling')

    setTimeout(() => {
      showRandomMovie()
    }, 1100)
  })
}

start().catch((error) => {
  console.error(error)

  const app = document.querySelector<HTMLDivElement>('#app')

  if (app) {
    app.innerHTML = `
      <main class="start-screen">
        <section class="hero">

          <h1 class="tagline">
            Do you like scary movies?
          </h1>

          <p class="intro">
            SOMETHING WENT WRONG. TRY AGAIN LATER.
          </p>

        </section>

        <p class="tmdb-credit">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>

      </main>
    `
  }
})