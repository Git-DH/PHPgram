<?php

namespace application\controllers;

class UserController extends Controller
{
    public function signin()
    {
        switch (getMethod()) {
            case _GET:
                return "user/signin.php";
            case _POST:
                $email = $_POST["email"];
                $pw = $_POST["pw"];
                $param = ["email" => $email];
                $dbuser = $this->model->selUser($param);

                if (!$dbuser || !password_verify($pw, $dbuser->pw)) {
                    return "redirect:signin?email={$email}&err";
                }
                $dbuser->pw = null;
                $dbuser->regdt = null;
                // 메모리 사용을 줄이기 위해 pw, regdt와 같이 필요없는 자료를 처리한다.
                $this->flash(_LOGINUSER, $dbuser);
                // session사용 이유 
                // 스코프(생존시간)가 길다-> 브라우저를 키고 끄는 순간 까지는 살아 있다.
                // 로그인 뿐만 아니라 다른화면으로 값을 이동하는 것에도 사용한다.
                return "redirect:/feed/index";
        }
    }

    public function signup()
    {
        switch (getMethod()) {
            case _GET:
                return "user/signup.php";
            case _POST:
                $param = [
                    "email" => $_POST["email"],
                    "pw" => $_POST["pw"],
                    "nm" => $_POST["nm"],
                ];
                $param["pw"] = password_hash($param["pw"], PASSWORD_BCRYPT);
                $this->model->insUser($param);
                return "redirect:signin";
        }
    }

    public function logout() {
        $this->flash(_LOGINUSER);
        return "redirect:/user/signin";
    }
}
