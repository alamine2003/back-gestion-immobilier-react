<?php
session_start();
require_once '../controllers/AuthController.php';
$auth = new AuthController();
$auth->logout(); 