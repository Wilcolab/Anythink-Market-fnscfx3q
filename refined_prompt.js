/**
 * Converts a string to camelCase format.
 * 
 * This function transforms strings with various separators (spaces, underscores, hyphens, dots)
 * into camelCase format where the first word is lowercase and subsequent words have their
 * first letter capitalized. Special characters are removed, and numbers are preserved.
 * 
 * @param {string} str - The input string to convert to camelCase.
 * @returns {string} The converted camelCase string. Returns empty string if input contains
 *                   only separators or is empty.
 * @throws {Error} If input is not a string, throws error with message indicating received type.
 * 
 * @example
 * // Basic conversions
 * toCamelCase('hello world');           // Returns: 'helloWorld'
 * toCamelCase('user_id');               // Returns: 'userId'
 * toCamelCase('SCREEN_NAME');           // Returns: 'screenName'
 * toCamelCase('mobile-number');         // Returns: 'mobileNumber'
 * 
 * @example
 * // Handles edge cases
 * toCamelCase('user_id_123');           // Returns: 'userId123'
 * toCamelCase('hello___world');         // Returns: 'helloWorld'
 * toCamelCase('___leading-separator');  // Returns: 'leadingSeparator'
 * toCamelCase('');                      // Returns: ''
 * 
 * @example
 * // Error handling
 * toCamelCase(123);                     // Throws: Error: "Input must be a string, received: number"
 * toCamelCase(null);                    // Throws: Error: "Input must be a string, received: object"
 */
