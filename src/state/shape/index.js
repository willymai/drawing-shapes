import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import shortid from 'shortid';
import RNShake from 'react-native-shake';
import ShapeTypes from '../../common/ShapeTypes';
import {
  randomHexColor,
  getShapeSize,
  randomShape,
} from '../../utils/shapeUtils';

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
    return data;
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
    return data;
  };

  useEffect(() => {
    fetchColors();
    fetchImages();

    RNShake.addListener(() => {
      setShapes({});
    });
    return () => {
      RNShake.removeListener();
    };
  }, []);

  const getColor = async () => {
    try {
      const data = await fetchColors();
      return {
        bgColor: `#${data[0].hex}` || `#${randomHexColor()}`,
      };
    } catch (error) {
      return {
        bgColor: `#${randomHexColor()}`,
      };
    }
  };

  const getImage = async () => {
    try {
      const data = await fetchImages();
      return {
        imageUrl: data[0].imageUrl,
      };
    } catch (error) {
      return {
        imageUrl: '',
        bgColor: `#${randomHexColor()}`,
      };
    }
  };

  const onAddNewShape = ({ type, data }) => {
    const currentListShapes = shapes[type] || [];
    const { size, x, y } = getShapeSize({ x: data.x, y: data.y });
    const newShape = {
      id: shortid.generate(),
      ...data,
      x,
      y,
      size: size,
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

  const onDoubleTapShape = async ({ id, type }) => {
    const listShapes = [...shapes[type]];
    console.log('oldlistShapes', listShapes.length);
    const index = listShapes.findIndex(item => item.id === id);
    if (index === -1) {
      return;
    }
    let shape = listShapes[index];
    if (shape.type === ShapeTypes.Triangle) {
      shape = {
        ...shape,
        bgColor: `#${randomHexColor()}`,
      };
    } else if (shape.type === ShapeTypes.Square) {
      const data = await getImage();
      shape = {
        ...shape,
        bgColor: `#${randomHexColor()}`,
        ...data,
      };
    } else if (shape.type === ShapeTypes.Circle) {
      const data = await getColor();
      shape = {
        ...shape,
        ...data,
      };
    }

    listShapes[index] = shape;
    console.log('listShapes', listShapes.length);
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
