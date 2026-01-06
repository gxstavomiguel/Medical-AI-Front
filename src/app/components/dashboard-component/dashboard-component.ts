import { Component, computed, Input, viewChild, viewChildren } from '@angular/core';
import { GraficoPizzaComponent } from '../grafico-pizza/grafico-pizza.component';
import { GraficoLineComponent } from '../grafico-line/grafico-line.component';
import { GraficoBarraComponent } from '../grafico-barra/grafico-barra.component';
import { TendenciaMensalContainerComponent } from '../grafico-line-tendencia/grafico-line-tendencia.component';

@Component({
  selector: 'app-dashboard-component',
  imports: [
    GraficoPizzaComponent,
    GraficoLineComponent,
    GraficoBarraComponent,
    TendenciaMensalContainerComponent,
  ],
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent {}
