import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef} from '@angular/material';
import {formatDate} from '@angular/common';
import {NgForm} from '@angular/forms';
import {TaskService} from '../task.service';

export interface DialogData {
  title: string;
  notes: string;
  due: string;
  selectedTaskList: string;
}

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss']
})
export class AddTaskDialogComponent implements OnInit {
  title = '';
  notes = '';
  due = '';

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private taskService: TaskService) {
  }

  ngOnInit() {
    this.title = this.data.title;
    this.notes = this.data.notes;
    this.due = this.data.due;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setDueDate(event: MatDatepickerInputEvent<Date>) {
    this.due = formatDate(event.value, 'y-MM-ddThh:mm:ss.000Z', 'en');
  }

  save(form: NgForm) {
    if (!form.value.title) {
      return false;
    }
    const taskInfo = {
      title: '',
      notes: '',
      due: ''
    };
    taskInfo.title = form.value.title;
    taskInfo.notes = form.value.notes || '';
    if (this.due) {
      taskInfo.due = this.due;
    }

    this.taskService.addTask(this.data.selectedTaskList, taskInfo).subscribe((res) => {
      this.dialogRef.close();
    });
  }

}
