import { matrixMultiply, rotate3x3AroundY, rotate3x3AroundZ } from "../../../statistics/matrix";
import Coordinates from "../../classes/Coordinates";
import { dirToCartesian2D, dirToCartesian3D } from "../../dirToCartesian";

const createSmallCircle = (
  dec: number, 
  inc: number, 
  radius: number,
  graphSize: number,
) => {
  // сначала корректируем координаты (не является необходимой частью алгоритма)
  if (radius == 180) return [];

  // необязательные преобразования, без которых ничего не будет работать (криво отобразится)
  dec = 360 - dec;
  inc = 90 - Math.abs(inc);
  radius = 90 - radius;

  const polarSmallCircle = []
  for (let dec = 0; dec < 361; dec += 10) { // создаем малый круг на полюсе
    let xyz = dirToCartesian3D(dec, radius, 1); // я не помню, почему тут такая каша с параметрами, но без этого отображется неправильно
    polarSmallCircle.push([xyz.x, xyz.y, xyz.z]);
  };
  const rotY = rotate3x3AroundY(inc); // матрица поворота вокруг оси Y
  const rotZ = rotate3x3AroundZ(dec); // матрица поворота вокруг оси Z
  const rotYZ = matrixMultiply(rotY, rotZ); // поворот вокруг Y и затем вокруг Z
  const rotatedSmallCircle = matrixMultiply(polarSmallCircle, rotYZ) as Array<[number, number, number]>; // поворот малого круга из полюса в правильное положение на сфере
  const smallCircleCoords: Array<Coordinates> = rotatedSmallCircle.map((coords: [number, number, number]) => {
    return new Coordinates(coords[0], coords[1], coords[2]);
  });

  const smallCircleDirs = smallCircleCoords.map((coords: Coordinates) => coords.toDirection());
  // координаты для построения
  console.log(smallCircleDirs)
  const xyData: Array<[number, number]> = smallCircleDirs.map((direction) => {
    const di = direction.toArray();
    const coords = dirToCartesian2D(di[0] - 90, di[1], graphSize);
    return [coords.x, coords.y];
  });

  return xyData;
};

export default createSmallCircle;