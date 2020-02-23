const token = sessionStorage.getItem('token');
const id = sessionStorage.getItem('uid');
document.getElementById('defaultOpen').click();
// const userInfo = document.getElementById('userInfo');

if (!token || !id) {
  alert('로그인이 필요한 서비스입니다');
  window.location = './login.html';
}

const initMap = () => {
  const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
  const options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
  };

  return {
    map: new kakao.maps.Map(container, options),
    moveCamera: function(lat, lng) {
      this.map.setCenter(new kakao.maps.LatLng(lat, lng));
    },
    renderMarker: function(log) {
      // 마커 이미지의 이미지 주소입니다
      const imageSrc = '/res/icons/marker.png';

      // 마커 이미지의 이미지 크기 입니다
      const imageSize = new kakao.maps.Size(50, 50);

      // 마커 이미지를 생성합니다
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        map: this.map, // 마커를 표시할 지도
        position: new kakao.maps.LatLng(log.lat, log.lng), // 마커를 표시할 위치
        // title: log[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage // 마커 이미지
      });
      marker.setMap(this.map);

      // 마우스 휠 줌인 허용안하는 코드
      // this.map.setZoomable(false);

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        const infoWindow = this.renderOpenWindow(log);

        kakao.maps.event.addListener(marker, 'mouseout', () => {
          infoWindow.close();
        });
        return () => {
          infoWindow.open(this.map);
        };
      });

      return marker;
    },
    renderPolyline: function(paths) {
      const polyline = new kakao.maps.Polyline({
        map: this.map,
        path: paths,
        strokeWeight: 3, // 선의 두께 입니다
        strokeColor: 'red', // 선의 색깔입니다
        strokeOpacity: 0.6, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid', // 선의 스타일입니다
        startArrow: true
      });
      return polyline;
    },
    renderOpenWindow: function(log) {
      const infowindow = new kakao.maps.InfoWindow({
        map: this.map,
        content: `<div id='infoWindow'>${log.time}</div>`, // 인포윈도우에 표시할 내용
        position: new kakao.maps.LatLng(log.lat + 0.0003, log.lng)
      });
      return infowindow;
    }
  };
  // return new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
};

const initLogs = map => {
  axios
    .request({
      method: 'GET',
      url: 'http://api.pomi.co.kr/users/log.php',
      headers: {
        Uid: id,
        Authorization: token
      }
    })
    .then(response => {
      const { log: logs } = response.data;
      //Array.map((element, index)=>{})
      const paths = []; // polyline을 위한 배열 선언

      const tbody = document.getElementById('logs'); //tbody
      let tbodyHTML = '';

      // 마커 이미지의 이미지 주소입니다
      const imageSrc =
        'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

      //Array.map((element, index)=>{})
      if (logs.length === 0) {
        tbodyHTML += `
        <tr>
          <td colspan="3">로그 정보가 없습니다</td>
        </tr>
      `;
        tbody.innerHTML = tbodyHTML;
      }

      logs.map((log, idx) => {
        if (idx === 0) map.moveCamera(log.lat, log.lng);
        map.renderMarker(log);
        paths.push(new kakao.maps.LatLng(log.lat, log.lng));
        //insert tr into tbody
        tbodyHTML += `
        <tr onclick="moveloc(${log.lat}, ${log.lng}, '${log.time}')">
          <td>${log.time}</td>
          <td>(${log.lng},${log.lat})</td>
        </tr>
      `;
      });
      tbody.innerHTML = tbodyHTML;
      map.renderPolyline(paths);
    })
    .catch(e => {
      console.log(e);
    });
};

const moveloc = (lat, lng, time) => {
  window.scrollTo(0, 0);
  kakaoMap.moveCamera(lat, lng);
  kakaoMap.renderOpenWindow({ lat, lng, time });
};

// 회원정보
axios
  .request({
    method: 'GET',
    url: 'http://api.pomi.co.kr/users/',
    headers: {
      Uid: id,
      Authorization: token
    }
  })
  .then(response => {
    const {
      uid,
      cash,
      birthday,
      myphone,
      ph1,
      ph2,
      ph3,
      email
    } = response.data;

    document.getElementById('id').value = uid;
    document.getElementById('cash').value = cash;
    document.getElementById('birthday').value = birthday;
    document.getElementById('myphone').value = '0' + myphone;
    document.getElementById('ph1').value = '0' + ph1;
    if (ph2) {
      document.getElementById('ph2').value = '0' + ph2;
    }
    if (ph3) {
      document.getElementById('ph3').value = '0' + ph3;
    }
    document.getElementById('email').value = email;
    // `내 전화번호는 0${myphone}이고 보호자 번호는 0${ph1}입니다`
  })
  .catch(e => {
    console.log(e);
  });

const droplog = () => {
  axios
    .request({
      method: 'DELETE',
      url: 'http://api.pomi.co.kr/users/log.php',
      headers: {
        Uid: id,
        Authorization: token
      },
      data: { idx: 'idx' }
    })
    .then(response => {})
    .catch(e => {
      console.log(e.response);
    });
};

const drop = () => {
  axios
    .request({
      method: 'DELETE',
      url: 'http://api.pomi.co.kr/users/',
      headers: {
        Uid: id,
        Authorization: token
      }
    })
    .then(response => {
      sessionStorage.clear();
      window.location = './index.html';
    })
    .catch(e => {
      console.log(e);
      console.log(e.response);
    });
};

