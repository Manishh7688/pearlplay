import { ImageSource } from 'expo-image';
import { PlanFamily, PlanImageKey } from '@/types';

export const PLAN_IMAGES: Record<PlanImageKey, ImageSource | number> = {
  'land-hydroponics': require('../../../assets/images/plans/land-hydroponics.jpg'),
  'land-polyhouse': require('../../../assets/images/plans/land-polyhouse.jpg'),
  'tool-irrigation': require('../../../assets/images/plans/tool-irrigation.jpg'),
  'tool-tractor': require('../../../assets/images/plans/tool-tractor.jpg'),
  'tool-drone': require('../../../assets/images/plans/tool-drone.jpg'),
  'tool-harvester': require('../../../assets/images/plans/tool-harvester.jpg'),
  'dairy-milk': require('../../../assets/images/plans/dairy-milk.jpg'),
  'dairy-creamery': require('../../../assets/images/plans/dairy-creamery.jpg'),
  'dairy-estate': require('../../../assets/images/plans/dairy-estate.jpg'),
};

export const FAMILY_LABEL: Record<PlanFamily, string> = {
  land: 'Land',
  instrument: 'Crop tools',
  dairy: 'Dairy',
};
