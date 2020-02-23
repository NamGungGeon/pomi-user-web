const params = new URLSearchParams(window.location.search);

if (!params.has('accessKey')) {
  alert('비정상적인 접근입니다');
  window.location = './';
}

//params.get('accessKey')
//localhost/helper.html?***acessKey=fsdgsdfgsfdg****

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
      url: 'http://api.pomi.co.kr/helper/',
      params: {
        accessKey: params.get('accessKey')
      }
    })
    .then(response => {
      const { log: logs } = response.data;
      //Array.map((element, index)=>{})
      const paths = []; // polyline을 위한 배열 선언
      const tbody = document.getElementById('logs'); //tbody
      let tbodyHTML = '';

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
          <td>${log.lng}</td>
          <td>${log.lat}</td>
        </tr>
      `;
      });
      tbody.innerHTML = tbodyHTML;
      map.renderPolyline(paths);
    })
    .catch(e => {
      console.log(e);
      console.log(e.response.data.msg);
      onToast(e.response.data.msg);
    });
};

const kakaoMap = initMap();
initLogs(kakaoMap);

const moveloc = (lat, lng, time) => {
  window.scrollTo(0, 0);
  kakaoMap.moveCamera(lat, lng);
  kakaoMap.renderOpenWindow({ lat, lng, time });
};
