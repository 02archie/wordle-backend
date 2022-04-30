export class AppController {
  responseOk(data: [], res) {
    const statusCode = 200;
    return res.status(statusCode).json({
      errors: false,
      status_code: statusCode,
      data: data ? data : [],
    });
  }

  responseOkPagination(data: [], pagination: [], res) {
    const statusCode = 200;
    return res.status(statusCode).json({
      errors: false,
      status_code: statusCode,
      data: data ? data : [],
      pagination: pagination,
    });
  }

  responseWithErrors(error: [], res) {
    const statusCode = 400;
    return res.status(statusCode).json({
      status_code: statusCode,
      errors: error,
    });
  }

  responseErrorWithMessage(message: string, res) {
    const statusCode = 400;
    return res.status(statusCode).json({
      status_code: statusCode,
      errors: message,
    });
  }
}
