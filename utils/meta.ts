import { Metadata } from 'next'

export function constructMetadata({
  title = 'mood - the journal for your moods',
  description = 'mood is a journal app capable of analyzing your moods with AI.',
  image = '/thumbnail.webp',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    //   twitter: {
    //     card: "summary_large_image",
    //     title,
    //     description,
    //     images: [image],
    //     creator: "@joshtriedcoding"
    //   },
    icons,
    metadataBase: new URL('https://mood-v2-ten.vercel.app/'),
    themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
