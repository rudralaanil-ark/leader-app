export default function authErrorMessage(code?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "User already exists. Please sign in.";
    case "auth/invalid-email":
      return "Please enter a valid email.";
    case "auth/weak-password":
      return "Please use a stronger password.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is disabled for this project.";
    default:
      return "Something went wrong. Please try again.";
  }
}
