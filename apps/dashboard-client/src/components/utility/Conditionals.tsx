/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

const render = (props: any) => {
  if (typeof props.children === 'function') {
    return props.children();
  }

  return props.children || null;
};

type Props = {
  condition: boolean;
  children?: React.ReactNode | any;
};

export const Then: React.FC<any> = (props) => {
  return render(props);
};

export const Else: React.FC<any> = (props) => {
  return render(props);
};

export const ElseIf: React.FC<Props> = ({ condition, children }) => {
  return render({ condition, children });
};

export const When: React.FC<Props> = ({ condition, children }) => {
  return condition && children ? render({ condition, children }) : null;
};

export const If: React.FC<Props> = ({ condition, children }) => {
  if (children == null) {
    return null;
  }

  const iteratable = children[Symbol.iterator]
    ? [...(children as any)]
    : [].concat(children as any);

  if (condition) {
    return iteratable.find((c) => c.type === (<Then />).type) || null;
  }
  return (
    iteratable.find(
      (c) => c.type === (<ElseIf condition />).type && !!c.props.condition
    ) ||
    iteratable.find((c) => c.type === (<Else />).type) ||
    null
  );
};

type SwitchProps = {
  control: any;
  children?: React.ReactNode | any;
};

type CaseProps = {
  value: any | any[];
  isDefault?: boolean;
  children?: React.ReactNode | any;
};

export const Case: React.FC<CaseProps> = ({
  value,
  isDefault = false,
  children
}) => {
  return render({ value, isDefault, children });
};

export const Switch: React.FC<SwitchProps> = ({ control, children }) => {
  if (children == null) {
    return null;
  }

  const iteratable = children[Symbol.iterator]
    ? [...(children as any)]
    : [].concat(children as any);

  return (
    iteratable.find(
      (c) =>
        c.type === (<Case value />).type &&
        (Array.isArray(c.props.value)
          ? c.props.value.includes(control)
          : control === c.props.value)
    ) ||
    iteratable.find(
      (c) => c.type === (<Case value />).type && c.props.isDefault
    ) ||
    null
  );
};
