import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

type Get = {
  url: string;
  requestOptions: {
    headers?: object;
    params?: object;
  };
};

@Injectable()
export class RestClientService {
  constructor(private readonly httpService: HttpService) {}

  public async get(config: Get) {
    const { data } = await firstValueFrom(
      this.httpService.get(config.url, config.requestOptions).pipe(
        catchError((error: AxiosError) => {
          throw new Error(error.message);
        }),
      ),
    );

    return data;
  }
}
