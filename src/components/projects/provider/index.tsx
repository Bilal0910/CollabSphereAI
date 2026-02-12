'use client'
import { loadProject } from '@/redux/slice/shapes'
import { restoreViewport } from '@/redux/slice/viewport'
import { useAppDispatch } from '@/redux/store'
import React, { useEffect } from 'react'

type Props = { children: React.ReactNode, initialProject: any }

const ProjectProvider = ({ children, initialProject }: Props) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (initialProject?._valueJSON.sketchesData) {
            const projectData = initialProject._valueJSON

            dispatch(loadProject(projectData.sketchesData))
            if (projectData.viewport) {
                dispatch(restoreViewport(projectData.viewport))
            }
        }

    }, [initialProject, dispatch])
    return (
        <div>{children}</div>
    )
}

export default ProjectProvider