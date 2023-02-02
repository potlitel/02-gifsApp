import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {

  private apiKey: string = '8etXzsLpRnXD7ghqQsON6BixkOmKuI4i';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  constructor( private http: HttpClient ){
    this._historial = JSON.parse( localStorage.getItem( 'historial' )! ) || [];
    // if ( localStorage.getItem( 'historial' ) ) {
    //   this._historial = JSON.parse( localStorage.getItem( 'historial' )! );
    // }
  }

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

      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );
    }
    console.log(this._historial);
    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=8etXzsLpRnXD7ghqQsON6BixkOmKuI4i&q=${ termino }&limit=25`).subscribe(
      ( resp ) => {
        console.log( resp.data );
        this.resultados = resp.data;
      }
    );
  }
}
