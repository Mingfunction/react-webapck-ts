import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

interface IProps {
  routes: {
    path: string;
    key?: string;
    exact?: boolean;
    strict?: any;
    render?: () => React.FC;
    requiresAuth?: string;
    component?: React.FC;
  }[];
  authed?: any;
  authPath?: string;
  extraProps?: any;
  switchProps?: any;
}

const renderRoutes = (props: IProps) => {
  const {
    routes,
    authed,
    authPath = "/login",
    extraProps = {},
    switchProps = {},
  } = props;
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={
            route.render ||
            ((props) => {
              if (!route.requiresAuth || authed || route.path === authPath) {
                return (
                  <route.component {...props} {...extraProps} route={route} />
                );
              }
              return (
                <Redirect
                  to={{ pathname: authPath, state: { from: props.location } }}
                />
              );
            })
          }
        />
      ))}
    </Switch>
  ) : null;
};

export default renderRoutes;
