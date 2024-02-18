import { v4 as uuidv4 } from 'uuid'
import { Project, ProjectStatus } from '../models/project'

// Represents a function type for listeners
type Listener<T> = (items: T[]) => void

// Represents the state class
class State<T> {
  protected listeners: Listener<T>[] = []

  // Adds a listener function to the list of listeners
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

// Represents the state of projects
export class ProjectState extends State<Project> {
  private projects: Project[] = []
  private static state: ProjectState

  private constructor() {
    super()
  }

  // Retrieves the singleton instance of ProjectState
  static getState() {
    if (this.state) {
      return this.state
    }
    this.state = new ProjectState()
    return this.state
  }

  // Adds a new project
  addProject(title: string, description: string, people: number) {
    const newProject = new Project(uuidv4(), title, description, people, ProjectStatus.Active)

    this.projects.push(newProject)
    this.updateListeners()
  }

  // Moves a project to a new status
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId)
    if (project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners()
    }
  }

  // Notifies all listeners about the update
  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects])
    }
  }
}

// Creates a singleton instance of ProjectState
export const projectState = ProjectState.getState()
