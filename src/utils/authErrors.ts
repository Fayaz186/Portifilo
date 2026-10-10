export function getSignInError(
  error: { code?: string; message?: string } | null | undefined,
  provider: 'Google' | 'Email/Password',
): string {
  switch (error?.code) {
    case 'auth/unauthorized-domain':
      return `This site's domain (${window.location.hostname}) is not authorized for Firebase sign-in. Add it in Firebase Console > Authentication > Settings > Authorized domains. (auth/unauthorized-domain)`;
    case 'auth/operation-not-allowed':
      return `${provider} sign-in is disabled. Enable it in Firebase Console > Authentication > Sign-in method. (auth/operation-not-allowed)`;
    case 'auth/internal-error':
      return 'Firebase could not complete sign-in (auth/internal-error). Try opening the site directly in your browser instead of an embedded preview. If it still fails, check this Firebase project’s sign-in provider and OAuth configuration.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow popups for this site and try again. (auth/popup-blocked)';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window closed before sign-in completed. Please try again. (auth/popup-closed-by-user)';
    case 'auth/network-request-failed':
      return 'Firebase could not be reached. Check your connection and try again. (auth/network-request-failed)';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Check your Firebase account credentials or use Sign In with Google.';
    default:
      return error?.message || 'Sign-in failed. Please try again.';
  }
}
