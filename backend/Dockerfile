FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project

COPY . .
RUN mkdir -p /app/data /app/media /app/staticfiles

EXPOSE 8000

CMD ["sh", "-c", "uv run python manage.py migrate --noinput && uv run python manage.py collectstatic --noinput && uv run gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
