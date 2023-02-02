import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {

  private apiKey     : string = '8etXzsLpRnXD7ghqQsON6BixkOmKuI4i';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial : string[] = [];
  public resultados  : Gif[] = [];

  constructor( private http: HttpClient ){
    //Obtenemos, en caso de existir, los valores del historial de búsqueda que hemos realizado previamente
    this._historial = JSON.parse( localStorage.getItem( 'historial' )! ) || [];
    //Obtenemos, en caso de existir, los valores del resultado de búsqueda que hemos realizado previamente
    this.resultados = JSON.parse( localStorage.getItem( 'resultados' )! ) || [];
    // if ( localStorage.getItem( 'historial' ) ) {
    //   this._historial = JSON.parse( localStorage.getItem( 'historial' )! );
    // }
  }

  get historial(): string[] {
    //rompemos la referencia con el uso del spread operator y de este modo pueden modificar esta propiedad 'historial' pero no la original 'this._historial'
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

    const params = new HttpParams()
          .set( 'api_key', this.apiKey )
          .set( 'limit', '10' )
          .set( 'q', termino );

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params }).subscribe(
      ( resp ) => {
        console.log( resp.data );
        //Asignamos los resultados a la variable 'resultados'
        this.resultados = resp.data;
        //Almacenamos los resultados en el local storage del navegador
        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );
      }
    );
  }
}
