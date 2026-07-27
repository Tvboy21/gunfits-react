import html2canvas from 'html2canvas';
import { DesignElement } from '../types';

export const generateDesignPreview = async (canvasElement: HTMLElement): Promise<string> => {
  try {
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#060606',
      scale: 2,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating preview:', error);
    throw error;
  }
};

export const downloadDesignAsJSON = (elements: DesignElement[], filename: string = 'design.json') => {
  const data = JSON.stringify(elements, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadDesignAsPNG = async (
  canvasElement: HTMLElement,
  filename: string = 'design.png'
) => {
  try {
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: null,
      scale: 2,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Error downloading PNG:', error);
  }
};

export const downloadDesignAsSVG = (elements: DesignElement[], filename: string = 'design.svg') => {
  const svgContent = `
    <svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          text { font-family: Arial, sans-serif; }
          image { max-width: 100%; max-height: 100%; }
        </style>
      </defs>
      <rect width="600" height="800" fill="#060606"/>
      ${elements
        .map((el) => {
          if (el.type === 'text') {
            return `
              <text
                x="${el.x}"
                y="${el.y}"
                font-size="${el.fontSize || 24}"
                fill="${el.fontColor || '#EEEBE3'}"
                font-family="${el.fontFamily || 'Arial'}"
                opacity="${el.opacity}"
                transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"
              >
                ${el.content}
              </text>
            `;
          }
          if (el.type === 'image' || el.type === 'logo') {
            return `
              <image
                x="${el.x}"
                y="${el.y}"
                width="${el.width}"
                height="${el.height}"
                href="${el.content}"
                opacity="${el.opacity}"
                transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"
              />
            `;
          }
          return '';
        })
        .join('')}
    </svg>
  `;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const printDesign = async (canvasElement: HTMLElement) => {
  try {
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#060606',
      scale: 2,
    });
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Design</title></head><body>');
      printWindow.document.write('<img src="' + canvas.toDataURL() + '" style="width:100%">');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  } catch (error) {
    console.error('Error printing design:', error);
  }
};

export const shareDesignLink = (elements: DesignElement[]): string => {
  const encoded = btoa(JSON.stringify(elements));
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/designer?design=${encoded}`;
};

export const generateProductMockup = (designUrl: string, color: string): string => {
  // Placeholder for mockup generation
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='${color.replace('#', '%23')}' width='400' height='500'/%3E%3C/svg%3E`;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Design link copied to clipboard!');
  });
};
