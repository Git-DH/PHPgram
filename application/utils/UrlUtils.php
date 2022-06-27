<?php
    function getParam($key) {
        return isset($_GET[$key]) ? $_GET[$key] : "";
        // 쿼리스트링에 값이 있으면 email의 value값이 리턴, 없으면 빈칸이 리턴
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