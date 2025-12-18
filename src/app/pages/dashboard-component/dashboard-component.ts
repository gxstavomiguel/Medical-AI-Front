import { Component, computed, Input, viewChild, viewChildren } from '@angular/core';
import { GraficoPizzaComponent } from '../../components/grafico-pizza/grafico-pizza.component';
import { GraficoLineComponent } from '../../components/grafico-line/grafico-line.component';
import { GraficoBarraComponent } from '../../components/grafico-barra/grafico-barra.component';
import { TendenciaMensalContainerComponent } from '../../components/grafico-line-tendencia/grafico-line-tendencia.component';

@Component({
  selector: 'app-dashboard-component',
  imports: [GraficoPizzaComponent, GraficoLineComponent, GraficoBarraComponent, TendenciaMensalContainerComponent],
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent {
}
