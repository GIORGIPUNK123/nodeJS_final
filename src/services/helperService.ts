export const findModelByValues = async (
  model: any,
  searchFields: Record<string, any>,
  attributes?: string[],
  includeStuffArr?: any
) => {
  try {
    return model.findOne({
      attributes: attributes,
      include: includeStuffArr,
      where: searchFields,
    });
  } catch (err: any) {
    throw new Error(err);
  }
};
export const updateModel = async (
  model: any,
  updateFields: Record<string, any>,
  searchFields: Record<string, any>
) => {
  try {
    return model.update(updateFields, {
      where: searchFields,
    });
  } catch (err: any) {
    throw new Error(err);
  }
};
export const createModel = async (
  model: any,
  createFields: Record<string, any>
) => model.create(createFields);

export const findAllModels = async (
  model: any,
  attributes: string[],
  includeStuffArr: any
) => {
  return model.findAll({
    attributes: attributes,
    include: includeStuffArr,
  });
};
