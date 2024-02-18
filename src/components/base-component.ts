/**
 * Represents a generic component.
 * @template T - The type of the host element.
 * @template U - The type of the component element.
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  private readonly templateElement: HTMLTemplateElement
  private readonly hostElement: T
  readonly element: U

  /**
   * Creates an instance of Component.
   * @param {string} templateId - The ID of the template element.
   * @param {string} hostElementId - The ID of the host element.
   * @param {boolean} insertAtStart - Whether to insert the component at the start or end of the host element.
   * @param {string} [newElementId] - Optional. The ID to assign to the newly created element.
   */
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

  /**
   * Attaches the component element to the host element.
   * @param {boolean} insertAtBeginning - Whether to insert the component at the beginning or end of the host element.
   */
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element)
  }

  /**
   * Configures the component.
   * Must be implemented by subclasses.
   */
  abstract configure(): void

  /**
   * Renders the content of the component.
   * Must be implemented by subclasses.
   */
  abstract renderContent(): void
}
