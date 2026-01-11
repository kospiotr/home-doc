export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        id: user.id,
        avatar: user.avatar_url,
        email: user.email,
        name: user.name,
        bio: user.bio
      },
      secure: {
        githubToken: tokens.access_token
      }
    })
    return sendRedirect(event, '/settings')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/settings')
  },
})
