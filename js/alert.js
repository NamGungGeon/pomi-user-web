const params = new URLSearchParams(window.location.search);
if (!params.has('idx')) {
  alert('비정상적인 접근입니다');
  window.location = './';
}

const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
const options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3 //지도의 레벨(확대, 축소 정도)
};

const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

const loadAlert = () => {
  axios
    .request({
      method: 'GET',
      url: 'http://api.pomi.co.kr/location/alerts/',
      params: {
        idx: params.get('idx')
      }
    })
    .then(response => {
      const {
        title,
        lv,
        content,
        lat,
        lng,
        createDate,
        img,
        goodCnt
      } = response.data;

      // 마커 이미지의 이미지 주소입니다
      const imageSrc = './res/icons/marker.png';

      // 마커 이미지의 이미지 크기 입니다
      const imageSize = new kakao.maps.Size(50, 50);

      // 마커 이미지를 생성합니다
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      map.setCenter(new kakao.maps.LatLng(lat, lng));
      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: new kakao.maps.LatLng(lat, lng), // 마커를 표시할 위치
        // title: log[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage // 마커 이미지
      });
      console.log(marker);
      marker.setMap(map);

      const updateChild = (id, child) => {
        document.getElementById(id).append(child);
      };
      updateChild('createDate', createDate);
      updateChild('content', content);
      updateChild('title', title);
      updateChild('goodCnt', goodCnt);
      updateChild('lv', lv);
      // updateChild('createDate', createDate);
      // updateChild('createDate', createDate);
    })
    .catch(e => {
      console.log(e);
    });
};
const loadAlertComment = () => {
  axios
    .request({
      method: 'GET',
      url: 'http://api.pomi.co.kr/location/alerts/comments/',
      params: {
        alertId: params.get('idx')
      }
    })
    .then(response => {
      const comments = response.data;
      const p_commentID = document.getElementById('comments');
      p_commentID.innerHTML = '';

      comments.map(comment => {
        //댓글 wrapper 생성
        //<p></p>
        const commentWrapper = document.createElement('p');
        //댓글 헤더 삽입
        const commentHeader = document.createElement('div');
        commentHeader.classList.add('header');

        const profileImage = document.createElement('img');
        profileImage.setAttribute('src', './res/android.png');
        commentHeader.append(profileImage);
        const nickname = document.createElement('h5');
        nickname.append('익명');
        nickname.setAttribute('id', 'nickname');
        commentHeader.append(nickname);
        const option = document.createElement('img');
        option.setAttribute('src', './res/icons/more.png');
        commentHeader.append(option);
        commentWrapper.append(commentHeader);

        //댓글 내용 삽입
        //<p> <p>comment.comment</p> </p>
        const commentBody = document.createElement('p');
        commentBody.append(comment.comment);
        commentBody.classList.add('body');
        commentWrapper.append(commentBody);
        //댓글 날짜 삽입
        //<p> <p>comment.comment</p> <p>comment.createDate</p> </p>
        const commentDate = document.createElement('p');
        commentDate.append(comment.createDate);
        commentDate.classList.add('description');
        commentWrapper.append(commentDate);

        //wrapper내용 추가
        // <div id="comment">
        //  <p> <p>comment.comment</p> <p>comment.createDate</p> </p>
        // </div>
        p_commentID.append(commentWrapper);
      });
    })
    .catch(e => {
      console.log(e);
    });
};

const makeComment = () => {
  const inputValue = document.getElementById('al_comment').value;

  if (!inputValue) {
    onToast('댓글을 입력하세요');
    return;
  }

  const uid = sessionStorage.getItem('uid');
  const token = sessionStorage.getItem('token');
  if (!uid || !token) {
    alert('로그인이 필요한 기능입니다');
    return;
  }

  const formdata = new FormData();
  formdata.append('comment', inputValue);
  formdata.append('alertId', params.get('idx'));
  axios
    .request({
      method: 'POST',
      url: 'http://api.pomi.co.kr/location/alerts/comments/',
      headers: {
        Uid: uid,
        Authorization: token
      },
      data: formdata
    })
    .then(response => {
      //댓글 입력 완료
      //reload alert
      onToast('댓글 작성 완료');
      window.scrollTo(0, 0);
      loadAlertComment();
      document.getElementById('al_comment').value = '';
    })
    .catch(e => {
      console.log(e);
    });
};

(() => {
  document.getElementById('al_comment').addEventListener('keydown', e => {
    if (e.key === 'Enter') makeComment();
  });

  window.scrollTo(0, 0);
  loadAlert();
  loadAlertComment();
})();
