/**
 * Represents the input component for adding projects.
 * Inherits from the base Component class.
 */
import { Component } from './base-component'
import { Validatable, validateInput } from '../util/validation'
import { projectState } from '../state/project-state'

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  public titleInputElement: HTMLInputElement
  public descriptionElement: HTMLTextAreaElement
  public peopleInputElement: HTMLInputElement

  constructor() {
    // Call the superclass constructor with necessary parameters
    super('project-input', 'app', true, 'user-input')

    // Initialize input elements
    this.titleInputElement = this.getElement('#title') as HTMLInputElement
    this.descriptionElement = this.getElement('#description') as HTMLTextAreaElement
    this.peopleInputElement = this.getElement('#people') as HTMLInputElement

    // Configure the component
    this.configure()
  }

  /**
   * Configures event listeners for the form submission.
   */
  configure() {
    this.element.addEventListener('submit', (e: Event) => this.handleSubmit(e))
  }

  /**
   * Placeholder method; does not render content for this component.
   */
  renderContent() {}

  private getElement<T extends HTMLElement>(selector: string): T {
    return this.element.querySelector<T>(selector)!
  }

  /**
   * Retrieves input values from the form.
   * @returns A tuple containing title, description, and number of people if input is valid; otherwise, void.
   */
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

  /**
   * Clears the form after submission.
   */
  private clearForm() {
    this.titleInputElement.value = ''
    this.descriptionElement.value = ''
    this.peopleInputElement.value = ''
  }

  /**
   * Handles form submission event.
   * Prevents default form submission, validates input, adds project if valid, and clears form.
   * @param {Event} event - The form submission event.
   */
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
