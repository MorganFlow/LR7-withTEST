# Dockerfile
FROM python:3.10-slim

# Установка зависимостей
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Для Pillow (images)
RUN apt-get update && apt-get install -y libjpeg-dev zlib1g-dev && rm -rf /var/lib/apt/lists/*

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]