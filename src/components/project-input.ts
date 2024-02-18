import { Component } from './base-component'
import { Validatable, validateInput } from '../util/validation'
import { projectState } from '../state/project-state'

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
