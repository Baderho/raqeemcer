import React, { useRef, useState, useCallback } from 'react';
import { Move, Type, QrCode, Hash, FileText, ZoomIn, ZoomOut, Palette, Languages } from 'lucide-react';
import { useCertificateStore, availableFonts, defaultColors } from '@/hooks/useCertificateStore';
import { PositionedElement } from '@/types/certificate';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DraggableElementProps {
  element: PositionedElement;
  containerRef: React.RefObject<HTMLDivElement>;
  onPositionChange: (id: string, x: number, y: number) => void;
  onFontSizeChange: (id: string, fontSize: number) => void;
  previewText: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  containerRef,
  onPositionChange,
  onFontSizeChange,
  previewText,
  isSelected,
  onSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const getIcon = () => {
    switch (element.type) {
      case 'name': return <Type className="w-3 h-3" />;
      case 'title': return <FileText className="w-3 h-3" />;
      case 'sentence': return <FileText className="w-3 h-3" />;
      case 'qrcode': return <QrCode className="w-3 h-3" />;
      case 'certificateId': return <Hash className="w-3 h-3" />;
      default: return <Move className="w-3 h-3" />;
    }
  };

  const getLabel = () => {
    switch (element.type) {
      case 'name': return 'Participant Name';
      case 'title': return 'Course Title';
      case 'sentence': return 'Fixed Sentence';
      case 'qrcode': return 'QR Code';
      case 'certificateId': return 'Certificate ID';
      default: return 'Element';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(element.id);
    setIsDragging(true);

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = element.position.x;
    const startPosY = element.position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / containerRect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / containerRect.height) * 100;

      const newX = Math.max(0, Math.min(95, startPosX + deltaX));
      const newY = Math.max(0, Math.min(95, startPosY + deltaY));

      onPositionChange(element.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!element.visible) return null;

  const isQrCode = element.type === 'qrcode';
  const fontSize = element.style?.fontSize || 24;

  return (
    <div
      ref={elementRef}
      className={`absolute drag-handle ${isDragging ? 'dragging z-50' : 'z-10'} ${isSelected ? 'ring-2 ring-accent ring-offset-2 rounded-lg' : ''}`}
      style={{
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative group">
        {/* Label with font size */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-navy text-primary-foreground text-xs rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
            {getIcon()}
            <span>{getLabel()}</span>
            {!isQrCode && <span className="text-gold ml-1">({fontSize}px)</span>}
          </div>
        </div>

        {/* Element preview */}
        {isQrCode ? (
          <div
            className="bg-white p-2 rounded-lg shadow-medium border-2 border-dashed border-accent"
            style={{ width: element.size.width, height: element.size.width }}
          >
            <div className="w-full h-full bg-muted rounded flex items-center justify-center">
              <QrCode className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        ) : (
          <div
            className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-medium border-2 border-dashed border-accent"
            style={{
              fontFamily: element.style?.fontFamily,
              fontSize: `${Math.min(fontSize, 32)}px`,
              fontWeight: element.style?.fontWeight,
              color: element.style?.color,
              textAlign: element.style?.textAlign,
              minWidth: '100px',
            }}
          >
            {previewText}
          </div>
        )}

        {/* Drag indicator */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Move className="w-2 h-2 text-accent-foreground" />
        </div>
      </div>
    </div>
  );
};
export const PositioningEditor: React.FC = () => {
  const { template, updateElement, config, setCurrentStep } = useCertificateStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    updateElement(id, { position: { x, y } });
  }, [updateElement]);

  const handleFontSizeChange = useCallback((id: string, fontSize: number) => {
    const element = template?.elements.find(e => e.id === id);
    updateElement(id, { 
      style: { 
        ...element?.style,
        fontSize 
      } 
    });
  }, [updateElement, template]);

  const handleFontFamilyChange = useCallback((id: string, fontFamily: string) => {
    const element = template?.elements.find(e => e.id === id);
    updateElement(id, { 
      style: { 
        ...element?.style,
        fontFamily 
      } 
    });
  }, [updateElement, template]);

  const handleColorChange = useCallback((id: string, color: string) => {
    const element = template?.elements.find(e => e.id === id);
    updateElement(id, { 
      style: { 
        ...element?.style,
        color 
      } 
    });
  }, [updateElement, template]);

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please upload a template first</p>
      </div>
    );
  }

  const getPreviewText = (element: PositionedElement): string => {
    switch (element.type) {
      case 'name': return 'John Doe';
      case 'title': return config.courseTitle || 'Course Title';
      case 'sentence': return config.fixedSentence;
      case 'certificateId': return `${config.certificateIdPrefix}-001`;
      default: return '';
    }
  };

  const selectedElement = template.elements.find(e => e.id === selectedElementId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
          Position Certificate Elements
        </h2>
        <p className="text-muted-foreground">
          Drag elements to position them on your certificate template
        </p>
      </div>

      <div className="flex gap-6 max-w-[1200px] mx-auto">
        {/* Canvas */}
        <div
          ref={containerRef}
          className="relative certificate-canvas rounded-xl overflow-hidden flex-1"
          style={{
            aspectRatio: `${template.width} / ${template.height}`,
          }}
        >
          <img
            src={template.imageUrl}
            alt="Certificate template"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />

          {template.elements.map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              containerRef={containerRef}
              onPositionChange={handlePositionChange}
              onFontSizeChange={handleFontSizeChange}
              previewText={getPreviewText(element)}
              isSelected={selectedElementId === element.id}
              onSelect={setSelectedElementId}
            />
          ))}
        </div>

        {/* Text Style Controls Panel */}
        <div className="w-80 glass-panel p-4 space-y-4 h-fit max-h-[80vh] overflow-y-auto">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Languages className="w-4 h-4 text-accent" />
            تنسيق النص / Text Styling
          </h3>
          
          {template.elements
            .filter(el => el.type !== 'qrcode' && el.visible)
            .map((element) => {
              const fontSize = element.style?.fontSize || 24;
              const fontFamily = element.style?.fontFamily || 'Cairo, sans-serif';
              const color = element.style?.color || '#1e3a5f';
              
              const getLabel = () => {
                switch (element.type) {
                  case 'name': return 'اسم المشارك / Name';
                  case 'title': return 'عنوان الدورة / Title';
                  case 'sentence': return 'الجملة الثابتة / Sentence';
                  case 'certificateId': return 'رقم الشهادة / ID';
                  default: return 'Element';
                }
              };
              
              return (
                <div 
                  key={element.id} 
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedElementId === element.id 
                      ? 'border-accent bg-accent/10' 
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setSelectedElementId(element.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">{getLabel()}</span>
                  </div>
                  
                  {/* Font Size */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-muted-foreground">حجم الخط / Size</Label>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {fontSize}px
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ZoomOut className="w-3 h-3 text-muted-foreground" />
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => handleFontSizeChange(element.id, value[0])}
                        min={12}
                        max={72}
                        step={1}
                        className="flex-1"
                      />
                      <ZoomIn className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Font Family */}
                  <div className="mb-3">
                    <Label className="text-xs text-muted-foreground mb-1 block">نوع الخط / Font</Label>
                    <Select
                      value={fontFamily}
                      onValueChange={(value) => handleFontFamilyChange(element.id, value)}
                    >
                      <SelectTrigger className="w-full h-8 text-xs bg-background">
                        <SelectValue placeholder="اختر الخط" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
                        <div className="text-xs text-muted-foreground px-2 py-1 border-b">خطوط عربية</div>
                        {availableFonts.filter(f => f.arabic).map((font) => (
                          <SelectItem 
                            key={font.family} 
                            value={font.family}
                            className="text-sm"
                            style={{ fontFamily: font.family }}
                          >
                            {font.name}
                          </SelectItem>
                        ))}
                        <div className="text-xs text-muted-foreground px-2 py-1 border-b border-t mt-1">English Fonts</div>
                        {availableFonts.filter(f => !f.arabic).map((font) => (
                          <SelectItem 
                            key={font.family} 
                            value={font.family}
                            className="text-sm"
                            style={{ fontFamily: font.family }}
                          >
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Picker */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">لون النص / Color</Label>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="w-8 h-8 rounded-md border-2 border-border shadow-sm hover:scale-105 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3 bg-popover border shadow-lg z-50" align="start">
                          <div className="grid grid-cols-5 gap-2 mb-3">
                            {defaultColors.map((c) => (
                              <button
                                key={c}
                                className={`w-7 h-7 rounded-md border-2 transition-all hover:scale-110 ${
                                  color === c ? 'border-accent ring-2 ring-accent/30' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: c }}
                                onClick={() => handleColorChange(element.id, c)}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-muted-foreground" />
                            <Input
                              type="color"
                              value={color}
                              onChange={(e) => handleColorChange(element.id, e.target.value)}
                              className="w-full h-8 p-0 border-0 cursor-pointer"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(element.id, e.target.value)}
                        className="flex-1 h-8 text-xs font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          {/* QR Code Size Control */}
          {template.elements
            .filter(el => el.type === 'qrcode' && el.visible)
            .map((element) => (
              <div 
                key={element.id} 
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedElementId === element.id 
                    ? 'border-accent bg-accent/10' 
                    : 'border-border hover:border-accent/50'
                }`}
                onClick={() => setSelectedElementId(element.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">رمز QR / QR Code</span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    {element.size.width}px
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-3 h-3 text-muted-foreground" />
                  <Slider
                    value={[element.size.width]}
                    onValueChange={(value) => updateElement(element.id, { size: { width: value[0], height: value[0] } })}
                    min={50}
                    max={200}
                    step={5}
                    className="flex-1"
                  />
                  <ZoomIn className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="glass-panel p-4 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Move className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-medium text-foreground">Drag to reposition & resize text</p>
            <p className="text-sm text-muted-foreground">
              Click and drag any element to move it. Use the sliders on the right to adjust text sizes.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Template
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="gold-button"
        >
          Continue to Upload Data
        </button>
      </div>
    </div>
  );
};
