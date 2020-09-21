import { Treatment } from '@splitsoftware/splitio/types/splitio';

export const mapTreatmentToBoolean = (controlValue: boolean) => (
  treatment: Treatment
) => {
  if (treatment === 'on' || (treatment === 'control' && controlValue)) {
    return true;
  } else if (
    treatment === 'off' ||
    (treatment === 'control' && !controlValue)
  ) {
    return false;
  } else {
    throw new Error(
      `Treatment is not boolean equivilent. expected on/off received ${treatment}`
    );
  }
};
