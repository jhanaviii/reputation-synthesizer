
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Download NLTK data
RUN python -c "import nltk; nltk.download('vader_lexicon')"

# Expose port for the API
EXPOSE 5000

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV USE_PRETRAINED_MODEL=false

# Command to run the application
CMD ["python", "app.py"]
