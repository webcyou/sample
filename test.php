<?php

	//セッション開始
	session_start();
	
	//セッション変数からデータを取り出す
	$loginUser = $_SESSION['loginUser'];
	
	if($loginUser == ""){

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>非会員ページ</title>
</head>

<body>
<h1>非会員ページ</h1>
会員登録かログインしてください。
<a href="login.php">→ログイン</a><br />
<a href="regist/index.php">→新規会員登録</a>


</body>
</html>

<?php
}else{

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>会員ページ</title>
</head>

<body>
こんにちは、<?php print $loginUser; ?>さん！
</body>
</html>
<?php

}
?>