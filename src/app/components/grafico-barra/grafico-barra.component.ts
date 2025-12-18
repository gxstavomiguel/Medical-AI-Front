
import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-grafico-barra',
  imports: [BaseChartDirective],
  templateUrl: './grafico-barra.component.html',
})
export class GraficoBarraComponent implements OnInit {
  @Input() titulo: string = 'Distribuição por Ferramenta';
  @Input() labels: string[] = [];
  @Input() valores: number[] = [];
  @Input() corPrimaria: string = '#4A6CF7';

  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  ngOnInit(): void {
    this.barChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.valores,
          label: 'Dados',
          backgroundColor: this.corPrimaria,
          borderColor: this.corPrimaria,
          hoverBackgroundColor: this.corPrimaria + 'B3',
          hoverBorderColor: this.corPrimaria,
        },
      ],
    };
  }
}
