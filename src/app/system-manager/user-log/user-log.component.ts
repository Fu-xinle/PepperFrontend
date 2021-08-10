import { Component } from '@angular/core';

import { GridApi, DetailGridInfo, ILoadingOverlayComp, INoRowsOverlayComp, IServerSideGetRowsParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { SystemManagerService } from '../system-manager.service';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss'],
})
export class UserLogComponent {
  // ag-grid设置
  public columnDefs = [
    {
      headerName: '序号',
      field: 'id',
      initialWidth: 150,
      suppressMenu: true,
    },
    {
      headerName: '用户名',
      field: 'userName',
      colId: 'user_name',
      flex: 1,
      suppressMenu: true,
      minWidth: 150,
    },
    {
      headerName: '操作描述',
      field: 'eventDescription',
      colId: 'event_description',
      suppressMenu: true,
      minWidth: 450,
      flex: 3,
    },
    {
      headerName: '操作时间',
      field: 'eventTime',
      colId: 'event_time',
      suppressMenu: true,
      initialWidth: 250,
      sortable: true,
      sort: 'desc',
      unSortIcon: true,
      icons: {
        sortAscending: '<i class="icon-Up" style="font-weight: bold;"></i>',
        sortDescending: '<i class="icon-Down" style="font-weight: bold;"></i>',
        sortUnSort: '<i class="icon-Up--Down"></i>',
      },
    },
  ];
  public gridApi!: GridApi;
  public context = { componentParent: this };
  public frameworkComponents:
    | {
        [p: string]: {
          new (): any;
        };
      }
    | any;
  public loadingOverlayComponent:
    | {
        new (): ILoadingOverlayComp;
      }
    | string;
  public loadingOverlayComponentParams:
    | {
        loadingMessage: string;
      }
    | any;
  public noRowsOverlayComponent:
    | {
        new (): INoRowsOverlayComp;
      }
    | string;
  public noRowsOverlayComponentParams:
    | {
        noRowsMessageFunc: () => string;
      }
    | any;
  public quickFilterText: string = '';

  // 搜索文本、记录总数
  public searchText = '';
  private totalCount: number = 0;

  constructor(private systemManagerService: SystemManagerService, private toastr: ToastrService) {
    // ag-grid
    this.frameworkComponents = {
      customLoadingOverlay: AppLoadingOverlayComponent,
      customNoRowsOverlay: AppNorowsOverlayComponent,
    };
    this.loadingOverlayComponent = 'customLoadingOverlay';
    this.loadingOverlayComponentParams = {
      loadingMessage: '加载中...',
    };
    this.noRowsOverlayComponent = 'customNoRowsOverlay';
    this.noRowsOverlayComponentParams = {
      noRowsMessageFunc: () => '暂无数据',
    };
  }

  onGridReady(params: DetailGridInfo) {
    this.gridApi = params.api!;

    params.api!.setServerSideDatasource({
      getRows: (serverParams: IServerSideGetRowsParams) => {
        // 通过服务从后台获取数据
        const subscription = this.systemManagerService
          .userLogServerSideData(this.totalCount, this.searchText, serverParams.request)
          .subscribe(
            res => {
              serverParams.success({
                rowCount: res.rowCount,
                rowData: res.rowData,
              });
              this.totalCount = res.rowCount;
            },
            err => {
              serverParams.fail();
              console.error(err);
              this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
            },
            () => {
              subscription.unsubscribe();
              /*Completed*/
            }
          );
      },
    });
  }

  refreshStore() {
    this.totalCount = 0;
    this.gridApi.refreshServerSideStore({ purge: false });
  }
}
