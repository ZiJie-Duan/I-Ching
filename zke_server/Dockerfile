FROM python:3.8

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --upgrade pip && \
    pip install -r ./requirements.txt

COPY src/ /app/

EXPOSE 5000

ENTRYPOINT ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "5000"]