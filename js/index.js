const id = sessionStorage.getItem('uid');
const token = sessionStorage.getItem('token');

if (!id) {
  console.log('공백입니다.');
  console.log(id);
} else {
  // setTimeout(() => {
  //   onToast('로그인 되었습니다!');
  // }, 400);
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

      console.log(email);
      console.log(myphone);
      const sidenav_email = document.getElementById('sidenav_email');
      const sidenav_myphone = document.getElementById('sidenav_myphone');

      sidenav_email.append(email);
      sidenav_myphone.append('0' + myphone);
    })
    .catch(e => {
      console.log(e);
    });
}