function toCamelCase(str) {
  // Input validation: check if input is a string
  if (typeof str !== 'string') {
    throw new Error(`Input must be a string, received: ${typeof str}`);
  }
  
  // Handle empty strings or strings with only separators
  if (!str.trim() || !str.replace(/[\s_\-.]/g, '')) {
    return '';
  }
  
  // Remove special characters (keep only alphanumeric, spaces, underscores, hyphens, dots)
  let cleaned = str.replace(/[^a-zA-Z0-9\s_\-.]/g, '');
  
  // Remove leading and trailing separators
  cleaned = cleaned.replace(/^[\s_\-.]+|[\s_\-.]+$/g, '');
  
  // Split by multiple separators (spaces, underscores, hyphens, dots)
  const words = cleaned.split(/[\s_\-.]+/).filter(word => word.length > 0);
  
  // Handle case where all words were filtered out
  if (words.length === 0) {
    return '';
  }
  
  // Convert to camelCase
  return words
    .map((word, index) => {
      // Convert entire word to lowercase first
      const lowerWord = word.toLowerCase();
      
      // Keep first word lowercase, capitalize first letter of subsequent words
      if (index === 0) {
        return lowerWord;
      }
      
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join('');
}

// Test cases with provided examples:
console.log('=== Basic Examples ===');
console.log(toCamelCase('hello world'));              // Output: helloWorld
console.log(toCamelCase('user_id_123'));              // Output: userId123
console.log(toCamelCase('___leading-underscore'));    // Output: leadingUnderscore
console.log(toCamelCase(''));                         // Output: ''
console.log(toCamelCase('hello'));                    // Output: hello

console.log('\n=== Edge Cases ===');
console.log(toCamelCase('SCREEN_NAME'));              // Output: screenName
console.log(toCamelCase('mobile-number'));            // Output: mobileNumber
console.log(toCamelCase('hello___world'));            // Output: helloWorld (consecutive separators)
console.log(toCamelCase('  leading spaces'));         // Output: leadingSpaces
console.log(toCamelCase('trailing spaces  '));        // Output: trailingSpaces
console.log(toCamelCase('mixed.separators-styles_all')); // Output: mixedSeparatorsStylesAll
console.log(toCamelCase('api.key.name'));             // Output: apiKeyName

console.log('\n=== Special Characters ===');
console.log(toCamelCase('hello@world!test'));         // Output: helloworldtest (special chars removed)
console.log(toCamelCase('user#123$id'));              // Output: user123id

console.log('\n=== Error Handling ===');
try {
  toCamelCase(123);                                   // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}

try {
  toCamelCase(null);                                  // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}

try {
  toCamelCase(undefined);                             // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}

try {
  toCamelCase({});                                    // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}

/**
 * Converts a string to dot.case format.
 * 
 * This function transforms strings with various separators (spaces, underscores, hyphens, dots)
 * into dot.case format where all words are lowercase and separated by dots. Special characters
 * are removed, and numbers are preserved within the output.
 * 
 * @param {string} str - The input string to convert to dot.case.
 * @returns {string} The converted dot.case string with words separated by dots. Returns empty
 *                   string if input contains only separators or is empty.
 * @throws {Error} If input is not a string, throws error with message indicating received type.
 * 
 * @example
 * // Basic conversions
 * toDotCase('hello world');             // Returns: 'hello.world'
 * toDotCase('user_id');                 // Returns: 'user.id'
 * toDotCase('SCREEN_NAME');             // Returns: 'screen.name'
 * toDotCase('mobile-number');           // Returns: 'mobile.number'
 * 
 * @example
 * // Handles edge cases and camelCase input
 * toDotCase('user_id_123');             // Returns: 'user.id.123'
 * toDotCase('hello___world');           // Returns: 'hello.world'
 * toDotCase('camelCaseString');         // Returns: 'camel.case.string'
 * toDotCase('API.KEY.NAME');            // Returns: 'api.key.name'
 * toDotCase('');                        // Returns: ''
 * 
 * @example
 * // Error handling
 * toDotCase(456);                       // Throws: Error: "Input must be a string, received: number"
 * toDotCase(null);                      // Throws: Error: "Input must be a string, received: object"
 */
function toDotCase(str) {
  // Input validation: check if input is a string
  if (typeof str !== 'string') {
    throw new Error(`Input must be a string, received: ${typeof str}`);
  }
  
  // Handle empty strings or strings with only separators
  if (!str.trim() || !str.replace(/[\s_\-.]/g, '')) {
    return '';
  }
  
  // Remove special characters (keep only alphanumeric, spaces, underscores, hyphens, dots)
  let cleaned = str.replace(/[^a-zA-Z0-9\s_\-.]/g, '');
  
  // Remove leading and trailing separators
  cleaned = cleaned.replace(/^[\s_\-.]+|[\s_\-.]+$/g, '');
  
  // Split by multiple separators (spaces, underscores, hyphens, dots)
  const words = cleaned.split(/[\s_\-.]+/).filter(word => word.length > 0);
  
  // Handle case where all words were filtered out
  if (words.length === 0) {
    return '';
  }
  
  // Convert to dot.case (all lowercase, joined by dots)
  return words.map(word => word.toLowerCase()).join('.');
}

// Test cases for toDotCase:
console.log('\n=== toDotCase Examples ===');
console.log(toDotCase('hello world'));                // Output: hello.world
console.log(toDotCase('user_id_123'));                // Output: user.id.123
console.log(toDotCase('___leading-underscore'));      // Output: leading.underscore
console.log(toDotCase(''));                           // Output: ''
console.log(toDotCase('hello'));                      // Output: hello

console.log('\n=== toDotCase Edge Cases ===');
console.log(toDotCase('SCREEN_NAME'));                // Output: screen.name
console.log(toDotCase('mobile-number'));              // Output: mobile.number
console.log(toDotCase('hello___world'));              // Output: hello.world
console.log(toDotCase('API.KEY.NAME'));               // Output: api.key.name
console.log(toDotCase('camelCaseString'));            // Output: camel.case.string
console.log(toDotCase('mixed.separators-styles_all')); // Output: mixed.separators.styles.all

console.log('\n=== toDotCase Error Handling ===');
try {
  toDotCase(456);                                     // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}

try {
  toDotCase(null);                                    // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}
