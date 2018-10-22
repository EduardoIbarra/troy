import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  env = environment;
  constructor(private httpClient: HttpClient) {
  }
  generateReport2(data) {
    return this.httpClient.get(this.env.apiURL+'excel/show/');
  }
  generateReport(data) {
    const headers = new HttpHeaders({"Content-Type":"application/json"});
    return this.httpClient.post(this.env.apiURL+'excel/show/',
      data,
      {headers:headers});
  }
  formReport(data) {
    const headers = new HttpHeaders({"Content-Type":"application/json"});
    return this.httpClient.post(this.env.apiURL+'excel/formReport/',
      data,
      {headers:headers});
  }
}
