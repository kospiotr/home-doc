export default eventHandler(async (event) => {
  const session = await getUserSession(event)
  const token = session.secure?.githubToken

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No GitHub token found'
    })
  }

  const {owner, repo} = getRouterParams(event)

  return await $fetch(`https://api.github.com/user/repos/${owner}/${repo}/branches`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })
})
