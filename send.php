<?php
// PHPMailerライブラリを読み込み
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// 入力値を取得（POST）
function h($s) {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

$category = trim($_POST['category'] ?? '');
$last_name = trim($_POST['last_name'] ?? '');
$first_name = trim($_POST['first_name'] ?? '');
$last_kana = trim($_POST['last_kana'] ?? '');
$first_kana = trim($_POST['first_kana'] ?? '');
$postcode = trim($_POST['postcode'] ?? '');
$prefecture = trim($_POST['prefecture'] ?? '');
$address = trim($_POST['address'] ?? '');
$building = trim($_POST['building'] ?? '');
$tel = trim($_POST['tel'] ?? '');
$fax = trim($_POST['fax'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

// 必須チェック
if (!$category || !$last_name || !$first_name || !$last_kana || !$first_kana || !$tel || !$email || !$message) {
    exit('必須項目が未入力です。');
}

// メールアドレス形式チェック
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('メールアドレスが不正です。');
}

// Turnstile認証（cURL）
$token = $_POST['cf-turnstile-response'] ?? '';
$ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'secret' => '0x4AAAAAABiz_Xhe-J0-EB9ypk53QvLFwt8',
    'response' => $token
]));
$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);
if (empty($result['success'])) {
    exit('Turnstile認証に失敗しました。戻ってやり直してください。');
}

// メール送信
$mail = new PHPMailer(true);

try {
    $mail->CharSet = 'UTF-8';
    $mail->isMail();

    // 差出人
    $mail->setFrom('info@n-lyric.com', '株式会社リリック');

    // Return-Path
    $mail->Sender = 'info@n-lyric.com';

    // 返信先
    $mail->addReplyTo($email, $last_name . ' ' . $first_name);

    // 宛先
    $mail->addAddress('info@n-lyric.com', 'お問い合わせ担当者');

    // BCC
    $mail->addBCC('tomglassesc@gmail.com');

    // 件名
    $mail->Subject = '【株式会社リリック】お問い合わせを受け付けました';

    // 本文（テキスト）
    $body = <<<EOT
以下の内容でお問い合わせがありました。

【項目】
{$category}

【お名前】
{$last_name} {$first_name}

【フリガナ】
{$last_kana} {$first_kana}

【住所】
〒{$postcode}
{$prefecture}{$address}
{$building}

【電話番号】
{$tel}

【FAX番号】
{$fax}

【メールアドレス】
{$email}

【お問い合わせ内容】
{$message}
EOT;

    $mail->Body = $body;

    $mail->send();

    // ログファイル記録
    file_put_contents(
        __DIR__ . '/contact_log.txt',
        date('Y-m-d H:i:s') . " 送信成功: {$email}\n",
        FILE_APPEND
    );

    // サンキューページにリダイレクト
    header("Location: https://n-lyric.com/thanks.html");
    exit();

} catch (Exception $e) {
    // ログ記録
    file_put_contents(
        __DIR__ . '/contact_log.txt',
        date('Y-m-d H:i:s') . " 送信失敗: {$email} エラー: {$mail->ErrorInfo}\n",
        FILE_APPEND
    );
    exit("メール送信エラー: {$mail->ErrorInfo}");
}
?>
