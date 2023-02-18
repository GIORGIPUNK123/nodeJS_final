import { Express, Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  userId?: number;
}

export const validation =
  (schema: any) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log('req.body: ', req.body);
    try {
      // console.log(req.body);
      await schema.validate({
        body: req.body,
        paramsId: parseInt(req.params.id),
        userId: req.userId,
      });
      next();
    } catch (error: any) {
      res.status(400).send({ error_from_validation_middleware: error.message });
    }
  };
