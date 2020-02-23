const login = () => {
  const id = document.getElementById('id').value;
  const pw = document.getElementById('pw').value;

  if (!id) {
    onToast('아이디를 입력해주세요');
    return;
  }

  if (!pw) {
    onToast('비밀번호를 입력해주세요');
    return;
  }

  const formData = new FormData();
  formData.append('id', id);
  formData.append('pw', pw);

  axios
    .request({
      method: 'POST',
      url: 'http://api.pomi.co.kr/auth/',
      data: formData
      // axios 객체에서 HTTP 요청, 이것은 약속을 반환한다.
      // async / await를 사용하여 응답 객체에 대한 약속을 해결할 수 있다.
      // async / await를 사용하지 않으려면 Promise 구문을 사용할 수 있다,
    })
    .then(response => {
      const body = response.data;
      sessionStorage.setItem('token', body.token);
      sessionStorage.setItem('uid', body.uid);
      window.location = './index.html';
    })
    .catch(e => {
      onToast('아이디 또는 비밀번호를 다시 확인해주세요');
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

(() => {
  document.getElementById('id').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });
  document.getElementById('pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });
})();
