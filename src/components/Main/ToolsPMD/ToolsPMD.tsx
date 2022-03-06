import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from './ToolsPMD.module.scss';
import DropdownSelect from '../../Sub/DropdownSelect/DropdownSelect';
import ButtonGroupWithLabel from '../../Sub/ButtonGroupWithLabel/ButtonGroupWithLabel';
import { Button } from '@mui/material';
import { Reference } from '../../../utils/graphs/types';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { addCurrentFileInterpretation, setCurrentStatistics, setReference, setStatisticsMode } from '../../../services/reducers/pcaPage';
import { IPmdData } from '../../../utils/GlobalTypes';
import ModalWrapper from '../../Sub/Modal/ModalWrapper';
import ToolsPMDSkeleton from './ToolsPMDSkeleton';
import OutputDataTablePMD from '../DataTablesPMD/OutputDataTable/OutputDataTablePMD';

const labelToReference = (label: string) => {
  if (label === 'Образец') return 'specimen';
  if (label === 'Стратиграфическая') return 'stratigraphic';
  return 'geographic';
};

const referenceToLabel = (reference: Reference) => {
  if (reference === 'specimen') return 'Образец';
  if (reference === 'stratigraphic') return 'Стратиграфическая';
  return 'Географическая';
};

interface IToolsPMD {
  data: IPmdData | null;
};

const ToolsPMD: FC<IToolsPMD> = ({ data }) => {

  const dispatch = useAppDispatch();

  const { reference, statisticsMode, allInterpretations } = useAppSelector(state => state.pcaPageReducer); 

  const [coordinateSystem, setCoordinateSystem] = useState<Reference>('geographic');
  const [allFilesStatOpen, setAllFilesStatOpen] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("keydown", handleStatisticsModeSelect);
    return () => {
      window.removeEventListener("keydown", handleStatisticsModeSelect);
    };
  }, []);
  
  useEffect(() => {
    setCoordinateSystem(reference);
  }, [reference]);

  const handleReferenceSelect = (option: string) => {
    dispatch(setReference(labelToReference(option)));
  };

  const onStatisticsModeClick = (statisticsMode: 'pca' | 'pca0' | 'gc' | 'gcn') => {
    dispatch(setStatisticsMode(statisticsMode));
  };

  const handleStatisticsModeSelect = useCallback((e) => {
    const key = (e.key as string).toLowerCase();
    if (key === 'd') onStatisticsModeClick('pca');
    if (key === 'o') onStatisticsModeClick('pca0');
    if (key === 'g') onStatisticsModeClick('gc');
    if (key === 'i') onStatisticsModeClick('gcn');
  }, []);

  const onStatisticsApply = useCallback(() => {
    dispatch(addCurrentFileInterpretation());
    dispatch(setStatisticsMode(null));
  }, []);

  const onStatisticsDecline = useCallback(() => {
    dispatch(setCurrentStatistics(null))
    dispatch(setStatisticsMode(null));
  }, []);

  if (!data) return <ToolsPMDSkeleton />;

  return (
    <ToolsPMDSkeleton>
      <DropdownSelect 
        label={'Система координат'}
        options={['Образец', 'Географическая', 'Стратиграфическая']}
        defaultValue='Географическая'
        onOptionSelect={handleReferenceSelect}
      />
      <ButtonGroupWithLabel label='Статистический метод'>
        <Button onClick={() => onStatisticsModeClick('pca')}>PCA</Button>
        <Button onClick={() => onStatisticsModeClick('pca0')}>PCA₀</Button>
        <Button onClick={() => onStatisticsModeClick('gc')}>GC</Button>
        <Button onClick={() => onStatisticsModeClick('gcn')}>GCN</Button>
      </ButtonGroupWithLabel>
      <ButtonGroupWithLabel label='Рассчитанная статистика'>
        <Button color='success' onClick={() => onStatisticsApply()} disabled={!statisticsMode}>Применить</Button>
        <Button color='error' onClick={() => onStatisticsDecline()} disabled={!statisticsMode}>Отменить</Button>
      </ButtonGroupWithLabel>
      <ButtonGroupWithLabel label='Смотреть статистику'>
        <Button onClick={() => setAllFilesStatOpen(true)}>По всем файлам</Button>
      </ButtonGroupWithLabel>
      <ModalWrapper
        open={allFilesStatOpen}
        setOpen={setAllFilesStatOpen}
      >
        <OutputDataTablePMD data={allInterpretations}/>
      </ModalWrapper>
    </ToolsPMDSkeleton>
  )
}

export default ToolsPMD;