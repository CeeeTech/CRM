import { AuthGuard } from 'src/guards/auth-guard';

export const withAuthGuard = (Component, requiredPermissions, allowedUserTypes) => (props) => (
  <AuthGuard requiredPermissions={requiredPermissions} allowedUserTypes={allowedUserTypes}>
    <Component {...props} />
  </AuthGuard>
);
