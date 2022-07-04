<?php
namespace application\libs;

require_once "application/utils/UrlUtils.php";
require_once "application/utils/SessionUtils.php";
require_once "application/utils/FileUtils.php";

class Application{
    
    public $controller;
    public $action;
    private static $modelList = [];
    // static이 붙으면 메모리에 바로 올라감, 변수하나가 할당되고 서버가 닫길 때 까지 유지 된다.
    // 메소드 안에서 멤버필드를 사용하는데 멤버필드가 static이 아니면 그 메소드는 static을 붙일 수 없다.

    public function __construct() {        
        $urlPaths = getUrlPaths();
        $controller = isset($urlPaths[0]) && $urlPaths[0] != '' ? $urlPaths[0] : 'board';
        $action = isset($urlPaths[1]) && $urlPaths[1] != '' ? $urlPaths[1] : 'index';

        if (!file_exists('application/controllers/'. $controller .'Controller.php')) {
            echo "해당 컨트롤러가 존재하지 않습니다.";
            exit();
        }

        $controllerName = 'application\controllers\\' . $controller . 'controller';                
        $model = $this->getModel($controller);
        new $controllerName($action, $model);
    }

    public static function getModel($key) {
        if(!in_array($key, static::$modelList)) {
            $modelName = 'application\models\\' . $key . 'model';
            static::$modelList[$key] = new $modelName();
        }
        return static::$modelList[$key];
    }
}