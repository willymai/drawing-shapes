import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import shortid from 'shortid';
import ShapeTypes from '../../common/ShapeTypes';
import { randomHexColor, randomeSize, randomShape } from '../../utils/random';

const context = createContext({
  shapes: {
    square: [],
    circle: [],
    triangle: [],
    all: [],
  },
  waiting: true,
  onAddNewShape: () => {},
  onRemoveShapes: () => {},
});

export function ShapeProvider({ children }) {
  const [shapes, setShapes] = useState({});

  const [listColors, setListColors] = useState([]);

  const [listImages, setListImages] = useState([]);

  const [fetchedColors, setFetchedColors] = useState(false);

  const [fetchedImages, setFetchedImages] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      const response = await fetch(
        'http://www.colourlovers.com/api/colors/random?format=json',
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      setListColors(data);
      setFetchedColors(true);
    };

    const fetchImages = async () => {
      const response = await fetch(
        'http://www.colourlovers.com/api/patterns/random?format=json',
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      setListImages(data);
      setFetchedImages(true);
    };

    fetchColors();
    fetchImages();
  }, []);

  const onAddNewShape = ({ type, data }) => {
    const currentListShapes = shapes[type] || [];
    const newShape = {
      id: shortid.generate(),
      ...data,
      size: randomeSize({ x: data.x, y: data.y }),
      bgColor: `#${randomHexColor()}`,
    };

    const shapeType = type === ShapeTypes.All ? randomShape() : type;

    if (shapeType === ShapeTypes.Circle && listColors.length) {
      newShape.bgColor = `#${listColors[0].hex}`;
    } else if (shapeType === ShapeTypes.Square && listImages.length) {
      const imageData = listImages[0];
      newShape.imageUrl = imageData.imageUrl;
    }

    newShape.type = shapeType;

    setShapes({
      ...shapes,
      [type]: currentListShapes.concat(newShape),
    });
  };

  const onRemoveShapes = type => {
    setShapes({
      ...shapes,
      [type]: [],
    });
  };

  const onDoubleTapShape = ({ id, type }) => {
    console.log('id, type', id, type);
    const listShapes = [...shapes[type]];
    const index = listShapes.findIndex(item => item.id === id);
    if (index !== -1) {
      listShapes[index].bgColor = `#${randomHexColor()}`;
    }
    setShapes({
      ...shapes,
      [type]: listShapes,
    });
  };

  return (
    <context.Provider
      value={{
        shapes,
        waiting: !(fetchedColors && fetchedImages),
        onAddNewShape,
        onRemoveShapes,
        onDoubleTapShape,
      }}>
      {children}
    </context.Provider>
  );
}

export const useShapeContext = () => useContext(context);
