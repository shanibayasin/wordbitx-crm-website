import type { Model, Types } from 'mongoose';

type TenantRecord = {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
};

type TenantFilter<T extends TenantRecord> = Partial<Omit<T, 'organizationId' | '_id'>>;

export function findByIdInOrganization<T extends TenantRecord>(
  model: Model<T>,
  recordId: Types.ObjectId,
  organizationId: Types.ObjectId,
) {
  return model.findById(recordId).where('organizationId', organizationId);
}

export function findManyInOrganization<T extends TenantRecord>(
  model: Model<T>,
  organizationId: Types.ObjectId,
  filter: TenantFilter<T> = {},
) {
  return model.find(filter).where('organizationId', organizationId);
}
