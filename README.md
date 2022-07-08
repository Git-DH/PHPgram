# [Composer exe 설치]
- https://getcomposer.org/download/
- php.ini 
- zend_extension=xdebug - 주석(;) 달기 
- extention=openssl - 주석 해제 후 설치


# [ratchet 라이브러리 설치]
- cmd로 해당 프로젝트 폴더에 들어간 후
- composer require cboden/ratchet 로 설치

# [composer.json, autoload 적용]
- vscode terminal 
- composer dump-autoload 입력 후 설치


# [웹소켓 서버 실행 (CLI에서)]
- php socketRun.php

# [vscode 파일 추가]
- composer.json에 추가
"autoload": {
  "psr-4":{
    "ws\\": "ws/",
    "application\\": "application/"
  }
},

- ws 폴더 만든 후 
https://github.com/sbsteacher/PHPgram/tree/master/ws 
파일 만들어서 내용 붙여넣기

- 최상위 폴더에 soketRun.php 추가
https://github.com/sbsteacher/PHPgram/blob/master/socketRun.php

- controllers 폴더에
DmController.php 만들고 내용 추가
https://github.com/sbsteacher/PHPgram/blob/master/application/controllers/DmController.php

- modes 폴더에
DmModel.php 만들고 내용 추가
https://github.com/sbsteacher/PHPgram/blob/master/application/models/DmModel.php
