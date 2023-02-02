import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GifsService {

  private apiKey: string = '8etXzsLpRnXD7ghqQsON6BixkOmKuI4i';
  private _historial: string[] = [];
  public resultados: any[] = [];

  constructor( private http: HttpClient ){}

  get historial(): string[] {
    //rompemos la referencia con el uso del spread operator
    return [...this._historial];
  }

  buscarGifs(termino: string): void {
    termino = termino.trim().toLocaleLowerCase();

    if (!this._historial.includes(termino)) {
      //Inserts new at the start of an array
      this._historial.unshift(termino);
      //Nos quedamos siempre con los primeros 15 términos de búsqueda
      this._historial = this._historial.splice(0, 10);
    }
    console.log(this._historial);
    this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=8etXzsLpRnXD7ghqQsON6BixkOmKuI4i&q=${ termino }&limit=25`).subscribe(
      ( resp:any ) => {
        console.log( resp.data );
        this.resultados = resp.data;
      }
    );
  }
}
