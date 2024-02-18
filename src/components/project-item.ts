import { Draggable } from '../models/drag-drop'
import { Component } from './base-component'
import { Project } from '../models/project'

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project

  // Getter to display the number of persons assigned to the project
  get persons() {
    if (this.project.people === 1) {
      return '1 person '
    } else {
      return `${this.project.people} persons `
    }
  }

  /**
   * Creates an instance of ProjectItem.
   * @param {string} hostId - The ID of the host element.
   * @param {Project} project - The project associated with the item.
   */
  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id)
    this.project = project

    this.configure()
    this.renderContent()
  }

  // Handler for the drag start event
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id)
    event.dataTransfer!.effectAllowed = 'move'
  }

  // Handler for the drag end event
  dragEndHandler(_: DragEvent) {
    console.log('DragEnd')
  }

  // Configures event listeners for drag and drop functionality
  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler.bind(this))
    this.element.addEventListener('dragend', this.dragEndHandler.bind(this))
  }

  // Renders the content of the project item
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned'
    this.element.querySelector('p')!.textContent = this.project.description
  }
}
