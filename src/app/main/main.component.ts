import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Alumno, Estado } from '../alumno';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  alumnos$!: Observable<any>;
  estado$!: Promise<any>;

  DELAY = 3;
  pendingPromise = true;
  URL: string = 'http://hp-api.herokuapp.com/api/characters/'

  constructor(private http: HttpClient) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.obtenerAlumnosCasa();
  }

  obtenerAlumnosCasa(casa?: string){
    console.log('Obtener alumnos ' + !casa ? '' : 'de ' + casa);

    this.alumnos$ = this.http.get<any>(this.URL)
      .pipe(
        map(x => 
            x.filter((a: Alumno) => !casa || a.house == casa)) ,
        tap(alumnos => this.obtenerEstados(alumnos))       
      );
  }

  obtenerEstados(alumnos: Alumno[]){
    this.pendingPromise = true;
    setTimeout(() => {
      this.estado$ = new Promise<Estado[]>((res, _) => {
        var estadosFinal : Estado[] = [];
        var estados = new Set(alumnos.map(a => a.alive));
        estados.forEach(estado => {
          estadosFinal.push({
            nombre: estado ? 'vivo' : 'muerto',
            cantidad: alumnos.filter(a => a.alive == estado).length
          });
        });
        res(estadosFinal);
        this.pendingPromise = false;
      });
    }, this.DELAY * 1000);
  }
}
