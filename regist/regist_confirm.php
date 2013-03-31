<?php
/*******************************************************************************
 *
 *　 [regist_confirm.php]　会員登録内容確認画面
 * 
 ********************************************************************************/
/* 入力フォームからパラメータを取得 */
$formList = array('mode','pre_userid','input_userid','input_password','input_name','input_email');

/* 必須項目 */
$requireList = array('mode','input_userid','input_password','input_name');

/* ポストデータを取得しパラメータと同名の変数に格納 */
foreach($formList as $value) {
  $$value = $_POST[$value];
}
	
/* エラーメッセージの初期化 */
$error = array();

/* 必須項目入力チェック	*/
foreach($requireList as $value) {
  if($$value == "") {
    array_push($error,"入力されていない項目があります。");
	break;
  }
}

/* パスワードチェック	*/
if(strlen($input_password) < 6 || strlen($input_password) > 16) {
  array_push($error,"パスワードは6文字以上16文字以内でお願いします。");
}
?>
<div class="error-msg">
<?php
/* エラー 入力フォーム表示 $error  */
if(count($error) > 0) {
  require_once("regist_form.php");
?>	
</div>
<?php
} else {
?>
<form method="post" action="index.php">
  <input type="hidden" name="mode" value="user_regist">
  <table>
    <caption>入力情報確認ページ</caption>
    <tr>
      <td class="item">ユーザー名：</td>
      <td><?php print $input_userid;?><input type="hidden" name="input_userid" value="<?php print $input_userid;?>"></td>
    </tr>
    <tr>
      <td class="item">パスワード：</td>
      <td><?php print $input_password;?><input type="hidden" name="input_password" value="<?php print $input_password;?>"></td>
    </tr>
    <tr>
      <td class="item">名前：</td>
      <td><?php print $input_name;?><input type="hidden" name="input_name" value="<?php print $input_name;?>"></td>
    </tr>
    <tr>
      <td class="item">メールアドレス：</td>
      <td><?php print $input_email;?><input type="hidden" name="input_email" value="<?php print $input_email;?>"></td>
    </tr>
  </table>
  <div><input type="submit" value=" 登 録 "></div>
</form>
<?php
}
?>