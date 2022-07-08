<?php
    function getJson(){
      return json_decode(file_get_contents('php://input'),true);
    }

    function getParam($key) {
        return isset($_GET[$key]) ? $_GET[$key] : "";
    }
    function getUrl() {
        return isset($_GET['url']) ? rtrim($_GET['url'], '/') : "";
    }
    function getUrlPaths() {
        $getUrl = getUrl();        
        return $getUrl !== "" ? explode('/', $getUrl) : "";
    }

    function getMethod() {        
        return $_SERVER['REQUEST_METHOD'];
    }

    function isGetOne() {
        $urlPaths = getUrlPaths();
        if(isset($urlPaths[2])) { //one
            return $urlPaths[2];
        }
        return false;
    }
    function getRealClientIp() {
      $ipaddress = '';
      if ($_SERVER['HTTP_CLIENT_IP']) {
          $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
      } else if($_SERVER['HTTP_X_FORWARDED_FOR']) {
          $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
      } else if($_SERVER['HTTP_X_FORWARDED']) {
          $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
      } else if($_SERVER['HTTP_FORWARDED_FOR']) {
          $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
      } else if($_SERVER['HTTP_FORWARDED']) {
          $ipaddress = $_SERVER['HTTP_FORWARDED'];
      } else if($_SERVER['REMOTE_ADDR']) {
          $ipaddress = $_SERVER['REMOTE_ADDR'];
      } else {
          $ipaddress = '알수없음';
      }  
      return $ipaddress;
  }