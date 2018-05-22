<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST)
{

	$name = strip_tags(trim($_POST["name"]));
	$name = str_replace(array("\r", "\n"), array(" ", " "), $name);
	$email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
	$message = trim($_POST["message"]);

	$email_content = "Name: $name\n";
	$email_content .= "Email: $email\n\n";
	$email_content .= "Message: \n$message\n";

	require 'phpmailer/PHPMailerAutoload.php';
	$mail = new PHPMailer;
	$mail->CharSet = 'UTF-8';
	$mail->isSMTP(); // Set mailer to use SMTP;
	$mail->SMTPAuth = true; // Enable SMTP authentication;
	$mail->SMTPSecure = 'tls'; // Enable TLS encryption, `ssl` also accepted;
	$mail->Port = 587; // TCP port to connect to;

	$mail->Host = ''; // Specify main and backup SMTP servers;
	$mail->Username = ''; // SMTP username;
	$mail->Password = ''; // SMTP password;
	$mail->setFrom(''); // Add a sender;
	$mail->addAddress(''); // Add a recipient;

	$mail->Subject = 'New message from your site';
	$mail->Body = $email_content;
	$mail->AltBody = $email_content;
	if (!$mail->send()) {
		echo 'Message could not be sent.';
    	echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
		echo "Message has been sent";
	}
	exit;
}

die("Error!");
