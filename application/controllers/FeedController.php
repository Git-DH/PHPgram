<?php

namespace application\controllers;

class FeedController extends Controller
{
    public function index()
    {
        $this->addAttribute(_JS, ["feed/index"]);
        $this->addAttribute(_CSS, ["feed/index"]);
        $this->addAttribute(_MAIN, $this->getView("feed/index.php"));
        return "template/t1.php";
    }

    public function rest()
    {
        switch (getMethod()) {
            case _POST:
                if (!is_array($_FILES) || !isset($_FILES["imgs"])) {
                    return ["result => 0"];
                }
                $iuser = getIuser();
                $param = [
                    "iuser" => $iuser,
                    "location" => $_POST["location"],
                    "ctnt" => $_POST["ctnt"],
                ];
                $ifeed = $this->model->insFeed($param);

                $paramImg = [ "ifeed" => $ifeed ];
                foreach ($_FILES["imgs"]["name"] as $key => $originalFileNm) {
                    $saveDirectory = _IMG_PATH . "/feed/" . $ifeed;
                    if (!is_dir($saveDirectory)) {
                        mkdir($saveDirectory, 0777, true);
                    }
                    $tmp_name = $_FILES["imgs"]["tmp_name"][$key];
                    $randomFileNm = getRandomFileNm($originalFileNm);
                    if (move_uploaded_file($tmp_name, $saveDirectory . "/" . $randomFileNm)) {
                        $paramImg["img"] = $randomFileNm;
                        $this->model->insFeedImg($paramImg);
                    };
                }
                return ["result" => 1];

            case _GET:
                $page = 1;
                if(isset($_GET["page"])){
                    $page = intval($_GET["page"]);
                }
                $startIdx = ($page - 1) * _FEED_ITEM_CNT;
                $param = [
                    "startIdx" => $startIdx,
                    "iuser" => getIuser()
                ];
                $list = $this->model->selFeedList($param);
                foreach($list as $item) {
                    $item->imgList = $this->model->selFeedImgList($item);
                }
                return $list;
        }
    }
}
