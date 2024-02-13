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
    const enteredTitle = this.titleInputElement.value.trim()
    const enteredDescription = this.descriptionElement.value.trim()
    const enteredPeople = +this.peopleInputElement.value.trim()

    if (!enteredTitle || !enteredDescription || !enteredPeople) {
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

  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.getUserInput()

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput
      console.log(title, description, people)
    }

    this.clearForm()
  }

  private configureForm() {
    this.formElement.addEventListener('submit', (e: Event) => this.submitHandler(e))
  }

  private attachForm() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement)
  }
}

const projInput = new ProjectInput()
