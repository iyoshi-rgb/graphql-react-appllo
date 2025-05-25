import { useQuery } from '@apollo/client';
import Link, { type LinkType } from './Link';
import { FEED_QUERY } from '../graphql/query';


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