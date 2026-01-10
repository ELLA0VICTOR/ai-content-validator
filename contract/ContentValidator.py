# { "Depends": "py-genlayer:test" }
from genlayer import *
from dataclasses import dataclass

@allow_storage
@dataclass
class ValidationResult:
    validation_id: str
    content_hash: str
    author: str
    score: u64
    passed: bool
    feedback: str
    timestamp: u64
    word_count: u64

class ContentValidator(gl.Contract):
    validations: TreeMap[str, ValidationResult]
    user_validations: TreeMap[str, DynArray[str]]
    validation_count: u64
    
    def __init__(self):
        self.validation_count = u64(0)
    
    @gl.public.write
    def validate_content(self, content: str, min_words: int):
        words = content.split()
        word_count = len(words)
        
        if word_count < min_words:
            raise Exception(f"Content must have at least {min_words} words. Current: {word_count}")
        
        prompt = f"""You are a professional content validator. Analyze this content and provide a score from 0-100 based on:
- Grammar & Spelling (0-40 points): Check for errors, proper punctuation, and language quality
- Readability & Clarity (0-30 points): Evaluate flow, structure, and ease of understanding
- Originality & Value (0-30 points): Assess uniqueness and usefulness of information

Content to validate:
{content}

You MUST respond in this EXACT format with no additional text:
SCORE: [number between 0-100]
PASSED: [YES if score >= 70, NO if score < 70]
FEEDBACK: [one clear sentence explaining the score]"""
        
        def analyze_content():
            ai_response = gl.nondet.exec_prompt(prompt)  # ← FIXED: Added .nondet
            
            score_line = ""
            passed_line = ""
            feedback_line = ""
            
            for line in ai_response.split('\n'):
                line = line.strip()
                if line.startswith('SCORE:'):
                    score_line = line.replace('SCORE:', '').strip()
                elif line.startswith('PASSED:'):
                    passed_line = line.replace('PASSED:', '').strip()
                elif line.startswith('FEEDBACK:'):
                    feedback_line = line.replace('FEEDBACK:', '').strip()
            
            try:
                score = int(score_line)
            except:
                score = 50
            
            if score > 100:
                score = 100
            
            passed = passed_line.upper() == 'YES' or score >= 70
            
            if not feedback_line:
                feedback_line = "Content analyzed successfully."
            
            return (score, passed, feedback_line)
        
        analysis = gl.eq_principle.strict_eq(analyze_content)  # ← FIXED: Added dot notation
        
        score_value = analysis[0]
        passed_value = analysis[1]
        feedback_value = analysis[2]
        
        self.validation_count = u64(int(self.validation_count) + 1)
        validation_id = f"val_{self.validation_count}"
        
        content_preview = content[:100] if len(content) > 100 else content
        
        timestamp = self.validation_count
        
        sender_str = str(gl.message.sender_address)
        
        result = ValidationResult(
            validation_id=validation_id,
            content_hash=content_preview,
            author=sender_str,
            score=u64(score_value),
            passed=passed_value,
            feedback=feedback_value,
            timestamp=timestamp,
            word_count=u64(word_count)
        )
        
        self.validations[validation_id] = result
        
        if sender_str in self.user_validations:
            user_vals = self.user_validations[sender_str]
            user_vals.append(validation_id)
            self.user_validations[sender_str] = user_vals
        else:
            new_array = DynArray[str]()
            new_array.append(validation_id)
            self.user_validations[sender_str] = new_array
    
    @gl.public.view
    def get_validation(self, validation_id: str) -> ValidationResult:
        if validation_id not in self.validations:
            raise Exception(f"Validation {validation_id} not found")
        return self.validations[validation_id]
    
    @gl.public.view
    def get_user_validations(self, user_address: str) -> DynArray[ValidationResult]:
        results = DynArray[ValidationResult]()
        
        if user_address not in self.user_validations:
            return results
        
        validation_ids = self.user_validations[user_address]
        
        for val_id in validation_ids:
            if val_id in self.validations:
                results.append(self.validations[val_id])
        
        return results
    
    @gl.public.view
    def get_validation_count(self) -> int:
        return int(self.validation_count)
    
    @gl.public.view
    def get_latest_validation_id(self) -> str:
        if self.validation_count == u64(0):
            return ""
        return f"val_{self.validation_count}"