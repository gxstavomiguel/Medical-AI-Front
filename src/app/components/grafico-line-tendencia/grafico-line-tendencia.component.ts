import { Component } from '@angular/core';

import { GraficoLineComponent, LineChartSeries } from '../grafico-line/grafico-line.component';

@Component({
  selector: 'app-tendencia-mensal-container',
  standalone: true,
  imports: [GraficoLineComponent],
  templateUrl: './grafico-line-tendencia.component.html',
})
export class TendenciaMensalContainerComponent {
  public labels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  public series: LineChartSeries[] = [
    {
      label: 'Casos Clínicos',
      data: [70, 75, 85, 90, 80, 88, 78, 82, 95, 85, 92, 75],
      color: '#4DB6AC'
    },
    {
      label: 'Estudar por Questões',
      data: [40, 45, 58, 42, 55, 40, 50, 58, 40, 50, 45, 60],
      color: '#F4D06F'
    },
    {
      label: 'Tirar Dúvidas',
      data: [20, 35, 25, 35, 28, 15, 35, 20, 30, 10, 25, 12],
      color: '#F28C8C'
    }


  ];

  public resumoData = [
    {
      text: 'Casos clínicos apresentou o maior crescimento no último mês, com aumento de 55% em relação ao último mês.',
      color: '#4DB6AC',
      strongText: 'Casos clínicos'
    },
    {
      text: 'Estudar questões teve a maior queda do período, com -27%.',
      color: '#F4D06F',
      strongText: 'Estudar questões'
    },
    {
      text: 'Tirar dúvidas permanece como a ferramenta mais utilizada, com 55% de todas as solicitações.',
      color: '#F28C8C',
      strongText: 'Tirar dúvidas'
    }
  ];
}
