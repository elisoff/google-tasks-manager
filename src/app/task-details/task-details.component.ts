import {Component, Inject, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef} from '@angular/material';
import {formatDate} from '@angular/common';
import {Router} from '@angular/router';

class UpdateDialogData {
  task: any;
  taskListId: string;
}

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  task: any = {};
  due = '';

  constructor(public dialogRef: MatDialogRef<TaskDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UpdateDialogData,
              private router: Router,
              private taskService: TaskService) { }

  ngOnInit() {
     this.task = Object.assign({}, this.data.task);

     this.task.due = new Date(this.task.due);
  }

  setDueDate(event: MatDatepickerInputEvent<Date>) {
    this.due = formatDate(event.value, 'y-MM-ddThh:mm:ss.000Z', 'en');
  }

  updateTask(): void {
    const task = Object.assign({}, this.task);

    delete task.selected;
    if (task.formatted) {
      delete task.formatted;
    }

    if (this.due !== '') {
      task.due = this.due;
    }

    this.taskService.updateTask(this.data.taskListId, task.id, task).subscribe((res) => {
      if (res.kind) {
        this.dialogRef.close();
        this.router.navigate(['/dashboard/' + this.data.taskListId], {replaceUrl: true}).then();
      }
    });
  }

}
