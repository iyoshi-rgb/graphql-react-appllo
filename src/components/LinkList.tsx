import { gql, useQuery } from '@apollo/client';
import Link, { type LinkType } from './Link';

const FEED_QUERY = gql`
{
  feed {
    id
    links {
      id
      createdAt
      url
      description
    }
  }
}
`

function LinkList() {
  const { data } = useQuery(FEED_QUERY)

  return (
    <div>
      {data && (
        <>
          {data.feed.links.map((link: LinkType) => (
            <Link key={link.id} link={link} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;