# { "Depends": "py-genlayer:test" }
from genlayer import *
from dataclasses import dataclass
import json

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
        pass  # GenLayer auto-initializes all storage fields to their default values
    
    @gl.public.write
    def validate_content(self, content: str, min_words: int):
        words = content.split()
        word_count = len(words)
        
        if word_count < min_words:
            raise Exception(f"Content must have at least {min_words} words. Current: {word_count}")
        
        # Use custom run_nondet pattern for structured JSON data
        prompt = f"""You are a professional content validator. Analyze this content and provide a score from 0-100 based on:
- Grammar & Spelling (0-40 points): Check for errors, proper punctuation, and language quality
- Readability & Clarity (0-30 points): Evaluate flow, structure, and ease of understanding
- Originality & Value (0-30 points): Assess uniqueness and usefulness of information

Content to validate:
{content}

You MUST respond in this EXACT JSON format with NO additional text or markdown:
{{"score": 85, "passed": true, "feedback": "Clear explanation of the score"}}

The score must be 0-100, passed must be true if score >= 70, and feedback must explain the score."""
        
        def leader_fn():
            response = gl.nondet.exec_prompt(prompt)
            # Clean any markdown formatting
            cleaned = response.replace("```json", "").replace("```", "").strip()
            # Parse and return as dict
            return json.loads(cleaned)
        
        def validator_fn(leader_res: gl.vm.Result) -> bool:
            # Check if leader got an error
            if not isinstance(leader_res, gl.vm.Return):
                return False
            
            leader_data = leader_res.calldata
            
            # Validate structure
            if not isinstance(leader_data, dict):
                return False
            if "score" not in leader_data or "passed" not in leader_data or "feedback" not in leader_data:
                return False
            
            # Validate score is reasonable
            score = leader_data["score"]
            if not isinstance(score, (int, float)) or score < 0 or score > 100:
                return False
            
            # Validate passed field matches score
            passed = leader_data["passed"]
            expected_passed = score >= 70
            if passed != expected_passed:
                return False
            
            # Validate feedback exists
            feedback = leader_data["feedback"]
            if not isinstance(feedback, str) or len(feedback) < 10:
                return False
            
            return True
        
        # Get analysis result as dict
        analysis = gl.vm.run_nondet(leader_fn, validator_fn)
        
        # Extract values from dict
        score_value = analysis.get("score", 50)
        passed_value = analysis.get("passed", False)
        feedback_value = analysis.get("feedback", "Content analyzed successfully.")
        
        # Ensure score is within bounds
        if score_value > 100:
            score_value = 100
        if score_value < 0:
            score_value = 0
        
        # Increment validation count
        self.validation_count = u64(int(self.validation_count) + 1)
        validation_id = f"val_{self.validation_count}"
        
        content_preview = content[:100] if len(content) > 100 else content
        
        timestamp = self.validation_count
        
        sender_str = str(gl.message.sender_address)
        
        # Create validation result
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
        
        # Store in validations map
        self.validations[validation_id] = result
        
        # Update user validations
        if sender_str in self.user_validations:
            user_vals = self.user_validations[sender_str]
            user_vals.append(validation_id)
            self.user_validations[sender_str] = user_vals
        else:
            # Use regular Python list - GenLayer converts it to DynArray automatically
            self.user_validations[sender_str] = [validation_id]
    
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