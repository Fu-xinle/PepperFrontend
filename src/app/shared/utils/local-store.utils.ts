/**
 * window.localStorage实用工具类
 */
export class LocalStoreUtils {
  /** 在window.localStorage中存储对象时,key(例如layout)名称可能与其他系统冲突,利用GUID避免重复 */
  static keyGuid: { [key: string]: string } = {
    layout: 'b498bc07-eab4-3828-4c7d-06b5b7d532ec',
  };

  static setItem(key: string, value: any) {
    key = LocalStoreUtils.keyGuid[key] ? LocalStoreUtils.keyGuid[key] : key;
    value = JSON.stringify(value);
    window.localStorage.setItem(key, value);
    return true;
  }

  static getItem(key: string) {
    key = LocalStoreUtils.keyGuid[key] ? LocalStoreUtils.keyGuid[key] : key;
    const value = window.localStorage.getItem(key)!;
    return value ? JSON.parse(value) : '';
  }

  static removeItem(key: string) {
    window.localStorage.removeItem(key);
  }

  static clear() {
    window.localStorage.clear();
  }
}
