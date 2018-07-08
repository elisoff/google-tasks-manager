import {Component, Inject, Input, OnInit} from '@angular/core';
import {TasklistService} from '../tasklist.service';
import {TaskService} from '../task.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AddTaskDialogComponent} from '../add-task-dialog/add-task-dialog.component';

export interface DialogData {
  title: string;
  notes: string;
  due: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  taskLists = [];
  selectedTaskList = '';

  title = '';
  notes = '';
  due = '';

  tasksUpdated = false;

  constructor(private taskListService: TasklistService,
              private taskService: TaskService,
              public dialog: MatDialog) {}

  getTaskLists() {
    this.taskLists = [];
    this.taskListService.retrieveUsersTaskLists().subscribe((taskList) => {
      if (taskList.items && taskList.items.length) {
        for (const i in taskList.items) {
          this.taskLists.push(taskList.items[i]);
        }
      }
    });
  }

  ngOnInit() {
    this.getTaskLists();
  }

  addTask(): void {

    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '80%',
      height: '80%',
      data: {selectedTaskList: this.selectedTaskList, title: this.title, notes: this.notes, due: this.due}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.tasksUpdated = true;
    });
  }
}

