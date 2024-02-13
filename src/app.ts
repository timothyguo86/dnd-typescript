/**
 * ProjectInput class manages the creation and behavior of a project input form.
 * It provides methods to fetch user input, validate it, and handle form submission.
 */
class ProjectInput {
  // Reference to the template element for the project input form
  private readonly templateElement: HTMLTemplateElement

  // Reference to the host element where the form will be inserted
  private readonly hostElement: HTMLDivElement

  // Reference to the form element itself
  private readonly formElement: HTMLFormElement

  // Reference to the input element for the project title
  public readonly titleInputElement: HTMLInputElement

  // Reference to the textarea element for the project description
  public readonly descriptionElement: HTMLTextAreaElement

  // Reference to the input element for the number of people assigned to the project
  public readonly peopleInputElement: HTMLInputElement

  /**
   * Constructor initializes the class by fetching necessary elements from the DOM,
   * cloning the template, and setting up event listeners.
   */
  constructor() {
    // Fetch the template element from the DOM
    this.templateElement = document.querySelector<HTMLTemplateElement>('#project-input')!

    // Fetch the host element where the form will be inserted
    this.hostElement = document.querySelector<HTMLDivElement>('#app')!

    // Clone the template content, assign it to the form element, and assign an ID to the form element
    const importedNode = document.importNode(this.templateElement.content, true)
    this.formElement = importedNode.firstElementChild as HTMLFormElement
    this.formElement.id = 'user-input'

    // Fetch references to input elements within the form
    this.titleInputElement = this.getElement<HTMLInputElement>('#title')
    this.descriptionElement = this.getElement<HTMLTextAreaElement>('#description')
    this.peopleInputElement = this.getElement<HTMLInputElement>('#people')

    // Configure and attach form element
    this.configureForm()
    this.attachForm()
  }

  /**
   * Helper method to fetch an element within the form.
   * @param selector The CSS selector to match the desired element.
   * @returns The matched element if found.
   */
  private getElement<T extends HTMLElement>(selector: string): T {
    return this.formElement.querySelector<T>(selector)!
  }

  /**
   * Method to get user input from form fields.
   * @returns An array containing the title, description, and number of people, or void if input is invalid.
   */
  private getUserInput(): [string, string, number] | void {
    // Fetch values from input fields and trim whitespace
    const enteredTitle = this.titleInputElement.value.trim()
    const enteredDescription = this.descriptionElement.value.trim()
    const enteredPeople = +this.peopleInputElement.value.trim()

    // Validate input and return an array or void
    if (!enteredTitle || !enteredDescription || !enteredPeople) {
      alert('Invalid input, please try again!')
      return
    } else {
      return [enteredTitle, enteredDescription, enteredPeople]
    }
  }

  /**
   * Method to clear form fields after submission.
   */
  private clearForm() {
    this.titleInputElement.value = ''
    this.descriptionElement.value = ''
    this.peopleInputElement.value = ''
  }

  /**
   * Handler for form submission.
   * Prevents default form submission behavior, processes user input, and clears the form.
   * @param event The submit event.
   */
  private handleSubmit(event: Event) {
    event.preventDefault()
    const userInput = this.getUserInput()

    // Process user input and clear form
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput
      console.log(title, description, people)
    }
    this.clearForm()
  }

  /**
   * Method to configure form.
   */
  private configureForm() {
    this.formElement.addEventListener('submit', (e: Event) => this.handleSubmit(e))
  }

  /**
   * Method to attach the form to the host element in the DOM.
   */
  private attachForm() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement)
  }
}

// Create an instance of ProjectInput when the script loads
const projInput = new ProjectInput()
