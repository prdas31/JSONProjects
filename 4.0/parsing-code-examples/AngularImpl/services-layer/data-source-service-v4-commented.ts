import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  constructor(private http: HttpClient) {}

  /**
   * Fetches data from the specified data source
   * @param dataSource The data source configuration
   * @returns An Observable that emits the fetched data
   */
  fetchData(dataSource: ParsedDataSource): Observable<any> {
    switch (dataSource.type) {
      case 'api':
        return this.fetchFromApi(dataSource);
      case 'sql':
        return this.executeSQL(dataSource);
      case 'function':
        return this.executeFunction(dataSource);
      case 'static':
        return of(dataSource.data); // Assuming static data is provided in the config
      default:
        throw new Error(`Unsupported data source type: ${dataSource.type}`);
    }
  }

  /**
   * Fetches data from an API endpoint
   * @param dataSource The API data source configuration
   * @returns An Observable that emits the API response
   */
  private fetchFromApi(dataSource: ParsedDataSource): Observable<any> {
    return this.http.request(dataSource.method || 'GET', dataSource.endpoint!, {
      body: dataSource.body // If provided in the config
    }).pipe(
      catchError(this.handleError('fetchFromApi', []))
    );
  }

  /**
   * Executes a SQL query
   * @param dataSource The SQL data source configuration
   * @returns An Observable that emits the query results
   */
  private executeSQL(dataSource: ParsedDataSource): Observable<any> {
    // In a real-world scenario, you'd typically have a backend service to handle SQL queries
    // Here, we're simulating it with an API call
    return this.http.post('/api/execute-sql', { query: dataSource.query }).pipe(
      catchError(this.handleError('executeSQL', []))
    );
  }

  /**
   * Executes a custom function to fetch data
   * @param dataSource The function data source configuration
   * @returns An Observable that emits the function results
   */
  private executeFunction(dataSource: ParsedDataSource): Observable<any> {
    // In a real application, you might have a way to dynamically execute functions
    // For this example, we'll use a switch statement with predefined functions
    switch (dataSource.functionName) {
      case 'getCountries':
        return this.getCountries();
      case 'getCities':
        return this.getCities(dataSource.parameters);
      // Add more custom functions as needed
      default:
        throw new Error(`Unknown function: ${dataSource.functionName}`);
    }
  }

  /**
   * Example custom function to get a list of countries
   * @returns An Observable that emits a list of countries
   */
  private getCountries(): Observable<string[]> {
    // In a real application, this might fetch from an API or database
    return of(['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan']);
  }

  /**
   * Example custom function to get a list of cities for a given country
   * @param params Parameters for the function (e.g., country name)
   * @returns An Observable that emits a list of cities
   */
  private getCities(params: any): Observable<string[]> {
    // In a real application, this would fetch cities based on the country
    // Here, we're just returning mock data
    const mockCities = {
      'USA': ['New York', 'Los Angeles', 'Chicago'],
      'UK': ['London', 'Manchester', 'Birmingham'],
      // Add more countries and cities as needed
    };
    return of(mockCities[params.country] || []);
  }

  /**
   * Error handler for HTTP requests
   * @param operation The operation that failed
   * @param result The default result to return in case of error
   * @returns A function that handles errors for an Observable
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // You might want to send the error to a remote logging infrastructure
      return of(result as T);
    };
  }
}

/**
 * Interface representing a parsed data source configuration
 */
interface ParsedDataSource {
  type: 'api' | 'sql' | 'function' | 'static';
  endpoint?: string;
  method?: string;
  query?: string;
  functionName?: string;
  parameters?: any;
  body?: any;
  data?: any; // For static data
}
