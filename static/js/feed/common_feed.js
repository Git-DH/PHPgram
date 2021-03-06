const feedObj = {
  limit: 8,
  itemLength: 0,
  currentPage: 1,
  swiper: null,
  getFeedUrl: '',
  iuser: 0,
  setScrollInfinity: function () {
    window.addEventListener(
      'scroll',
      (e) => {
        if (this.isLoading()) {
          return;
        }
        // 구조 분할 할당
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        // console.log(scrollTop, scrollHeight, clientHeight);
        if (scrollTop + clientHeight >= scrollHeight - 20 && this.itemLength === this.limit) {
          this.getFeedList();
        }
      },
      { passive: true }
    );
  },
  getFeedList: function () {
    this.itemLength = 0;
    this.showLoading();
    const param = {
      page: this.currentPage++,
      iuser: this.iuser,
    };
    fetch(this.getFeedUrl + encodeQueryString(param))
      .then((res) => res.json())
      .then((list) => {
        this.itemLength = list.length;
        this.makeFeedList(list);
      })
      .catch((e) => {
        console.error(e);
        this.hideLoading();
      });
  },

  refreshSwipe: function () {
    if (this.swiper !== null) {
      this.swiper = null;
    }
    this.swiper = new Swiper('.swiper', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: { el: '.swiper-pagination' },
      allowTouchMove: false,
      direction: 'horizontal',
      loop: false,
    });
  },
  loadingElem: document.querySelector('.loading'),
  containerElem: document.querySelector('#item_container'),
  getFeedCmtList: function (ifeed, divCmtList, spanMoreCmt) {
    fetch(`/feedcmt/index?ifeed=${ifeed}`)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.length > 0) {
          if (spanMoreCmt) {
            spanMoreCmt.remove();
          }
          divCmtList.innerHTML = null;
          res.forEach((item) => {
            const divCmtItem = this.makeCmtItem(item);
            divCmtList.appendChild(divCmtItem);
          });
        }
      });
  },
  makeCmtItem: function (item) {
    const divCmtItemContainer = document.createElement('div');
    divCmtItemContainer.className = 'd-flex flex-row align-items-center mt-1 mb-2';
    const src = '/static/img/profile/' + (item.writerimg ? `${item.iuser}/${item.writerimg}` : 'defaultProfileImg_100.png');
    divCmtItemContainer.innerHTML = `
          <div class="circleimg h24 w24 me-1">
              <img src="${src}" class="profile w24 pointer profileimg">                
          </div>
          <div class="d-flex flex-row">
              <div class="pointer me-2">${item.writer} - <span class="rem0_8">${getDateTimeInfo(item.regdt)}</span></div>
              <div>${item.cmt}</div>
          </div>
      `;
    const img = divCmtItemContainer.querySelector('img');
    img.addEventListener('click', (e) => {
      moveToFeedWin(item.iuser);
    });
    return divCmtItemContainer;
  },
  makeFeedList: function (list) {
    if (list.length !== 0) {
      list.forEach((item) => {
        const divItem = this.makeFeedItem(item);
        this.containerElem.appendChild(divItem);
      });
    }
    this.refreshSwipe();
    this.hideLoading();
  },
  makeFeedItem: function (item) {
    const divContainer = document.createElement('div');
    divContainer.className = 'item mt-3 mb-3';

    const divTop = document.createElement('div');
    divContainer.appendChild(divTop);

    const regDtInfo = getDateTimeInfo(item.regdt);
    divTop.className = 'd-flex flex-row ps-3 pe-3 border-bottom';
    const writerImg = `<img class="profileimg" src='/static/img/profile/${item.iuser}/${item.mainimg}' 
    onerror='this.error=null;this.src="/static/img/profile/defaultProfileImg_100.png"'>`;

    divTop.innerHTML = `
          <div class="d-flex flex-column justify-content-center">
              <div class="circleimg h40 w40 pointer feedwin">${writerImg}</div>
          </div>
          <div class="p-3 flex-grow-1">
              <div><span class="pointer feedwin">${item.writer}</span> - ${regDtInfo}</div>
              <div>${item.location === null ? '' : item.location}</div>
          </div>
          <div class="p-3 pointer">
          <i class="fa-solid fa-ellipsis rem1_5"></i>
          </div>
      `;

    const feedwinList = divTop.querySelectorAll('.feedwin');
    feedwinList.forEach((el) => {
      el.addEventListener('click', () => {
        moveToFeedWin(item.iuser);
      });
    });

    const divImgSwiper = document.createElement('div');
    divContainer.appendChild(divImgSwiper);
    divImgSwiper.className = 'swiper item_img';
    divImgSwiper.innerHTML = `
          <div class="swiper-wrapper align-items-center"></div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"><i class="fa-solid fa-circle-chevron-left rem1_5"></i></div>
          <div class="swiper-button-next"><i class="fa-solid fa-circle-chevron-right rem1_5"></i></div>
      `;
    const divSwiperWrapper = divImgSwiper.querySelector('.swiper-wrapper');

    item.imgList.forEach(function (imgObj) {
      const divSwiperSlide = document.createElement('div');
      divSwiperWrapper.appendChild(divSwiperSlide);
      divSwiperSlide.classList.add('swiper-slide');

      const img = document.createElement('img');
      divSwiperSlide.appendChild(img);
      img.className = 'w100p_mw614 pointer';
      img.src = `/static/img/feed/${item.ifeed}/${imgObj.img}`;
      // 이미지 클릭시 이미지 보이기
      img.addEventListener('click', () => {
        const imgBox = document.createElement('div');
        imgBox.classList = 'modal modal-img d-flex pointer imgBox';
        imgBox.tabIndex = '2';
        imgBox.innerHTML = `
          <div class="modal-dialog">
            <div class="modal-content img-modal-content">
              <img src="${img.src}">
            </div>
          </div>`;
        const main = document.querySelector('main');
        main.appendChild(imgBox);
        imgBox.addEventListener('click', () => {
          imgBox.remove();
        });
      });
    });

    const divBtns = document.createElement('div');
    const leftBtns = document.createElement('div');
    leftBtns.classList = 'leftBtns';
    divContainer.appendChild(divBtns);
    divBtns.appendChild(leftBtns);
    divBtns.className = 'favCont w100p_mw614 pe-3 ps-3 d-flex flex-row ';

    const heartIcon = document.createElement('i');
    leftBtns.appendChild(heartIcon);
    heartIcon.className = 'fa-heart pointer rem1_5 me-3';
    heartIcon.classList.add(item.isFav === 1 ? 'fa-solid' : 'fa-regular');
    heartIcon.addEventListener('click', (e) => {
      let method = 'POST';
      if (item.isFav === 1) {
        method = 'DELETE';
      }
      // if (item.isFav === 0) {
      //   divFav.classList.remove('d-none');
      //   item.favCnt = item.favCnt + 1;
      //   spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;
      // }
      // if (item.isFav === 1) {
      //   // delete (1은 0으로 바꿔줘야 함)
      //   method = 'DELETE';
      //   divFav.classList.remove('d-none');
      //   item.favCnt = item.favCnt - 1;
      //   spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;
      //   if (item.favCnt === 0) {
      //     divFav.classList.add('d-none');
      //   }
      // }
      fetch(`/feed/fav/${item.ifeed}`, {
        method: method,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result) {
            item.isFav = 1 - item.isFav; // 0 > 1, 1 > 0
            if (item.isFav === 0) {
              // 좋아요 취소
              heartIcon.classList.remove('fa-solid');
              heartIcon.classList.add('fa-regular');
              item.favCnt--;
              if (item.favCnt === 0) {
                divFav.classList.add('d-none');
              }
            } else {
              // 좋아요 처리
              heartIcon.classList.remove('fa-regular');
              heartIcon.classList.add('fa-solid');
              item.favCnt++;
              divFav.classList.remove('d-none');
            }
            spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;
          } else {
            alert('좋아요를 할 수 없습니다.');
          }
        })
        .catch((e) => {
          alert('네트워크에 이상이 있습니다.');
        });
    });
    const divMsg = document.createElement('div');

    leftBtns.appendChild(divMsg);
    divMsg.className = 'pointer rem1_5 me-3';
    divMsg.innerHTML = '<i class="fa-regular fa-comment"></i>';
    const divDm = document.createElement('div');
    leftBtns.appendChild(divDm);
    divDm.className = 'pointer';
    divDm.innerHTML = `<svg aria-label="다이렉트 메시지" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>`;
    divDm.addEventListener('click', (e) => {
      location.href = `/dm/index?oppoiuser=${item.iuser}`;
    });
    const divBmk = document.createElement('div');
    divBmk.className = 'pointer rem1_5 me-3 container-center';
    divBmk.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
    divBtns.appendChild(divBmk);
    // 좋아요 표시
    const divFav = document.createElement('div');
    divContainer.appendChild(divFav);
    divFav.className = 'p-3 d-none';
    const spanFavCnt = document.createElement('span');
    divFav.appendChild(spanFavCnt);
    spanFavCnt.className = 'bold';
    spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;

    if (item.favCnt > 0) {
      divFav.classList.remove('d-none');
    }

    if (item.ctnt !== null && item.ctnt !== '') {
      const divCtnt = document.createElement('div');
      divContainer.appendChild(divCtnt);
      divCtnt.innerText = item.ctnt;
      divCtnt.className = 'itemCtnt p-3';
    }

    const divCmtList = document.createElement('div');
    divContainer.appendChild(divCmtList);
    divCmtList.className = 'ms-3';

    const divCmt = document.createElement('div');
    divContainer.appendChild(divCmt);

    const spanMoreCmt = document.createElement('span');

    if (item.cmt) {
      const divCmtItem = this.makeCmtItem(item.cmt);
      divCmtList.appendChild(divCmtItem);

      if (item.cmt.ismore === 1) {
        const divMoreCmt = document.createElement('div');
        divCmt.appendChild(divMoreCmt);
        divMoreCmt.className = 'ms-3 mb-3';

        divMoreCmt.appendChild(spanMoreCmt);
        spanMoreCmt.className = 'pointer rem0_9 c_lightgray';
        spanMoreCmt.innerText = '댓글 더보기..';
        spanMoreCmt.addEventListener('click', (e) => {
          this.getFeedCmtList(item.ifeed, divCmtList, spanMoreCmt);
        });
      }
    }

    const divCmtForm = document.createElement('div');
    divCmtForm.className = 'd-flex flex-row cmtBox';
    divCmt.appendChild(divCmtForm);

    divCmtForm.innerHTML = `
          <div class="container-center p-2 pointer"><i class="fa-regular fa-face-smile rem1_5"></i></div>
          <input type="text" class="flex-grow-1 my_input back_color p-2" placeholder="댓글을 입력하세요...">
          <button type="button" class="btn btn-outline-primary bold">게시</button>
      `;

    const inputCmt = divCmtForm.querySelector('input');
    inputCmt.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        btnCmtReg.click();
      }
    });
    const btnCmtReg = divCmtForm.querySelector('button');
    btnCmtReg.addEventListener('click', (e) => {
      const param = {
        ifeed: item.ifeed,
        cmt: inputCmt.value,
      };
      fetch('/feedcmt/index', {
        method: 'POST',
        body: JSON.stringify(param),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result) {
            inputCmt.value = '';
            this.getFeedCmtList(param.ifeed, divCmtList, spanMoreCmt);
          }
        });
    });

    return divContainer;
  },

  showLoading: function () {
    this.loadingElem.classList.remove('d-none');
  },
  hideLoading: function () {
    this.loadingElem.classList.add('d-none');
  },
  isLoading: function () {
    return !this.loadingElem.classList.contains('d-none');
  },
};

