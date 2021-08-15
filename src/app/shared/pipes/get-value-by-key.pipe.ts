import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getValueByKey',
  pure: true,
})
export class GetValueByKeyPipe implements PipeTransform {
  transform(value: any[], id: number, property: string): any {
    /**find 查找第一个符合条件的数组元素 */
    const filteredObj = value.find(item => {
      if (item.id !== undefined) {
        return item.id === id;
      }
      return false;
    });

    if (filteredObj) {
      return filteredObj[property];
    }
  }
}
