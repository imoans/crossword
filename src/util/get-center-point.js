// @flow

import type { Point } from '../../domain/field'

export const getCenterPoint = (horizontal: number, vertical: number): Point => {
  const getCenter = (number) => (number - 1) / 2 + 1
  return { x: getCenter(horizontal), y: getCenter(vertical) }
}
