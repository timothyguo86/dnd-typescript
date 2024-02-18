# dnd-typescript

A drag and drop component created with TypeScript.

## Installation

To use this project, follow these steps:

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

To use the project, ensure you have TypeScript set up in your environment. Then, follow these steps:

1. Import the necessary classes and functions into your TypeScript file:

   ```typescript
   import { ProjectInput } from './components/project-input'
   import { ProjectList } from './components/project-list'
   ```

2. Create instances of the `ProjectInput` and `ProjectList` classes:

   ```typescript
   new ProjectInput()
   new ProjectList('active')
   new ProjectList('finished')
   ```

3. Use the instances to handle user input and manage projects.

## Example

Here's a basic example of how you can use the project components:

```typescript
import { ProjectInput } from './components/project-input'
import { ProjectList } from './components/project-list'

// Initialize project input and project lists
new ProjectInput()
new ProjectList('active')
new ProjectList('finished')
```

## License

This project is licensed under the [MIT License](LICENSE).
