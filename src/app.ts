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

type Listener<T> = (items: T[]) => void

class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = []
  private static state: ProjectState

  private constructor() {
    super()
  }

  static getState() {
    if (this.state) {
      return this.state
    }
    this.state = new ProjectState()
    return this.state
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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  private readonly templateElement: HTMLTemplateElement
  private readonly hostElement: T
  readonly element: U

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement
    this.hostElement = document.getElementById(hostElementId)! as T

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as U
    if (newElementId) {
      this.element.id = newElementId
    }

    this.attach(insertAtStart)
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element)
  }

  abstract configure(): void

  abstract renderContent(): void
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id)
    this.project = project

    this.configure()
    this.renderContent()
  }

  configure() {}

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = this.project.people.toString()
    this.element.querySelector('p')!.textContent = this.project.description
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  private assignedProjects: Project[]

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)
    this.assignedProjects = []

    this.configure()
    this.renderContent()
  }

  configure() {
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
  }

  renderContent() {
    const listId = `${this.type}-project-list`
    this.element.querySelector('ul')!.id = listId
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement
    listEl.innerHTML = ''
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  public titleInputElement: HTMLInputElement
  public descriptionElement: HTMLTextAreaElement
  public peopleInputElement: HTMLInputElement

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.titleInputElement = this.getElement('#title') as HTMLInputElement
    this.descriptionElement = this.getElement('#description') as HTMLTextAreaElement
    this.peopleInputElement = this.getElement('#people') as HTMLInputElement

    this.configure()
  }

  configure() {
    this.element.addEventListener('submit', (e: Event) => this.handleSubmit(e))
  }

  renderContent() {}

  private getElement<T extends HTMLElement>(selector: string): T {
    return this.element.querySelector<T>(selector)!
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
}

const projectInput = new ProjectInput()
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')
