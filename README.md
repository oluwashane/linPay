# LannisterAPI Docs Examples

A payment processing api used for processing fee charge per tranaction.

API url 'https://lannisterpay12.herokuapp.com/'.

## Open Endpoints

Open endpoints require no Authentication.

- `POST /fees`
- `GET /fees`

POST for fees endpoint ensure you use the right configurations as specified below to avoid errors on payment charges

payment config format

- {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE}

- LNPY1222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8

The endpoint below ensures each tranaction is calculated with it's appropriate configuration if not found uses the default configuration or returns an error

- `POST /transactions/compute-transaction-fee`