const editInfo = () => {
  const email = document.getElementById('email').value;
  const myphone = document.getElementById('myphone').value;
  const ph1 = document.getElementById('ph1').value;
  const ph2 = document.getElementById('ph2').value;
  const ph3 = document.getElementById('ph3').value;

  function validateEmail() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  if (email && !validateEmail(email)) {
    onToast('이메일 형식이 틀립니다');
    return;
  }

  if (!ph1) {
    onToast('지정보호자는 필수입니다');
    return;
  }

  if (!myphone) {
    onToast('핸드폰 번호는 필수입니다');
    return;
  }

  if (myphone.length !== 11 || ph1.length < 11) {
    onToast('전화번호는 11자로 입력해주세요');
    return;
  }

  if (ph2 && ph2.length !== 11) {
    onToast('지정보호자2의 전화번호는 11자여야 합니다');
    return;
  }

  if (ph3 && ph3.length !== 11) {
    onToast('지정보호자3의 전화번호는 11자여야 합니다');
    return;
  }

  axios
    .request({
      method: 'PUT',
      url: 'http://api.pomi.co.kr/users/email.php',
      headers: {
        Uid: id,
        Authorization: token
      },
      data: { email }
    })
    .then(response => {})
    .catch(e => {
      console.log(e);
    });

  axios
    .request({
      method: 'PUT',
      url: 'http://api.pomi.co.kr/users/phone.php',
      headers: {
        Uid: id,
        Authorization: token
      },
      data: { phone: myphone }
    })
    .then(response => {})
    .catch(e => {
      console.log(e);
    });

  axios
    .request({
      method: 'PUT',
      url: 'http://api.pomi.co.kr/users/helpers.php',
      headers: {
        Uid: id,
        Authorization: token
      },
      data: { ph1: ph1, ph2: ph2, ph3: ph3 }
    })
    .then(response => {
      onToast('수정이 완료되었습니다');
      setTimeout(() => {
        window.location = './mypage.html';
      }, 1000);
    })
    .catch(e => {
      console.log(e);
    });
};

const updatePw = () => {
  const newPw = document.getElementById('newPw').value;
  const newPwchk = document.getElementById('newPwchk').value;

  if (newPw !== newPwchk) {
    onToast('비밀번호가 동일하지 않습니다');
    return;
  }

  axios
    .request({
      method: 'PUT',
      url: 'http://api.pomi.co.kr/auth/',
      headers: {
        Uid: id,
        Authorization: token
      },
      data: { newPw: newPwchk }
    })
    .then(response => {
      alert('비밀번호가 변경되었습니다\n다시 로그인 해 주세요');
      window.location = './login.html';
    })
    .catch(e => {
      console.log(e.response);
      console.log(e.response.data);
    });
};

let kakaoMap;
function showMenu(evt, menuName) {
  const tabcontent = document.getElementsByClassName('tabcontent');
  const tablinks = document.getElementsByClassName('tablinks');

  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  for (let j = 0; j < tablinks.length; j++) {
    tablinks[j].className = tablinks[j].className.replace(' active', '');
  }

  document.getElementById(menuName).style.display = 'block';
  evt.currentTarget.className += ' active';

  if (menuName == 'userLoc') {
    kakaoMap = initMap();
    initLogs(kakaoMap);
  }
}

axios
  .request({
    method: 'GET',
    url: 'http://api.pomi.co.kr/users/',
    headers: {
      Uid: id,
      Authorization: token
    }
  })
  .then(response => {
    const { myphone } = response.data;
    const { email } = response.data;

    const sidenav_email = document.getElementById('sidenav_email');
    const sidenav_myphone = document.getElementById('sidenav_myphone');

    sidenav_email.append(email);
    sidenav_myphone.append('0' + myphone);
  })
  .catch(e => {
    console.log(e);
  });

// Get the modal
const containermodal = document.getElementById('container-modal');
const modalheader = document.getElementById('header');
const modalbody = document.getElementById('body');
const modalactions = document.getElementById('actions');
const modalactionsNo = document.getElementById('no');
const modalactionsYes = document.getElementById('yes');

// When the user clicks the button, open the modal
const deleteuserModal = function(msg) {
  containermodal.style.display = 'flex';
  modalbody.innerHTML = msg;
  modalactionsYes.innerHTML = '네';
  modalactionsNo.innerHTML = '아니오';
  modalactionsYes.addEventListener('click', () => {
    drop();
    containermodal.style.display = 'none';
  });
  modalactionsNo.addEventListener('click', () => {
    containermodal.style.display = 'none';
  });
};

const modifyuserinfoModal = function(msg) {
  containermodal.style.display = 'flex';
  modalbody.innerHTML = msg;
  modalactionsYes.innerHTML = '네';
  modalactionsNo.innerHTML = '아니오';
  modalactionsYes.addEventListener('click', () => {
    editInfo();
    containermodal.style.display = 'none';
  });
  modalactionsNo.addEventListener('click', () => {
    containermodal.style.display = 'none';
  });
};

const updateuserPwModal = function(msg) {
  containermodal.style.display = 'flex';
  modalbody.innerHTML = msg;
  modalactionsYes.innerHTML = '네';
  modalactionsNo.innerHTML = '아니오';
  modalactionsYes.addEventListener('click', () => {
    updatePw();
    containermodal.style.display = 'none';
  });
  modalactionsNo.addEventListener('click', () => {
    containermodal.style.display = 'none';
  });
};

const dropuserlogModal = function(msg) {
  containermodal.style.display = 'flex';
  modalbody.innerHTML = msg;
  modalactionsYes.innerHTML = '네';
  modalactionsNo.innerHTML = '아니오';
  modalactionsYes.addEventListener('click', () => {
    droplog();
    containermodal.style.display = 'none';
    initLogs(kakaoMap);
  });
  modalactionsNo.addEventListener('click', () => {
    containermodal.style.display = 'none';
  });
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == containermodal) {
    containermodal.style.display = 'none';
  }
};
