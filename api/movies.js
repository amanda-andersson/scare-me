export default async function handler(request, response) {
  try {
    const token = process.env.TMDB_TOKEN;

    if (!token) {
      return response.status(500).json({
        error: "TMDB token is missing",
      });
    }

    const pages = [1, 2, 3, 4, 5];

    const requests = pages.map(async (page) => {
      const tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=27&sort_by=vote_average.desc&vote_count.gte=1000&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        },
      );

      if (!tmdbResponse.ok) {
        throw new Error(`TMDB request failed: ${tmdbResponse.status}`);
      }

      const data = await tmdbResponse.json();
      return data.results;
    });

    const results = await Promise.all(requests);

    const movies = results.flat().filter((movie) => movie.poster_path !== null);

    return response.status(200).json(movies);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      error: "Failed to fetch movies",
    });
  }
}
