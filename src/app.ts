enum ProjectStatus {
  Active,
  Finished
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener = (items: Project[]) => void

class ProjectState {
  private listeners: Listener[] = []
  private projects: Project[] = []
  private static state: ProjectState

  constructor() {}

  static getState() {
    if (this.state) {
      return this.state
    }
    this.state = new ProjectState()
    return this.state
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn)
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active)

    this.projects.push(newProject)
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects])
    }
  }
}

const projectState = ProjectState.getState()

interface Validatable {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

function validateInput(validatableInput: Validatable): boolean {
  let isValid = true

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max
  }

  return isValid
}

class ProjectList {
  private readonly templateElement: HTMLTemplateElement
  private readonly hostElement: HTMLDivElement
  private readonly listElement: HTMLElement
  private assignedProjects: Project[]

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.querySelector<HTMLTemplateElement>('#project-list')!
    this.hostElement = document.querySelector<HTMLDivElement>('#app')!
    this.assignedProjects = []

    const importedNode = document.importNode(this.templateElement.content, true)
    this.listElement = importedNode.firstElementChild as HTMLElement
    this.listElement.id = `${this.type}-projects`

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active
        }

        return project.status === ProjectStatus.Finished
      })
      this.assignedProjects = relevantProjects
      this.renderProjects()
    })
    this.attachList()
    this.renderContent()
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement('li')
      listItem.textContent = projectItem.title
      listEl.appendChild(listItem)
    }
  }

  private renderContent() {
    const listId = `${this.type}-project-list`
    this.listElement.querySelector('ul')!.id = listId
    this.listElement.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
  }

  private attachList() {
    this.hostElement.insertAdjacentElement('beforeend', this.listElement)
  }
}

class ProjectInput {
  private readonly templateElement: HTMLTemplateElement
  private readonly hostElement: HTMLDivElement
  private readonly formElement: HTMLFormElement
  public readonly titleInputElement: HTMLInputElement
  public readonly descriptionElement: HTMLTextAreaElement
  public readonly peopleInputElement: HTMLInputElement

  constructor() {
    this.templateElement = document.querySelector<HTMLTemplateElement>('#project-input')!
    this.hostElement = document.querySelector<HTMLDivElement>('#app')!
    const importedNode = document.importNode(this.templateElement.content, true)
    this.formElement = importedNode.firstElementChild as HTMLFormElement
    this.formElement.id = 'user-input'
    this.titleInputElement = this.getElement<HTMLInputElement>('#title')
    this.descriptionElement = this.getElement<HTMLTextAreaElement>('#description')
    this.peopleInputElement = this.getElement<HTMLInputElement>('#people')
    this.configureForm()
    this.attachForm()
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    return this.formElement.querySelector<T>(selector)!
  }

  private getUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionElement.value
    const enteredPeople = +this.peopleInputElement.value

    const titleValidateable: Validatable = {
      value: enteredTitle,
      required: true
    }
    const descriptionValidateable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }
    const peopleValidateable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1
    }

    if (
      !validateInput(titleValidateable) ||
      !validateInput(descriptionValidateable) ||
      !validateInput(peopleValidateable)
    ) {
      alert('Invalid input, please try again!')
      return
    } else {
      return [enteredTitle, enteredDescription, enteredPeople]
    }
  }

  private clearForm() {
    this.titleInputElement.value = ''
    this.descriptionElement.value = ''
    this.peopleInputElement.value = ''
  }

  private handleSubmit(event: Event) {
    event.preventDefault()
    const userInput = this.getUserInput()

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput
      projectState.addProject(title, description, people)
      this.clearForm()
    }
  }

  private configureForm() {
    this.formElement.addEventListener('submit', (e: Event) => this.handleSubmit(e))
  }

  private attachForm() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement)
  }
}

const projectInput = new ProjectInput()
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')
