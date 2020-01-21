import { Request, Response } from 'express';
import access_token from '../models/access_token.model.';
import profile from '../models/profile.model';

export const checkAccessToken = async (req: any, res: Response, next) => {
  try {
    if (!req.headers.accesstoken) {

      res.status(403).send({
        status: {
          error: 'Header must be provided',
          statusCode: 401,
          statusText: 'UNAUTHENTICATED'
        }
      });
    } else {
      const accessToken = await access_token.findOne({id:req.headers.accesstoken});
      //console.log(req.headers.accesstoken , accessToken.toJSON().payload);


      if (!accessToken) {
        res.status(401).send({
          status: {
            error: 'Access Token is not found',
            statusCode: 401,
            statusText: 'UNAUTHENTICATED'
          }
        });        
      } else {

        //console.log(payload.accountId);
          
        req.uid = accessToken.toJSON().payload.accountId;
        req.profile =  await profile
        .findOne({ id: process.env.BASE_URL+accessToken.toJSON().payload.accountId });

        //console.log(req.profile , req.uid);
        next();
      }
    }
  } catch (error) {
    console.log(error);
  }
};