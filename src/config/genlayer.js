// GenLayer Configuration
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x9552e2C4Bd68dD44B6193519425d0610301cE735';

// Contract method names
export const CONTRACT_METHODS = {
  VALIDATE_CONTENT: 'validate_content',
  GET_VALIDATION: 'get_validation',
  GET_USER_VALIDATIONS: 'get_user_validations',
  GET_VALIDATION_COUNT: 'get_validation_count',
  GET_LATEST_VALIDATION_ID: 'get_latest_validation_id',
};

// Validation configuration
export const VALIDATION_CONFIG = {
  MIN_WORDS_DEFAULT: 50,
  MAX_CHARS: 2000,
  PASSING_SCORE: 70,
};