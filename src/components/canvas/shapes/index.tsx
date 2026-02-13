import { Shape } from '@/redux/slice/shapes'
import React from 'react'
import { Frame } from './frame';
import { Rectangle } from './rectangle';
import { Stroke } from './stroke';
import { Arrow } from './arrow';
import { Line } from './line';
import { Text } from './text';
import { Elipse } from './elipse';

type Props = {}
const ShapeRenderer = ({
    shape,
    toggleInspiration,
    toggleChat,
    generateWorkflow,
    exportDesign
}: {
    shape: Shape;
    toggleInspiration: () => void;
    toggleChat: (generateUIId: string) => void;
    generateWorkflow: (generateUIId: string) => void;
    exportDesign: (generateUIId: string, element: HTMLElement | null) => void;
}) => {
    switch (shape.type) {
        case 'frame':
            return (
                <Frame
                    shape={shape}
                    toggleInspiration={toggleInspiration}
                />
            )
        case 'rect':
            return <Rectangle shape={shape} />
        case 'ellipse':
            return <Elipse shape={shape} />
        case 'freedraw':
            return <Stroke shape={shape} />
        case 'arrow':
            return <Arrow shape={shape} />
        case 'line':
            return <Line shape={shape} />
        case 'text':
            return <Text shape={shape} />
    }
}

export default ShapeRenderer