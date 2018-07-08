import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDate',
  pure: false
})
export class FilterDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const date = args;
    for (const i in value) {
      for(const j in value[i]) {
        console.log(value[i][j].due)
        if (value[i][j].due && value[i][j].due ===  date) {
          return value;
        }
      }
    }
    return null;
  }

}
