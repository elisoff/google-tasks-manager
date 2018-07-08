import {Component, Inject, OnInit} from '@angular/core';
import {AddTaskDialogComponent, DialogData} from '../add-task-dialog/add-task-dialog.component';
import {TaskService} from '../task.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  task = {}

  constructor(public dialogRef: MatDialogRef<AddTaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private taskService: TaskService) { }

  ngOnInit() {
     this.task = this.data.task;
  }

}
