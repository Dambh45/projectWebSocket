'use client';

import { useEffect, useRef } from 'react';
import '@simonwep/pickr/dist/themes/classic.min.css';

export default function ColorPicker({ defaultColor, onChange }: {
  defaultColor: string;
  onChange: (color: string) => void;
}) {
  const pickrRef = useRef<any>(null);
  const pickrEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPickr = async () => {
      const Pickr = (await import('@simonwep/pickr')).default;

      if (pickrEl.current && !pickrRef.current) {
        pickrRef.current = Pickr.create({
          el: pickrEl.current,
          theme: 'classic',
          default: `#${defaultColor}`,
          components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
              hex: true,
              rgba: true,
              input: true,
              save: true,
            },
          },
        });

        pickrRef.current.on('save', (color: any) => {
          const hex = color.toHEXA().toString().replace(/^#/, '');
          onChange(hex);
          pickrRef.current.hide();
        });
      }
    };

    loadPickr();
  }, [defaultColor, onChange]);

  return <div ref={pickrEl} />;
}
