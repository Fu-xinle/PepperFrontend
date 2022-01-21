import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IWordChineseEnglish } from '../../shared/interface/development-operations.interface';
import { IOperatorInformationModel } from '../../shared/interface/system-manage.interface';

@Injectable()
export class WordChineseEnglishService {
  constructor(private http: HttpClient) {}

  /**
   *  获取所有的词汇项信息数组
   *
   * @returns {{ wordChineseEnglishData: IWordChineseEnglish[] } } 词汇项信息数组
   */
  getAllWordChineseEnglishs(): Observable<{ wordChineseEnglishData: IWordChineseEnglish[] }> {
    return this.http.get<{ wordChineseEnglishData: IWordChineseEnglish[] }>(
      '/development_operations_api/word_chinese_english/all_word_chinese_englishs',
      {}
    );
  }

  /**
   * 新建词汇项，保存词汇项的信息
   *
   * @param {IWordChineseEnglish} newWordChineseEnglishInfo  新建的词汇项信息
   * @returns  {IOperatorInformationModel} 操作成功，返回操作者信息以及操作时间信息
   */
  addWordChineseEnglish(newWordChineseEnglishInfo: IWordChineseEnglish): Observable<IOperatorInformationModel> {
    return this.http.post<IOperatorInformationModel>('/development_operations_api/word_chinese_english/add_word_chinese_english', {
      newWordChineseEnglishInfo,
    });
  }

  /**
   * 用户编辑词汇项信息
   *
   * @param {IWordChineseEnglish} editWordChineseEnglishInfo  编辑的词汇项信息
   * @returns  {IOperatorInformationModel} 操作成功，返回操作者信息以及操作时间信息
   */
  editWordChineseEnglish(editWordChineseEnglishInfo: IWordChineseEnglish): Observable<IOperatorInformationModel> {
    return this.http.post<IOperatorInformationModel>('/development_operations_api/word_chinese_english/edit_word_chinese_english', {
      editWordChineseEnglishInfo,
    });
  }

  /**
   * 用户删除词汇项信息
   *
   * @param {string} guid  词汇项的唯一标识
   * @returns  {{}} 操作成功，返回空对象
   */
  deleteWordChineseEnglish(guid: string): Observable<{}> {
    return this.http.post<any>('/development_operations_api/word_chinese_english/delete_word_chinese_english', {
      guid,
    });
  }
}
