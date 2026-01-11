Результаты тестирования:
====================================================================== test session starts ======================================================================
platform linux -- Python 3.10.19, pytest-9.0.2, pluggy-1.6.0 -- /usr/local/bin/python3.10
cachedir: .pytest_cache
django: version: 5.2.10, settings: ark_project.settings (from ini)
rootdir: /app
configfile: pytest.ini
plugins: django-4.11.1
collected 28 items

ark_app/tests/test_admin.py::test_export_xlsx PASSED                                                                                                      [  3%]
ark_app/tests/test_auth.py::test_guest_no_access PASSED                                                                                                   [  7%]
ark_app/tests/test_auth.py::test_user_access PASSED                                                                                                       [ 10%]
ark_app/tests/test_auth.py::test_admin_access PASSED                                                                                                      [ 14%]
ark_app/tests/test_models.py::test_create_userprofile PASSED                                                                                              [ 17%]
ark_app/tests/test_models.py::test_gamesession_create PASSED                                                                                              [ 21%]
ark_app/tests/test_models.py::test_leaderboard_create PASSED                                                                                              [ 25%]
ark_app/tests/test_models.py::test_achievement_create PASSED                                                                                              [ 28%]
ark_app/tests/test_models.py::test_friendship_create PASSED                                                                                               [ 32%]
ark_app/tests/test_models.py::test_unique_friendship PASSED                                                                                               [ 35%]
ark_app/tests/test_security.py::test_sql_injection PASSED                                                                                                 [ 39%]
ark_app/tests/test_security.py::test_xss PASSED                                                                                                           [ 42%]
ark_app/tests/test_serializers.py::test_register_serializer PASSED                                                                                        [ 46%]
ark_app/tests/test_serializers.py::test_register_serializer_invalid PASSED                                                                                [ 50%] 
ark_app/tests/test_serializers.py::test_userprofile_serializer_create_update PASSED                                                                       [ 53%]
ark_app/tests/test_serializers.py::test_gamesession_serializer PASSED                                                                                     [ 57%]
ark_app/tests/test_serializers.py::test_leaderboard_serializer PASSED                                                                                     [ 60%]
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_views.py::test_profile_view_authenticated PASSED                                                                                       [ 82%] 
ark_app/tests/test_views.py::test_profile_view_unauthenticated PASSED                                                                                     [ 85%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_views.py::test_profile_view_authenticated PASSED                                                                                       [ 82%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_views.py::test_profile_view_authenticated PASSED                                                                                       [ 82%] 
ark_app/tests/test_views.py::test_profile_view_unauthenticated PASSED                                                                                     [ 85%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_serializers.py::test_achievement_serializer PASSED                                                                                     [ 64%] 
ark_app/tests/test_serializers.py::test_friendship_serializer PASSED                                                                                      [ 67%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_serializers.py::test_usersearch_serializer PASSED                                                                                      [ 71%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_views.py::test_register_view PASSED                                                                                                    [ 75%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_views.py::test_login_view PASSED                                                                                                       [ 78%] 
ark_app/tests/test_views.py::test_profile_view_authenticated PASSED                                                                                       [ 82%] 
ark_app/tests/test_views.py::test_profile_view_authenticated PASSED                                                                                       [ 82%] 
ark_app/tests/test_views.py::test_profile_view_unauthenticated PASSED                                                                                     [ 85%] 
ark_app/tests/test_views.py::test_gamesession_list_create PASSED                                                                                          [ 89%] 
ark_app/tests/test_views.py::test_leaderboard_list_create PASSED                                                                                          [ 92%] 
ark_app/tests/test_views.py::test_friendship_list_create PASSED                                                                                           [ 96%] 
ark_app/tests/test_views.py::test_achievement_list PASSED                                                                                                 [100%] 

====================================================================== 28 passed in 6.64s =======================================================================

# Отчет о ручном тестировании

## Критерии функциональности

| № | Тест-кейс | Ожидаемый результат | Статус | Примечания |
|---|-----------|---------------------|--------|------------|
| 1 | Все ссылки на главной странице | Нет "битых" ссылок (404) | ✅/❌ | |
| 2 | Регистрация нового пользователя | Успешная регистрация, создание профиля | ✅/❌ | |
| 3 | Вход в систему | Получение токена аутентификации | ✅/❌ | |
| 4 | Просмотр профиля | Отображение данных профиля | ✅/❌ | |
| 5 | Обновление профиля | Сохранение изменений | ✅/❌ | |
| 6 | Создание игровой сессии | Сохранение игровых данных | ✅/❌ | |
| 7 | Просмотр таблицы лидеров | Отображение ранжированного списка | ✅/❌ | |
| 8 | Добавление в друзья | Создание запроса на дружбу | ✅/❌ | |
| 9 | Принятие заявки в друзья | Подтверждение дружбы | ✅/❌ | |
| 10 | Просмотр достижений | Отображение полученных достижений | ✅/❌ | |
| 11 | Поиск пользователей | Поиск по имени пользователя | ✅/❌ | |

## Валидация форм

| № | Тест-кейс | Ожидаемый результат | Статус | Примечания |
|---|-----------|---------------------|--------|------------|
| 12 | Регистрация с коротким паролем (<8 символов) | Ошибка валидации | ✅/❌ | |
| 13 | Регистрация с некорректным email | Ошибка валидации | ✅/❌ | |
| 14 | Вход с неверными данными | Ошибка аутентификации | ✅/❌ | |
| 15 | Создание сессии без обязательных полей | Ошибка валидации | ✅/❌ | |

## Разделы прав доступа

| № | Тест-кейс | Ожидаемый результат | Статус | Примечания |
|---|-----------|---------------------|--------|------------|
| 16 | Гость пытается получить доступ к /api/profile/ | Ошибка 401 (Unauthorized) | ✅/❌ | |
| 17 | Гость пытается получить доступ к /api/sessions/ | Ошибка 401 (Unauthorized) | ✅/❌ | |
| 18 | Обычный пользователь пытается получить доступ к /admin/ | Редирект на страницу входа | ✅/❌ | |
| 19 | Администратор входит в /admin/ | Успешный доступ к админ-панели | ✅/❌ | |
| 20 | Пользователь пытается просмотреть чужие данные | Ошибка доступа | ✅/❌ | |

## Удобство использования (юзабилити)

| № | Тест-кейс | Ожидаемый результат | Статус | Примечания |
|---|-----------|---------------------|--------|------------|
| 21 | Отображение на ПК (разрешение >1200px) | Корректное отображение | ✅/❌ | |
| 22 | Отображение на планшете (768px-1024px) | Адаптивный дизайн | ✅/❌ | |
| 23 | Отображение на смартфоне (<768px) | Адаптивный дизайн | ✅/❌ | |
| 24 | Навигация по интерфейсу | Интуитивно понятная навигация | ✅/❌ | |
| 25 | Загрузка изображений аватаров | Корректная загрузка и отображение | ✅/❌ | |
| 26 | Применение CSS-стилей | Все элементы стилизованы | ✅/❌ | |

## Надежность

| № | Тест-кейс | Ожидаемый результат | Статус | Примечания |
|---|-----------|---------------------|--------|------------|
| 27 | Переход на несуществующую страницу | Кастомная страница 404 | ✅/❌ | |
| 28 | Ввод SQL-инъекции в поиск | Безопасная обработка | ✅/❌ | |
| 29 | Ввод XSS-кода в поля формы | Экранирование HTML | ✅/❌ | |
| 30 | Повторная отправка формы | Корректная обработка | ✅/❌ | |

## Производительность

| № | Тест-кейс | Ожидаемый результат | Статус | Примечания |
|---|-----------|---------------------|--------|------------|
| 31 | Загрузка главной страницы | <2 секунд | ✅/❌ | |
| 32 | Загрузка таблицы лидеров | <2 секунд | ✅/❌ | |
| 33 | Загрузка списка друзей | <2 секунд | ✅/❌ | |
| 34 | Оптимизация запросов (N+1) | Нет избыточных запросов к БД | ✅/❌ | |

## Безопасность

| № | Тест-кейс | Ожидаемый результат | Статус | Примечания |
|---|-----------|---------------------|--------|------------|
| 35 | Проверка DEBUG режима | DEBUG=False в production | ✅/❌ | |
| 36 | Хранение паролей в БД | Пароли хешированы | ✅/❌ | |
| 37 | Защита от CSRF-атак | Наличие CSRF-токенов | ✅/❌ | |
| 38 | HTTPS соединение | Использование безопасного протокола | ✅/❌ | |

## Результаты тестирования

### Статистика:
- Всего тест-кейсов: 38
- Пройдено успешно: [число]
- Не пройдено: [число]
- Процент успешных: [процент]%

### Критические проблемы:
1. [Описание проблемы 1]
2. [Описание проблемы 2]

### Незначительные проблемы:
1. [Описание проблемы 1]
2. [Описание проблемы 2]

### Рекомендации:
1. [Рекомендация 1]
2. [Рекомендация 2]