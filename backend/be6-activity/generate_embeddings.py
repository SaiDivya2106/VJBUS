import json
import numpy as np
from sentence_transformers import SentenceTransformer
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_embeddings():
    """Generate embeddings for all activities in career_goals.json and update the file."""
    try:
        # Load the model
        logger.info("Loading SentenceTransformer model...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Load the career goals JSON
        logger.info("Loading career goals data...")
        with open('career_goals.json', 'r') as f:
            career_goals = json.load(f)
        
        # Iterate through career paths and activities
        for career_path, data in career_goals.get('career_goals', {}).items():
            logger.info(f"Processing career path: {career_path}")
            
            # Generate embedding for career path
            career_text = f"{data['title']} {data['description']} {' '.join(data['required_skills'])}"
            career_embedding = model.encode(career_text).tolist()
            
            # Add embedding to career path data
            data['embedding'] = career_embedding
            
            # Process activities
            for activity in data['activities']:
                # Combine title, description, and skills for rich embedding
                skills_text = ' '.join(activity.get('skills', []))
                activity_text = f"{activity['title']} {activity['description']} {skills_text}"
                
                # Generate embedding
                activity_embedding = model.encode(activity_text).tolist()
                
                # Add embedding to activity
                activity['embedding'] = activity_embedding
        
        # Save the updated JSON with embeddings
        logger.info("Saving updated career goals with embeddings...")
        with open('career_goals_with_embeddings.json', 'w') as f:
            json.dump(career_goals, f, indent=4)
        
        # Backup original file and replace it
        logger.info("Creating backup and updating original file...")
        os.rename('career_goals.json', 'career_goals_backup.json')
        os.rename('career_goals_with_embeddings.json', 'career_goals.json')
        
        logger.info("Successfully added embeddings to career goals JSON.")
        
    except Exception as e:
        logger.error(f"Error generating embeddings: {str(e)}")
        raise

if __name__ == "__main__":
    generate_embeddings() 