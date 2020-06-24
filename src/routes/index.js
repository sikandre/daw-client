import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from './Route';

import Projects from '../pages/Project/ProjectList';
import Login from '../pages/login';
import Signup from '../pages/signup';
import ProjectDetail from '../pages/Project/PojectDetails';
import { CreateProject } from '../pages/Project/CreateProject';

export const Routes = () => {
  return (
    <>
      <Switch>
        <Route path='/' exact component={Signup} />
        <Route path='/login' component={Login} />
        <Route path='/projects' exact component={Projects} isPrivate />
        <Route
          path='/projects/:pName'
          exact
          component={ProjectDetail}
          isPrivate
        />
        <Route
          path='/createProject'
          exact
          component={CreateProject}
          isPrivate
        />
        <Route
          path='/projects/:pName/issues/:issueId'
          component={() => <h1>Not yet Implemented :(</h1>}
          isPrivate
        />
      </Switch>
    </>
  );
};
