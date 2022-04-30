import { useLocation } from 'react-router-dom';

function Search() {
  const location = useLocation();
  //현재 위치에 대한 정보를 얻을 수 있다.
  const keyword = new URLSearchParams(location.search).get('keyword');
  //파싱하기 어렵다. 따라서 직접 파싱하는것이아니라 urlSearchParameter을 써준다
  console.log(keyword);
  //keyword정보를 얻었다. 이를 이용해서 API로부터 정보를 얻어올 수 있겠지 !
  // 요청을 보내올 수 있다. fetch만 하면되겠네
  return null;
}

export default Search;
