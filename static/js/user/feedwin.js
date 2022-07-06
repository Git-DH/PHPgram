if(feedObj) {
    const url = new URL(location.href);
    feedObj.iuser = parseInt(url.searchParams.get('iuser'));
    feedObj.getFeedUrl = '/user/feed';
    feedObj.getFeedList();
}

/* function getFeedList() {
    if(!feedObj) { return; }
    
    feedObj.showLoading();
    const param = {
        page: feedObj.currentPage++,
        iuser: url.searchParams.get('iuser')
    }
    fetch('/user/feed' + encodeQueryString(param))
    .then(res => res.json())
    .then(list => {                
        feedObj.makeFeedList(list);                
    })
    .catch(e => {
        console.error(e);
        feedObj.hideLoading();
    });
}
getFeedList();
*/

(function () {
    const spanCntFollower = document.querySelector('#spanCntFollower')
    const btnFollow = document.querySelector('#btnFollow');
    const lData = document.querySelector('#lData');
    if(btnFollow) {
        btnFollow.addEventListener('click', function() {
            const param = {
                toiuser: parseInt(lData.dataset.toiuser)
            };
            console.log(param);
            const follow = btnFollow.dataset.follow;
            console.log('follow : ' + follow);
            const followUrl = '/user/follow';
            switch(follow) {
                case '1': //팔로우 취소
                // encodeQueryString(param): 파라미터의 값을 쿼리스트링으로 변환
                    fetch(followUrl + encodeQueryString(param), {method: 'DELETE'})
                    .then(res => res.json())
                    .then(res => {
                        console.log(res);
                        if(res.result) {
                            // 팔로워 숫자 변경
                            const cntFollowerVal = parseInt(spanCntFollower.innerText);
                            spanCntFollower.innerText = cntFollowerVal - 1;

                            btnFollow.dataset.follow = '0';
                            btnFollow.classList.remove('btn-outline-secondary');
                            btnFollow.classList.add('btn-primary');
                            if(btnFollow.dataset.youme === '1') {
                                btnFollow.innerText = '맞팔로우 하기';
                            } else {
                                btnFollow.innerText = '팔로우';
                            }
                        }
                    });
                    break;
                case '0': //팔로우 등록
                fetch(followUrl , {
                    method: 'POST',
                    body: JSON.stringify(param)
                    // post방식이므로 body에 자료를 담는다.
                })
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    if(res.result) {
                        const cntFollowerVal = parseInt(spanCntFollower.innerText);
                        spanCntFollower.innerText = cntFollowerVal + 1;
                        btnFollow.dataset.follow = '1';
                        btnFollow.classList.remove('btn-primary');
                        btnFollow.classList.add('btn-outline-secondary');
                            btnFollow.innerText = '팔로우 취소';
                    }
                });
                    break;
            }
        })
    }
})()