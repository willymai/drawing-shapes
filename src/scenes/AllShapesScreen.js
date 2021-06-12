import React, { useMemo } from 'react';
import ShapeTypes from '../common/ShapeTypes';
import Circle from '../components/shape/Circle';
import Square from '../components/shape/Square';
import Triangle from '../components/shape/Triangle';
import ViewHandler from '../components/ViewHandler';
import { useShapeContext } from '../state/shape';
export default function AllShapesScreen() {
  const { shapes, onAddNewShape } = useShapeContext();

  const listShapes = useMemo(() => shapes[ShapeTypes.All] || [], [shapes]);

  const handleTap = position => {
    onAddNewShape({
      type: ShapeTypes.All,
      data: { ...position },
    });
  };

  return (
    <ViewHandler onTap={handleTap}>
      {listShapes.map((shape, index) => {
        let Content;
        switch (shape.type) {
          case ShapeTypes.Square:
            Content = Square;
            break;
          case ShapeTypes.Circle:
            Content = Circle;
            break;
          case ShapeTypes.Triangle:
            Content = Triangle;
            break;
          default:
            break;
        }
        return (
          <Content key={index} shape={shape} parentType={ShapeTypes.All} />
        );
      })}
    </ViewHandler>
  );
}
