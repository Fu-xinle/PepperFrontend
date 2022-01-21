interface ISimpleInformationModel {
  id?: number;
  guid: string;
  chineseName: string;
  englishName: string;
  description: string;
  createUser?: string;
  createTime?: string;
  isLeaf?: boolean;
  treeChineseName?: string;
  parentGuid?: string;
}

/**
 * 词汇表中词汇项对象接口
 */
export interface IWordChineseEnglish extends ISimpleInformationModel {}
