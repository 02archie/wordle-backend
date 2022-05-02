import { Response } from 'express';

export class AppController {
  // Metodo para estructurar respuesta con status 200
  responseOk(data: Object, res: Response) {
    const statusCode = 200;
    return res.status(statusCode).json({
      errors: false,
      status_code: statusCode,
      data: data ? data : [],
    });
  }

  // Metodo para estructurar respuesta error
  responseWithErrors(error: Object, res: Response) {
    const statusCode = 400;
    return res.status(statusCode).json({
      status_code: statusCode,
      errors: error,
    });
  }
}
