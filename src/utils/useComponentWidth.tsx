import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

// Get width of container to calculate sizing of tabs
const useComponentWidth = (): [number, (event: LayoutChangeEvent) => void] => {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setWidth(nativeEvent.layout.width);
  }, []);
  return [width, onLayout];
};

export default useComponentWidth;
