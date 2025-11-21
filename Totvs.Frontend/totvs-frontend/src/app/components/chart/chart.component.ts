import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService, TickData } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() activeId: number = 2278;

  private ctx!: CanvasRenderingContext2D;
  private candles: Candle[] = [];
  private currentPrice: number = 0;
  private subscriptions: Subscription[] = [];

  connected = false;
  authenticated = false;
  currentSymbol = 'EUR/USD (OTC)';

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.subscriptions.push(
      this.wsService.connected$.subscribe(connected => {
        this.connected = connected;
        this.drawChart();
      })
    );

    this.subscriptions.push(
      this.wsService.authenticated$.subscribe(authenticated => {
        this.authenticated = authenticated;
        if (authenticated) {
          this.wsService.subscribeToCandles(this.activeId, 60);
        }
      })
    );

    this.subscriptions.push(
      this.wsService.tickData$.subscribe(data => {
        this.updateChart(data);
      })
    );

    this.generateMockData();
    this.drawChart();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement!;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    this.drawChart();
  }

  private generateMockData() {
    const now = Date.now();
    let price = 1.0850;

    for (let i = 100; i >= 0; i--) {
      const change = (Math.random() - 0.5) * 0.002;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 0.001;
      const low = Math.min(open, close) - Math.random() * 0.001;

      this.candles.push({
        time: now - i * 60000,
        open,
        high,
        low,
        close
      });

      price = close;
    }

    this.currentPrice = price;
  }

  private updateChart(data: TickData) {
    this.currentPrice = data.price;

    if (this.candles.length === 0) {
      this.candles.push({
        time: data.timestamp,
        open: data.price,
        high: data.price,
        low: data.price,
        close: data.price
      });
      this.drawChart();
      return;
    }

    const lastCandle = this.candles[this.candles.length - 1];
    const timeDiff = data.timestamp - lastCandle.time;

    if (timeDiff > 60000) {
      this.candles.push({
        time: data.timestamp,
        open: data.price,
        high: data.price,
        low: data.price,
        close: data.price
      });

      if (this.candles.length > 100) {
        this.candles.shift();
      }
    } else {
      lastCandle.close = data.price;
      lastCandle.high = Math.max(lastCandle.high, data.price);
      lastCandle.low = Math.min(lastCandle.low, data.price);
    }

    this.drawChart();
  }

  private drawChart() {
    if (!this.ctx || this.candles.length === 0) return;

    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width;
    const height = canvas.height;

    this.ctx.fillStyle = '#0f1419';
    this.ctx.fillRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const prices = this.candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 0.001;

    const candleWidth = chartWidth / this.candles.length;

    this.candles.forEach((candle, i) => {
      const x = padding + i * candleWidth;
      const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
      const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;

      const isGreen = candle.close >= candle.open;
      this.ctx.strokeStyle = isGreen ? '#4caf50' : '#f44336';
      this.ctx.fillStyle = isGreen ? '#4caf50' : '#f44336';

      this.ctx.beginPath();
      this.ctx.moveTo(x + candleWidth / 2, highY);
      this.ctx.lineTo(x + candleWidth / 2, lowY);
      this.ctx.stroke();

      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;
      this.ctx.fillRect(x + 2, bodyTop, candleWidth - 4, bodyHeight);
    });

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(width - padding, y);
      this.ctx.stroke();

      const price = maxPrice - (i * priceRange) / 5;
      this.ctx.fillStyle = '#8b9bb3';
      this.ctx.font = '12px sans-serif';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(price.toFixed(5), padding - 10, y + 4);
    }

    this.ctx.fillStyle = '#00d9ff';
    this.ctx.font = 'bold 24px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(this.currentPrice.toFixed(5), padding, 40);

    this.ctx.fillStyle = '#8b9bb3';
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(this.currentSymbol, padding, 60);

    if (!this.authenticated) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, width, height);

      this.ctx.fillStyle = '#ff9800';
      this.ctx.font = 'bold 20px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        this.connected ? 'Autenticando...' : 'Conectando ao servidor...',
        width / 2,
        height / 2
      );
    }
  }
}
