import numeric from "numeric";
import { IPmdData } from "../files/fileManipulations";
import Coordinates from "../graphs/classes/Coordinates";
import { TMatrix } from "./matrix";
import { sortEigenvectors } from "./eigManipulations";

const calculatePCA = (
  selectedSteps: IPmdData['steps'], 
  anchored: boolean, 
  normalized: boolean,
  type: 'directions' | 'planes',
) => {
  
  // Function calculatePCA
  // Does a PCA calculation on the selected steps

  const centerMass: [number, number, number] = [0, 0, 0];

  const vectors: Array<[number, number, number]> = selectedSteps.map(step => {
    const factor = normalized ? Math.sqrt((step.x * step.x) + (step.y * step.y) + (step.z * step.z)) : 1;
    return [step.x / factor, step.y / factor, step.z / factor];
  });

  // Vector of first & last step
  const firstVector = new Coordinates(...vectors[0]);
  const lastVector = new Coordinates(...vectors[vectors.length - 1]);

  // When anchoring we mirror the points and add them
  // in opposite case need to transform to the center of mass
  if (anchored) vectors.push(...vectors);
  else {
    vectors.forEach((vector, index) => {
      vector.forEach((coordinate, jndex) => {
        centerMass[jndex] += coordinate / selectedSteps.length;
        vectors[index][jndex] = coordinate - centerMass[jndex];
      });
    });
  };

  // Library call (numeric.js) to get the eigenvector / eigenvalues
  const eig = sortEigenvectors(numeric.eig(TMatrix(vectors)));

  const centerMassCoordinates = new Coordinates(...centerMass);
  const directionVector = firstVector.subtract(lastVector);
  const intensity = directionVector.length;

  let vectorTAU1 = new Coordinates(...eig.v1); // eigenvector for directions
  let vectorTAU3 = new Coordinates(...eig.v3); // eigenvector for planes
  let MAD = 0;
  let eigenVectorCoordinates = undefined;

  if (directionVector.dot(vectorTAU1) < 0) vectorTAU1 = vectorTAU1.reflect();
  if (vectorTAU3.z > 0) vectorTAU3 = vectorTAU3.reflect();

  if (type === 'directions') {
    // Calculation of maximum angle of deviation
    const s1 = Math.sqrt(eig.tau[0]);
    MAD = (Math.atan(Math.sqrt(eig.tau[1] + eig.tau[2]) / s1)  * Coordinates.RADIANS) || 0;
    eigenVectorCoordinates = vectorTAU1;
  };

  if (type === 'planes') {
    // Calculation of maximum angle of deviation
    const s1 = Math.sqrt((eig.tau[2] / eig.tau[1]) + (eig.tau[2] / eig.tau[0]));
    MAD = (Math.atan(s1) * Coordinates.RADIANS) || 0;
    eigenVectorCoordinates = vectorTAU3;
  };

  return {
    component: {
      coordinates: eigenVectorCoordinates,
      centerMass: centerMassCoordinates
    },
    intensity,
    MAD,
  };
};

export default calculatePCA;