const url = new URL(location.href);

if (feedObj) {
  const url = new URL(location.href);
  feedObj.iuser = parseInt(url.searchParams.get('iuser'));
  feedObj.getFeedUrl = '/user/feed';
  feedObj.getFeedList();
}

/*
function getFeedList() {
  if (!feedObj) {
    return;
  }
  const urlParams = url.searchParams;
  feedObj.showLoading();
  // const iuser = location.search.split('?iuser=');
  const param = {
    page: feedObj.currentPage++,
    iuser: urlParams.get('iuser'),
  };
  fetch('/user/feed' + encodeQueryString(param) + location.search)
    .then((res) => res.json())
    .then((list) => {
      feedObj.makeFeedList(list);
    })
    .catch((e) => {
      console.error(e);
      feedObj.hideLoading();
    });
}
 */
// getFeedList();

(function () {
  const lData = document.querySelector('#lData');
  const btnFollow = document.querySelector('#btnFollow');
  const btnUpdateCurrentProfilePic = document.querySelector('#btnUpdateCurrentProfilePic');
  const btnDelCurrentProfilePic = document.querySelector('#btnDelCurrentProfilePic');
  const btnProfileImgModalClose = document.querySelector('#btnProfileImgModalClose');

  if (btnFollow) {
    btnFollow.addEventListener('click', function () {
      const param = {
        toiuser: parseInt(lData.dataset.toiuser),
      };
      console.log(param);
      const follow = btnFollow.dataset.follow;
      console.log('follow : ' + follow);
      const followUrl = '/user/follow';
      const spanFollower = document.querySelector('.divFollower span');
      switch (follow) {
        case '1': //팔로우 취소
          fetch(followUrl + encodeQueryString(param), { method: 'DELETE' })
            .then((res) => res.json())
            .then((res) => {
              if (res.result) {
                btnFollow.dataset.follow = '0';
                // 팔로워 숫자 변경
                const followerCnt = ~~spanFollower.innerText - 1;
                spanFollower.innerText = followerCnt;
                btnFollow.classList.remove('btn-outline-secondary');
                btnFollow.classList.add('btn-primary');
                if (btnFollow.dataset.youme === '1') {
                  btnFollow.innerText = '맞팔로우 하기';
                } else {
                  btnFollow.innerText = '팔로우';
                }
              }
            });
          break;
        case '0': //팔로우 등록
          fetch(followUrl, {
            method: 'POST',
            body: JSON.stringify(param),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.result) {
                btnFollow.dataset.follow = '1';
                // 팔로워 숫자 변경
                const followerCnt = ~~spanFollower.innerText + 1;
                spanFollower.innerText = followerCnt;
                btnFollow.classList.remove('btn-primary');
                btnFollow.classList.add('btn-outline-secondary');
                btnFollow.innerText = '팔로우 취소';
              }
            });
          break;
      }
    });
  }

  if (btnDelCurrentProfilePic) {
    btnDelCurrentProfilePic.addEventListener('click', (e) => {
      fetch('/user/profile', {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result) {
            const profileImgList = document.querySelectorAll('.profileimg');
            profileImgList.forEach((item) => {
              item.src = '/static/img/profile/defaultProfileImg_100.png';
            });
          }
          btnProfileImgModalClose.click();
        });
    });
  }

  if (btnUpdateCurrentProfilePic) {
    btnUpdateCurrentProfilePic.addEventListener('click', (e) => {
      const inputChangeProfile = document.querySelector('#inputChangeProfile');
      const profileImgList = document.querySelectorAll('.profileimg');

      inputChangeProfile.click();
      inputChangeProfile.addEventListener('change', (e) => {
        const imgSource = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imgSource);
        reader.onload = function () {
          profileImgList.forEach((profileImg) => {
            profileImg.src = reader.result;
          });
        };
        const fData = new FormData();
        fData.append('img', imgSource);
        fetch('/user/profile', {
          method: 'POST',
          body: fData,
        })
          .then((res) => res.json())
          .then((res) => {
            btnProfileImgModalClose.click();
          });
      });
    });
  }

  // if (userProfileimg.src === `http://localhost/static/img/profile/${feedObj.iuser}/` || userProfileimg.src === 'http://localhost/static/img/profile/defaultProfileImg_100.png') {
  //   userProfileimg.setAttribute('data-bs-target', '123');
  //   userProfileimg.addEventListener('click', () => {
  //     changeProfile();
  //     userProfileimg.setAttribute('data-bs-target', '#changeProfileImgModal');
  //   });
  // }

  // function changeProfile() {
  //   const inputChangeProfile = document.querySelector('#inputChangeProfile');
  //   const profileImgList = document.querySelectorAll('.profileimg');

  //   inputChangeProfile.click();
  //   inputChangeProfile.addEventListener('change', (e) => {
  //     const imgSource = e.target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(imgSource);
  //     reader.onload = function () {
  //       profileImgList.forEach((profileImg) => {
  //         profileImg.src = reader.result;
  //       });
  //     };
  //     const fData = new FormData();
  //     fData.append('img', imgSource);
  //     fetch('/user/profile', {
  //       method: 'POST',
  //       body: fData,
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         btnProfileImgModalClose.click();
  //       });
  //   });
  // }
})();

// (function () {
//   const btnFollow = document.querySelector('#btnFollow');
//   btnFollow.addEventListener('click', () => {
//     if (btnFollow.innerText === '팔로우' || btnFollow.innerText === '맞팔로우 하기') {
//       fetch(`http://localhost/user/follow${window.location.search}`, {
//         method: 'POST',
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           btnFollow.setAttribute('data-follow', 1);
//           btnFollow.className = 'btn btn-outline-secondary';
//           btnFollow.innerText = '팔로우 취소';
//         });
//     } else if (btnFollow.innerText === '팔로우 취소') {
//       fetch(`http://localhost/user/follow${window.location.search}`, {
//         method: 'DELETE',
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           btnFollow.setAttribute('data-follow', 0);
//           btnFollow.className = 'btn btn-primary';
//           if (Number(btnFollow.dataset.youme) === 1) {
//             btnFollow.innerText = '맞팔로우 하기';
//           } else {
//             btnFollow.innerText = '팔로우';
//           }
//         });
//     }
//   });
// })();
