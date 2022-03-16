import { IPmdData } from "../GlobalTypes";
import enteredIndexesToIDs from "./enteredIndexesToIDs";

const parseIDsInput = (
  enteredIDs: string, 
  hiddenStepsIDs: Array<number>, 
  pmdData: IPmdData
) => {
  // parse id's input (like steps to select)
  // example of valid enteredIDs: 
  // 1-9 || 2,4,8,9 || 2-4;8,9 || 2-4;8,9;12-14
  const segments = enteredIDs.split(';');

  const commaSegements = segments.filter(segment => segment.includes(','));
  const dashSegments = segments.filter(segment => segment.includes('-'));

  const commaIDs: Array<number> = [];
  const dashIDs: Array<number> = [];

  commaSegements.forEach(segment => {
    const IDs = segment.split(',').map(id => +id);
    commaIDs.push(...IDs);
  });

  dashSegments.forEach(segment => {
    const edges = segment.split('-').map(id => +id);
    if (edges.length !== 2) return [];
    const IDs = [];
    for (let id = edges[0]; id <= edges[1]; id++) {
      IDs.push(id);
    };
    dashIDs.push(...IDs);
  });

  const uniqueIDs = [...new Set([
    ...commaIDs, 
    ...dashIDs
  ])];

  const fixedIDs = enteredIndexesToIDs(uniqueIDs, hiddenStepsIDs, pmdData);

  return fixedIDs;
};

export default parseIDsInput;