<?php
// PHPMailerクラスを読み込み
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// メール送信
$mail = new PHPMailer(true);

try {
    // 文字エンコーディング
    $mail->CharSet = 'UTF-8';

    // SMTPを使わずにmail()で送信
    $mail->isMail();

    // 差出人
    $mail->setFrom('no-reply@n-lyric.com', '株式会社リリック');

    // 宛先（ここをあなたのメールアドレスに変更）
    $mail->addAddress('toshio.k@icloud.com', 'テスト受信者');

    // 件名
    $mail->Subject = 'テスト送信';

    // 本文
    $mail->Body = "これはテスト送信です。\n改行もそのまま表示されます。";

    // 送信
    $mail->send();

    echo "✅ テストメールを送信しました！";
} catch (Exception $e) {
    echo "❌ エラー: {$mail->ErrorInfo}";
}
?>
