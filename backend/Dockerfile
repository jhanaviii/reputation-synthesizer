
FROM python:3.10-slim

WORKDIR /app

# Install required system dependencies for certain Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories if they don't exist
RUN mkdir -p data/models

# Download NLTK data
RUN python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('punkt'); nltk.download('stopwords')"

# Expose port for the API
EXPOSE 5000

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV USE_PRETRAINED_MODEL=false

# Command to run the application
CMD ["python", "app.py"]
