import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from 'src/app/core/api/product';
import { ProductService } from 'src/app/core/service/product.service';
import { Subscription, debounceTime } from 'rxjs';

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProjectService } from '@app/pages/projects/project.service';


@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy, AfterContentInit {
    items!: MenuItem[];
    products!: Product[];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    kpis: ProjectData = {
        overViewProjects: { Title: '', Total: 0, Icon: '', ImportantLeyend: '', Leyend: '' },
        oncomingProjects: { Title: '', Total: 0, Icon: '', ImportantLeyend: '', Leyend: '' },
        pendingResourcesProjects: { Title: '', Total: 0, Icon: '', ImportantLeyend: '', Leyend: '' },
        openProjects: [],
        pendingProjects: []
    };

    constructor(
        private productService: ProductService, 
        public layoutService: LayoutService,
        private projectService: ProjectService,
        private messageService: MessageService,
    ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    async ngAfterContentInit(): Promise<void> {
        await this.getProjectsKPIs();
    }
    

    async getProjectsKPIs() {
        this.projectService.getProjectKPIs().subscribe({
          next: async (response: any) => {
            const {data} = response;
            this.kpis = data;
            console.log(this.kpis)
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error getting the projects'
            });
          }
        });    
      }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

export interface ProjectOverview {
    Title: string;
    Total: number;
    Icon: string;
    ImportantLeyend: string;
    Leyend: string;
  }
  
  export interface OpenProject {
    ProjectName: string;
    ProjectDescription: string;
    ClientName: string;
    NumberPositionTobeFill: number;
    DateCreated: string;
    StartDate: string;
    EndDate: string;
  }
  
  export interface ProjectData {
    overViewProjects: ProjectOverview;
    oncomingProjects: ProjectOverview;
    pendingResourcesProjects: ProjectOverview;
    openProjects: OpenProject[];
    pendingProjects: OpenProject[];
  }