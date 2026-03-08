<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Life OS - Offline</title>
    <meta name="theme-color" content="#EC4899">
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Nunito:wght@400;600;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FFF8F0;
            font-family: 'Nunito', sans-serif;
            color: #374151;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        .icon {
            font-size: 80px;
            color: #EC4899;
            opacity: 0.6;
        }
        h1 {
            font-family: 'Caveat', cursive;
            font-size: 2.5rem;
            margin: 1rem 0 0.5rem;
        }
        p {
            color: #6b7280;
            font-size: 1.1rem;
            max-width: 400px;
            margin: 0 auto 2rem;
        }
        button {
            background: #EC4899;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            font-family: 'Nunito', sans-serif;
        }
        button:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <span class="material-symbols-outlined icon">cloud_off</span>
        <h1>Kamu Sedang Offline</h1>
        <p>Sepertinya koneksi internet kamu terputus. Cek koneksi dan coba lagi ya.</p>
        <button onclick="window.location.reload()">Coba Lagi</button>
    </div>
</body>
</html>
