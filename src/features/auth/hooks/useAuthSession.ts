import { useMe } from "./useMe";
import { useSignOut } from "./useSignOut";

export const useAuthSession = () => {
  const me = useMe();
  const signOut = useSignOut();

  return {
    isAuthenticated: Boolean(me.data),
    isLoading: me.isLoading,
    isSigningOut: signOut.isPending,
    signOut: signOut.mutate,
    userName: me.data?.name ?? "",
  };
};
