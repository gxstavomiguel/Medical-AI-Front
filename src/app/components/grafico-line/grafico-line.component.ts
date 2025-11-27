// import { Component, Input, OnChanges } from '@angular/core';
// import { Chart, ChartData, ChartOptions } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';

// @Component({
//   selector: 'app-grafico-line',
//   standalone: true,
//   imports: [BaseChartDirective],
//   templateUrl: './grafico-line.component.html',
// })
// export class GraficoLineComponent implements OnChanges {
//   @Input() titulo: string = '';
//   @Input() labels: string[] = [];
//   @Input() valores: number[] = [];
//   @Input() corPrimaria: string = '#4A6CF7';

//   lineChartData!: ChartData<'line'>;

//   lineChartOptions: ChartOptions<'line'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//         position: 'top',
//       },
//       title: {
//         display: false,
//       },
//     },
//     elements: {
//       line: {
//         tension: 0,
//         borderWidth: 2,
//       },
//       point: {
//         radius: 4,
//         hoverRadius: 6,
//         hitRadius: 15,
//         pointStyle: 'circle',
//         backgroundColor: 'white',
//         borderWidth: 2,
//       },
//     },
//     scales: {
//       x: {
//         ticks: { color: '#555' },
//         grid: { color: '#e0e0e0' },
//       },
//       y: {
//         beginAtZero: true,
//         max: 100,
//         ticks: {
//           color: '#555',
//           stepSize: 20,
//         },
//         grid: { color: '#e0e0e0' },
//       },
//     },
//   };
//   ngOnChanges(): void {
//     this.lineChartData = {
//       labels: this.labels,
//       datasets: [
//         {
//           label: 'Vendas',
//           data: this.valores,
//           borderColor: this.corPrimaria,
//           backgroundColor: this.corPrimaria + '33',
//           tension: 0,
//           borderWidth: 2,
//           pointRadius: 4,
//           pointBackgroundColor: 'white',
//           pointBorderColor: this.corPrimaria,
//           pointBorderWidth: 2,
//           fill: 'origin',
//           type: 'line' as const,
//         },
//       ],
//     };
//   }
// }

import { Component, Input, OnChanges } from '@angular/core';
import { Chart, ChartData, ChartOptions, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

// Interface para definir a estrutura de uma série de dados para o gráfico de linha
export interface LineChartSeries {
  label: string;
  data: number[];
  color: string;
}

@Component({
  selector: 'app-grafico-line',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './grafico-line.component.html',
})
export class GraficoLineComponent implements OnChanges {
  @Input() titulo: string = '';
  @Input() labels: string[] = [];
  @Input() valores: number[] = [];
  @Input() corPrimaria: string = '#4A6CF7';
  // Novo Input para múltiplas séries de dados (para o gráfico de tendência)
  @Input() series: LineChartSeries[] = [];
  // Novo Input para controlar a exibição da legenda (necessário para o gráfico de tendência)
  @Input() showLegend: boolean = false;
  // Novo Input para controlar o preenchimento da área (necessário para o gráfico de tendência)
  @Input() fillArea: boolean = false;
  // Novo Input para controlar a tensão da linha (curvatura)
  @Input() tension: number = 0;

  lineChartData!: ChartData<'line'>;

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Será sobrescrito em ngOnChanges
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0, // Será sobrescrito em ngOnChanges
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        hitRadius: 15,
        pointStyle: 'circle',
        backgroundColor: 'white',
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        ticks: { color: '#555' },
        grid: { color: '#e0e0e0' },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#555',
          stepSize: 20,
        },
        grid: { color: '#e0e0e0' },
      },
    },
  };

  ngOnChanges(): void {

    this.lineChartOptions.scales = this.lineChartOptions.scales || {};
    this.lineChartOptions.scales['x'] = this.lineChartOptions.scales['x'] || {};
    this.lineChartOptions.scales['y'] = this.lineChartOptions.scales['y'] || {};

    if (this.lineChartOptions.plugins && this.lineChartOptions.plugins.legend) {
      this.lineChartOptions.plugins.legend.display = this.showLegend;
    }
    if (this.lineChartOptions.elements && this.lineChartOptions.elements.line) {
      this.lineChartOptions.elements.line.tension = this.tension;
    }

    // 2. Dados do Gráfico (Data)
    let datasets: ChartDataset<'line'>[] = [];

    if (this.series && this.series.length > 0) {
      // Caso de Múltiplas Séries (Tendência Mensal)
      datasets = this.series.map(s => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: s.color + '33', // Cor com 20% de opacidade para preenchimento
        tension: this.tension,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'white',
        pointBorderColor: s.color,
        pointBorderWidth: 2,
        fill: this.fillArea ? 'origin' : false,
        type: 'line' as const,
      }));

      // Ajuste para o eixo Y do gráfico de tendência (se necessário)
      if (this.lineChartOptions.scales && this.lineChartOptions.scales['y']) {
        this.lineChartOptions.scales['y'].grid = { color: 'rgba(0, 0, 0, 0.05)' }; // Linhas mais claras
        this.lineChartOptions.scales['y'].ticks = { color: '#555', stepSize: 20 };
        this.lineChartOptions.scales?.['x']?.grid &&
          (this.lineChartOptions.scales['x'].grid = { display: false });
      }

    } else {
      // Caso de Série Única (Comportamento Original)
      datasets = [
        {
          label: this.titulo || 'Dados',
          data: this.valores,
          borderColor: this.corPrimaria,
          backgroundColor: this.corPrimaria + '33',
          tension: this.tension,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'white',
          pointBorderColor: this.corPrimaria,
          pointBorderWidth: 2,
          fill: 'origin',
          type: 'line' as const,
        },
      ];

      // Restaura as configurações originais do eixo Y
      if (this.lineChartOptions.scales && this.lineChartOptions.scales['y']) {
        this.lineChartOptions.scales['y'].grid = { color: '#e0e0e0' };
        this.lineChartOptions.scales?.['x']?.grid &&
          (this.lineChartOptions.scales['x'].grid = { display: false });
      }
    }

    this.lineChartData = {
      labels: this.labels,
      datasets: datasets,
    };
  }
}
