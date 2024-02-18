/**
 * Represents an interface for draggable elements.
 */
export interface Draggable {
  // Handler for the drag start event
  dragStartHandler(event: DragEvent): void
  // Handler for the drag end event
  dragEndHandler(event: DragEvent): void
}

/**
 * Represents an interface for drag target elements.
 */
export interface DragTarget {
  // Handler for the drag over event
  dragOverHandler(event: DragEvent): void
  // Handler for the drop event
  dropHandler(event: DragEvent): void
  // Handler for the drag leave event
  dragLeaveHandler(event: DragEvent): void
}
