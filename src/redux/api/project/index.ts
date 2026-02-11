import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface AutosaveProjectRequest {
    projectId: string,
    usedId: string,
    shapesData: {
        shapes: Record<string, unknown>,
        tool: string,
        selected: Record<string, unknown>,
        frameCounter: number
    }
    viewportData?: {
        scale: number,
        translate: {x: number, y: number}
    }
}


interface AutosaveProjectResponse {
    success: boolean,
    message: string,
    event: string,
}




export const ProjectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/project'}),
    tagTypes: ['Project'],
    endpoints: (builder) => ({
        autosaveProject: builder.mutation<
        AutosaveProjectResponse,
        AutosaveProjectRequest
        >({
            query: (data) => ({
                url: '',
                method: 'POST',
                body: data,
            }),
        }),
    }),
})