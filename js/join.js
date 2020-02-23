const join = () => {
  const id = document.getElementById('id').value;
  const pw = document.getElementById('pw').value;
  const pw_chk = document.getElementById('pw_chk').value;
  const email = document.getElementById('email').value;
  const birth = document.getElementById('birth').value;
  const myphone = document.getElementById('phone').value;
  const ph1 = document.getElementById('ph1').value;
  const ph2 = document.getElementById('ph2').value;
  const ph3 = document.getElementById('ph3').value;

  function validateEmail() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  if (email && !validateEmail(email)) {
    onToast('이메일을 다시 확인해주세요');
    return;
  }

  if (!isValidDate(birth)) {
    onToast('생년월일을 다시 확인해주세요');
    return;
  }

  if (id.length > 12 || id.length < 5) {
    onToast('아이디는 5~12자로 입력해주세요');
    return;
  }

  if (pw.length > 12 || pw.length < 5) {
    onToast('비밀번호는 5~12자로 입력해주세요');
    return;
  }

  if (pw_chk !== pw) {
    onToast('비밀번호와 비밀번호 확인이 일치하지 않습니다');
    return;
  }

  if (myphone.length !== 11 || ph1.length !== 11) {
    onToast('전화번호는 11자로 입력해주세요');
    return;
  }

  if (ph2 && ph2.length !== 11) {
    onToast('지정보호자2의 전화번호는 11자이어야 합니다');
    return;
  }

  if (ph3 && ph3.length !== 11) {
    onToast('지정보호자3의 전화번호는 11자이어야 합니다');
    return;
  }

  const formData = new FormData();
  formData.append('id', id);
  formData.append('pw', pw);
  formData.append('birthday', birth);
  formData.append('myphone', myphone);
  formData.append('hp1', ph1);
  formData.append('hp2', ph2);
  formData.append('hp3', ph3);
  formData.append('email', email);

  // eslint-disable-next-line no-undef
  axios
    .request({
      method: 'POST',
      url: 'http://api.pomi.co.kr/auth/create.php',
      data: formData
    })
    .then(response => {
      const { token: _token, uid: _uid } = response.data;
      sessionStorage.setItem('token', _token);
      sessionStorage.setItem('uid', _uid);
      alert('회원가입이 완료되었습니다!');
      window.location = './index.html';
    })
    .catch(e => {
      const { msg } = e.response.data;
      console.log(e.response);
      console.log('실패');
      console.log(msg);
      onToast(msg);
    });
};

function onToast(msg) {
  const x = document.getElementById('snackbar');
  x.className = 'show';
  x.textContent = msg;
  setTimeout(() => {
    x.className = x.className.replace('show', '');
  }, 3000);
}

function numberMaxLength(e) {
  if (e.value.length > e.maxLength) {
    e.value = e.value.slice(0, e.maxLength);
  }
}

// yymmdd
function isValidDate(dateString) {
  // First check for the pattern
  if (dateString.length !== 6) return false;
  if (isNaN(parseInt(dateString))) return false;

  // Parse the date parts to integers
  const month = parseInt(dateString.slice(2, 4));
  const day = parseInt(dateString.slice(4, 6));

  if (month > 12 || month < 1) {
    return false;
  }

  if (day > 31 || day < 1) {
    return false;
  }

  return true;
}
