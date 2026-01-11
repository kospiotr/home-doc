declare module '#auth-utils' {
  interface User {}

  interface UserSession {
    secure: SecureSessionData
  }

  interface SecureSessionData {
    githubToken: string
  }
}

export {}
