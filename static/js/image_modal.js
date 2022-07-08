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
// const divCmtClose = document.createElement('div');
// divCmtClose.className = `divCmtClose`;
// divCmtClose.innerText = `숨기기`;
// divCmtList.appendChild(divCmtClose);
// const moreCmt = document.querySelectorAll('.moreCmt');
// divCmtClose.addEventListener('click', () => {
//   console.log('dkdkdk');
//   moreCmt.forEach((item) => {
//     item.classList.add('d-none');
//   });
// });
<i class="fa-solid fa-circle-chevron-right"></i>;
