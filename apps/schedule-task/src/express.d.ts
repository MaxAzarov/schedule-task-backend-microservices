declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends Pick<AppUser, 'id' | 'role' | 'email'> {}
  }
}
