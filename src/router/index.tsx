import React, { Suspense, lazy } from "react";

const Discovery = lazy(() => import("../pages/discovery"));

const SuspenseComponent = (Com) => (props) => {
  return (
    <Suspense fallback={null}>
      <Com {...props} />
    </Suspense>
  );
};

const routeArr: any[] = [
  {
    path: "/",
    exact: true,
    component: SuspenseComponent(Discovery),
  },
];

export default routeArr;
