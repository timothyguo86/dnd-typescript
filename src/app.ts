import { ProjectInput } from './components/project-input'
import { ProjectList } from './components/project-list'

// Instantiates ProjectInput component
new ProjectInput()

// Instantiates ProjectList component for active projects
new ProjectList('active')

// Instantiates ProjectList component for finished projects
new ProjectList('finished')
