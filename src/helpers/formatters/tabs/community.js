import i18n from '#/plugins/i18n'
import {
  main as formatCommunityMainLink,
  posts as formatCommunityPostsLink
} from '@/helpers/formatters/links/community'

export default function (
  {
    communityId,
    communityTitle,
    scope
  }
) {
  function formatIcon () {
    switch (scope) {
      case 'posts':
        return 'post'
      default:
        return 'community'
    }
  }

  function formatTitle () {
    if (scope) {
      return i18n.global.t(
        `navigation.model.${scope}`,
        {
          modelName: communityTitle
        }
      )
    } else {
      return communityTitle
    }
  }

  function formatPath () {
    switch (scope) {
      case 'posts':
        return formatCommunityPostsLink(
          {
            communityId
          }
        ).path
      default:
        return formatCommunityMainLink(
          {
            communityId
          }
        ).path
    }
  }

  return {
    icon: formatIcon(),
    title: formatTitle(),
    path: formatPath()
  }
}
