import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {

  }
  fetchFeatured(){
    return this._http.get('/getFeatured')
  }

  fetchProduct(){
    return this._http.get('/getProduct')
  }
  fetchSearchedProducts(searchQuery){
    return this._http.post('/fetchSearchedProducts', {searchQuery:searchQuery})
  }
}
