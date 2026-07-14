import { SignUp } from "@clerk/react";

import { authAppearance } from "@/components/auth/auth-appearance";

export function EmbeddedSignUp() {
  return (
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      forceRedirectUrl="/welcome"
      appearance={authAppearance}
    />
  );
}
