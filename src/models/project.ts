/**
 * Represents the status of a project.
 */
export enum ProjectStatus {
  Active, // Indicates that the project is active
  Finished // Indicates that the project is finished
}

/**
 * Represents a project.
 */
export class Project {
  /**
   * Creates an instance of Project.
   * @param {string} id - The ID of the project.
   * @param {string} title - The title of the project.
   * @param {string} description - The description of the project.
   * @param {number} people - The number of people assigned to the project.
   * @param {ProjectStatus} status - The status of the project (active or finished).
   */
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
