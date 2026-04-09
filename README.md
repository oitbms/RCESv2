# RCES
Задачки по прокачке:
- внедрить JasperReports и заменить всю генерацию отчетов на его использование
- Код-генерацию DTO и ts интерфейсов при build (Kotlin)
- Перевести все JavaScript файлы на TypeScript с наследованием от базового класса
- Перевести все CSS файлы на SCSS с наследованием от базового SCSS файла
- Убрать весь CSS из HTML-файлов и перенести в соответствующие SCSS-файлы (кроме login.ftlh)
- Убрать весь JavaScript из HTML-файлов и перенести в соответствующие TypeScript-файлы (кроме login.ftlh)

## Security setup

The application now expects sensitive values from environment variables:

- SPRING_DATASOURCE_PASSWORD
- SPM_DATASOURCE_PASSWORD
- AUTH_BASE_CLIENT_CREDENTIALS
- AUTH_BASE_PASSWORD
- TELEGRAM_BOT_TOKEN
- JWT_SECRET
- VK_API_TOKEN

JWT_SECRET can be either plain text (at least 32 chars) or Base64-encoded bytes.
