const token = sessionStorage.getItem('token');
const id = sessionStorage.getItem('uid');

axios
  .request({
    method: 'GET',
    url: 'http://api.pomi.co.kr/location/infra/safehome.php',
    headers: {
      Uid: id,
      Authorization: token
    }
  })
  .then(response => {
    const { data } = response.data;
    console.log(response);
    console.log(response.data);
    console.log(data);

    // document.getElementById('id').value = uid;
    // document.getElementById('cash').value = cash;
    // document.getElementById('birthday').value = birthday;
    // document.getElementById('myphone').value = '0' + myphone;
    // document.getElementById('ph1').value = '0' + ph1;
    // if (ph2) {
    //   document.getElementById('ph2').value = '0' + ph2;
    // }
    // if (ph3) {
    //   document.getElementById('ph3').value = '0' + ph3;
    // }
    // document.getElementById('email').value = email;
    // // `내 전화번호는 0${myphone}이고 보호자 번호는 0${ph1}입니다`
  })
  .catch(e => {
    console.log(e);
  });
