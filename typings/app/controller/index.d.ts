// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Error from '../../../app/controller/error';
import Project from '../../../app/controller/project';
import User from '../../../app/controller/user';
import VerifyToken from '../../../app/controller/verifyToken';

declare module 'egg' {
  interface IController {
    error: Error;
    project: Project;
    user: User;
    verifyToken: VerifyToken;
  }
}
