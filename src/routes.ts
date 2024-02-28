import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const ROUTES = {
  workflow: '/workflow',
  history: '/workflow/history',
  workspaces: '/workspaces',
} as const;

export const useRouteConditions = () => {
  const location = useLocation();

  const isWorkflowPage = ROUTES.workflow === location.pathname;
  const isWorkspacesPage = ROUTES.workspaces === location.pathname;

  return useMemo(() => ({ isWorkflowPage, isWorkspacesPage }), [isWorkflowPage, isWorkspacesPage]);
};
