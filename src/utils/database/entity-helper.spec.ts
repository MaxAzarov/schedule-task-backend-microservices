import { EntityHelper } from './entity-helper';

describe('EntityHelper', () => {
  let entity: EntityHelper;

  beforeEach(() => {
    entity = new EntityHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setEntityName', () => {
    it('should set the __entity property to the name of the constructor', () => {
      // Call the setEntityName method
      entity.setEntityName();

      // Assert that the __entity property is set correctly
      expect(entity.__entity).toBe('EntityHelper');
    });
  });
});
