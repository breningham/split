export const mapControlToValue = <T = string>(controlValue: T) => (
  treatment: string
) => (treatment === 'control' ? controlValue : treatment);
