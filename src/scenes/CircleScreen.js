import React, { useMemo } from 'react';
import ShapeTypes from '../common/ShapeTypes';
import Circle from '../components/shape/Circle';
import ViewHandler from '../components/ViewHandler';
import { useShapeContext } from '../state/shape';

export default function CircleScreen() {
  const { shapes, onAddNewShape } = useShapeContext();
  const listShapes = useMemo(() => shapes[ShapeTypes.Circle] || [], [shapes]);
  const handleTap = position => {
    onAddNewShape({
      type: ShapeTypes.Circle,
      data: { ...position, type: ShapeTypes.Circle },
    });
  };
  return (
    <ViewHandler onTap={handleTap}>
      {listShapes.map((shape, index) => (
        <Circle key={index} shape={shape} parentType={ShapeTypes.Circle} />
      ))}
    </ViewHandler>
  );
}
