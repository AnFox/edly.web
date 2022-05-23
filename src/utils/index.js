export function extractFormErrors(error) {
  if (!error.response || !error.response.data || !error.response.data.data) return {};

  const {errors = {}} = error.response.data.data;

  return Object.keys(errors).reduce((mem, fieldName) => ({
    ...mem,
    [fieldName]: errors[fieldName].join(', '),
  }), {});
}
