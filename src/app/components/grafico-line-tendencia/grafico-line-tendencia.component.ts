import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraficoLineComponent, LineChartSeries } from '../grafico-line/grafico-line.component';

@Component({
  selector: 'app-tendencia-mensal-container',
  standalone: true,
  imports: [CommonModule, GraficoLineComponent],
  templateUrl: './grafico-line-tendencia.component.html',
})
export class TendenciaMensalContainerComponent {
  // Dados de exemplo para o gráfico de tendência
  public labels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  public series: LineChartSeries[] = [
    {
      label: 'Casos Clínicos',
      data: [70, 75, 85, 90, 80, 88, 78, 82, 95, 85, 92, 75],
      color: '#4A6CF7' // Azul claro/ciano
    },
    {
      label: 'Estudar por Questões',
      data: [40, 45, 58, 42, 55, 40, 50, 58, 40, 50, 45, 60],
      color: '#FFC107' // Amarelo/Laranja
    },
    {
      label: 'Tirar Dúvidas',
      data: [20, 35, 25, 35, 28, 15, 35, 20, 30, 10, 25, 12],
      color: '#9C27B0' // Roxo/Azul escuro
    }
  ];

  // Dados para o resumo analítico (cores para facilitar a referência no HTML)
  public resumoData = [
    {
      text: 'Casos clínicos apresentou o maior crescimento no último mês, com aumento de 55% em relação ao último mês.',
      color: '#4A6CF7',
      strongText: 'Casos clínicos'
    },
    {
      text: 'Estudar questões teve a maior queda do período, com -27%.',
      color: '#FFC107',
      strongText: 'Estudar questões'
    },
    {
      text: 'Tirar dúvidas permanece como a ferramenta mais utilizada, com 55% de todas as solicitações.',
      color: '#9C27B0',
      strongText: 'Tirar dúvidas'
    },
    {
      text: 'O número de usuários ativos cresceu 12% em comparação ao último período.',
      color: '#FBC02D', // Cor genérica para o item de usuários ativos
      strongText: null
    }
  ];
}
