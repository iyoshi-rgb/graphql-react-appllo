export type LinkType = {
  id: string
  description: string
  url: string
  createdAt: string
}

function Link(props: { link: LinkType }) {
  const { link } = props
  return (
    <div>
      <div>
        {link.description} ({link.url})
      </div>
    </div>
  )
}

export default Link