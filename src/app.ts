class ProjectInput {
  private templateElement: HTMLTemplateElement
  private hostElement: HTMLDivElement
  private element: HTMLFormElement

  constructor() {
    this.templateElement = document.querySelector<HTMLTemplateElement>('#project-input')!
    this.hostElement = document.querySelector<HTMLDivElement>('#app')!

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLFormElement

    this.attach()
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

const projInput = new ProjectInput()
