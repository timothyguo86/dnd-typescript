import { v4 as uuidv4 } from 'uuid'
import { Project, ProjectStatus } from '../models/project.js'

type Listener<T> = (items: T[]) => void

class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

export class ProjectState extends State<Project> {
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
    const newProject = new Project(uuidv4(), title, description, people, ProjectStatus.Active)

    this.projects.push(newProject)
    this.updateListeners()
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId)
    if (project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects])
    }
  }
}

export const projectState = ProjectState.getState()
