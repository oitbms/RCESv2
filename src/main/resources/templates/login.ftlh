<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в RCES</title>
    <style>
        :root {
            --login-primary: #0d5c63;
            --login-primary-dark: #08434a;
            --login-accent: #f4a259;
            --login-ink: #132238;
            --login-muted: #5d6a7f;
            --login-surface: rgba(255, 255, 255, 0.86);
            --login-surface-strong: #ffffff;
            --login-border: rgba(19, 34, 56, 0.12);
            --login-shadow: 0 28px 80px rgba(19, 34, 56, 0.18);
        }

        * {
            box-sizing: border-box;
        }

        html {
            min-height: 100%;
        }

        body.login-page {
            margin: 0;
            min-height: 100vh;
            padding: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Trebuchet MS", "Segoe UI", sans-serif;
            color: var(--login-ink);
            background:
                    radial-gradient(circle at top left, rgba(244, 162, 89, 0.28), transparent 34%),
                    radial-gradient(circle at bottom right, rgba(13, 92, 99, 0.28), transparent 28%),
                    linear-gradient(135deg, #f8f2ea 0%, #eef4f3 54%, #d9ebe8 100%);
            position: relative;
            overflow: hidden;
        }

        body.login-page::before,
        body.login-page::after {
            content: "";
            position: absolute;
            border-radius: 999px;
            z-index: 0;
            filter: blur(8px);
        }

        body.login-page::before {
            width: 320px;
            height: 320px;
            top: -120px;
            right: -80px;
            background: rgba(244, 162, 89, 0.25);
        }

        body.login-page::after {
            width: 280px;
            height: 280px;
            left: -120px;
            bottom: -120px;
            background: rgba(13, 92, 99, 0.18);
        }

        .login-layout {
            position: relative;
            z-index: 1;
            width: min(1120px, 100%);
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
            gap: 24px;
            align-items: stretch;
        }

        .login-hero,
        .login-card {
            border-radius: 32px;
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.55);
            box-shadow: var(--login-shadow);
        }

        .login-hero {
            padding: 40px;
            background: linear-gradient(160deg, rgba(19, 34, 56, 0.9), rgba(13, 92, 99, 0.88));
            color: #f7fbff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 560px;
        }

        .login-kicker,
        .login-card__eyebrow {
            margin: 0 0 14px;
            text-transform: uppercase;
            letter-spacing: 0.24em;
            font-size: 0.76rem;
            font-weight: 700;
        }

        .login-kicker {
            color: rgba(255, 255, 255, 0.72);
        }

        .login-hero h1 {
            margin: 0 0 16px;
            font-size: clamp(2.3rem, 4vw, 4rem);
            line-height: 0.98;
            max-width: 10ch;
        }

        .login-description {
            margin: 0;
            max-width: 34rem;
            font-size: 1.05rem;
            line-height: 1.7;
            color: rgba(247, 251, 255, 0.8);
        }

        .login-hero__grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-top: 36px;
        }

        .login-hero__card {
            padding: 20px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .login-hero__card-label {
            display: inline-flex;
            margin-bottom: 14px;
            padding: 6px 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.16);
            color: rgba(255, 255, 255, 0.82);
            font-size: 0.78rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .login-hero__card strong {
            display: block;
            margin-bottom: 10px;
            font-size: 1.05rem;
        }

        .login-hero__card p {
            margin: 0;
            line-height: 1.55;
            color: rgba(247, 251, 255, 0.78);
        }

        .login-panel {
            display: flex;
            align-items: center;
        }

        .login-card {
            width: 100%;
            padding: 36px;
            background: var(--login-surface);
            color: var(--login-ink);
        }

        .login-card__header {
            margin-bottom: 28px;
        }

        .login-card__eyebrow {
            color: var(--login-primary);
        }

        .login-card__header h2 {
            margin: 0 0 10px;
            font-size: clamp(1.8rem, 2.8vw, 2.4rem);
            line-height: 1.05;
        }

        .login-card__header p {
            margin: 0;
            color: var(--login-muted);
            line-height: 1.6;
        }

        .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form-label {
            font-size: 0.95rem;
            font-weight: 700;
        }

        .form-control {
            width: 100%;
            border: 1px solid var(--login-border);
            border-radius: 18px;
            padding: 18px 20px;
            font: inherit;
            font-size: 1rem;
            color: var(--login-ink);
            background: var(--login-surface-strong);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }

        .form-control::placeholder {
            color: #96a1b2;
        }

        .form-control:focus {
            outline: none;
            border-color: rgba(13, 92, 99, 0.55);
            box-shadow: 0 0 0 5px rgba(13, 92, 99, 0.12);
            transform: translateY(-1px);
        }

        .form-hint {
            margin: 0;
            font-size: 0.9rem;
            color: var(--login-muted);
            line-height: 1.5;
        }

        .error-message {
            padding: 14px 16px;
            border-radius: 16px;
            border: 1px solid rgba(177, 37, 44, 0.18);
            background: rgba(177, 37, 44, 0.08);
            color: #8b1e25;
            font-size: 0.92rem;
            line-height: 1.45;
        }

        .btn {
            width: 100%;
            border: none;
            border-radius: 18px;
            padding: 16px 22px;
            font: inherit;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .btn-primary {
            color: #fff;
            background: linear-gradient(135deg, var(--login-primary) 0%, var(--login-primary-dark) 100%);
            box-shadow: 0 18px 32px rgba(8, 67, 74, 0.22);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 22px 36px rgba(8, 67, 74, 0.28);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        @media (max-width: 980px) {
            body.login-page {
                padding: 20px;
            }

            .login-layout {
                grid-template-columns: 1fr;
            }

            .login-hero {
                min-height: auto;
            }
        }

        @media (max-width: 640px) {
            body.login-page {
                padding: 14px;
            }

            .login-hero,
            .login-card {
                border-radius: 24px;
            }

            .login-hero,
            .login-card {
                padding: 24px 20px;
            }

            .login-hero__grid {
                grid-template-columns: 1fr;
            }

            .login-hero h1 {
                max-width: none;
            }
        }

    </style>
</head>
<body class="login-page">
<main class="login-layout" role="main">

    <section class="login-panel" aria-label="Форма входа">
        <div class="login-card">
            <div class="login-card__header">
                <p class="login-card__eyebrow">Авторизация</p>
            </div>

            <form method="POST" action="/login" class="login-form">
                <#if error??>
                    <div class="error-message" role="alert">${error}</div>
                </#if>
                <div class="form-group">
                    <label for="username" class="form-label">Ключ доступа</label>
                    <input
                            type="text"
                            id="username"
                            name="username"
                            class="form-control"
                            autocomplete="username"
                            placeholder="Введите ваш ключ"
                            required
                    >
                </div>

                <button type="submit" id="loginButton" class="btn btn-primary">Войти</button>
            </form>
        </div>
    </section>
</main>
</body>
</html>
