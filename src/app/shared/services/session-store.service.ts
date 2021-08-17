import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private webSessionStorage = window.sessionStorage;

  constructor() {}

  public setItem(key: string, value: any) {
    value = JSON.stringify(value);
    this.webSessionStorage.setItem(key, value);
    return true;
  }

  public getItem(key: string) {
    const value = this.webSessionStorage.getItem(key)!;
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  public removeItem(key: string) {
    this.webSessionStorage.removeItem(key);
  }

  public clear() {
    this.webSessionStorage.clear();
  }
}
