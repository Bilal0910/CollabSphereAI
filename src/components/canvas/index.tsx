'use client'
import { useInfiniteCanvas } from '@/hooks/use-canvas'
import React from 'react'
import TextSidebar from './text-sidebar'
import { cn } from '@/lib/utils'
import ShapeRenderer from './shapes'

type Props = {}

const InfiniteCanvas = (props: Props) => {
  const {
    viewport,
    shapes,
    currentTool,
    selectedShapes,
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerCancel,
    attachCanvasRef,
    getDraftShape,
    getFreeDrawPoints,
    isSidebarOpen,
    hasSelectedText,
  } = useInfiniteCanvas()

  const draftShape = getDraftShape()
  const freeDrawPoints = getFreeDrawPoints()
  return (
    <>
    <TextSidebar isOpen={isSidebarOpen && hasSelectedText} />

    <div
    ref={attachCanvasRef}
    role='application'
    aria-label='Infinite drawing canvas'
    className={cn(
      'relative w-full h-full overflow-hidden select-none z-0',
      {
        'cursor-move': viewport.mode === 'panning',
        'cursor-pointer': viewport.mode === 'shiftPanning',
        'cursor-crosshair':
        currentTool !== 'select' && viewport.mode === 'idle',
        'cursor-default':
        currentTool === 'select' && viewport.mode === 'idle',
      }
    )}
    style={{touchAction: 'none'}}
    onPointerDown={onPointerDown}
    onPointerUp={onPointerUp}
    onPointerMove={onPointerMove}
    onPointerCancel={onPointerCancel}
    onContextMenu={(e) => e.preventDefault()}
    draggable={false}
    >
      <div
      className='absolute origin-top-left pointer-events-none z-10'
      style={{
  transform: `translate(${viewport.translate.x}px, ${viewport.translate.y}px) scale(${viewport.scale})`,
  transformOrigin: '0 0',
  willChange: 'transform'
}}

      >
        {shapes.map((shape) => (
          <ShapeRenderer 
          key={shape.id}
          shape={shape}
          // toggleInspiration={toggleInspiration}
          // toggleChat={toggleChat}
          // generateWorkflow={generateWorkflow}
          // exportDesign={exportDesign}
          />
        ))}

        {draftShape && draftShape.type === 'frame' && (
          <FramePreview
          startWorld={draftShape.startWorld}
          currentWorld={draftShape.currentWorld} />
        )}

        
      </div>
    </div>
    </>
  )
}

export default InfiniteCanvas