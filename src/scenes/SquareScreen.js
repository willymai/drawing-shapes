import React, { useMemo } from 'react';
import ShapeTypes from '../common/ShapeTypes';
import Square from '../components/shape/Square';
import ViewHandler from '../components/ViewHandler';
import { useShapeContext } from '../state/shape';

export default function SquareScreen() {
  const { shapes, onAddNewShape } = useShapeContext();

  const listShapes = useMemo(() => shapes[ShapeTypes.Square] || [], [shapes]);

  const handleTap = position => {
    onAddNewShape({
      type: ShapeTypes.Square,
      data: { ...position, type: ShapeTypes.Square },
    });
  };

  return (
    <ViewHandler onTap={handleTap}>
      {listShapes.map((shape, index) => (
        <Square key={index} shape={shape} parentType={ShapeTypes.Square} />
      ))}
    </ViewHandler>
  );
}