function moveToFeedWin(iuser) {
  location.href = `/user/feedwin?iuser=${iuser}`;
}

(function () {
  const btnNewFeedModal = document.querySelector('#btnNewFeedModal');
  if (btnNewFeedModal) {
    const modal = document.querySelector('#newFeedModal');
    const body = modal.querySelector('#id-modal-body');
    const frmElem = modal.querySelector('form');
    const btnClose = modal.querySelector('.btn-close');
    //이미지 값이 변하면
    frmElem.imgs.addEventListener('change', function (e) {
      console.log(`length: ${e.target.files.length}`);
      if (e.target.files.length > 0) {
        body.innerHTML = `
                  <div>
                      <div class="d-flex flex-md-row">
                          <div class="flex-grow-1 h-full"><img id="id-img" class="w300"></div>
                          <div class="ms-1 w250 d-flex flex-column">                
                              <textarea placeholder="문구 입력..." class="flex-grow-1 p-1"></textarea>
                              <input type="text" placeholder="위치" class="mt-1 p-1">
                          </div>
                      </div>
                  </div>
                  <div class="mt-2">
                      <button type="button" class="btn btn-primary">공유하기</button>
                  </div>
              `;
        const imgElem = body.querySelector('#id-img');

        const imgSource = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imgSource);
        reader.onload = function () {
          imgElem.src = reader.result;
        };

        const shareBtnElem = body.querySelector('button');
        shareBtnElem.addEventListener('click', function () {
          const files = frmElem.imgs.files;

          const fData = new FormData();
          for (let i = 0; i < files.length; i++) {
            fData.append('imgs[]', files[i]);
          }
          fData.append('ctnt', body.querySelector('textarea').value);
          fData.append('location', body.querySelector('input[type=text]').value);

          fetch('/feed/rest', {
            method: 'post',
            body: fData,
          })
            .then((res) => res.json())
            .then((myJson) => {
              console.log(myJson);

              if (myJson) {
                btnClose.click();
                const lData = document.querySelector('#lData');
                const gData = document.querySelector('#gData');
                if (lData && lData.dataset.toiuser !== gData.dataset.loginiuser) {
                  return;
                }
                // 남의 feedWin이 아니라면 화면에 등록!!!
                const feedItem = feedObj.makeFeedItem(myJson);
                feedObj.containerElem.prepend(feedItem);
                feedObj.refreshSwipe();
                window.scrollTo(0, 0);
              }
            });
        });
      }
    });

    btnNewFeedModal.addEventListener('click', function () {
      const selFromComBtn = document.createElement('button');
      selFromComBtn.type = 'button';
      selFromComBtn.className = 'btn btn-primary';
      selFromComBtn.innerText = '컴퓨터에서 선택';
      selFromComBtn.addEventListener('click', function () {
        frmElem.imgs.click();
      });
      body.innerHTML = null;
      body.appendChild(selFromComBtn);
    });
  }
})();
