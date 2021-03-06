import { Component, OnInit, OnDestroy } from '@angular/core';

import { GridApi, ServerSideStoreType, GridReadyEvent, IServerSideGetRowsParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { LogManageService } from '../service/log-manage.service';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss'],
})
export class UserLogComponent implements OnInit, OnDestroy {
  /**Ag-Grid表格列配置信息 */
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
      sort: 'desc' as const,
      unSortIcon: true,
      icons: {
        sortAscending: '<i class="icon-Up" style="font-weight: bold;"></i>',
        sortDescending: '<i class="icon-Down" style="font-weight: bold;"></i>',
        sortUnSort: '<i class="icon-Up--Down"></i>',
      },
    },
  ];

  /**Ag-Grid表格的加载显示和空数据显示,自定义重载相关变量 */
  public gridApi!: GridApi;
  public context = { componentParent: this };
  public loadingOverlayComponent: any = AppLoadingOverlayComponent;
  public loadingOverlayComponentParams: any = {
    loadingMessage: '加载中...',
  };
  public noRowsOverlayComponent: any = AppNorowsOverlayComponent;
  public noRowsOverlayComponentParams: any = {
    noRowsMessageFunc: () => '暂无数据',
  };

  public serverSideStoreType: ServerSideStoreType = 'partial';

  /**搜索关键字、记录总数（用于服务器端分页） */
  public keySearcchValue: string = '';
  public keySearcchValue$ = new Subject<string>();
  private totalCount: number | null = null;

  private subscription: Subscription = new Subscription();

  constructor(private logManageService: LogManageService, private toastr: ToastrService) {}

  ngOnInit() {
    /**实现搜索框防抖功能 */
    this.subscription.add(
      this.keySearcchValue$.pipe(debounceTime(200), distinctUntilChanged()).subscribe(_res => {
        this.refreshStore();
      })
    );
  }

  /**
   * Ag-Grid初始化完成后回调函数
   *
   * @param {GridReadyEvent} params Paramater Ag-Grid对象
   */
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api!;

    params.api!.setServerSideDatasource({
      getRows: (serverParams: IServerSideGetRowsParams) => {
        this.subscription.add(
          this.logManageService.userLogServerSideData(this.totalCount, this.keySearcchValue, serverParams.request).subscribe({
            next: res => {
              serverParams.success({
                rowCount: res.rowCount,
                rowData: res.rowData,
              });
              this.totalCount = res.rowCount;
            },
            error: err => {
              serverParams.fail();
              console.error(err);
              this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
            },
            complete: () => {
              /*Completed*/
            },
          })
        );
      },
    });
  }

  /**
   * Ag-Grid刷新从服务器重新请求数据
   * purge:如果为 true，则刷新级别的所有行都会立即销毁，并且将出现“loading”。
   *       如果为 false，则保持刷新级别的所有行，直到加载行（不出现“loading”行）。
   */
  refreshStore() {
    this.totalCount = null;
    this.gridApi.refreshServerSideStore({ purge: false });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.keySearcchValue$.complete();
  }
}
