export * from './displayModel.dto';
export * from './createModel.dto';

export interface Section {
  coordinates: Point[];
}

export interface Point {
  x: number;
  y: number;
}
