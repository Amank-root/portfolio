/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */


import {NextStudio} from 'next-sanity/studio'
import config from '../../../sanity.config'
import type {Metadata} from 'next'
import {metadata as studioMetadata, viewport} from 'next-sanity/studio'
import { connection } from 'next/server'
import { Suspense } from 'react'

// export const dynamic = 'force-static'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Studio',
  description: 'Sanity Studio for managing portfolio content.',
  // You can override robots if you really want, but the defaults already set noindex
  robots: {
    index: false,
    follow: false,
  },
}

export {viewport}

async function Connection() {
  await connection()
  return null
}

export default function StudioPage() {
  return (
    <>
      <Suspense fallback={null}>
        <Connection />
      </Suspense>
      <NextStudio config={config} />
    </>
  )
}