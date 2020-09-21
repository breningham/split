import { Treatment } from '@splitsoftware/splitio/types/splitio';

/**
 * simple function to map treatments to booleans (if applicable)
 * @returns `( treatment: string ) => boolean`
 * @example Off
 *
 * const treatment = client.getTreatment('split-name'); // treatment = 'off'
 * const mapped = mapTreatmentToBoolean(false)(treatment); // returns false
 *
 * @example On
 *
 * const treatment = client.getTreatment('split-name'); // treatment = 'on'
 * const mapped = mapTreatmentToBoolean(false)(treatment); // returns true
 *
 *  @example Control
 *
 * const treatment = client.getTreatment('split-name'); // treatment = 'control'
 * const mappedToTrue = mapTreatmentToBoolean(true)(treatment); // returns true
 * const mappedToFalse = mapTreatmentToBoolean(false)(treatment); // returns false
 *
 */
export const mapTreatmentToBoolean = (controlValue: boolean) => (
  treatment: Treatment
) => {
  if (treatment === 'control') {
    return controlValue;
  } else if (treatment === 'on') {
    return true;
  } else if (treatment === 'off') {
    return false;
  } else {
    throw new Error(
      `Treatment is not boolean equivilent. expected on/off received ${treatment}`
    );
  }
};
