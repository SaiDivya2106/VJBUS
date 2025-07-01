import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os
from typing import List, Dict, Any, Tuple
import logging
import google.generativeai as genai

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CareerAnalyzer:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.career_goals = self._load_career_goals()
        # No need to generate embeddings, they're already in the JSON
        self.career_path_embeddings = self._extract_career_path_embeddings()
        self.activity_embeddings = self._extract_activity_embeddings()
        
    def _load_career_goals(self) -> Dict[str, Any]:
        """Load career goals from JSON file"""
        try:
            with open('career_goals.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading career goals: {str(e)}")
            return {}
    
    def _extract_career_path_embeddings(self) -> Dict[str, np.ndarray]:
        """Extract pre-computed career path embeddings from JSON"""
        embeddings = {}
        for career_path, data in self.career_goals.get('career_goals', {}).items():
            if 'embedding' in data:
                embeddings[career_path] = np.array(data['embedding'])
            else:
                # Fall back to generating embeddings if not found in JSON
                logger.warning(f"No pre-computed embedding found for career path {career_path}, generating on the fly")
                career_text = f"{data['title']} {data['description']} {' '.join(data['required_skills'])}"
                embeddings[career_path] = self.model.encode(career_text)
        return embeddings
    
    def _extract_activity_embeddings(self) -> Dict[str, Tuple[str, np.ndarray]]:
        """Extract pre-computed activity embeddings from JSON"""
        embeddings = {}
        for career_path, data in self.career_goals.get('career_goals', {}).items():
            for activity in data['activities']:
                if 'embedding' in activity:
                    # Store as tuple of (career_path, embedding)
                    key = f"{career_path}_{activity['title']}"
                    embeddings[key] = (career_path, np.array(activity['embedding']))
                else:
                    # Fall back to generating embeddings if not found in JSON
                    logger.warning(f"No pre-computed embedding found for activity {activity['title']}, generating on the fly")
                    skills_text = ' '.join(activity.get('skills', []))
                    activity_text = f"{activity['title']} {activity['description']} {skills_text}"
                    key = f"{career_path}_{activity['title']}"
                    embeddings[key] = (career_path, self.model.encode(activity_text))
        return embeddings
        
    def generate_activity_embedding(self, title: str, description: str, skills: List[str] = None) -> np.ndarray:
        """Generate embedding for a single activity"""
        skills_text = ' '.join(skills) if skills else ''
        text = f"{title} {description} {skills_text}"
        return self.model.encode(text)
        
    def find_similar_activities(self, user_embedding: np.ndarray, threshold: float = 0.7) -> List[Dict[str, Any]]:
        """Find similar activities from career goals based on embedding similarity"""
        similar_activities = []
        
        for key, (career_path, embedding) in self.activity_embeddings.items():
            similarity = cosine_similarity([user_embedding], [embedding])[0][0]
            if similarity >= threshold:
                activity_title = key.split('_', 1)[1]
                similar_activities.append({
                    'career_path': career_path,
                    'activity_title': activity_title,
                    'similarity': float(similarity)
                })
                    
        return sorted(similar_activities, key=lambda x: x['similarity'], reverse=True)
    
    def find_career_match(self, user_activities: List[Dict[str, Any]], threshold: float = 0.5) -> List[Dict[str, Any]]:
        """Find career paths that match the user's activities"""
        if not user_activities:
            return []
            
        # Generate embeddings for user activities
        user_embeddings = []
        for activity in user_activities:
            skills = activity.get('skills', [])
            user_embeddings.append(self.generate_activity_embedding(
                activity['title'], 
                activity['description'],
                skills
            ))
            
        # Average user embeddings to get a single user profile embedding
        if user_embeddings:
            user_profile_embedding = np.mean(user_embeddings, axis=0)
            
            # Compare with career path embeddings
            matches = []
            for career_path, embedding in self.career_path_embeddings.items():
                similarity = cosine_similarity([user_profile_embedding], [embedding])[0][0]
                if similarity >= threshold:
                    career_data = self.career_goals['career_goals'][career_path]
                    matches.append({
                        'career_path': career_path,
                        'title': career_data['title'],
                        'similarity': float(similarity)
                    })
                    
            return sorted(matches, key=lambda x: x['similarity'], reverse=True)
        return []
        
    def analyze_career_gaps(self, user_activities: List[Dict[str, Any]], target_career: str) -> Dict[str, Any]:
        """Analyze gaps between user's activities and target career requirements"""
        if target_career not in self.career_goals.get('career_goals', {}):
            return {'error': f'Career path {target_career} not found'}
            
        target_data = self.career_goals['career_goals'][target_career]
        required_skills = set(target_data['required_skills'])
        
        # Get user's skills from activities
        user_skills = set()
        for activity in user_activities:
            if 'skills' in activity:
                user_skills.update(activity['skills'])
                
        # Find missing skills
        missing_skills = required_skills - user_skills
        
        # Find missing activities using semantic similarity
        target_activities = target_data['activities']
        
        # Generate embeddings for user activities if not already done
        user_activity_embeddings = []
        for activity in user_activities:
            embedding = self.generate_activity_embedding(
                activity['title'], 
                activity.get('description', ''),
                activity.get('skills', [])
            )
            user_activity_embeddings.append((activity['title'], embedding))
        
        # Compare each target activity with all user activities
        # If similarity is below threshold, consider it missing
        missing_activities = []
        for target_activity in target_activities:
            # Get pre-computed embedding for target activity
            target_key = f"{target_career}_{target_activity['title']}"
            if target_key not in self.activity_embeddings:
                logger.warning(f"No embedding found for target activity: {target_key}")
                continue
                
            _, target_embedding = self.activity_embeddings[target_key]
            
            # Check if any user activity is similar enough
            max_similarity = 0
            for _, user_embedding in user_activity_embeddings:
                similarity = cosine_similarity([target_embedding], [user_embedding])[0][0]
                max_similarity = max(max_similarity, similarity)
                
            # If max similarity is below threshold, consider it missing
            if max_similarity < 0.7:  # Threshold for considering an activity similar
                missing_activities.append(target_activity)
        
        # Calculate progress percentages
        skill_progress = (len(required_skills) - len(missing_skills)) / len(required_skills) if required_skills else 1.0
        activity_progress = (len(target_activities) - len(missing_activities)) / len(target_activities) if target_activities else 1.0
        
        return {
            'missing_skills': list(missing_skills),
            'missing_activities': missing_activities,
            'progress': {
                'skills': skill_progress,
                'activities': activity_progress,
                'overall': (skill_progress + activity_progress) / 2
            }
        }
        
    def generate_roadmap(self, user_activities: List[Dict[str, Any]], target_career: str) -> Dict[str, Any]:
        """Generate a personalized roadmap using Gemini"""
        try:
            # Get gap analysis
            gap_analysis = self.analyze_career_gaps(user_activities, target_career)
            
            # Check if Gemini API key is available
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                logger.warning("No Gemini API key found, returning gap analysis only")
                return {
                    'gap_analysis': gap_analysis,
                    'recommendations': {
                        'next_steps': [f"Learn {skill}" for skill in gap_analysis['missing_skills'][:3]],
                        'project_ideas': [activity['title'] for activity in gap_analysis['missing_activities'][:2]],
                        'learning_resources': [],
                        'timeline': {
                            'short_term': 'Focus on fundamental skills',
                            'medium_term': 'Complete missing activities',
                            'long_term': 'Build portfolio projects'
                        }
                    }
                }
                
            # Configure Gemini
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-pro')
            
            # Prepare context for Gemini
            target_data = self.career_goals['career_goals'][target_career]
            
            # Format user activities for the prompt
            user_activities_text = ""
            for i, activity in enumerate(user_activities[:5], 1):  # Limit to 5 for prompt length
                skills_text = ", ".join(activity.get('skills', []))
                user_activities_text += f"{i}. {activity['title']}: {activity.get('description', '')} (Skills: {skills_text})\n"
            
            # Format missing activities
            missing_activities_text = ""
            for i, activity in enumerate(gap_analysis['missing_activities'][:3], 1):  # Limit to 3
                skills_text = ", ".join(activity.get('skills', []))
                missing_activities_text += f"{i}. {activity['title']}: {activity['description']} (Skills: {skills_text})\n"
            
            # Create prompt for Gemini
            prompt = f"""
            Create a personalized career roadmap for becoming a {target_data['title']}.
            
            About the career:
            {target_data['description']}
            
            Current Progress:
            - Skills mastered: {len(set(target_data['required_skills']) - set(gap_analysis['missing_skills']))} out of {len(target_data['required_skills'])}
            - Missing Skills: {', '.join(gap_analysis['missing_skills'])}
            - Completed Activities: {len(user_activities)}
            - Missing Key Activities: {len(gap_analysis['missing_activities'])}
            
            User's current activities:
            {user_activities_text}
            
            Key missing activities:
            {missing_activities_text}
            
            Based on the user's current activities and the gaps identified, provide a JSON response with:
            1. A prioritized list of next steps
            2. Specific project ideas to develop missing skills
            3. Recommended learning resources (courses, books, websites)
            4. Timeline estimates for each step
            
            Your response should be in JSON format ONLY with the following structure:
            {{
                "next_steps": ["Step 1", "Step 2", "Step 3"],
                "project_ideas": [
                    {{
                        "title": "Project Title",
                        "description": "Brief description",
                        "skills_gained": ["Skill 1", "Skill 2"]
                    }}
                ],
                "learning_resources": [
                    {{
                        "type": "course/book/website",
                        "title": "Resource Title",
                        "link": "URL if applicable",
                        "description": "Brief description"
                    }}
                ],
                "timeline": {{
                    "short_term": "What to focus on in 1-3 months",
                    "medium_term": "What to focus on in 3-6 months",
                    "long_term": "What to focus on in 6-12 months"
                }}
            }}
            
            Make the recommendations specific, actionable, and tailored to the user's current skills and activities.
            """
            
            # Generate recommendation
            response = model.generate_content(prompt)
            
            # Parse JSON from response
            try:
                # Extract JSON part
                response_text = response.text
                import re
                json_match = re.search(r'({[\s\S]*})', response_text)
                
                if json_match:
                    recommendations = json.loads(json_match.group(1))
                else:
                    # Try parsing the whole text as JSON
                    recommendations = json.loads(response_text)
                    
                # Combine with gap analysis
                return {
                    'gap_analysis': gap_analysis,
                    'recommendations': recommendations
                }
                
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing Gemini response: {str(e)}")
                logger.info(f"Response text: {response.text}")
                
                # Return fallback recommendations
                return {
                    'gap_analysis': gap_analysis,
                    'recommendations': {
                        'next_steps': [f"Learn {skill}" for skill in gap_analysis['missing_skills'][:3]],
                        'project_ideas': [{"title": activity['title'], "description": activity['description']} 
                                        for activity in gap_analysis['missing_activities'][:2]],
                        'learning_resources': [],
                        'timeline': {
                            'short_term': 'Focus on fundamental skills',
                            'medium_term': 'Complete missing activities',
                            'long_term': 'Build portfolio projects'
                        }
                    },
                    'error': 'Error parsing Gemini response'
                }
            
        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            return {'error': str(e)} 