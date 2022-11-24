<?php

require_once 'fotosecure.php';

$img = myImageCreate('demo.jpg');

//keys must be between 0.1 and 0.9
$keys = [0.45, 0.14, 0.667, 0.21, 0.789, 0.43, 0.5, 0.33, 0.19, 0.48];

$factor = 0.2; //factor should be less than 0.1 for better encryption, 0.01 is ideal

//encrypt jubei
$encrypted_img = encrypt($img, $keys, $factor);

//save encrypted image
//must use png format, jpeg is lossy
myImageSave($encrypted_img, 'encrypted.png');

//load encrypted image and decrypt it
$img = myImageCreate('encrypted.png');
$decrypted_img = decrypt($img, $keys, $factor);

myImageSave($decrypted_img, 'decrypted.png');
