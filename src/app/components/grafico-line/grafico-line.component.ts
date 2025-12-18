import { Component, Input, OnChanges } from '@angular/core';
import { Chart, ChartData, ChartOptions, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


export interface LineChartSeries {
  label: string;
  data: number[];
  color: string;
}

@Component({
  selector: 'app-grafico-line',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './grafico-line.component.html',
})
export class GraficoLineComponent implements OnChanges {
  @Input() titulo: string = '';
  @Input() labels: string[] = [];
  @Input() valores: number[] = [];
  @Input() corPrimaria: string = '#4A6CF7';
  @Input() series: LineChartSeries[] = [];
  @Input() showLegend: boolean = false;
  @Input() fillArea: boolean = false;
  @Input() tension: number = 0;

  lineChartData!: ChartData<'line'>;

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
        hitRadius: 15,
        pointStyle: 'circle',
        backgroundColor: 'white',
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#555',
          font: {
            size: 10,
          },
        },
        grid: { color: '#e0e0e0' },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#555',
          stepSize: 20,
          font: {
            size: 10,
          },
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

    let datasets: ChartDataset<'line'>[] = [];

    if (this.series && this.series.length > 0) {
      datasets = this.series.map(s => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: s.color + '33',
        tension: this.tension,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'white',
        pointBorderColor: s.color,
        pointBorderWidth: 2,
        fill: this.fillArea ? 'origin' : false,
        type: 'line' as const,
      }));

      if (this.lineChartOptions.scales && this.lineChartOptions.scales['y']) {
        this.lineChartOptions.scales['y'].grid = { color: 'rgba(0, 0, 0, 0.05)' };
        this.lineChartOptions.scales['y'].ticks = { color: '#555', stepSize: 20 };
        this.lineChartOptions.scales?.['x']?.grid &&
          (this.lineChartOptions.scales['x'].grid = { display: false });
      }

    } else {
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

      if (this.lineChartOptions.scales && this.lineChartOptions.scales['y']) {
        this.lineChartOptions.scales['y'].grid = { color: '#e0e0e0' };
        this.lineChartOptions.scales?.['x']?.grid &&
          (this.lineChartOptions.scales['x'].grid = { display: false });
      }
    }

    const isMobile = window.innerWidth < 640;

    if (this.lineChartOptions.scales?.['x']?.ticks) {
      this.lineChartOptions.scales['x'].ticks.font = { size: isMobile ? 9 : 11 };
    }

    if (this.lineChartOptions.scales?.['y']?.ticks) {
      this.lineChartOptions.scales['y'].ticks.font = { size: isMobile ? 9 : 11 };
    }

    if (this.lineChartOptions.plugins?.legend?.labels) {
      this.lineChartOptions.plugins.legend.labels.font = { size: isMobile ? 10 : 11 };
      this.lineChartOptions.plugins.legend.labels.padding = isMobile ? 10 : 20;
    }

    this.lineChartData = {
      labels: this.labels,
      datasets: datasets,
    };
  }
}
