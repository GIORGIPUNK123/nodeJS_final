import { Express, Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: {
    userId: number;
  };
}

export const validation =
  (schema: any) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log('req.body: ', req.body);
    try {
      // console.log(req.body);
      await schema.validate(req.body, {
        context: { userId: req.user?.userId },
      });
      next();
      // create a new user in the database
      // res.status(200).send({ message: 'Validation passed' });
    } catch (error: any) {
      res.status(400).send({ error_from_validation_middleware: error.message });
    }
  };
