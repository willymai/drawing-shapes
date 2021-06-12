import React, { useMemo } from 'react';
import ShapeTypes from '../common/ShapeTypes';
import Triangle from '../components/shape/Triangle';
import ViewHandler from '../components/ViewHandler';
import { useShapeContext } from '../state/shape';

export default function TriangleScreen() {
  const { shapes, onAddNewShape } = useShapeContext();

  const listShapes = useMemo(() => shapes[ShapeTypes.Triangle] || [], [shapes]);

  const handleTap = position => {
    onAddNewShape({
      type: ShapeTypes.Triangle,
      data: { ...position, type: ShapeTypes.Triangle },
    });
  };

  return (
    <ViewHandler onTap={handleTap}>
      {listShapes.map((shape, index) => (
        <Triangle key={index} shape={shape} parentType={ShapeTypes.Triangle} />
      ))}
    </ViewHandler>
  );
}
