import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
//AnimatePresence는 컴포넌트가 render 되거나 destroy 될 때 효과를 줄 수 있다.
import { type } from 'os';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { getMovies, IGetMovieResult } from '../api';
import { makeImagePath } from '../util';

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -10em;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
  margin-bottom: 10px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  font-size: 16px;
  cursor: pointer;
  //position: relative;
  &:first-child {
    transform-origin: center left;
    //맨 끝 포스터들이 잘리지 않게 커지도록 한다.
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
    color: ${(props) => props.theme.white.darker};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 50vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 35vh;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  text-align: center;
  font-size: 24px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -60px;
`;

const rowVariants = {
  //슬라이더 기능 구현
  hidden: {
    x: window.outerWidth,
    //사용자의 window 크기
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVariants = {
  //slider box의 hover상태 animation
  normal: {
    scale: 1,
    transition: { type: 'tween' },
  },
  hover: {
    //zIndex: 99,
    scale: 1.5,
    y: -50,
    transition: {
      delay: 0.3,
      type: 'tween',
      //bounce되는 애니매이션 제거
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      type: 'tween',
    },
  },
  nomal: {},
};

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
  console.log(bigMovieMatch); // {"path": "/movies/:movieId", "url": "/movies/580489", "isExact": true, "params": { "movieId": "580489" }}
  const { scrollY, scrollYProgress } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetMovieResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  //index를 증가시키기 전에 체크한다, leaing이 true면 reuturn한다 false면 원래대로 작동한다.
  //간격이 생기는 것을 방지하기 위함이다

  const increaseIndex = () => {
    //index를 증가시키는 함수
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      // movie의 길이를정해두었다.
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      // 나중에는 영화가 늘어나 정수가 될 수 도 있으니 floor로 올림처리해준다
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      //index를 증가시킬 때 확인하는 절차를 거치는 것이다. 만약 maxLen 이면 0으로 되돌리고
      // 그렇지 않다면 증가시킨다.
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  //leaving을 반전시키는 역할을 한다.
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onOverlayClick = () => history.push('/');
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + '' === bigMovieMatch.params.movieId
    );
  console.log(clickedMovie);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            //값을 변경하도록 한다
            bgPhoto={makeImagePath(data?.results[2].backdrop_path || '')}
          >
            <Title>{data?.results[2].title}</Title>
            <Overview>{data?.results[2].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              {/* onExitComplete에 함수를 넣으면 exit가 끝났을 때 실행된다 
              initial = {false} 는 처음에 슬라이드가 들어오는 것을 fix해준다*/}
              <Row
                key={index}
                //슬라이더 기능 구현 key 값의 증감에 따라 slider 변경
                //key만 바뀌면 exit가 실행되고 initial이 실행되고 animate까지 실행한다
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', duration: 0.6 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  //영화가 담긴 배열을 자르는 역할
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ''}
                      key={movie.id}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: 'tween' }}
                      //bounce 효과 제거
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId + ''}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent ), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
