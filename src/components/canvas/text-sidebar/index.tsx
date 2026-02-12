import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { TextShape, updateShape } from '@/redux/slice/shapes'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Bold, Italic, Palette, Strikethrough, Underline } from 'lucide-react'
import React from 'react'
import { Label } from '@/components/ui/label'

type Props = {
    isOpen: boolean
}



const TextSidebar = ({ isOpen }: Props) => {
    const dispatch = useAppDispatch()
    const selectedShape = useAppSelector((state) => state.shapes.selected)
    const shapesEntities = useAppSelector((state) => state.shapes.shapes.entities)
    const [colorInput, setColorInput] = React.useState('#ffffff')


    const fontFamilies = [
        'Inter, sans-serif',
        'Poppins, sans-serif',
        'Roboto, sans-serif',
        'Lato, sans-serif',
        'Open Sans, sans-serif',
        'Arial, sans-serif',
        'Helvetica, sans-serif',
        'Times New Roman, serif',
        'Courier New, monospace',
        'Georgia, serif',
        'Trebuchet MS, sans-serif',
        'system-ui, sans-serif'
    ]

    const selectedTextShape = Object.keys(selectedShape)
        .map((id) => shapesEntities[id])
        .find((shape) => shape?.type === 'text') as TextShape | undefined


    const updateTextProperty = (property: keyof TextShape, value: any) => {
        if (!selectedTextShape) return

        dispatch(
            updateShape({
                id: selectedTextShape.id,
                patch: {
                    [property]: value
                }
            })
        )

        
    }


    const handleColorChange = (color: string) => {
        setColorInput(color)
        if (/^#[0-9A-F]{6}$/i.test(color) || /^#[0-9A-F]{3}$/i.test(color)) {
            updateTextProperty('fill', color)
        }
    }


    if (!isOpen || !selectedTextShape) return null

    // TODO isOpen
    return (
        <div className={cn(
            'fixed right-5 top-1/2 transform -translate-y-1/2 w-80 backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] gap-2 transition-transform duration-300 saturate-150 p-3 rounded-lg z-50',
            isOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
            <div className='p-4 flex flex-col gap-10 overflow-y-auto max-h-[calc(100vh-8rem)]'>
                <div className='space-y-2'>
                    <Label className='text-white/50'>Font Family</Label>
                    <Select
                        value={selectedTextShape.fontFamily}
                        onValueChange={(value) => updateTextProperty('fontFamily', value)}
                    >
                        <SelectTrigger className='bg-white/5 border-white/10 w-full text-white'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='bg-black/90 border-white/10'>
                            {fontFamilies.map((font) => (
                                <SelectItem key={font} value={font} className='text-white hover:bg-white/10'>
                                    <span style={{ fontFamily: font }}>{font.split(',')[0]}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='space-y-2'>
                    <Label className='text-white/80'>
                        Font Size: {selectedTextShape.fontSize}
                    </Label>
                    <Slider
                        value={[selectedTextShape?.fontSize]}
                        onValueChange={([value]) => updateTextProperty('fontSize', value)}
                        min={8}
                        max={128}
                        step={1}
                        className='w-full'
                    />
                </div>
                <div className='space-y-2'>
                    <Label className='text-white/80'>
                        Font Weight: {selectedTextShape?.fontWeight}
                    </Label>
                    <Slider
                        value={[selectedTextShape?.fontWeight]}
                        onValueChange={([value]) => updateTextProperty('fontWeight', value)}
                        min={100}
                        max={900}
                        step={100}
                        className='w-full'
                    />
                </div>
                <div className='space-y-3'>
                    <Label className='text-white/80'>Style</Label>
                    <div className='flex gap-2'>
                        <Toggle
                            pressed={selectedTextShape?.fontWeight > 600}
                            onPressedChange={(pressed) =>
                                updateTextProperty('fontWeight', pressed ? 700 : 400)
                            }
                            className='data-[state=on]:bg-blue-500 data-[state=on]:text-white'>
                            <Bold className='w-4 h-4' />
                        </Toggle>
                        <Toggle
                            pressed={selectedTextShape?.fontStyle === 'italic'}
                            onPressedChange={(pressed) =>
                                updateTextProperty('fontStyle', pressed ? 'italic' : 'normal')
                            }
                            className='data-[state=on]:bg-blue-500 data-[state=on]:text-white'>
                            <Italic className='w-4 h-4' />
                        </Toggle>
                        <Toggle
                            pressed={selectedTextShape?.textDecoration === 'underline'}
                            onPressedChange={(pressed) =>
                                updateTextProperty('textDecoration', pressed ? 'underline' : 'none')
                            }
                            className='data-[state=on]:bg-blue-500 data-[state=on]:text-white'>
                            <Underline className='w-4 h-4' />
                        </Toggle>
                        <Toggle
                            pressed={selectedTextShape?.textDecoration === 'line-through'}
                            onPressedChange={(pressed) =>
                                updateTextProperty('textDecoration', pressed ? 'line-through' : 'none')
                            }
                            className='data-[state=on]:bg-blue-500 data-[state=on]:text-white'>
                            <Strikethrough className='w-4 h-4' />
                        </Toggle>
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label className='text-white/80'>
                        Line Height: {selectedTextShape?.lineHeight}
                    </Label>
                    <Slider
                        value={[selectedTextShape.lineHeight]}
                        onValueChange={([value]) => updateTextProperty('lineHeight', value)}
                        min={0.8}
                        max={3}
                        step={0.1}
                        className='w-full'
                    />
                </div>

                <div className='space-y-2'>
                    <Label className='text-white/80'>
                        Letter Spacing: {selectedTextShape?.letterSpacing}
                    </Label>
                    <Slider
                        value={[selectedTextShape.letterSpacing]}
                        onValueChange={([value]) => updateTextProperty('letterSpacing', value)}
                        min={-0.5}
                        max={0.5}
                        step={0.1}
                        className='w-full'
                    />
                </div>

                <div className='flex gap-2'>
                    <Label className='text-white/80 flex items-center gap-2'>
                        <Palette className='w-4 h-4' />
                        Text Color
                    </Label>
                    <div className='flex gap-2'>
                        <Input
                            value={colorInput}
                            onChange={(e) => handleColorChange(e.target.value)}
                            placeholder='#ffffff'
                            className='bg-white/5 border-white/20 text-white flex-1'
                        />
                        <div
                            className='w-10 h-10 rounded border border-white/20 cursor-pointer'
                            style={{ backgroundColor: selectedTextShape?.fill || '#ffffff' }}
                            onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'color'
                                input.value = selectedTextShape?.fill || '#ffffff'
                                input.onchange = (e) => {
                                    const color = (e.target as HTMLInputElement).value
                                    setColorInput(color)
                                    updateTextProperty('fill', color)
                                }
                                input.click()
                            }}
                        >
                        </div>
                    </div>
                </div>

                {/* ALIGN */}
                <div className='space-y-2'>
                    <Label className='text-white/80'>Align</Label>
                    <div className='flex gap-2'>
                        {['left', 'center', 'right', 'justify'].map((align) => (
                            <Toggle
                                key={align}
                                pressed={selectedTextShape.textAlign === align}
                                onPressedChange={() => updateTextProperty('textAlign', align)}
                                className='data-[state=on]:bg-blue-500 data-[state=on]:text-white'
                            >
                                {align}
                            </Toggle>
                        ))}
                    </div>
                </div>

                {/* STROKE */}
                <div className='space-y-2'>
                    <Label className='text-white/80'>Stroke</Label>
                    <div className='flex gap-2'>
                        <Input
                            type='number'
                            min={0}
                            max={20}
                            value={selectedTextShape.strokeWidth || 0}
                            onChange={(e) => updateTextProperty('strokeWidth', Number(e.target.value))}
                            className='bg-white/5 border-white/20 text-white w-20'
                        />

                        <div
                            className='w-10 h-10 rounded border border-white/20 cursor-pointer'
                            style={{ backgroundColor: selectedTextShape.stroke || '#ffffff' }}
                            onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'color'
                                input.value = selectedTextShape.stroke || '#ffffff'
                                input.onchange = (e) => {
                                    updateTextProperty('stroke', (e.target as HTMLInputElement).value)
                                }
                                input.click()
                            }}
                        />
                    </div>
                </div>

                {/* PADDING */}
                <div className='space-y-2'>
                    <Label className='text-white/80'>Padding</Label>
                    <div className='grid grid-cols-4 gap-2'>
                        {(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as const).map((side) => (
                            <Input
                                key={side}
                                type='number'
                                value={selectedTextShape[side] || 0}
                                onChange={(e) => updateTextProperty(side, Number(e.target.value))}
                                className='bg-white/5 border-white/20 text-white'
                            />
                        ))}
                    </div>
                </div>

                {/* PARAGRAPH SPACING */}
                <div className='space-y-2'>
                    <Label className='text-white/80'>
                        Paragraph Spacing: {selectedTextShape.paragraphSpacing || 0}
                    </Label>
                    <Slider
                        value={[selectedTextShape.paragraphSpacing || 0]}
                        onValueChange={([value]) => updateTextProperty('paragraphSpacing', value)}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>
            </div>
        </div>
    )
}

export default TextSidebar