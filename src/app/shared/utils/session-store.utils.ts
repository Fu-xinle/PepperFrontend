/**
 * window.sessionStorage实用工具类
 */
export class SessionStoreUtils {
  static setItem(key: string, value: any) {
    value = JSON.stringify(value);
    window.sessionStorage.setItem(key, value);
    return true;
  }

  static getItem(key: string) {
    const value = window.sessionStorage.getItem(key)!;
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  static removeItem(key: string) {
    window.sessionStorage.removeItem(key);
  }

  static clear() {
    window.sessionStorage.clear();
  }
}
