export function normalizeSpecifications(product = {}) {
  const source = Array.isArray(product.specifications) && product.specifications.length
    ? product.specifications
    : Array.isArray(product.technicalSpecs)
      ? product.technicalSpecs.map((spec) => ({
          key: spec?.key || spec?.specKey || '',
          value: spec?.value || spec?.specValue || '',
        }))
      : [];

  return source
    .map((spec) => ({
      key: String(spec?.key || '').trim(),
      value: String(spec?.value || '').trim(),
    }))
    .filter((spec) => spec.key && spec.value);
}

export function normalizeProductPayload(payload = {}) {
  const specifications = normalizeSpecifications(payload);

  return {
    ...payload,
    isB2B: Boolean(payload.isB2B),
    specifications,
    technicalSpecs: specifications.map((spec) => ({
      specKey: spec.key,
      specValue: spec.value,
    })),
  };
}

export function isB2BProductVisibleToUser(user) {
  return ['admin', 'dealer'].includes(user?.role);
}
