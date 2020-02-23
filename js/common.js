const sidenavWrapper = document.getElementById('sidenavWrapper');
const sidenav = document.getElementById('re_Sidenav');

let sidenavStatus = false;
// eslint-disable-next-line no-unused-vars
const toggleSidenav = e => {
  // e.stopPropagation();
  if (sidenavStatus) {
    // opened
    sidenavWrapper.style.animation = '0.3s fadeOut';
    sidenav.style.animation = '0.3s slideOut';
    setTimeout(() => {
      sidenavWrapper.style.display = 'none';
    }, 280);

    sidenavStatus = false;
  } else {
    // closed
    sidenavWrapper.style.display = 'block';
    sidenavWrapper.style.animation = '0.3s fadeIn';
    sidenav.style.animation = '0.3s slideIn';

    sidenavStatus = true;
  }
};

function onToast(msg) {
  const x = document.getElementById('snackbar');
  x.innerHTML = msg;
  x.className = 'show';
  setTimeout(function() {
    x.className = x.className.replace('show', '');
  }, 3000);
}

function numberMaxLength(e) {
  if (e.value.length > e.maxLength) {
    e.value = e.value.slice(0, e.maxLength);
  }
}

(() => {
  const token = sessionStorage.getItem('token');
  const uid = sessionStorage.getItem('uid');

  const topnav = document.getElementById('topnav');
  const sidenav = document.getElementById('sidenav_content');

  const addLinkToNav = (name, link) => {
    const element = document.createElement('a');
    element.append(name);
    element.setAttribute('href', link);
    topnav.append(element);

    const _element = document.createElement('div');
    _element.append(element.cloneNode(true));

    sidenav.append(_element);
  };

  if (token && uid) {
    //logined
    addLinkToNav('마이페이지', './mypage.html');
    addLinkToNav('로그아웃', './logout.html');
  } else {
    //not logined
    addLinkToNav('로그인', './login.html');
    addLinkToNav('회원가입', './join.html');
  }
})();
