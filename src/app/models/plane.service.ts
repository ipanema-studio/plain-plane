import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Plane } from './plane';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class PlaneService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  // TODO: Change this handleError
  private static handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }

  getRandomPlanes(): Promise<Plane[]> {
    return this.http.get('/api/plane/random/')
      .toPromise()
      .then(response => response.json() as Plane[])
      .catch(PlaneService.handleError);
  }

  getNearPlanes(lat: number, lon: number, radius: number): Promise<Plane[]> {
    return this.http.post(`/api/plane/location/${radius}/`, JSON.stringify({'latitude': lat, 'longitude': lon}), {headers: this.headers})
      .toPromise()
      .then(() => {
        return this.http.get(`/api/plane/location/${radius}/`)
          .toPromise()
          .then(response => response.json() as Plane[])
          .catch(PlaneService.handleError)
      })
      .catch(PlaneService.handleError);
  }

  getPlane(planeId: number): Promise<Plane> {
    return this.http.get(`/api/plane/${planeId}/`)
      .toPromise()
      .then(response => response.json() as Plane)
      .catch(e => {
        return Promise.resolve({
          author_id: -1,
          plane_id: -1,
          content: '',
          tag: '',
          level: ''
        });
      });
  }

  report(plane: Plane): Promise<number> {
    return this.http.put(`/api/plane/report/${plane.plane_id}/`, '', {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(PlaneService.handleError);
  }

  foldNewPlane(content: string, tag: string, latitude: number, longitude: number): Promise<number> {
    // TODO: implement here with location service
    let dataToSend = {
      'content': content,
      'tag': tag,
      'has_location': !(latitude<0 && longitude<0)
    };

    if (dataToSend['has_location']) {
      dataToSend['latitude'] = latitude;
      dataToSend['longitude'] = longitude;
    }

    sessionStorage.setItem('today_write_count', String(Number(sessionStorage.getItem('today_write_count')) - 1));

    return this.http.post('/api/plane/new/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(PlaneService.handleError);
  }

  deletePlane(planeId: number): Promise<number> {
    const dataToSend = {
      'plane_id': planeId
    };

    return this.http.put('/api/plane/delete/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(PlaneService.handleError);
  }
}
