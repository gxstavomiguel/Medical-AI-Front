import { Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { ReportHistory } from '../../interfaces/report-history.interface';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-gerar-relatorios-component',
  imports: [
    MatRadioModule,
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
  ],
  standalone: true,
  templateUrl: './gerar-relatorios-component.html',
})
export class GerarRelatoriosComponent implements OnInit {
  reports: ReportHistory[] = [];
  reportGenerated = false;

  chart: any;

  reportData: { date: string; value: number }[] = [];

  filters = {
    period: '',
    groupBy: '',
    reportType: '',
    viewType: '' as 'graph' | 'table' | '',
  };

  renderedViewType: 'graph' | 'table' | null = null;

  periodOptions = [
    { key: 'start', label: 'Data início' },
    { key: 'end', label: 'Data fim' },
    { key: '7d', label: 'Últimos 7 dias' },
    { key: '30d', label: 'Último mês' },
    { key: 'quarter', label: 'Último trimestre' },
    { key: 'last_semester', label: 'Último semestre' },
  ];

  page = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.reports = this.getHistory();
  }

  selectPeriod(key: string) {
    this.filters.period = key;
  }

  getHistory(): ReportHistory[] {
    return [
      {
        id: '1',
        type: 'Crescimento de usuários',
        period: '16/06/2025 à 16/07/2025',
        createdAt: '30/07/2025',
      },
    ];
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  generateReport(): void {
    if (!this.filters.viewType) return;

    this.reportGenerated = true;
    this.renderedViewType = this.filters.viewType;

    this.reportData = Array.from({ length: 10 }).map((_, i) => ({
      date: `Dia ${i + 1}`,
      value: Math.floor(Math.random() * 100),
    }));

    this.reports.unshift({
      id: crypto.randomUUID(),
      type: this.getReportTitle(),
      period: 'Período selecionado',
      createdAt: new Date().toLocaleDateString(),
    });

    this.destroyChart();

    if (this.renderedViewType === 'graph') {
      setTimeout(() => this.renderChart());
    }
  }

  getReportTitle(): string {
    return this.filters.reportType === 'growth'
      ? 'Crescimento de Usuários'
      : this.filters.reportType === 'access'
        ? 'Acessos'
        : 'Erros';
  }

  renderChart(): void {
    const canvas = document.getElementById('reportChart') as HTMLCanvasElement;

    if (!canvas) return;

    this.destroyChart();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.reportData.map((d) => d.date),
        datasets: [
          {
            label: 'Valores',
            data: this.reportData.map((d) => d.value),
            borderColor: '#19AA79',
            backgroundColor: 'rgba(25,170,121,0.3)',
          },
        ],
      },
    });
  }

  exportPDF() {
    const pdf = new jsPDF();
    pdf.text('Relatório Gerado', 20, 20);
    pdf.save('relatorio.pdf');
  }

  exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.reportData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'relatorio.xlsx');
  }

  viewReport(id: string): void {}

  get pagedReports() {
    const start = (this.page - 1) * this.pageSize;
    return this.reports.slice(start, start + this.pageSize);
  }

  prevPage() {}

  nextPage() {}
}
