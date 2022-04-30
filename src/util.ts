export const makeImagePath = (id: string, format?: string) => {
  //Id 와 format을 받을 것이다.
  return `https://image.tmdb.org/t/p/${format ? format : 'original'}${id}`;
  // 이미지의 경로를 만들어주는 함수이다. format이 제공된다면 사용하고 없으면 original을 쓸 것이다
};
