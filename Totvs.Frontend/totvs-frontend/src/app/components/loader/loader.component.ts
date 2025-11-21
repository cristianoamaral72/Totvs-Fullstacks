import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule]
})
export class LoaderComponent {

  // Agora a visibilidade pode ser passada como uma entrada para o componente
  @Input() visibility: boolean = false;

  // Mantemos o serviço de loader, caso o componente precise obter o estado diretamente do serviço
  visibility$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    // Associa o observable diretamente ao serviço, caso seja necessário monitorar o estado global
    this.visibility$ = this.loaderService.getVisibility();
  }
}
