<?php

/*******************************************************************************
 *
 *	[mail_regist.php]　ユーザの仮登録と登録ページURLの送信
 *
 ********************************************************************************/
/*フォームからメールアドレスを取得*/
$email = $_POST["email"];

/*エラーメッセージ配列*/
$error = array();

/*データベースに接続*/
require_once("db.php");

/*メールアドレス入力チェック*/
if($email == "") { //未入力の場合、エラーを返す
  //エラー配列に値を代入	
  array_push($error, "メールアドレスを入力してください。"); //エラー配列に値を代入
} else {

  //仮ユーザーIDの生成
  $pre_user_id = uniqid(rand(100,999));	
  $query = "insert into members(pre_userid,email) values('$pre_user_id','$email')";
	
  //SQL文を発行
  $result = mysql_query($query);
	
  /*データベース登録チェック*/
  if($result == false) {
    array_push($error,"データベースに登録できませんでした。"); //エラー配列に値を代入
  } else {
	
  /*取得したメールアドレス宛にメールを送信*/
  mb_language("japanese");  //言語の設定
  mb_internal_encoding("utf-8");//内部エンコーディングの設定
	
  $to = $email;
  $subject = "会員登録URL送信メール";
  $message = "以下のURLより会員登録してください。\n".
  "http://localhost:8888/members/regist/index.php?pre_userid=$pre_user_id";
  $header = "From:test@test.com";
	
  if(!mb_send_mail($to, $subject, $message, $header)) {  //メール送信に失敗したら
    array_push($error,"メールが送信できませんでした。<br><a href='http://localhost:8888/members/regist/index.php?pre_userid=$pre_user_id'>遷移先</a>"); //エラー配列に値を代入	
	}
  }
}

/*エラーがあるかないかによって表示の振り分け($error配列の確認）*/
if(count($error) > 0) {  //エラーがあった場合
  /*エラー内容表示*/
  foreach($error as $value) {
?>
<table>
  <caption>メールアドレス登録エラー</caption>
  <tr>
    <td class="item">Error：</td>
    <td><?php print $value; ?></td>
  </tr>
</table>
<?php
  }  //foreach文の終了
} else {  //エラーがなかった場合		
?>
<table>
  <caption>メール送信成功しました。</caption>
  <tr>
    <td class="item">送信先メールアドレス：</td>
    <td><?php print $email ?></td>
  </tr>
</table>
<?php
}
?>