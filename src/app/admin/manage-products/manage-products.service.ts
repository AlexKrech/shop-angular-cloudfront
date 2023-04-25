import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        })
      )
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    return this.http.get<string>(
      'https://k0lwegv1sa.execute-api.eu-west-1.amazonaws.com/dev/import',
      {
        params: {
          name: fileName,
        },
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      }
    );
  }
}
