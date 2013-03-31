<?php

/*******************************************************************************
 *
 *	 [regist_from.php]　仮登録のチェックと会員登録フォーム
 * 
 ********************************************************************************/
/*pre_useridの値を取得*/
if($mode == "regist_form") {
  $pre_userid = $_GET['pre_userid'];
}

/*pre_userid 有効チェック*/
$errorFlag = true;

/* データベース接続設定 */
require_once("db.php");
		
/* 取得したユニークIDをキーに登録されたメールアドレスを取得 */
$query = "select email from members where pre_userid = '$pre_userid'";
$result = mysql_query($query);
	
/*データベースより取得したメールアドレスを表示*/
if(mysql_num_rows($result) > 0) { //取得した結果のデータの数が0以上なら → データが取得できた
  //データが正常に取得できた
  $errorFlag = false;
  $data = mysql_fetch_array($result); 
  $email = $data['email'];
}

if($errorFlag) {  // pre_useridが無効
?>
<table>
  <caption>メールアドレス登録エラー</caption>
  <tr>
    <td class="item">Error：</td>
    <td>このURLは利用できません。<br>もう一度メールアドレスの登録からお願いします。<br> <a href="index.php">会員登録ページ</a></td>
  </tr>
</table>
<?php
} else { // pre_useridが有効
	// regist_confirmでのエラー表示
  if(count($error) > 0) {
    foreach($error as $value) {
	  print $value."<br>";
    }
  }
?>
<form method="post" action="index.php">
  <input type="hidden" name="mode" value="regist_confirm">
  <input type="hidden" name="pre_userid" value="<?php print $pre_userid; ?>">
  <table>
    <caption>会員情報登録フォーム</caption>
    <tr>
      <td class="item">ユーザー名：</td>
      <td><input type="text" size="30" name="input_userid" value="<?php print $input_userid; ?>"></td>
    </tr>
    <tr>
      <td class="item">パスワード：</td>
      <td><input type="text" size="30" name="input_password" value="<?php print $input_password; ?>">&nbsp;&nbsp;※ 6文字以上16文字以下</td>
    </tr>
    <tr>
      <td class="item">名前：</td>
      <td><input type="text" size="30" name="input_name" value="<?php print $input_name; ?>"></td>
    </tr>
    <tr>
      <td class="item">E-mail：</td>
      <td><?php print $email; ?><input type="hidden" name="input_email" value="<?php print $email; ?>"></td>
    </tr>
  </table>
  <div><input type="submit" value=" 送 信 "></div>
</form>
<?php
}
?>