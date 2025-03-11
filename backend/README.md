
# AI Relationship Manager Backend

This is the Python backend for the AI Relationship Manager app. It provides ML-powered AI features for relationship management.

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Backend

Start the Flask development server:
```
python app.py
```

The server will start at http://localhost:5000

### Using Docker

You can also run the backend using Docker:

```
docker build -t ai-relationship-backend .
docker run -p 5000:5000 ai-relationship-backend
```

## API Endpoints

### Process Command
- **URL**: `/api/process-command`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "command": "Summarize my last meeting",
    "personId": "1"
  }
  ```
- **Response**: Enhanced AI response with sentiment analysis, entity recognition, and suggested actions

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Response**: Service health status

## ML Models

The backend uses several machine learning models for:

1. **Sentiment Analysis** - Analyzes the sentiment of text
2. **Entity Extraction** - Identifies entities in text (people, dates, etc.)
3. **Relationship Analysis** - Provides insights about professional relationships
4. **Task Management** - Extracts task information from natural language
5. **Follow-up Recommendations** - Suggests optimal follow-up timing
6. **Meeting Scheduling** - Recommends optimal meeting times
7. **Progress Analysis** - Analyzes project progress and provides recommendations

## Configuration

Set the `USE_PRETRAINED_MODEL` environment variable to `true` to use actual ML models instead of simulations:

```
export USE_PRETRAINED_MODEL=true
```

## Data

The backend generates and uses mock data for demonstration purposes. In a production environment, this would be replaced with real data from databases or APIs.
