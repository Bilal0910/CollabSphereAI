// import { ThemeContent } from '@/components/style/theme'
// import { TabsContent } from '@/components/ui/tabs'
// import { MoodBoardImagesQuery, StyleGuideQuery } from '@/convex/query.config'
// import { MoodBoardImage } from '@/hooks/use-styles'
// import { StyleGuide } from '@/redux/api/style-guide'
// import { Palette } from 'lucide-react'
// import React from 'react'
// import { mockStyleGuide } from './mockdata'

// type Props = {
//   searchParams: {
//     project: string
//   }
// }

// const Page = async ({ searchParams }: Props) => {

//   const projectId = (await searchParams).project
//   const existingStyleGuide = await StyleGuideQuery(projectId)

//   const guide = existingStyleGuide.styleGuide
//     ?._valueJSON as unknown as StyleGuide

//   const colorGuide = guide?.colorSections || []
//   const typographyGuide = guide?.typographySections || []

//   const existingMoodBoardImages = await MoodBoardImagesQuery(projectId)

//   const guideImages = existingMoodBoardImages.images
//     ._valueJSON as unknown as MoodBoardImage[]
    

//   return (
//     <TabsContent
//       value='colours'
//       className='space-y-8'>
//       {!colorGuide.length ? (
//         <div className='space-y-8'>
//           <div className='text-center py-20'>
//             <div className='w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center'>
//               <Palette className='w-8 h-8 text-muted-foreground' />
//             </div>
//             <h3 className='text-lg font-medium text-foreground mb-2'>
//               No colours generated yet
//             </h3>
//             <p className='text-sm text-muted-foreground max-w-md mx-auto mb-6'>
//               Upload some images to your mood board and generate an
//               AI-powered style guide colours and typography.
//             </p>
//           </div>
//         </div>
//       ) : (
//         <ThemeContent colorGuide={colorGuide} />
        
//       )}
//     </TabsContent>
//   )
// }

// export default Page


import { ThemeContent } from '@/components/style/theme'
import { TabsContent } from '@/components/ui/tabs'
import { MoodBoardImagesQuery, StyleGuideQuery } from '@/convex/query.config'
import { MoodBoardImage } from '@/hooks/use-styles'
import { Palette } from 'lucide-react'
import React from 'react'
import { mockStyleGuide } from '@/redux/api/style-guide/mockData'
import { StyleGuide } from '@/redux/api/style-guide'

type Props = {
  searchParams: {
    project: string
  }
}

const Page = async ({ searchParams }: Props) => {
  // Await searchParams
  const { project: projectId } = await searchParams

  // Try fetching the real style guide
  const existingStyleGuide = await StyleGuideQuery(projectId)
  const fetchedGuide = existingStyleGuide.styleGuide
    ?._valueJSON as unknown as StyleGuide | undefined

  // Fallback to mock if real guide not available
  const guide = fetchedGuide || mockStyleGuide

  const colorGuide = guide.colorSections || []
  const typographyGuide = guide.typographySections || []

  // Fetch mood board images
  const existingMoodBoardImages = await MoodBoardImagesQuery(projectId)
  const guideImages = existingMoodBoardImages.images
    ?._valueJSON as unknown as MoodBoardImage[] || []

  return (
    <TabsContent
      value='colours'
      className='space-y-8'>
      {!colorGuide.length ? (
        <div className='space-y-8'>
          <div className='text-center py-20'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center'>
              <Palette className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium text-foreground mb-2'>
              No colours generated yet
            </h3>
            <p className='text-sm text-muted-foreground max-w-md mx-auto mb-6'>
              Upload some images to your mood board and generate an
              AI-powered style guide colours and typography.
            </p>
          </div>
        </div>
      ) : (
        <ThemeContent colorGuide={colorGuide} />
      )}
    </TabsContent>
  )
}

export default Page
