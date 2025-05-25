import { useMutation } from "@apollo/client"
import { AUTH_TOKEN, LINKS_PER_PAGE } from "../constants"
import { timeDifferenceForDate } from "../utils"
import { VOTE_MUTATION } from "../graphql/mutation"
import { FEED_QUERY } from "../graphql/query"

const take = LINKS_PER_PAGE;
const skip = 0;
const orderBy = { createdAt: 'desc' };

export type LinkType = {
  id: string
  description: string
  url: string
  createdAt: string
  postedBy: {
    id: string
    name: string
  }
  votes: {
    id: string
    user: {
      id: string
    }
  }[]
}

function Link(props: { link: LinkType, index: number }) {
  const { link } = props
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    update: (cache, {data: {vote}}) => {
      const { feed } : any = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        }
      });

      const updatedLinks = feed.links.map((feedLink : any) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        },
        variables: {
          take,
          skip,
          orderBy
        }
      });
    }
  });
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: 'pointer' }}
            onClick={() => vote()}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {(
          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Link