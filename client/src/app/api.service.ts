import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerDetails } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  async getOrder(id:string):Promise<CustomerDetails[]> {
    const results = await this.http.get<CustomerDetails[]>(`http://localhost:3000/order/total/${id}`).toPromise()
    return results as CustomerDetails[]
  }
}
