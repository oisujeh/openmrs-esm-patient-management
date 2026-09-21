import { filterOutUndefinedPatientIdentifiers, getGenderOptionValue } from './patient-registration-utils';
import { vi, describe, it, expect } from 'vitest';

describe('filterOutUndefinedPatientIdentifiers', () => {
  const getIdentifiers = (autoGeneration = true, manualEntryEnabled = false) => ({
    OpenMRSId: {
      autoGeneration: autoGeneration,
      identifierName: 'OpenMRS ID',
      identifierTypeUuid: '05a29f94-c0ed-11e2-94be-8c13b969e334',
      identifierValue: undefined,
      initialValue: '100GEJ',
      preferred: true,
      required: true,
      selectedSource: {
        uuid: '01af8526-cea4-4175-aa90-340acb411771',
        name: 'Generator for OpenMRS ID',
        autoGenerationOption: {
          manualEntryEnabled: manualEntryEnabled,
          automaticGenerationEnabled: autoGeneration,
        },
      },
    },
  });

  it('should filter out undefined identifiers', () => {
    const filteredIdentifiers = filterOutUndefinedPatientIdentifiers(getIdentifiers());
    expect(filteredIdentifiers.OpenMRSId).not.toBeDefined();
  });

  it('should retain auto-generated identifiers with manual entry', () => {
    const filteredIdentifiers = filterOutUndefinedPatientIdentifiers(getIdentifiers(true, true));
    expect(filteredIdentifiers.OpenMRSId).toBeDefined();
  });
});

describe('getGenderOptionValue', () => {
  it('returns the stored gender when it matches a configured option', () => {
    expect(getGenderOptionValue('male', [{ value: 'male' }, { value: 'female' }])).toBe('male');
  });

  it('maps the stored gender to a configured option that differs in case or form', () => {
    expect(getGenderOptionValue('female', [{ value: 'Male' }, { value: 'Female' }])).toBe('Female');
    expect(getGenderOptionValue('male', [{ value: 'M' }, { value: 'F' }])).toBe('M');
    expect(getGenderOptionValue('F', [{ value: 'male' }, { value: 'female' }])).toBe('female');
  });

  it('returns the stored gender unchanged when no option matches', () => {
    expect(getGenderOptionValue('unknown', [{ value: 'male' }, { value: 'female' }])).toBe('unknown');
    expect(getGenderOptionValue(undefined, [{ value: 'male' }])).toBeUndefined();
  });
});
