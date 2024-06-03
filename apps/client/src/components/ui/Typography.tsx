import React from 'react';

type TypographyProps = {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  element?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  size,
  weight,
  element: TypographyComponent = 'span',
  className = '',
  style
}) => {
  return (
    <TypographyComponent
      className={`${size ? `text-${size}` : ''}${weight ? ` font-${weight}` : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </TypographyComponent>
  );
};
