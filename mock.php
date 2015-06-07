<?php
header("Content-Type: application/json");
$type = $_REQUEST['type'];
switch($type){
    case "login":
        $data = [
            "status" => 200,
            "info" => "success",
            "uid" => 1,
            "token" => "nasdfnldssdaf",
            "name" => "Ling."
        ];

        break;

    case "pics":
        $data = [
            "status" => 200,
            "info" => "成功",
            "data" => [[
                "url" => "#!/collect",
                "src" => "http://redrock.u.qiniudn.com/QQ20140305-2.png"
            ],
                [
                    "url" => "#!/detail",
                    "src" => "http://redrock.u.qiniudn.com/pics/css-style.png"
                ],
                [
                    "url" => "#!/history`",
                    "src" => "http://redrock.u.qiniudn.com/pics/git_wallpaper_clean_by_black_pixel-d5wmjnw.jpg"
                ]]
        ];
        break;
    case "list":
        die('{"data":[],"status":200,"info":"\u6210\u529f"}');
}
if(empty($data)){
 $data = [];
}

  echo json_encode($data);
