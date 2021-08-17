import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private webLocalStorage = window.localStorage;

  constructor() {}

  public setItem(key: string, value: any) {
    value = JSON.stringify(value);
    this.webLocalStorage.setItem(key, value);
    return true;
  }

  public getItem(key: string) {
    const value = this.webLocalStorage.getItem(key)!;
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  public removeItem(key: string) {
    this.webLocalStorage.removeItem(key);
  }

  public clear() {
    this.webLocalStorage.clear();
  }
}
