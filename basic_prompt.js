/*
PROMPT: Write a function called toCamelCase that converts strings to camelCase format.

The function should:
1. Take a string as input
2. Handle strings with spaces, hyphens, and underscores as word separators
3. Remove the separators and capitalize the first letter of each word (except the first word)
4. Return the resulting camelCase string

Examples:
- toCamelCase('hello world')         => 'helloWorld'
- toCamelCase('hello-world-example') => 'helloWorldExample'
- toCamelCase('hello_world')         => 'helloWorld'
- toCamelCase('HelloWorld')          => 'helloWorld'

The function should handle multiple consecutive separators and ignore leading/trailing separators.
*/
