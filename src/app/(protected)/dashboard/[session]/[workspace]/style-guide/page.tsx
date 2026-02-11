import { TabsContent } from '@/components/ui/tabs'
import React from 'react'

type Props = {
  searchParams: {
    project: string
  }
}

const Page = async ({ searchParams }: Props) => {

  const projectId = (await searchParams).project
  const existingStyleGuide = await StyleGuideQuery(projectId)

  return (
    <TabsContent
      value='colours'
      className='space-y-8'>

      </TabsContent>
  )
}

export default Page