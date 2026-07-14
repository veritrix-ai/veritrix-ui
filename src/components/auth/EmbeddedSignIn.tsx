import { SignIn } from "@clerk/react";

import { authAppearance } from "@/components/auth/auth-appearance";

export function EmbeddedSignIn() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      forceRedirectUrl="/projects"
      appearance={authAppearance}
    />
  );
}
