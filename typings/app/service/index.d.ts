// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Error from '../../../app/service/error';
import Project from '../../../app/service/project';
import User from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    error: Error;
    project: Project;
    user: User;
  }
}
