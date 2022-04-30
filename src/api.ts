const API_KEY = 'd69508f7c4bbf58ad73a7dbdc7a106a8';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_result: number;
}

export const getMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((res) => res.json());
};
