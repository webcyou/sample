<?php

/***************************************************

		ユーザー登録処理コントロールページ

****************************************************/
/* 登録処理（終了を知らせる値）によって読み込むファイルを変える */
$mode = $_POST["mode"];

/* パラメーターに　preuser_idがあれば登録フォームを表示 */
if($_GET['pre_userid'] !=""){
	$mode = "regist_form";
}

/* 振り分け処理 */
switch($mode) {
	// メールアドレスの登録と仮ID送信
	case"email_regist":
		$module = "email_regist.php";
	break;
	
	//会員登録フォーム
	case"regist_form":
		$module = "regist_form.php";
	break;
	
	//登録内容確認
	case"regist_confirm":
		$module = "regist_confirm.php";
	break;
	
	//会員登録
	case"user_regist":
		$module = "user_regist.php";
	break;
	
	//メールアドレス登録（初期画面）
	default:
		$module = "email_form.php";
	break;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="../css/style.css"/>
<title>会員登録フォーム</title>
</head>
<body>
<?php
  // コンテンツ（表示ページ）読み込み
  require_once($module);
?>
</body>
</html>
