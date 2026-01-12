function toCamelCase(str) {
  // Split the string by spaces, underscores, and hyphens
  const words = str.split(/[\s_-]+/);
  
  // Convert to camelCase
  return words
    .map((word, index) => {
      // Convert to lowercase first
      const lowerWord = word.toLowerCase();
      
      // Capitalize first letter of each word except the first one
      if (index === 0) {
        return lowerWord;
      }
      
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join('');
}

// Test cases with the provided examples:
console.log(toCamelCase('first name'));      // Output: firstName
console.log(toCamelCase('user_id'));         // Output: userId
console.log(toCamelCase('SCREEN_NAME'));     // Output: screenName
console.log(toCamelCase('mobile-number'));   // Output: mobileNumber

// Additional test cases:
console.log(toCamelCase('hello world test')); // Output: helloWorldTest
console.log(toCamelCase('API_KEY_NAME'));     // Output: apiKeyName
console.log(toCamelCase('my-variable-name')); // Output: myVariableName

function addNumbers(a, b) {
  // Check for null or undefined
  if (a === null || a === undefined || b === null || b === undefined) {
    throw new Error(`Invalid input: null or undefined values are not allowed. Received: ${a}, ${b}`);
  }
  
  // Check if both inputs are numbers (not strings or other types)
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error(`Invalid input: both arguments must be numbers. Received: ${typeof a} and ${typeof b}`);
  }
  
  // Check for NaN values
  if (isNaN(a) || isNaN(b)) {
    throw new Error(`Invalid input: NaN values are not allowed. Received: ${a}, ${b}`);
  }
  
  // Return the sum
  return a + b;
}

// Test cases:
console.log(addNumbers(5, 3));        // Output: 8
console.log(addNumbers(10, -5));      // Output: 5
console.log(addNumbers(2.5, 3.7));    // Output: 6.2

// Error handling test cases:
try {
  addNumbers('5', 3);                 // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}

try {
  addNumbers(5, null);                // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}

try {
  addNumbers(undefined, 10);          // Should throw error
} catch (error) {
  console.error('Error:', error.message);
}
