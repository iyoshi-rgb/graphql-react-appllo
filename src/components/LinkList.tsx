import { useQuery } from '@apollo/client';
import Link, { type LinkType } from './Link';
import { FEED_QUERY } from '../graphql/query';
import { NEW_LINKS_SUBSCRIPTION } from '../graphql/subscription';

function LinkList() {
  const result = useQuery(FEED_QUERY);
  const { data, subscribeToMore } = result;

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    onError: (err) => console.error('Subscription error:', err),
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(
        ({ id }: { id: string }) => id === newLink.id
      );
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      });
    }
  });

  return (
    <div>
      {data && (
        <>
          {data.feed.links.map((link: LinkType, index: number) => (
            <Link key={link.id} link={link} index={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;