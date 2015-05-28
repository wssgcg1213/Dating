<?php

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
        "url" => "#!/",
        "src" => "http://redrock.u.qiniudn.com/pics/git_wallpaper_clean_by_black_pixel-d5wmjnw.jpg"
      ]]
  ];

  header("Content-Type: application/json");
  echo json_encode($data);
