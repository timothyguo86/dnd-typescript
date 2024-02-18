/**
 * Represents a project list component.
 * Implements DragTarget interface.
 */
import { Component } from './base-component'
import { Project, ProjectStatus } from '../models/project'
import { projectState } from '../state/project-state'
import { DragTarget } from '../models/drag-drop'
import { ProjectItem } from './project-item'

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  private assignedProjects: Project[]

  /**
   * Creates an instance of ProjectList.
   * @param {'active' | 'finished'} type - The type of projects (active or finished).
   */
  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)
    this.assignedProjects = []

    this.configure()
    this.renderContent()
  }

  // Handler for the drag over event
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault()
      const listEl = this.element.querySelector('ul')!
      listEl.classList.add('droppable')
    }
  }

  // Handler for the drop event
  dropHandler(event: DragEvent) {
    const projectId = event.dataTransfer!.getData('text/plain')
    projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
  }

  // Handler for the drag leave event
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!
    listEl.classList.remove('droppable')
  }

  // Configures event listeners and project state listener
  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler.bind(this))
    this.element.addEventListener('dragleave', this.dragLeaveHandler.bind(this))
    this.element.addEventListener('drop', this.dropHandler.bind(this))
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

  // Renders the content of the project list
  renderContent() {
    const listId = `${this.type}-project-list`
    this.element.querySelector('ul')!.id = listId
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
  }

  // Renders the projects in the list
  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement
    listEl.innerHTML = ''
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
    }
  }
}
