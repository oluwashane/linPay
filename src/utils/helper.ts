// function that converts a string to parsed object base on the following format below
// {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE}
// LNPY1222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8

// How we expect the data to be parsed
// {
//   fee_id: 'LNPY1222',
//   currency: 'NGN',
//   fee_locale: 'INTL',
//   fee_entity: 'CREDIT-CARD',
//   entity_property: 'MASTERCARD',
//   fee_type: 'PERC',
//   fee_value: 3.8,
// };

// const objectFormat = [
//   'fee_id',
//   'currency',
//   'fee_locale',
//   'fee_entity',
//   'entity_property',
//   'fee_type',
//   'fee_value',
// ];

export const convertToArray = (arg) => {
  const initData = arg.split(/[\n]+/g);

  const convertedArray = initData.map((data) => {
    const firstArr = [];
    const secondArr = [];
    const filterandCreateArray = data.split(/[() :\ \s]+/g);
    const scope = filterandCreateArray.filter(
      (data) => !data.includes('APPLY'),
    );

    scope.filter((data) => {
      if (parseFloat(data)) {
        firstArr.push(Number(data));
      } else {
        firstArr.push(data);
      }
    });

    firstArr.some((data) => {
      if (data === '*') {
        data = 'Every';
        secondArr.push(data);
      } else {
        secondArr.push(data);
      }
    });
    return secondArr;
  });

  const convertToObject = convertedArray.map(
    ([
      fee_id,
      currency,
      fee_locale,
      fee_entity,
      entity_property,
      fee_type,
      fee_value,
      flat_fee_perc,
    ]) => ({
      fee_id,
      currency,
      fee_locale,
      fee_entity,
      entity_property,
      fee_type,
      fee_value,
      flat_fee_perc: flat_fee_perc || null,
    }),
  );

  return convertToObject;
};
