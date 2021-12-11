export class GeneralUtils {
  /**
   * 根据屏幕的尺寸判断设备是否是手机
   *
   * @returns {boolean} Return 是否是手机屏幕,窗口小于或等于700像素.
   */
  static isMobile() {
    return window && window.matchMedia('(max-width: 767px)').matches;
  }

  /**
   * 将ngbDate格式的日期转化为JavaScript格式的日期
   *
   * @param { { month: number; day: number; year: number } } ngbDate Parameter ngbDate格式的日期
   * @param {number}  ngbDate.month  Parameter 月
   * @param {number}  ngbDate.day    Parameter 日
   * @param {number}  ngbDate.year   Parameter 年
   * @returns {Date} Return JavaScript格式的日期
   */
  static ngbDateToDate(ngbDate: { month: number; day: number; year: number }) {
    if (!ngbDate) {
      return null;
    }
    return new Date(`${ngbDate.month}/${ngbDate.day}/${ngbDate.year}`);
  }

  /**
   * 将JavaScript格式的日期转化为ngbDate格式的日期
   *
   * @param {Date} date Parameter JavaScript格式的日期
   * @returns { { month: number; day: number; year: number } } Return ngbDate格式的日期
   */
  static dateToNgbDate(date: Date) {
    if (!date) {
      return null;
    }
    date = new Date(date);
    return {
      month: date.getMonth() + 1,
      day: date.getDate(),
      year: date.getFullYear(),
    };
  }

  /**
   * 通过设置scrollTop属性为0,将元素滚动条滚动到顶部.
   *
   * @param {string} selector Parameter html元素选择器
   */
  static scrollToTop(selector: string) {
    if (document) {
      const element = document.querySelector(selector) as HTMLElement;
      element.scrollTop = 0;
    }
  }

  /**
   * 根据输入长度，随机生成包含大小写字母、数字的ID字符串,请用uuid库生成的guid代替
   *
   * @param {number} [length]  Parameter 字符串的长度，默认值5
   * @returns {string} Return 创建的ID字符串
   */
  static genId(length: number = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * 检测数据是否是复杂对象
   *
   * @param {any} item 检测数据
   * @returns {boolean} 是否是复杂对象
   */
  static isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * 由于Object.assign是浅层对象合并，只合并一层，本函数是深层合并
   *
   * @param {any} target 目标对象
   * @param {any[]} sources 合并的对象
   * @returns {any} 合并的对象
   */
  static mergeDeep(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return this.mergeDeep(target, ...sources);
  }
}
