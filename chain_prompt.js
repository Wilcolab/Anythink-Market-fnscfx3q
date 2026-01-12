// ============================================================================
// KEBAB CASE CONVERSION - STEP-BY-STEP GUIDE
// ============================================================================

/**
 * STEP 1: Kebab Case Explanation
 * 
 * Kebab case is a naming convention used in programming and web development where:
 * - All words are written in lowercase letters
 * - Words are separated by hyphens (-)
 * - No spaces or underscores are used
 * 
 * The term "kebab case" comes from the visual appearance of the hyphen separators
 * looking like skewers on a kebab stick.
 * 
 * Common use cases:
 * - CSS class names: <div class="header-nav-bar">
 * - HTML attribute names: data-user-id
 * - URL slugs: /my-blog-post-title
 * - Command-line arguments: --enable-debug-mode
 * 
 * Examples of conversion:
 * - Input: "Kebab Case"         Output: "kebab-case"
 * - Input: "hello_world"        Output: "hello-world"
 * - Input: "HelloWorld"         Output: "hello-world"
 * - Input: "CONSTANT_VALUE"     Output: "constant-value"
 * - Input: "camelCaseExample"   Output: "camel-case-example"
 */

/**
 * STEP 2: Algorithm Outline
 * 
 * Algorithm to convert a string to kebab-case:
 * 
 * 1. Convert all characters to lowercase
 *    - Use toLowerCase() to standardize the string
 *    - Example: "HelloWorld" → "helloworld"
 * 
 * 2. Replace spaces and underscores with hyphens
 *    - Use regex to find spaces and underscores
 *    - Replace them with hyphen character
 *    - Example: "hello world" → "hello-world"
 *    - Example: "hello_world" → "hello-world"
 * 
 * 3. Handle camelCase by inserting hyphens before uppercase letters
 *    - Before converting to lowercase, insert hyphen before uppercase letters
 *    - Use regex pattern: /([a-z])([A-Z])/g
 *    - Replace with: '$1-$2'
 *    - Example: "camelCase" → "camel-Case" → "camel-case"
 * 
 * 4. Remove leading or trailing hyphens
 *    - Use regex to find hyphens at the start or end
 *    - Remove them to ensure clean output
 *    - Example: "-kebab-case-" → "kebab-case"
 * 
 * 5. Handle multiple consecutive hyphens
 *    - Replace multiple hyphens with single hyphen
 *    - Use regex pattern: /-+/g
 *    - Example: "hello--world" → "hello-world"
 */

/**
 * STEP 3: Implementation
 * 
 * Converts a string to kebab-case format.
 * 
 * @param {string} str - The input string to convert to kebab-case.
 * @returns {string} The converted kebab-case string.
 * @throws {Error} If input is not a string.
 */
function toKebabCase(str) {
  // Input validation
  if (typeof str !== 'string') {
    throw new Error(`Expected a string, but received: ${typeof str}`);
  }
  
  // Step 1: Insert hyphens before uppercase letters (handle camelCase)
  let result = str.replace(/([a-z])([A-Z])/g, '$1-$2');
  
  // Step 2: Convert all characters to lowercase
  result = result.toLowerCase();
  
  // Step 3: Replace spaces and underscores with hyphens
  result = result.replace(/[\s_]+/g, '-');
  
  // Step 4: Remove leading or trailing hyphens
  result = result.replace(/^-+|-+$/g, '');
  
  // Step 5: Replace multiple consecutive hyphens with a single hyphen
  result = result.replace(/-+/g, '-');
  
  return result;
}

// ============================================================================
// STEP 4: Example Calls with Expected Results
// ============================================================================

console.log('=== Basic Examples ===');
console.log(`toKebabCase("Example String") => "${toKebabCase('Example String')}"`);
// Expected: "example-string"

console.log(`toKebabCase("Kebab Case") => "${toKebabCase('Kebab Case')}"`);
// Expected: "kebab-case"

console.log(`toKebabCase("hello_world") => "${toKebabCase('hello_world')}"`);
// Expected: "hello-world"

console.log('\n=== CamelCase Examples ===');
console.log(`toKebabCase("camelCaseExample") => "${toKebabCase('camelCaseExample')}"`);
// Expected: "camel-case-example"

console.log(`toKebabCase("HelloWorld") => "${toKebabCase('HelloWorld')}"`);
// Expected: "hello-world"

console.log('\n=== Mixed Separator Examples ===');
console.log(`toKebabCase("hello_world_test") => "${toKebabCase('hello_world_test')}"`);
// Expected: "hello-world-test"

console.log(`toKebabCase("CONSTANT_VALUE") => "${toKebabCase('CONSTANT_VALUE')}"`);
// Expected: "constant-value"

console.log('\n=== Edge Cases ===');
console.log(`toKebabCase("a") => "${toKebabCase('a')}"`);
// Expected: "a"

console.log(`toKebabCase("already-kebab-case") => "${toKebabCase('already-kebab-case')}"`);
// Expected: "already-kebab-case"

console.log(`toKebabCase("multiple  spaces") => "${toKebabCase('multiple  spaces')}"`);
// Expected: "multiple-spaces"

console.log(`toKebabCase("  leading and trailing  ") => "${toKebabCase('  leading and trailing  ')}"`);
// Expected: "leading-and-trailing"

console.log('\n=== Error Handling ===');
try {
  toKebabCase(123);
} catch (error) {
  console.error(`toKebabCase(123) throws: ${error.message}`);
  // Expected: "Expected a string, but received: number"
}

try {
  toKebabCase(null);
} catch (error) {
  console.error(`toKebabCase(null) throws: ${error.message}`);
  // Expected: "Expected a string, but received: object"
}
