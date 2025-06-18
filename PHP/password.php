<?php
// Виводити всі помилки для налагодження
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Параметри підключення до бази даних
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db   = 'my_database';

// Функція для збереження нового користувача у базу даних
function saveToMySQL($mysqli, $login, $password) {
    // Підготовка SQL-запиту для вставки нового запису
    $stmt = $mysqli->prepare("INSERT INTO logins (login, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $login, $password); // Прив'язка параметрів
    $stmt->execute(); // Виконання запиту
    $stmt->close(); // Закриття запиту
}

// Перевіряємо, чи запит є POST-запитом
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Отримуємо дані з POST-запиту
    $login = $_POST['login'] ?? '';
    $password = $_POST['password'] ?? '';
    $action = $_POST['action'] ?? 'login';

    // Підключення до бази даних
    $mysqli = new mysqli($host, $user, $pass, $db, 3306);
    if ($mysqli->connect_errno) {
        die("Помилка підключення: " . $mysqli->connect_error); // Вивід помилки підключення
    }

    // Перевіряємо, чи існує таблиця logins
    $result = $mysqli->query("SHOW TABLES LIKE 'logins'");
    if (!$result || $result->num_rows == 0) {
        die("Таблиця logins НЕ знайдена!<br>");
    }

    // Якщо дію задано як "register" — реєструємо нового користувача
    if ($action === 'register') {
        saveToMySQL($mysqli, $login, $password);
        echo "Реєстрація успішна!";
    } else {
        // Перевіряємо, чи існує такий логін
        $stmt = $mysqli->prepare("SELECT * FROM logins WHERE login=?");
        if (!$stmt) {
            die("Помилка підготовки запиту: " . $mysqli->error);
        }
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $userResult = $stmt->get_result();

        if ($userResult && $userResult->num_rows > 0) {
            // Якщо логін існує, перевіряємо пароль
            $stmt->close();
            $stmt = $mysqli->prepare("SELECT * FROM logins WHERE login=? AND password=?");
            $stmt->bind_param("ss", $login, $password);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result && $result->num_rows > 0) {
                // Вхід успішний — повертаємо JSON для редіректу
                echo json_encode(['redirect' => '/my-website/online-store-website/HTML/basket.html']);
                exit;
            } else {
                // Невірний пароль
                echo "<div class='login-error'>Невірний пароль.</div>";
            }
        } else {
            // Якщо користувача не існує — пропонуємо реєстрацію
            echo "<div class='login-error'>Такого користувача не існує.</div>
            <form id='register-form' method='post' action='/my-website/online-store-website/PHP/password.php'>
                <input type='hidden' name='login' value='$login'>
                <input type='hidden' name='password' value='$password'>
                <input type='hidden' name='action' value='register'>
                <button type='submit' class='login-submit-button' style='margin-top:16px;'>Реєстрація</button>
            </form>";
        }
        $stmt->close(); // Закриваємо запит
    }
    $mysqli->close(); // Закриваємо підключення до БД
} else {
    // Якщо запит не POST — повідомляємо про помилку
    echo "Невірний запит!";
}