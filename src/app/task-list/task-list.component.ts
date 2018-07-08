import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaskService} from '../task.service';
import {MatDatepickerInputEvent, MatDialog} from '@angular/material';
import {formatDate} from '@angular/common';
import {TaskDetailsComponent} from '../task-details/task-details.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() taskListId: string;
  @Input() tasksUpdated: boolean;
  @Input() picker: string;

  tasks = [];
  tasksCopy = [];
  allTasks = [];

  parentIds = [];

  selectedTasksHidden = false;

  constructor(private taskService: TaskService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  organizeTasks(items: Array<any>): any {
    const parents = [];
    for (const i in items) {
      const item = items[i];

      if (item.due && !item.formatted) {
        const due = new Date(formatDate(item.due, 'MM/dd/y', 'en'));
        due.setDate(due.getDate() + 1); // Google sets the datetime to 00:00 so it's always one day late

        item.due = formatDate(due, 'MM/dd/y', 'en');
        item.formatted = true;
      }

      item.selected = item.status === 'completed';

      if (!item.parent) {
        if (this.parentIds.indexOf(item.id) === -1) {
          this.parentIds.push(item.id);
        }

        if (parents.indexOf(item) === -1) {
          item.children = [];
          parents.push(item);
        }
      }
    }

    parents.sort((a, b) => {
      const dateA = new Date(a.due);
      const dateB = new Date(b.due);
      if (dateB > dateA) {
        return 1;
      }
      if (dateB < dateA) {
        return -1;
      }
      return 0;
    });

    for (const idx in items) {
      const item = items[idx];

      if (item.parent) {
        const parentIndex = parents.findIndex((parent) => {
          return parent.id === item.parent;
        });
        parents[parentIndex].children.push(item);
      }

    }

    this.tasks = parents;
    this.tasksCopy = parents;
  }

  filterTasksByDate(event: MatDatepickerInputEvent<Date>): void {
    this.organizeTasks(this.allTasks);

    const date = formatDate(event.value, 'MM/dd/y', 'en');

    this.tasks = this.tasks.filter((task) => {
      if (task.due === date) {
        return task;
      }

      const children = task.children.filter((child) => {
        if (child.due === date) {
          return child;
        }
      });
      if (children.length > 0) {
        return task;
      }

    });
  }

  clearFilter() {
    this.organizeTasks(this.allTasks);
  }

  toggleSelectedTasks() {
    this.selectedTasksHidden = !this.selectedTasksHidden;

    if (this.selectedTasksHidden) {
      this.tasks = this.tasks.filter((task) => {
        if (!task.selected && task.children.length === 0) {
          return task;
        } else {
          const children = task.children.filter((child) => {
            if (!child.selected) {
              return child;
            }
          });
          if (children.length > 0) {
            task.children = children;
            return task;
          }
        }

      });
    } else {
      this.organizeTasks(this.allTasks);
    }
  }

  getTasks(taskListId: string) {
    this.tasks = [];
    this.taskService.retrieveTaskByTaskListId(taskListId).subscribe((tasks) => {
      if (tasks.items && tasks.items.length) {
        this.allTasks = tasks.items;
        this.organizeTasks(tasks.items);
      }
    });
  }

  updateTask(task: any, toggle: boolean) {

    delete task.selected;
    if (task.formatted) {
      delete task.formatted;
    }

    if (toggle) {
      task.status = task.status === 'completed' ? 'needsAction' : 'completed';
    }

    this.taskService.updateTask(this.taskListId, task.id, task).subscribe((res) => {
      console.log(res);

    });
  }

  editTask(task: any) {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '80%',
      height: '80%',
      data: {task: task}
    });

    dialogRef.afterClosed().subscribe(() => {
      //this.tasksUpdated = true;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.taskListId.currentValue !== '' || (changes.tasksUpdated.currentValue === true &&
      changes.tasksUpdated.previousValue === false)) {
      this.getTasks(changes.taskListId.currentValue);
    }
  }

}
