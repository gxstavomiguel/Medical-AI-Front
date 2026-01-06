import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PromptOutput } from '../interfaces/prompt-output.interface';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { getHeaderToken } from '../utils/token';
import { environment as env } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MensagemService {
  constructor(private http: HttpClient) {}

  enviarMensagem(texto: string, foi_usuario: boolean, horario: string, imagem?: string) {
    const payload = {
      usuario_id: localStorage.getItem('usuario_id'),
      horario,
      texto,
      imagem: imagem || '',
      foi_usuario,
    };
    return this.http.post(`${env.hostUrl}/f9689d3b-cb0e-435d-b8b7-120c61ddff4b`, payload, {
      headers: {
        Authorization: getHeaderToken(),
      },
    });
  }

  enviarPrompt(texto: string, modo?: 'MODO 1' | 'MODO 2' | 'MODO 3') {
    const payload = {
      usuario_id: localStorage.getItem('usuario_id'),
      prompt: texto,
      modo,
      // modo: 'MODO 2',
    };

    return this.http.post<PromptOutput>(
      `${env.hostUrl}/f217499f-9fa2-46e8-9283-540736845070`,
      payload,
      {
        headers: {
          Authorization: getHeaderToken(),
        },
      },
    );
  }

  buscarMensagens() {
    return this.http.get<UsuarioInterface[]>(
      `${env.hostUrl}/cca065d0-f68d-4a70-b9c8-8da4fb5cebee/mensagem/${localStorage.getItem(
        'usuario_id',
      )}?limit=50&offset=0`,
      {
        headers: {
          Authorization: getHeaderToken(),
        },
      },
    );
  }
}
