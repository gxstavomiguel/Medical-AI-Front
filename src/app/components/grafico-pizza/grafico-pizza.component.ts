import { Component, Input, OnInit } from '@angular/core';
import {
  ChartData,
  ChartOptions,
  Chart,
  ArcElement,
  PieController,
  Legend,
  Tooltip,
  ChartType,
  ChartConfiguration,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-grafico-pizza',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './grafico-pizza.component.html',
})
export class GraficoPizzaComponent implements OnInit {
  @Input() titulo: string = 'Distribuição por Tipo de Estudo';
  @Input() labels: string[] = ['Estudo A', 'Estudo B', 'Estudo C'];
  @Input() valores: number[] = [12.13, 22.4, 16.54];
  @Input() cores: string[] = [
    // '#19AA79', // Verde principal
    // '#8CCFB5', // Verde claro complementar
    // '#3C7D66', // Verde profundo contrastante
    // '#F4C67E', // Dourado suave (complementar quente, combina com verde)
    // '#6FB8E6'  // Azul suave e harmônico
    '#6FB8E6',
    '#F4D06F',
    '#8CCFB5',
  ];


  public pieChartType: ChartType = 'doughnut';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';

            const value = Number(context.raw);

            const dataset = context.chart.data.datasets[context.datasetIndex].data.map(Number);

            const total = dataset.reduce((a, b) => a + b, 0);

            const percentage = ((value / total) * 100).toFixed(2) + '%';

            return `${label}: ${value} (${percentage})`;
          },
        },
      },
    },
  };

  public pieChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [],
  };

  ngOnInit(): void {
    const finalLabels = this.labels.length > 0 ? this.labels : ['Estudo A', 'Estudo B', 'Estudo C'];

    this.pieChartData = {
      labels: finalLabels,
      datasets: [
        {
          data: this.valores,
          backgroundColor: this.cores,
          hoverBackgroundColor: this.cores.map((cor) => cor + 'CC'),
          borderWidth: 1,
          borderColor: '#ffffff',
        },
      ],
    };
  }
}
