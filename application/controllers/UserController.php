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
                $_SESSION[_LOGINUSER] = $dbuser;

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
}
